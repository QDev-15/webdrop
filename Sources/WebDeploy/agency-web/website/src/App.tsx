import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './components/pages/HomePage'
import ServicesPage from './components/pages/ServicesPage'
import ProjectsPage from './components/pages/ProjectsPage'
import AboutPage from './components/pages/AboutPage'
import ContactPage from './components/pages/ContactPage'

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/dich-vu"      element={<ServicesPage />} />
          <Route path="/du-an"        element={<ProjectsPage />} />
          <Route path="/ve-chung-toi" element={<AboutPage />} />
          <Route path="/lien-he"      element={<ContactPage />} />
        </Routes>
        <Footer />
        <ZaloFloat />
      </BrowserRouter>
    </SiteProvider>
  )
}
