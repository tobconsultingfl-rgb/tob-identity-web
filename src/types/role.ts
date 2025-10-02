// Role related types
export interface RoleDto {
  roleId?: string | null;
  roleName?: string | null;
  permissions?: PermissionDto[] | null;
}

export interface PermissionDto {
  permissionId?: string | null;
  permissionName?: string | null;
}