import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './components/pages/HomePage'
import ServicesPage from './components/pages/ServicesPage'
import LawyersPage from './components/pages/LawyersPage'
import CasesPage from './components/pages/CasesPage'
import ContactPage from './components/pages/ContactPage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/dich-vu"   element={<ServicesPage />} />
        <Route path="/luat-su"   element={<LawyersPage />} />
        <Route path="/du-an"     element={<CasesPage />} />
        <Route path="/lien-he"   element={<ContactPage />} />
      </Routes>
      <Footer />
      <ZaloFloat />
    </>
  )
}
