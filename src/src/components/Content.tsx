import React, { useState } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { Tenants } from './Tenants';
import { Users } from './Users';
import { Roles } from './Roles';
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';
import {
  Lock as LockIcon,
  Api as ApiIcon
} from '@mui/icons-material';

export const Content: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!isAuthenticated) {
    return (
      <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ p: { xs: 4, sm: 5 }, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 0, fontSize: { xs: '1.125rem', sm: '1.5rem' } }}>
            TOB Identity Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              Please log in.
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
