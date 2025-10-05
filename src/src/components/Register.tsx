import React, { useState, useEffect } from 'react';
import { useApiService } from '../services';
import type { CreateUserRequest } from '../types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Close as CloseIcon } from '@mui/icons-material';

interface RegisterProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobilePhone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  mobilePhone?: string;
}

const DEFAULT_ROLE_ID = 'CFEF957C-D3B8-4CEC-847E-FF5BC10993F3'; // User role
const DEFAULT_TENANT_NAME = 'Demo Company';

export const Register: React.FC<RegisterProps> = ({ open, onClose, onSuccess }) => {
  const apiService = useApiService();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobilePhone: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [demoTenantId, setDemoTenantId] = useState<string | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(false);

  useEffect(() => {
    if (open) {
      loadDemoTenant();
      resetForm();
    }
  }, [open]);

  const loadDemoTenant = async () => {
    setLoadingTenant(true);
    try {
      const tenants = await apiService.tenants.getAllTenants();
      const demoTenant = tenants.find(t => t.tenantName === DEFAULT_TENANT_NAME);

      if (demoTenant?.tenantId) {
        setDemoTenantId(demoTenant.tenantId);
      } else {
        setSubmitError(`Could not find "${DEFAULT_TENANT_NAME}" tenant. Please contact administrator.`);
      }
    } catch (err: any) {
      setSubmitError('Failed to load registration data. Please try again later.');
      console.error('Failed to load demo tenant:', err);
    } finally {
      setLoadingTenant(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobilePhone: ''
    });
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEmailBlur = async () => {
    // Only check if email is valid format
    if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      try {
        const exists = await apiService.users.checkUsernameExists(formData.email);
        if (exists) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        }
      } catch (err) {
        console.error('Failed to check username:', err);
      }
    }
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.mobilePhone.trim()) {
      newErrors.mobilePhone = 'Mobile phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    // Check if there are any actual error messages (not undefined)
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '');

    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password !== '' &&
      formData.password.length >= 6 &&
      formData.mobilePhone.trim() !== '' &&
      !hasErrors &&
      demoTenantId !== null
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!demoTenantId) {
      setSubmitError('Registration is not available at this time. Please contact administrator.');
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const createData: CreateUserRequest = {
        tenantId: demoTenantId,
        managerId: null,
        userName: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobilePhone: formData.mobilePhone,
        roles: [{ roleId: DEFAULT_ROLE_ID, roleName: 'User' }]
      };

      await apiService.users.createUser(createData);

      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create account. Please try again.');
      console.error('Registration error:', err);
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
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonAddIcon sx={{ mr: 1 }} />
          Create Account
        </Box>
      </DialogTitle>
      <DialogContent>
        {loadingTenant ? (
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

            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Account created successfully! You can now log in with your credentials.
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Register for a new account. Your account will be created under "{DEFAULT_TENANT_NAME}".
            </Typography>

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
              disabled={loading || submitSuccess}
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
              disabled={loading || submitSuccess}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={loading || submitSuccess}
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
              disabled={loading || submitSuccess}
            />

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
              disabled={loading || submitSuccess}
            />
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
          disabled={loading || loadingTenant || submitSuccess || !isFormValid()}
          startIcon={loading ? <CircularProgress size={16} /> : <PersonAddIcon />}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
