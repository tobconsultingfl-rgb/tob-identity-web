import { BaseApiClient } from './base-api-client';
import {
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse
} from '../types';

export class UsersService {
  constructor(private apiClient: BaseApiClient) {}

  /**
   * Get the currently logged-in user
   */
  async getCurrentUser(): Promise<ApiResponse<UserDto>> {
    return this.apiClient.get<UserDto>('/users/me');
  }

  /**
   * Get users by licensee ID
   */
  async getUsersByLicenseeId(licenseeId?: string): Promise<ApiResponse<UserDto[]>> {
    const endpoint = licenseeId
      ? `/users?licenseeId=${encodeURIComponent(licenseeId)}`
      : '/users';
    return this.apiClient.get<UserDto[]>(endpoint);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<UserDto>> {
    return this.apiClient.get<UserDto>(`/users/${userId}`);
  }

  /**
   * Create a new user
   */
  async createUser(user: CreateUserRequest): Promise<ApiResponse<UserDto>> {
    return this.apiClient.post<UserDto>('/users', user);
  }

  /**
   * Update an existing user
   */
  async updateUser(userId: string, user: UpdateUserRequest): Promise<void> {
    return this.apiClient.put<void>(`/users/${userId}`, user);
  }

  /**
   * Delete (deactivate) a user
   */
  async deleteUser(userId: string): Promise<void> {
    return this.apiClient.delete<void>(`/users/${userId}`);
  }

  /**
   * Check if a username exists
   */
  async checkUsernameExists(userName: string): Promise<ApiResponse<boolean>> {
    return this.apiClient.get<boolean>(`/users/usernameexists/${encodeURIComponent(userName)}`);
  }
}