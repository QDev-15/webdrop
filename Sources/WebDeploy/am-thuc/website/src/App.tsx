import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ReservationPage from './pages/ReservationPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/thuc-don" element={<MenuPage />} />
          <Route path="/dat-ban" element={<ReservationPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  )
}
