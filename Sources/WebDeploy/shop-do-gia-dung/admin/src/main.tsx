import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './styles/admin.css'
import App from './App'

// Detect basename dynamically so admin works at both /admin/ (root) and /slug/admin/ (sub-path)
const _p = window.location.pathname
const _i = _p.lastIndexOf('/admin')
const adminBasename = _i >= 0 ? _p.slice(0, _i + '/admin'.length) : '/admin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={adminBasename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
