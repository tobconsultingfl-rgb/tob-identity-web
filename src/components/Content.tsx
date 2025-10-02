import React, { useState, useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useApiService } from '../services';
import type { UserDto, RoleDto, TenantDto } from '../types';
import { Tenants } from './Tenants';
import { Users } from './Users';
import { Roles } from './Roles';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Api as ApiIcon
} from '@mui/icons-material';

export const Content: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const apiService = useApiService();

  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load current user, roles, and tenants in parallel
      const [userResponse, rolesResponse, tenantsResponse] = await Promise.all([
        apiService.users.getCurrentUser(),
        apiService.roles.getAllRoles(),
        apiService.tenants.getAllTenants()
      ]);

      setCurrentUser(userResponse);
      setRoles(rolesResponse);
      setTenants(tenantsResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async () => {
    try {
      const exists = await apiService.users.checkUsernameExists('testuser');
      alert(`Username exists: ${exists}`);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ p: { xs: 4, sm: 5 }, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 0, fontSize: { xs: '1.125rem', sm: '1.5rem' } }}>
            API Demo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              Please log in to test the API services.
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              Please log in to continue.
            </Box>
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.125rem', sm: '1.5rem' } }}>
          <ApiIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 2, mt: -0.5 }} />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            TOB Identity Management
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Identity Management
          </Box>
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tenants" />
          <Tab label="Users" />
          <Tab label="Roles" />
        </Tabs>
      </Paper>

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Tab Panels */}
        {tabValue === 0 && (
          <Box>
            <Tenants />
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Users />
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Roles />
          </Box>
        )}

        {loading && (
          <Alert severity="info" icon={<CircularProgress size={20} />} sx={{ mb: 3 }}>
            <Typography variant="body2">Loading data...</Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}
      </CardContent>
    </Paper>
  );
};
