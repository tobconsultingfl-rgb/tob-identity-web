import { BaseApiClient } from './base-api-client';
import type {
  RoleDto,
  CreateUserRoleRequest,
  ApiResponse
} from '../types';

export class UserRolesService {
  private apiClient: BaseApiClient;

  constructor(apiClient: BaseApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get user's roles
   */
  async getUserRoles(userId: string): Promise<ApiResponse<RoleDto[]>> {
    return this.apiClient.get<RoleDto[]>(`/${userId}/roles`);
  }

  /**
   * Assign user to role
   */
  async assignUserToRole(userId: string, roleRequest: CreateUserRoleRequest): Promise<ApiResponse<boolean[]>> {
    return this.apiClient.patch<boolean[]>(`/${userId}/roles`, roleRequest);
  }
}