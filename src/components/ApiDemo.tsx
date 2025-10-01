import React, { useState, useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useApiService } from '../services';
import type { UserDto, RoleDto, TenantDto } from '../types';
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
  ListItemText
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

export const ApiDemo: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const apiService = useApiService();

  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            TOB Identity API Demo
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            API Demo
          </Box>
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: { xs: 3, sm: 4 } }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
            sx={{ flex: { sm: 'none' } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Reload Data
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Reload
            </Box>
          </Button>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={checkUsername}
            disabled={loading}
            sx={{ flex: { sm: 'none' } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Check Username 'testuser'
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Check User
            </Box>
          </Button>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Current User */}
          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader
                avatar={<PersonIcon color="primary" />}
                title={
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                    <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Current User</Box>
                    <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>User</Box>
                  </Typography>
                }
                sx={{ bgcolor: 'grey.50' }}
              />
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {currentUser ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Name:</Typography>
                      <Typography variant="body2" noWrap>{currentUser.firstName} {currentUser.lastName}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Email:</Typography>
                      <Typography variant="body2" noWrap>{currentUser.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Username:</Typography>
                      <Typography variant="body2" noWrap>{currentUser.username}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Tenant:</Typography>
                      <Typography variant="body2" noWrap>{currentUser.tenantName}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Status:</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={currentUser.isActive ? 'Active' : 'Inactive'}
                          color={currentUser.isActive ? 'success' : 'error'}
                          size="small"
                          icon={currentUser.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                        />
                      </Box>
                    </Box>

                    {currentUser.roles && currentUser.roles.length > 0 && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Roles:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {currentUser.roles.map(role => (
                            <Chip key={role.roleId} label={role.roleName} size="small" />
                          ))}
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">No user data available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Roles */}
          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader
                avatar={<SecurityIcon color="success" />}
                title={
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                    <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>All Roles ({roles.length})</Box>
                    <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Roles ({roles.length})</Box>
                  </Typography>
                }
                sx={{ bgcolor: 'grey.50' }}
              />
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ maxHeight: { xs: 200, sm: 300 }, overflowY: 'auto' }}>
                  {roles.length > 0 ? (
                    <List disablePadding>
                      {roles.map((role, index) => (
                        <React.Fragment key={role.roleId}>
                          <ListItem sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
                            <ListItemText
                              primary={role.roleName}
                              secondary={
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                  {role.roleId?.slice(0, 8)}...
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < roles.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                      <InfoIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                      <Typography variant="body2" component="span">No roles found</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Tenants */}
          <Grid item xs={12} lg={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader
                avatar={<BusinessIcon color="info" />}
                title={
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                    <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>All Tenants ({tenants.length})</Box>
                    <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Tenants ({tenants.length})</Box>
                  </Typography>
                }
                sx={{ bgcolor: 'grey.50' }}
              />
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ maxHeight: { xs: 200, sm: 300 }, overflowY: 'auto' }}>
                  {tenants.length > 0 ? (
                    <List disablePadding>
                      {tenants.map((tenant, index) => (
                        <React.Fragment key={tenant.tenantId}>
                          <ListItem sx={{ py: 2, px: { xs: 2, sm: 3 }, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }} noWrap>
                              {tenant.tenantName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              <LocationIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                              {tenant.tenantCity}, {tenant.tenantState}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <PersonIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                              {tenant.contactFirstName} {tenant.contactLastName}
                            </Typography>
                            <Chip
                              label={tenant.isActive ? 'Active' : 'Inactive'}
                              color={tenant.isActive ? 'success' : 'error'}
                              size="small"
                              icon={tenant.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                            />
                          </ListItem>
                          {index < tenants.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                      <InfoIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
                      <Typography variant="body2" component="span">No tenants found</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* API Information */}
        <Alert severity="info" icon={<InfoIcon />} sx={{ mt: { xs: 3, sm: 4 }, mb: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            API Information
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Base URL:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {import.meta.env.VITE_API_BASE_URL || 'https://as-identity-api-develop-eastus2.azurewebsites.net'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Authentication:</Typography>
              <Typography variant="body2">Bearer JWT (via MSAL)</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, mt: 1, display: 'block' }}>Services:</Typography>
              <Typography variant="body2">Users, Roles, Tenants, UserRoles</Typography>
            </Grid>
          </Grid>
        </Alert>
      </CardContent>
    </Paper>
  );
};
