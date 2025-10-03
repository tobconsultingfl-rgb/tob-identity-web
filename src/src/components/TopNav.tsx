import React, { useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { useApiService } from '../services';
import type { UserDto } from '../types';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import tobLogo from '../assets/TOB_Consulting_Logo.png';

export const TopNav: React.FC = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const apiService = useApiService();
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && !currentUser) {
      loadCurrentUser();
    }
  }, [isAuthenticated]);

  const loadCurrentUser = async () => {
    setLoading(true);
    try {
      const user = await apiService.users.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
      .catch(error => console.log(error));
  };

  const handleLogout = () => {
    instance.logoutRedirect()
      .catch(error => console.log(error));
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getUserDisplayName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.username) {
      return currentUser.username;
    }
    if (currentUser?.email) {
      return currentUser.email;
    }
    return 'User';
  };

  const getUserInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    if (currentUser?.username) {
      return currentUser.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 3, sm: 4 } }}>
        {/* Left side - Logo */}
        <Box sx={{ flexGrow: 1 }}>
          <img
            src={tobLogo}
            alt="TOB Consulting"
            style={{
              height: 'clamp(120px, 24vw, 150px)',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* Right side - Authentication */}
        <Box>
          {isAuthenticated ? (
            loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Loading...
                </Typography>
              </Box>
            ) : (
              <>
                <Button
                  onClick={handleOpenMenu}
                  endIcon={<ArrowDownIcon />}
                  sx={{
                    textTransform: 'none',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                      fontWeight: 600,
                      mr: { xs: 0, lg: 2 }
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', alignItems: 'flex-start', mr: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
                      {getUserDisplayName()}
                    </Typography>
                    {currentUser?.tenantName && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>
                        {currentUser.tenantName}
                      </Typography>
                    )}
                  </Box>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    sx: {
                      minWidth: { xs: 200, sm: 280 },
                      maxWidth: '95vw',
                      mt: 1
                    }
                  }}
                >
                  <Box sx={{ px: { xs: 3, sm: 4 }, py: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                      {getUserDisplayName()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }} noWrap>
                      {currentUser?.email}
                    </Typography>
                    {currentUser?.tenantName && (
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }} noWrap>
                        {currentUser.tenantName}
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleCloseMenu}>
                    <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleCloseMenu}>
                    <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            )
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              startIcon={<LoginIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
              sx={{ px: { xs: 3, sm: 4 }, py: 2 }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Sign In
              </Box>
              <LoginIcon sx={{ display: { xs: 'inline-flex', sm: 'none' }, fontSize: 20 }} />
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
