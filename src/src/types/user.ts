import type { RoleDto } from './role';

// User related types
export interface UserDto {
  userId?: string | null;
  managerId?: string | null;
  managerName?: string | null;
  managerEmail?: string | null;
  tenantId: string;
  tenantName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  fax?: string | null;
  mobilePhone?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  roleName?: string | null;
  roles?: RoleDto[] | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdDateTime?: string | null;
  updatedDateTime?: string | null;
  lastLogin?: string | null;
  isActive: boolean;
}

export interface CreateUserRequest {
  tenantId: string;
  managerId?: string | null;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  roles?: RoleDto[] | null;
}

export interface UpdateUserRequest {
  userId: string;
  tenantId: string;
  managerId?: string | null;
  firstName: string;
  lastName: string;
  mobilePhone: string;
  maxQuoteAmount?: number | null;
  roles?: RoleDto[] | null;
}