import { TopNav } from './components/TopNav'
import { Content } from './components/Content'
import { Box, Typography } from '@mui/material'
import { Security as SecurityIcon } from '@mui/icons-material'

import './App.css'

function App() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNav />


        <Box sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 3, sm: 4 } }}>
          <Box>
            <Box>
              {/* Content Component */}
              <Content />

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
        </Box>

    </Box>
  )
}

export default App
