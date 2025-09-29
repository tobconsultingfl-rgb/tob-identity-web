import { useState } from 'react'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { loginRequest } from './authConfig'
import { ApiDemo } from './components/ApiDemo'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [count, setCount] = useState(0)

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .catch(error => console.log(error))
  }

  const handleLogout = () => {
    instance.logoutPopup()
      .catch(error => console.log(error))
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>TOB Identity Web</h1>

      <div className="card">
        {isAuthenticated ? (
          <div>
            <button onClick={handleLogout} style={{ marginRight: '10px' }}>
              Sign Out
            </button>
            <p>Welcome! You are signed in.</p>
          </div>
        ) : (
          <div>
            <button onClick={handleLogin} style={{ marginRight: '10px' }}>
              Sign In
            </button>
            <p>Please sign in to access the application.</p>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>

      {/* API Demo Component */}
      <ApiDemo />

      <p className="read-the-docs">
        TOB Identity Web Application with Azure AD authentication and API integration
      </p>
    </>
  )
}

export default App
