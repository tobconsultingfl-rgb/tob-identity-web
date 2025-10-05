import { BaseApiClient } from './base-api-client';
import type {
  RoleDto,
  ApiResponse
} from '../types';

export class RolesService {
  private apiClient: BaseApiClient;

  constructor(apiClient: BaseApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<ApiResponse<RoleDto[]>> {
    return this.apiClient.get<RoleDto[]>('/roles', false);
  }

  /**
   * Create a new role
   */
  async createRole(role: RoleDto): Promise<ApiResponse<RoleDto>> {
    return this.apiClient.post<RoleDto>('/roles', role);
  }

  /**
   * Update an existing role
   */
  async updateRole(roleId: string, role: RoleDto): Promise<void> {
    return this.apiClient.put<void>(`/roles/${roleId}`, role);
  }

  /**
   * Delete (deactivate) a role
   */
  async deleteRole(roleId: string): Promise<void> {
    return this.apiClient.delete<void>(`/roles/${roleId}`);
  }
}