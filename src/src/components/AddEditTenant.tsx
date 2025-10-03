import React, { useState, useEffect } from 'react';
import { useApiService } from '../services';
import type { TenantDto, CreateTenantRequest, UpdateTenantRequest, State as StateType } from '../types';
import { State } from '../types';
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
  type SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

interface AddEditTenantProps {
  open: boolean;
  onClose: () => void;
  tenant?: TenantDto | null;
  onSave: () => void;
}

interface FormData {
  tenantName: string;
  tenantAddress1: string;
  tenantAddress2: string;
  tenantCity: string;
  tenantState: StateType;
  tenantZip: string;
  tenantPhoneNumber: string;
  tenantFax: string;
  contactFirstName: string;
  contactLastName: string;
  contactMobilePhone: string;
  contactEmail: string;
  password: string;
}

interface FormErrors {
  tenantName?: string;
  tenantAddress1?: string;
  tenantCity?: string;
  tenantState?: string;
  tenantZip?: string;
  tenantPhoneNumber?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactMobilePhone?: string;
  contactEmail?: string;
  password?: string;
}

const US_STATES: StateType[] = [
  State.AL, State.AK, State.AZ, State.AR, State.CA, State.CO, State.CT, State.DE, State.FL, State.GA,
  State.HI, State.ID, State.IL, State.IN, State.IA, State.KS, State.KY, State.LA, State.ME, State.MD,
  State.MA, State.MI, State.MN, State.MS, State.MO, State.MT, State.NE, State.NV, State.NH, State.NJ,
  State.NM, State.NY, State.NC, State.ND, State.OH, State.OK, State.OR, State.PA, State.RI, State.SC,
  State.SD, State.TN, State.TX, State.UT, State.VT, State.VA, State.WA, State.WV, State.WI, State.WY
];

