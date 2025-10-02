import React, { useState, useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useApiService } from '../services';
import type { RoleDto } from '../types';
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
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';

type Order = 'asc' | 'desc';
type OrderBy = keyof RoleDto;

export const Roles: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const apiService = useApiService();

  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('roleName');

  useEffect(() => {
    if (isAuthenticated) {
      loadRoles();
    }
  }, [isAuthenticated]);

  const loadRoles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.roles.getAllRoles();
      setRoles(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load roles');
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

  const sortedRoles = React.useMemo(() => {
    const comparator = (a: RoleDto, b: RoleDto) => {
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

    return [...roles].sort(comparator);
  }, [roles, order, orderBy]);

  if (!isAuthenticated) {
    return (
      <Alert severity="warning">
        Please sign in to view roles.
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
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'roleName'}
                direction={orderBy === 'roleName' ? order : 'asc'}
                onClick={() => handleRequestSort('roleName')}
              >
                Role Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Permissions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRoles.length > 0 ? (
            sortedRoles.map((role) => (
              <TableRow key={role.roleId} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {role.roleName || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {role.permissions && role.permissions.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.permissions.map((permission) => (
                        <Chip
                          key={permission.permissionId}
                          label={permission.permissionName}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No roles found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
