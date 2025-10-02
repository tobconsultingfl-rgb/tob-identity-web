import React, { useState, useEffect } from 'react';
import { useApiService } from '../services';
import type { UserDto, TenantDto, RoleDto, CreateUserRequest, UpdateUserRequest } from '../types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
  Alert,
  Chip,
  OutlinedInput,
  type SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

interface AddEditUserProps {
  open: boolean;
  onClose: () => void;
  user?: UserDto | null;
  onSave: () => void;
}

interface FormData {
  tenantId: string;
  managerId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  mobilePhone: string;
  roleIds: string[];
}

interface FormErrors {
  tenantId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  mobilePhone?: string;
}

export const AddEditUser: React.FC<AddEditUserProps> = ({ open, onClose, user, onSave }) => {
  const apiService = useApiService();
  const isEditMode = !!user;

  const [formData, setFormData] = useState<FormData>({
    tenantId: '',
    managerId: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    mobilePhone: '',
    roleIds: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (open) {
      loadCurrentUserAndDropdownData();
      if (user) {
        populateFormWithUser(user);
      } else {
        resetForm();
      }
    }
  }, [open, user]);

  const loadCurrentUserAndDropdownData = async () => {
    setLoadingData(true);
    try {
      // Get current user first
      const userData = await apiService.users.getCurrentUser();
      setCurrentUser(userData);

      // Check if user is Super Admin
      const superAdmin = userData.roles?.some(role => role.roleName === 'Super Admin') || false;
      setIsSuperAdmin(superAdmin);

      // Load roles for all users
      const rolesData = await apiService.roles.getAllRoles();
      setRoles(rolesData);

      // Only load tenants if Super Admin
      if (superAdmin) {
        const tenantsData = await apiService.tenants.getAllTenants();
        setTenants(tenantsData);
      } else {
        // For non-Super Admin, set the tenant to current user's tenant
        if (!user) {
          setFormData(prev => ({ ...prev, tenantId: userData.tenantId }));
        }
      }
    } catch (err: any) {
      console.error('Failed to load dropdown data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const populateFormWithUser = (userData: UserDto) => {
    setFormData({
      tenantId: userData.tenantId || '',
      managerId: userData.managerId || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      username: userData.username || '',
      password: '',
      mobilePhone: userData.mobilePhone || '',
      roleIds: userData.roles?.map(r => r.roleId || '').filter(Boolean) || []
    });
  };

  const resetForm = () => {
    setFormData({
      tenantId: '',
      managerId: '',
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      mobilePhone: '',
      roleIds: []
    });
    setErrors({});
    setSubmitError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, roleIds: typeof value === 'string' ? value.split(',') : value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!isEditMode) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (!formData.mobilePhone.trim()) {
      newErrors.mobilePhone = 'Mobile phone is required';
    }

    if (!formData.tenantId) {
      newErrors.tenantId = 'Tenant is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      if (isEditMode && user?.userId) {
        // Update existing user
        const updateData: UpdateUserRequest = {
          userId: user.userId,
          tenantId: formData.tenantId,
          managerId: formData.managerId || null,
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobilePhone: formData.mobilePhone,
          roles: formData.roleIds.map(roleId => ({ roleId })) as RoleDto[]
        };
        await apiService.users.updateUser(user.userId, updateData);
      } else {
        // Create new user
        const createData: CreateUserRequest = {
          tenantId: formData.tenantId,
          managerId: formData.managerId || null,
          userName: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobilePhone: formData.mobilePhone,
          roles: formData.roleIds.map(roleId => ({ roleId })) as RoleDto[]
        };
        await apiService.users.createUser(createData);
      }

      onSave();
      handleClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save user');
      console.error('Save user error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        {loadingData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            {isSuperAdmin ? (
              <FormControl fullWidth margin="normal" error={!!errors.tenantId}>
                <InputLabel>Tenant *</InputLabel>
                <Select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleSelectChange}
                  label="Tenant *"
                >
                  {tenants.map(tenant => (
                    <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                      {tenant.tenantName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tenantId && <FormHelperText>{errors.tenantId}</FormHelperText>}
              </FormControl>
            ) : (
              <TextField
                fullWidth
                margin="normal"
                label="Tenant"
                value={currentUser?.tenantName || ''}
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            )}

            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={isEditMode}
            />

            {!isEditMode && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  required
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                />
              </>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Mobile Phone"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleChange}
              error={!!errors.mobilePhone}
              helperText={errors.mobilePhone}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={formData.roleIds}
                onChange={handleRoleChange}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((roleId) => {
                      const role = roles.find(r => r.roleId === roleId);
                      return <Chip key={roleId} label={role?.roleName || roleId} size="small" />;
                    })}
                  </Box>
                )}
              >
                {roles
                  .filter(role => role.roleId != null)
                  .map(role => (
                    <MenuItem key={role.roleId as string} value={role.roleId as string}>
                      {role.roleName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading} startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingData}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
