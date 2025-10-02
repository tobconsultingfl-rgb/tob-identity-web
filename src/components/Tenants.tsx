import React, { useState, useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useApiService } from '../services';
import type { TenantDto } from '../types';
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
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

type Order = 'asc' | 'desc';
type OrderBy = keyof TenantDto;

export const Tenants: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const apiService = useApiService();

  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('tenantName');

  useEffect(() => {
    if (isAuthenticated) {
      loadTenants();
    }
  }, [isAuthenticated]);

  const loadTenants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.tenants.getAllTenants();
      setTenants(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load tenants');
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

  const sortedTenants = React.useMemo(() => {
    const comparator = (a: TenantDto, b: TenantDto) => {
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

    return [...tenants].sort(comparator);
  }, [tenants, order, orderBy]);

  if (!isAuthenticated) {
    return (
      <Alert severity="warning">
        Please sign in to view tenants.
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
                active={orderBy === 'tenantName'}
                direction={orderBy === 'tenantName' ? order : 'asc'}
                onClick={() => handleRequestSort('tenantName')}
              >
                Tenant Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'tenantCity'}
                direction={orderBy === 'tenantCity' ? order : 'asc'}
                onClick={() => handleRequestSort('tenantCity')}
              >
                City
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'tenantState'}
                direction={orderBy === 'tenantState' ? order : 'asc'}
                onClick={() => handleRequestSort('tenantState')}
              >
                State
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'contactFirstName'}
                direction={orderBy === 'contactFirstName' ? order : 'asc'}
                onClick={() => handleRequestSort('contactFirstName')}
              >
                Contact
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'contactEmail'}
                direction={orderBy === 'contactEmail' ? order : 'asc'}
                onClick={() => handleRequestSort('contactEmail')}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'tenantPhoneNumber'}
                direction={orderBy === 'tenantPhoneNumber' ? order : 'asc'}
                onClick={() => handleRequestSort('tenantPhoneNumber')}
              >
                Phone
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'isActive'}
                direction={orderBy === 'isActive' ? order : 'asc'}
                onClick={() => handleRequestSort('isActive')}
              >
                Status
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTenants.length > 0 ? (
            sortedTenants.map((tenant) => (
              <TableRow key={tenant.tenantId} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {tenant.tenantName || '-'}
                  </Typography>
                </TableCell>
                <TableCell>{tenant.tenantCity || '-'}</TableCell>
                <TableCell>{tenant.tenantState || '-'}</TableCell>
                <TableCell>
                  {tenant.contactFirstName || tenant.contactLastName
                    ? `${tenant.contactFirstName || ''} ${tenant.contactLastName || ''}`.trim()
                    : '-'}
                </TableCell>
                <TableCell>{tenant.contactEmail || '-'}</TableCell>
                <TableCell>{tenant.tenantPhoneNumber || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={tenant.isActive ? 'Active' : 'Inactive'}
                    color={tenant.isActive ? 'success' : 'error'}
                    size="small"
                    icon={tenant.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No tenants found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
