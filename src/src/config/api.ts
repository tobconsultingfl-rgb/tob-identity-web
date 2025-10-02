export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const getApiConfig = (): ApiConfig => {
  // Check for environment variables first, then fallback to defaults
  const baseUrl = import.meta.env.VITE_API_BASE_URL ||
                 'https://as-identity-api-develop-eastus2.azurewebsites.net';

  return {
    baseUrl: baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  };
};

export const apiConfig = getApiConfig();