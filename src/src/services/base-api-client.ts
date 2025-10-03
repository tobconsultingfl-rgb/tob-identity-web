import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { apiConfig } from '../config/api';
import type { ApiError } from '../types';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

export class BaseApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private getAccessToken?: () => Promise<string>;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || apiConfig.baseUrl;
    this.defaultHeaders = apiConfig.headers || {};
  }

  setAuthProvider(getAccessToken: () => Promise<string>) {
    this.getAccessToken = getAccessToken;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.getAccessToken) {
      throw new Error('Authentication provider not set');
    }

    try {
      const token = await this.getAccessToken();
      return {
        'Authorization': `Bearer ${token}`
      };
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Authentication failed');
    }
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      requireAuth = true
    } = config;

    const url = `${this.baseUrl}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers
    };

    if (requireAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(requestHeaders, authHeaders);
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders
    };

    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type header for FormData - browser will set it with boundary
        delete requestHeaders['Content-Type'];
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            status: response.status,
            title: response.statusText,
            detail: `HTTP ${response.status}: ${response.statusText}`
          };
        }
        throw new ApiClientError(errorData, response.status);
      }

      // Handle no content responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text() as T;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new Error(`Request failed: ${error}`);
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requireAuth });
  }

  async post<T>(endpoint: string, body?: any, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, requireAuth });
  }

  async put<T>(endpoint: string, body?: any, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, requireAuth });
  }

  async patch<T>(endpoint: string, body?: any, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, requireAuth });
  }

  async delete<T>(endpoint: string, requireAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth });
  }
}

export class ApiClientError extends Error {
  public readonly apiError: ApiError;
  public readonly statusCode: number;

  constructor(
    apiError: ApiError,
    statusCode: number
  ) {
    super(apiError.detail || apiError.title || `API Error ${statusCode}`);
    this.name = 'ApiClientError';
    this.apiError = apiError;
    this.statusCode = statusCode;
  }
}

// Create a hook to use the API client with MSAL authentication
export const useApiClient = () => {
  const { instance, accounts } = useMsal();

  const apiClient = new BaseApiClient();

  apiClient.setAuthProvider(async () => {
    const request = {
      ...loginRequest,
      account: accounts[0]
    };

    const response = await instance.acquireTokenSilent(request);
    return response.accessToken;
  });

  return apiClient;
};