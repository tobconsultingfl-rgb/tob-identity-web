import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: 'YOUR_CLIENT_ID_HERE', // Replace with your Azure AD application client ID
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID_HERE', // Replace with your tenant ID or common
    redirectUri: 'http://localhost:3000', // Replace with your redirect URI
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to true if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      }
    }
  }
};

export const loginRequest = {
  scopes: ['User.Read'], // Add the scopes you need for your application
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};