export const AddEditTenant: React.FC<AddEditTenantProps> = ({ open, onClose, tenant, onSave }) => {
  const apiService = useApiService();
  const isEditMode = !!tenant;

  const [formData, setFormData] = useState<FormData>({
    tenantName: '',
    tenantAddress1: '',
    tenantAddress2: '',
    tenantCity: '',
    tenantState: State.AL,
    tenantZip: '',
    tenantPhoneNumber: '',
    tenantFax: '',
    contactFirstName: '',
    contactLastName: '',
    contactMobilePhone: '',
    contactEmail: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (tenant) {
        populateFormWithTenant(tenant);
      } else {
        resetForm();
      }
    }
  }, [open, tenant]);

  const populateFormWithTenant = (tenantData: TenantDto) => {
    setFormData({
      tenantName: tenantData.tenantName || '',
      tenantAddress1: tenantData.tenantAddress1 || '',
      tenantAddress2: tenantData.tenantAddress2 || '',
      tenantCity: tenantData.tenantCity || '',
      tenantState: tenantData.tenantState || State.AL,
      tenantZip: tenantData.tenantZip || '',
      tenantPhoneNumber: tenantData.tenantPhoneNumber || '',
      tenantFax: tenantData.tenantFax || '',
      contactFirstName: tenantData.contactFirstName || '',
      contactLastName: tenantData.contactLastName || '',
      contactMobilePhone: tenantData.contactPhoneNumber || '',
      contactEmail: tenantData.contactEmail || '',
      password: ''
    });
  };

  const resetForm = () => {
    setFormData({
      tenantName: '',
      tenantAddress1: '',
      tenantAddress2: '',
      tenantCity: '',
      tenantState: State.AL,
      tenantZip: '',
      tenantPhoneNumber: '',
      tenantFax: '',
      contactFirstName: '',
      contactLastName: '',
      contactMobilePhone: '',
      contactEmail: '',
      password: ''
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
    setFormData(prev => ({ ...prev, [name as string]: value as StateType }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Tenant name is required';
    }

    if (!formData.tenantAddress1.trim()) {
      newErrors.tenantAddress1 = 'Address is required';
    }

    if (!formData.tenantCity.trim()) {
      newErrors.tenantCity = 'City is required';
    }

    if (!formData.tenantState) {
      newErrors.tenantState = 'State is required';
    }

    if (!formData.tenantZip.trim()) {
      newErrors.tenantZip = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.tenantZip)) {
      newErrors.tenantZip = 'Invalid ZIP code format';
    }

    if (!formData.tenantPhoneNumber.trim()) {
      newErrors.tenantPhoneNumber = 'Phone number is required';
    }

    if (!formData.contactFirstName.trim()) {
      newErrors.contactFirstName = 'Contact first name is required';
    }

    if (!formData.contactLastName.trim()) {
      newErrors.contactLastName = 'Contact last name is required';
    }

    if (!formData.contactMobilePhone.trim()) {
      newErrors.contactMobilePhone = 'Contact mobile phone is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
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
      if (isEditMode && tenant?.tenantId) {
        // Update existing tenant
        const updateData: UpdateTenantRequest = {
          tenantName: formData.tenantName,
          tenantAddress1: formData.tenantAddress1,
          tenantAddress2: formData.tenantAddress2 || undefined,
          tenantCity: formData.tenantCity,
          tenantState: formData.tenantState,
          tenantZip: formData.tenantZip,
          tenantPhoneNumber: formData.tenantPhoneNumber,
          tenantFax: formData.tenantFax || undefined,
          contactFirstName: formData.contactFirstName,
          contactLastName: formData.contactLastName,
          contactMobilePhone: formData.contactMobilePhone,
          contactEmail: formData.contactEmail
        };
        await apiService.tenants.updateTenant(tenant.tenantId, updateData);
      } else {
        // Create new tenant
        const createData: CreateTenantRequest = {
          tenantName: formData.tenantName,
          tenantAddress1: formData.tenantAddress1,
          tenantAddress2: formData.tenantAddress2 || undefined,
          tenantCity: formData.tenantCity,
          tenantState: formData.tenantState,
          tenantZip: formData.tenantZip,
          tenantPhoneNumber: formData.tenantPhoneNumber,
          tenantFax: formData.tenantFax || undefined,
          contactFirstName: formData.contactFirstName,
          contactLastName: formData.contactLastName,
          contactMobilePhone: formData.contactMobilePhone,
          contactEmail: formData.contactEmail,
          password: formData.password
        };
        await apiService.tenants.createTenant(createData);
      }

      onSave();
      handleClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save tenant');
      console.error('Save tenant error:', err);
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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Tenant Name"
            name="tenantName"
            value={formData.tenantName}
            onChange={handleChange}
            error={!!errors.tenantName}
            helperText={errors.tenantName}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Address Line 1"
            name="tenantAddress1"
            value={formData.tenantAddress1}
            onChange={handleChange}
            error={!!errors.tenantAddress1}
            helperText={errors.tenantAddress1}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Address Line 2"
            name="tenantAddress2"
            value={formData.tenantAddress2}
            onChange={handleChange}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="City"
              name="tenantCity"
              value={formData.tenantCity}
              onChange={handleChange}
              error={!!errors.tenantCity}
              helperText={errors.tenantCity}
              required
            />

            <FormControl fullWidth margin="normal" error={!!errors.tenantState}>
              <InputLabel>State *</InputLabel>
              <Select
                name="tenantState"
                value={formData.tenantState}
                onChange={handleSelectChange}
                label="State *"
              >
                {US_STATES.map(state => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              {errors.tenantState && <FormHelperText>{errors.tenantState}</FormHelperText>}
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="ZIP Code"
              name="tenantZip"
              value={formData.tenantZip}
              onChange={handleChange}
              error={!!errors.tenantZip}
              helperText={errors.tenantZip}
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="tenantPhoneNumber"
              value={formData.tenantPhoneNumber}
              onChange={handleChange}
              error={!!errors.tenantPhoneNumber}
              helperText={errors.tenantPhoneNumber}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Fax Number"
              name="tenantFax"
              value={formData.tenantFax}
              onChange={handleChange}
            />
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Contact First Name"
            name="contactFirstName"
            value={formData.contactFirstName}
            onChange={handleChange}
            error={!!errors.contactFirstName}
            helperText={errors.contactFirstName}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Contact Last Name"
            name="contactLastName"
            value={formData.contactLastName}
            onChange={handleChange}
            error={!!errors.contactLastName}
            helperText={errors.contactLastName}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Contact Mobile Phone"
            name="contactMobilePhone"
            value={formData.contactMobilePhone}
            onChange={handleChange}
            error={!!errors.contactMobilePhone}
            helperText={errors.contactMobilePhone}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            error={!!errors.contactEmail}
            helperText={errors.contactEmail}
            required
          />

          {!isEditMode && (
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
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading} startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
