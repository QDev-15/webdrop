import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './components/pages/HomePage'
import ServicesPage from './components/pages/ServicesPage'
import TeamPage from './components/pages/TeamPage'
import ContactPage from './components/pages/ContactPage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dich-vu" element={<ServicesPage />} />
        <Route path="/doi-ngu" element={<TeamPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
      </Routes>
      <Footer />
      <ZaloFloat />
    </>
  )
}
