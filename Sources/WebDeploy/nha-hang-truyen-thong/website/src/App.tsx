import { Routes, Route } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ReservationPage from './pages/ReservationPage'
import ContactPage from './pages/ContactPage'
import './styles/template.css'
import './styles/site.css'

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thuc-don" element={<MenuPage />} />
        <Route path="/dat-ban" element={<ReservationPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
      </Routes>
    </SiteProvider>
  )
}
