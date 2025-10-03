import { BaseApiClient } from './base-api-client';
import { UsersService } from './users.service';
import { RolesService } from './roles.service';
import { TenantsService } from './tenants.service';
import { UserRolesService } from './user-roles.service';

/**
 * Main API service that combines all individual services
 */
export class ApiService {
  private apiClient: BaseApiClient;
  public readonly users: UsersService;
  public readonly roles: RolesService;
  public readonly tenants: TenantsService;
  public readonly userRoles: UserRolesService;

  constructor(apiClient: BaseApiClient) {
    this.apiClient = apiClient;
    this.users = new UsersService(apiClient);
    this.roles = new RolesService(apiClient);
    this.tenants = new TenantsService(apiClient);
    this.userRoles = new UserRolesService(apiClient);
  }

  /**
   * Get the underlying API client for custom requests
   */
  getClient(): BaseApiClient {
    return this.apiClient;
  }
}