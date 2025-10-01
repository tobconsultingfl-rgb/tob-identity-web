import { useState } from 'react'
import { useIsAuthenticated } from '@azure/msal-react'
import { TopNav } from './components/TopNav'
import { ApiDemo } from './components/ApiDemo'
import { Box, Container, Paper, Typography, Button, Alert, AlertTitle } from '@mui/material'
import { Add as AddIcon, Security as SecurityIcon } from '@mui/icons-material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const isAuthenticated = useIsAuthenticated()
  const [count, setCount] = useState(0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNav />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 900 }}>

              {/* Welcome Section */}
              <Paper sx={{ mb: { xs: 3, sm: 4 }, borderRadius: 2, boxShadow: 1 }}>
                <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4, md: 5 }, px: 4 }}>
                  <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                    <a href="https://vite.dev" target="_blank" style={{ display: 'inline-block', marginRight: '12px' }}>
                      <img
                        src={viteLogo}
                        alt="Vite logo"
                        style={{ height: 'clamp(40px, 8vw, 64px)', opacity: 0.9, transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                      />
                    </a>
                    <a href="https://react.dev" target="_blank" style={{ display: 'inline-block' }}>
                      <img
                        src={reactLogo}
                        className="animate-spin-slow"
                        alt="React logo"
                        style={{ height: 'clamp(40px, 8vw, 64px)', opacity: 0.9, transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                      />
                    </a>
                  </Box>

                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mb: { xs: 3, sm: 4 },
                      fontSize: 'clamp(1.75rem, 5vw, 3.5rem)'
                    }}
                  >
                    TOB Identity Web
                  </Typography>

                  {!isAuthenticated && (
                    <Alert severity="warning" sx={{ display: 'inline-flex', mx: 2 }}>
                      <AlertTitle sx={{ display: { xs: 'none', sm: 'block' } }}>Authentication Required</AlertTitle>
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Please sign in to access the application.
                      </Box>
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        Please sign in to continue.
                      </Box>
                    </Alert>
                  )}

                  <Box sx={{ mt: { xs: 3, sm: 4 } }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: { xs: 2, sm: 3 }, fontWeight: 500 }}>
                      Demo Counter
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => setCount((count) => count + 1)}
                      sx={{
                        px: { xs: 3, sm: 4 },
                        py: 2,
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)'
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        Count is {count}
                      </Box>
                      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                        {count}
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </Paper>

              {/* API Demo Component */}
              <ApiDemo />

              {/* Footer */}
              <Box
                component="footer"
                sx={{
                  textAlign: 'center',
                  mt: { xs: 4, sm: 5 },
                  py: { xs: 3, sm: 4 },
                  borderTop: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0,
                    px: 2,
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                  }}
                >
                  <SecurityIcon sx={{ width: 16, height: 16, verticalAlign: 'middle', mr: 1, mt: -0.5 }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    TOB Identity Web Application with Azure AD authentication and API integration
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    TOB Identity Web - Secure Authentication
                  </Box>
                </Typography>
              </Box>

            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default App
