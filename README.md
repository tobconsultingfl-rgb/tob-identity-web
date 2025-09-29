# TOB Identity Web Application

A React-based web application with Azure Active Directory (Azure AD) authentication using Microsoft Authentication Library (MSAL).

## Overview

This application demonstrates integration with Azure AD for user authentication and authorization. It uses MSAL.js to handle the OAuth 2.0 / OpenID Connect authentication flow, providing secure access to Microsoft Graph APIs and other protected resources.

## Features

- **Azure AD Authentication**: Secure user login using Microsoft Azure Active Directory
- **MSAL Integration**: Built with @azure/msal-browser and @azure/msal-react for seamless authentication
- **React 19**: Modern React application with TypeScript support
- **Vite Build Tool**: Fast development and optimized production builds
- **ESLint Configuration**: Code quality and consistency enforcement

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Authentication**: Azure AD with MSAL.js
- **Build Tool**: Vite
- **Styling**: CSS (ready for styling framework integration)
- **Code Quality**: ESLint with TypeScript support

## Prerequisites

Before running this application, you need:

1. **Azure AD Application**: Register an application in Azure AD
2. **Node.js**: Version 16 or higher
3. **Azure Subscription**: Access to Azure Active Directory

## Configuration

### Azure AD Setup

1. Register a new application in Azure AD
2. Configure redirect URIs for your application
3. Note down the Application (client) ID and Directory (tenant) ID

### Application Configuration

Update the configuration in `src/authConfig.js`:

```javascript
export const msalConfig = {
  auth: {
    clientId: 'YOUR_CLIENT_ID_HERE', // Replace with your Azure AD application client ID
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID_HERE', // Replace with your tenant ID
    redirectUri: 'http://localhost:3000', // Replace with your redirect URI
  },
  // ... rest of configuration
};
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tob-identity-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Azure AD settings in `src/authConfig.js`

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── authConfig.js       # MSAL configuration
├── main.tsx           # Application entry point with MSAL provider
├── App.tsx            # Main application component
├── App.css            # Application styles
└── index.css          # Global styles
```

## Authentication Flow

1. User visits the application
2. MSAL checks for existing authentication
3. If not authenticated, user is redirected to Azure AD login
4. After successful authentication, user is redirected back to the application
5. MSAL manages tokens and provides authentication context to React components

## Usage

### Using Authentication in Components

```jsx
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

function MyComponent() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest);
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  // Component logic...
}
```

## Security Considerations

- Never commit real Azure AD credentials to version control
- Use environment variables for sensitive configuration in production
- Implement proper token handling and refresh logic
- Follow Azure AD security best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check Azure AD documentation
- Review MSAL.js documentation
- Open an issue in this repository
