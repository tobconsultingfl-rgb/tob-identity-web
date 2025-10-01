import { useState } from 'react'
import { useIsAuthenticated } from '@azure/msal-react'
import { TopNav } from './components/TopNav'
import { ApiDemo } from './components/ApiDemo'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const isAuthenticated = useIsAuthenticated()
  const [count, setCount] = useState(0)

  return (
    <div className="d-flex flex-column min-vh-100">
      <TopNav />

      <main className="flex-grow-1 bg-light">
        <div className="container-fluid py-2 py-sm-3 py-md-4 px-2 px-sm-3">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 col-xxl-7">

              {/* Welcome Section */}
              <div className="card shadow-sm mb-3 mb-sm-4">
                <div className="card-body text-center py-3 py-sm-4 py-md-5">
                  <div className="mb-3 mb-sm-4">
                    <a href="https://vite.dev" target="_blank" className="me-2 me-sm-3">
                      <img
                        src={viteLogo}
                        className="img-fluid hover:opacity-75 transition-opacity"
                        alt="Vite logo"
                        style={{ height: 'clamp(40px, 8vw, 64px)' }}
                      />
                    </a>
                    <a href="https://react.dev" target="_blank">
                      <img
                        src={reactLogo}
                        className="img-fluid hover:opacity-75 transition-opacity animate-spin-slow"
                        alt="React logo"
                        style={{ height: 'clamp(40px, 8vw, 64px)' }}
                      />
                    </a>
                  </div>

                  <h1 className="fw-bold text-primary mb-3 mb-sm-4"
                      style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}>
                    TOB Identity Web
                  </h1>

                  {!isAuthenticated && (
                    <div className="alert alert-warning d-inline-block mx-2" role="alert">
                      <i className="bi bi-info-circle me-2"></i>
                      <span className="d-none d-sm-inline">Please sign in to access the application.</span>
                      <span className="d-sm-none">Please sign in to continue.</span>
                    </div>
                  )}

                  <div className="mt-3 mt-sm-4">
                    <h3 className="h6 h5-sm text-muted mb-2 mb-sm-3">Demo Counter</h3>
                    <button
                      onClick={() => setCount((count) => count + 1)}
                      className="btn btn-outline-primary px-3 px-sm-4 py-2"
                      style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      <span className="d-none d-sm-inline">Count is {count}</span>
                      <span className="d-sm-none">{count}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* API Demo Component */}
              <ApiDemo />

              {/* Footer */}
              <footer className="text-center mt-4 mt-sm-5 py-3 py-sm-4 border-top">
                <p className="text-muted mb-0 px-2"
                   style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  <i className="bi bi-shield-check me-2"></i>
                  <span className="d-none d-sm-inline">
                    TOB Identity Web Application with Azure AD authentication and API integration
                  </span>
                  <span className="d-sm-none">
                    TOB Identity Web - Secure Authentication
                  </span>
                </p>
              </footer>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
