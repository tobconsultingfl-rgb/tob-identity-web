import React, { useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { useApiService } from '../services';
import type { UserDto } from '../types';
import tobLogo from '../assets/TOB_Consulting_Logo.png';

export const TopNav: React.FC = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const apiService = useApiService();
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && !currentUser) {
      loadCurrentUser();
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-section')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

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
    instance.loginPopup(loginRequest)
      .catch(error => console.log(error));
  };

  const handleLogout = () => {
    instance.logoutPopup()
      .then(() => {
        setCurrentUser(null);
        setShowUserMenu(false);
      })
      .catch(error => console.log(error));
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
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
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-0">
      <div className="container-fluid px-3 px-sm-4">
        {/* Left side - Logo */}
        <div className="navbar-brand p-0 m-0">
          <img
            src={tobLogo}
            alt="TOB Consulting"
            className="img-fluid"
            style={{
              height: 'clamp(120px, 24vw, 150px)',
            }}
          />
        </div>

        {/* Right side - Authentication */}
        <div className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <div className="nav-item dropdown position-relative">
              {loading ? (
                <div className="d-flex align-items-center text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="d-none d-sm-inline">Loading...</span>
                </div>
              ) : (
                <>
                  <button
                    className="btn btn-link nav-link d-flex align-items-center text-decoration-none p-2 rounded hover:bg-gray-50 transition-all border-0"
                    onClick={toggleUserMenu}
                    type="button"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 me-sm-3"
                         style={{
                           width: 'clamp(28px, 6vw, 32px)',
                           height: 'clamp(28px, 6vw, 32px)',
                           fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                           fontWeight: '600'
                         }}>
                      {getUserInitials()}
                    </div>
                    <div className="d-none d-lg-flex flex-column text-start me-2">
                      <span className="fw-medium text-dark" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
                        {getUserDisplayName()}
                      </span>
                      {currentUser?.tenantName && (
                        <span className="text-muted" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>
                          {currentUser.tenantName}
                        </span>
                      )}
                    </div>
                    <svg className={`transition-transform flex-shrink-0 ${showUserMenu ? 'rotate-180' : ''}`}
                         width="12" height="8" viewBox="0 0 12 8">
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg border-0 rounded-lg"
                         style={{
                           minWidth: 'clamp(200px, 50vw, 280px)',
                           maxWidth: '95vw',
                           zIndex: 1001
                         }}>
                      <div className="px-3 px-sm-4 py-3 border-bottom">
                        <div className="fw-semibold text-dark mb-1 text-truncate">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-muted small mb-1 text-truncate">
                          {currentUser?.email}
                        </div>
                        {currentUser?.tenantName && (
                          <div className="text-primary small fw-medium text-truncate">
                            {currentUser.tenantName}
                          </div>
                        )}
                      </div>
                      <button className="dropdown-item py-2 px-3 px-sm-4 hover:bg-gray-50 d-flex align-items-center"
                              onClick={() => setShowUserMenu(false)}>
                        <i className="bi bi-person me-2 flex-shrink-0"></i>
                        <span>Profile</span>
                      </button>
                      <button className="dropdown-item py-2 px-3 px-sm-4 hover:bg-gray-50 d-flex align-items-center"
                              onClick={() => setShowUserMenu(false)}>
                        <i className="bi bi-gear me-2 flex-shrink-0"></i>
                        <span>Settings</span>
                      </button>
                      <hr className="dropdown-divider my-1" />
                      <button className="dropdown-item py-2 px-3 px-sm-4 text-danger hover:bg-red-50 d-flex align-items-center"
                              onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2 flex-shrink-0"></i>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <button className="btn btn-primary px-3 px-sm-4 py-2" onClick={handleLogin}>
              <span className="d-none d-sm-inline">Sign In</span>
              <i className="bi bi-box-arrow-in-right d-sm-none"></i>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};