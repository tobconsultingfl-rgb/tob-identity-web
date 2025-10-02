import { type Configuration, LogLevel, type PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'c70a71b7-033c-4a87-a3e1-521502ca7994', // Replace with your Azure AD application client ID
    authority: 'https://tobconsultingfl.ciamlogin.com/82c3240a-fc69-499d-932c-65e6f2fae460', // Replace with your tenant ID or common
    redirectUri: 'http://localhost:5173', // Replace with your redirect URI
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

export const loginRequest: PopupRequest = {
  scopes: ['api://c44d41f2-9e2b-4b73-be56-e538a0013fcc/.default'], // Add the scopes you need for your application
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};