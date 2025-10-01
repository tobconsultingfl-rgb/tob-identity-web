import React, { useState, useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useApiService } from '../services';
import type { UserDto, RoleDto, TenantDto } from '../types';

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
      <div className="card shadow-sm">
        <div className="card-body text-center py-4 py-sm-5">
          <i className="bi bi-lock text-muted mb-3"
             style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}></i>
          <h3 className="h5 h4-sm text-muted">API Demo</h3>
          <p className="text-muted mb-0 small">
            <span className="d-none d-sm-inline">Please log in to test the API services.</span>
            <span className="d-sm-none">Please log in to continue.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h2 className="h5 h4-sm mb-0">
          <i className="bi bi-api me-2"></i>
          <span className="d-none d-sm-inline">TOB Identity API Demo</span>
          <span className="d-sm-none">API Demo</span>
        </h2>
      </div>
      <div className="card-body p-2 p-sm-3">

        {loading && (
          <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
            <div className="spinner-border spinner-border-sm me-2 flex-shrink-0" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="small">Loading data...</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <span className="small">{error}</span>
          </div>
        )}

        <div className="d-flex flex-column flex-sm-row gap-2 mb-3 mb-sm-4">
          <button
            onClick={loadData}
            disabled={loading}
            className="btn btn-success btn-sm flex-fill flex-sm-grow-0"
          >
            <i className="bi bi-arrow-clockwise me-1 me-sm-2"></i>
            <span className="d-none d-sm-inline">Reload Data</span>
            <span className="d-sm-none">Reload</span>
          </button>
          <button
            onClick={checkUsername}
            disabled={loading}
            className="btn btn-outline-secondary btn-sm flex-fill flex-sm-grow-0"
          >
            <i className="bi bi-search me-1 me-sm-2"></i>
            <span className="d-none d-sm-inline">Check Username 'testuser'</span>
            <span className="d-sm-none">Check User</span>
          </button>
        </div>

        <div className="row g-2 g-sm-3 g-md-4">
          {/* Current User */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-header bg-light p-2 p-sm-3">
                <h5 className="card-title mb-0 h6 h5-sm">
                  <i className="bi bi-person-circle me-2 text-primary"></i>
                  <span className="d-none d-sm-inline">Current User</span>
                  <span className="d-sm-none">User</span>
                </h5>
              </div>
              <div className="card-body p-2 p-sm-3">
                {currentUser ? (
                  <>
                    <dl className="row mb-0 small">
                      <dt className="col-5 col-sm-4 text-muted">Name:</dt>
                      <dd className="col-7 col-sm-8 text-truncate">{currentUser.firstName} {currentUser.lastName}</dd>

                      <dt className="col-5 col-sm-4 text-muted">Email:</dt>
                      <dd className="col-7 col-sm-8 text-truncate">{currentUser.email}</dd>

                      <dt className="col-5 col-sm-4 text-muted">Username:</dt>
                      <dd className="col-7 col-sm-8 text-truncate">{currentUser.username}</dd>

                      <dt className="col-5 col-sm-4 text-muted">Tenant:</dt>
                      <dd className="col-7 col-sm-8 text-truncate">{currentUser.tenantName}</dd>

                      <dt className="col-5 col-sm-4 text-muted">Status:</dt>
                      <dd className="col-7 col-sm-8">
                        <span className={`badge ${currentUser.isActive ? 'bg-success' : 'bg-danger'} small`}>
                          {currentUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </dd>
                    </dl>

                    {currentUser.roles && currentUser.roles.length > 0 && (
                      <div className="mt-2 mt-sm-3">
                        <h6 className="text-muted small mb-1">Roles:</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {currentUser.roles.map(role => (
                            <span key={role.roleId} className="badge bg-secondary small">
                              {role.roleName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted mb-0 small">No user data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-header bg-light p-2 p-sm-3">
                <h5 className="card-title mb-0 h6 h5-sm">
                  <i className="bi bi-shield-check me-2 text-success"></i>
                  <span className="d-none d-sm-inline">All Roles ({roles.length})</span>
                  <span className="d-sm-none">Roles ({roles.length})</span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush"
                     style={{ maxHeight: 'clamp(200px, 40vh, 300px)', overflowY: 'auto' }}>
                  {roles.length > 0 ? (
                    roles.map(role => (
                      <div key={role.roleId} className="list-group-item d-flex justify-content-between align-items-center py-2 px-2 px-sm-3">
                        <span className="small text-truncate me-2">{role.roleName}</span>
                        <span className="badge bg-light text-dark small font-monospace flex-shrink-0">
                          {role.roleId?.slice(0, 6)}...
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="list-group-item text-muted text-center py-3">
                      <i className="bi bi-inbox me-2"></i>
                      <span className="small">No roles found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tenants */}
          <div className="col-12 col-lg-4">
            <div className="card h-100">
              <div className="card-header bg-light p-2 p-sm-3">
                <h5 className="card-title mb-0 h6 h5-sm">
                  <i className="bi bi-building me-2 text-info"></i>
                  <span className="d-none d-sm-inline">All Tenants ({tenants.length})</span>
                  <span className="d-sm-none">Tenants ({tenants.length})</span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div style={{ maxHeight: 'clamp(200px, 40vh, 300px)', overflowY: 'auto' }}>
                  {tenants.length > 0 ? (
                    tenants.map(tenant => (
                      <div key={tenant.tenantId} className="p-2 p-sm-3 border-bottom">
                        <h6 className="mb-1 small fw-semibold text-truncate">{tenant.tenantName}</h6>
                        <p className="small text-muted mb-1">
                          <i className="bi bi-geo-alt me-1"></i>
                          <span className="text-truncate">{tenant.tenantCity}, {tenant.tenantState}</span>
                        </p>
                        <p className="small text-muted mb-1">
                          <i className="bi bi-person me-1"></i>
                          <span className="text-truncate">{tenant.contactFirstName} {tenant.contactLastName}</span>
                        </p>
                        <span className={`badge ${tenant.isActive ? 'bg-success' : 'bg-danger'} small`}>
                          {tenant.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-muted text-center">
                      <i className="bi bi-inbox me-2"></i>
                      <span className="small">No tenants found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="alert alert-info mt-3 mt-sm-4 mb-0">
          <h6 className="alert-heading small">
            <i className="bi bi-info-circle me-2"></i>
            API Information
          </h6>
          <hr className="my-2" />
          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <p className="mb-1 small"><strong>Base URL:</strong></p>
              <code className="small d-block text-truncate">
                {import.meta.env.VITE_API_BASE_URL || 'https://as-identity-api-develop-eastus2.azurewebsites.net'}
              </code>
            </div>
            <div className="col-12 col-sm-6">
              <p className="mb-1 small"><strong>Authentication:</strong> Bearer JWT (via MSAL)</p>
              <p className="mb-0 small"><strong>Services:</strong> Users, Roles, Tenants, UserRoles</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};