import { type ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './components/pages/HomePage'
import ProjectsPage from './components/pages/ProjectsPage'
import ProjectDetailPage from './components/pages/ProjectDetailPage'
import ServicesPage from './components/pages/ServicesPage'
import AboutPage from './components/pages/AboutPage'
import ContactPage from './components/pages/ContactPage'
function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ZaloFloat />
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/du-an" element={<ProjectsPage />} />
          <Route path="/du-an/:slug" element={<ProjectDetailPage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/ve-chung-toi" element={<AboutPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </SiteProvider>
  )
}
