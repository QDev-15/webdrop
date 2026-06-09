import { Routes, Route } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/pages/HomePage'
import ServicePage from './components/pages/ServicePage'
import ProjectPage from './components/pages/ProjectPage'
import ContactPage from './components/pages/ContactPage'

export default function App() {
  return (
    <SiteProvider>
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dich-vu" element={<ServicePage />} />
          <Route path="/du-an" element={<ProjectPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </SiteProvider>
  )
}
