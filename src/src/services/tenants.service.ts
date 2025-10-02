import { BaseApiClient } from './base-api-client';
import type {
  TenantDto,
  CreateTenantRequest,
  UpdateTenantRequest,
  ApiResponse
} from '../types';

export class TenantsService {
  constructor(private apiClient: BaseApiClient) {}

  /**
   * Get all tenants
   */
  async getAllTenants(): Promise<ApiResponse<TenantDto[]>> {
    return this.apiClient.get<TenantDto[]>('/tenants');
  }

  /**
   * Get tenant by ID
   */
  async getTenantById(tenantId: string): Promise<ApiResponse<TenantDto>> {
    return this.apiClient.get<TenantDto>(`/tenants/${tenantId}`);
  }

  /**
   * Create a new tenant
   */
  async createTenant(tenant: CreateTenantRequest): Promise<ApiResponse<TenantDto>> {
    // Convert to FormData as the API expects multipart/form-data
    const formData = new FormData();

    Object.entries(tenant).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    return this.apiClient.request<TenantDto>('/tenants', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type with boundary for FormData
      requireAuth: true
    });
  }

  /**
   * Update an existing tenant
   */
  async updateTenant(tenantId: string, tenant: UpdateTenantRequest): Promise<void> {
    return this.apiClient.put<void>(`/tenants/${tenantId}`, tenant);
  }

  /**
   * Delete (deactivate) a tenant
   */
  async deleteTenant(tenantId: string): Promise<void> {
    return this.apiClient.delete<void>(`/tenants/${tenantId}`);
  }
}