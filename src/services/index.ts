// Export base client
export { BaseApiClient, ApiClientError, useApiClient } from './base-api-client';

// Export individual services
export { UsersService } from './users.service';
export { RolesService } from './roles.service';
export { TenantsService } from './tenants.service';
export { UserRolesService } from './user-roles.service';

// Export combined API service
export { ApiService } from './api.service';

// Export hooks for React components
import { useApiClient } from './base-api-client';
import { ApiService } from './api.service';

/**
 * React hook to use the complete API service with MSAL authentication
 */
export const useApiService = () => {
  const apiClient = useApiClient();
  return new ApiService(apiClient);
};