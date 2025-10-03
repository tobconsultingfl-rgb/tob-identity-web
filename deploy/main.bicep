@description('The name of the application')
param applicationName string

@description('The environment name (e.g., dev, staging, prod)')
param environmentName string

@description('The Azure region for the resources')
param location string = resourceGroup().location

@description('The name of the Static Web App')
var staticWebAppName = 'swa-${applicationName}-${environmentName}'

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  staticSiteName: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: ''
    branch: ''
    buildProperties: {
      skipGithubActionWorkflowGeneration: true
    }
  }
  tags: {
    environment: environmentName
  }
}

output staticWebAppId string = staticWebApp.id
output staticWebAppName string = staticWebApp.name
output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
