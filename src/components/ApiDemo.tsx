import React, { useState, useEffect } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useApiService } from '../services';
import { UserDto, RoleDto, TenantDto } from '../types';

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
      <div className="api-demo">
        <h2>API Demo</h2>
        <p>Please log in to test the API services.</p>
      </div>
    );
  }

  return (
    <div className="api-demo" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>TOB Identity API Demo</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={loadData} disabled={loading}>
          Reload Data
        </button>
        <button onClick={checkUsername} disabled={loading} style={{ marginLeft: '10px' }}>
          Check Username 'testuser'
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Current User */}
        <div>
          <h3>Current User</h3>
          {currentUser ? (
            <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
              <p><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Username:</strong> {currentUser.username}</p>
              <p><strong>Tenant:</strong> {currentUser.tenantName}</p>
              <p><strong>Active:</strong> {currentUser.isActive ? 'Yes' : 'No'}</p>
              {currentUser.roles && currentUser.roles.length > 0 && (
                <div>
                  <strong>Roles:</strong>
                  <ul>
                    {currentUser.roles.map(role => (
                      <li key={role.roleId}>{role.roleName}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>No user data</p>
          )}
        </div>

        {/* Roles */}
        <div>
          <h3>All Roles ({roles.length})</h3>
          <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', maxHeight: '300px', overflowY: 'auto' }}>
            {roles.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {roles.map(role => (
                  <li key={role.roleId}>
                    {role.roleName} ({role.roleId?.slice(0, 8)}...)
                  </li>
                ))}
              </ul>
            ) : (
              <p>No roles found</p>
            )}
          </div>
        </div>

        {/* Tenants */}
        <div>
          <h3>All Tenants ({tenants.length})</h3>
          <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', maxHeight: '300px', overflowY: 'auto' }}>
            {tenants.length > 0 ? (
              tenants.map(tenant => (
                <div key={tenant.tenantId} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                  <p><strong>{tenant.tenantName}</strong></p>
                  <p>{tenant.tenantCity}, {tenant.tenantState}</p>
                  <p>Contact: {tenant.contactFirstName} {tenant.contactLastName}</p>
                  <p>Active: {tenant.isActive ? 'Yes' : 'No'}</p>
                </div>
              ))
            ) : (
              <p>No tenants found</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#e8f4f8', borderRadius: '5px' }}>
        <h4>API Information</h4>
        <p>Base URL: {import.meta.env.VITE_API_BASE_URL || 'https://as-identity-api-develop-eastus2.azurewebsites.net'}</p>
        <p>Authentication: Bearer JWT (via MSAL)</p>
        <p>Services: Users, Roles, Tenants, UserRoles</p>
      </div>
    </div>
  );
};