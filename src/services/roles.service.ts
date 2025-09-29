import { BaseApiClient } from './base-api-client';
import {
  RoleDto,
  ApiResponse
} from '../types';

export class RolesService {
  constructor(private apiClient: BaseApiClient) {}

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<ApiResponse<RoleDto[]>> {
    return this.apiClient.get<RoleDto[]>('/roles');
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