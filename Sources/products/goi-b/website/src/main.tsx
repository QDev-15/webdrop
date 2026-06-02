import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import App from './App'
import './styles/site.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <App />
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>
)
