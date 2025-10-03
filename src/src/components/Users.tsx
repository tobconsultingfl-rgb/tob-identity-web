import React, { useState, useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useApiService } from '../services';
import type { UserDto, TenantDto } from '../types';
import { AddEditUser } from './AddEditUser';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';

type Order = 'asc' | 'desc';
type OrderBy = keyof UserDto;

export const Users: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const apiService = useApiService();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('lastName');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadCurrentUserAndUsers();
    }
  }, [isAuthenticated]);

  const loadCurrentUserAndUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // First get the current user to get their tenantId
      const user = await apiService.users.getCurrentUser();

      // Check if user is Super Admin
      const superAdmin = user.roles?.some((role: any) => role.roleName === 'Super Admin') || false;
      setIsSuperAdmin(superAdmin);

      // If Super Admin, load all tenants
      if (superAdmin) {
        const tenantsData = await apiService.tenants.getAllTenants();
        setTenants(tenantsData);
      }

      // Set the default selected tenant to current user's tenant
      setSelectedTenantId(user.tenantId);

      // Then get all users for that tenant
      const usersResponse = await apiService.users.getUsersByTenantId(user.tenantId);
      setUsers(usersResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: UserDto) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    loadCurrentUserAndUsers();
  };

  const handleTenantChange = async (event: SelectChangeEvent) => {
    const tenantId = event.target.value;
    setSelectedTenantId(tenantId);

    setLoading(true);
    setError(null);

    try {
      const usersResponse = await apiService.users.getUsersByTenantId(tenantId);
      setUsers(usersResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedUsers = React.useMemo(() => {
    const comparator = (a: UserDto, b: UserDto) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    };

    return [...users].sort(comparator);
  }, [users, order, orderBy]);

  if (!isAuthenticated) {
    return (
      <Alert severity="warning">
        Please sign in to view users.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>

        {isSuperAdmin && (
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Tenant</InputLabel>
            <Select
              value={selectedTenantId}
              onChange={handleTenantChange}
              label="Tenant"
            >
              {tenants.map(tenant => (
                <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.tenantName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'firstName'}
                direction={orderBy === 'firstName' ? order : 'asc'}
                onClick={() => handleRequestSort('firstName')}
              >
                First Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'lastName'}
                direction={orderBy === 'lastName' ? order : 'asc'}
                onClick={() => handleRequestSort('lastName')}
              >
                Last Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'email'}
                direction={orderBy === 'email' ? order : 'asc'}
                onClick={() => handleRequestSort('email')}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'username'}
                direction={orderBy === 'username' ? order : 'asc'}
                onClick={() => handleRequestSort('username')}
              >
                Username
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'phone'}
                direction={orderBy === 'phone' ? order : 'asc'}
                onClick={() => handleRequestSort('phone')}
              >
                Phone
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'tenantName'}
                direction={orderBy === 'tenantName' ? order : 'asc'}
                onClick={() => handleRequestSort('tenantName')}
              >
                Tenant
              </TableSortLabel>
            </TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'isActive'}
                direction={orderBy === 'isActive' ? order : 'asc'}
                onClick={() => handleRequestSort('isActive')}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <TableRow key={user.userId} hover>
                <TableCell>{user.firstName || '-'}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.lastName || '-'}
                  </Typography>
                </TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>{user.username || '-'}</TableCell>
                <TableCell>{user.phone || user.mobilePhone || '-'}</TableCell>
                <TableCell>{user.tenantName || '-'}</TableCell>
                <TableCell>
                  {user.roles && user.roles.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {user.roles.map((role) => (
                        <Chip
                          key={role.roleId}
                          label={role.roleName}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'error'}
                    size="small"
                    icon={user.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditUser(user)}
                    title="Edit User"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No users found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

      <AddEditUser
        open={dialogOpen}
        onClose={handleCloseDialog}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </Box>
  );
};
