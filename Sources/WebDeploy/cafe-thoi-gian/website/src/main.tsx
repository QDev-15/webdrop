import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import App from './App'
import './styles/template.css'

const rootEl = document.getElementById('root')!
createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <App />
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>
)
