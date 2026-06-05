import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './components/pages/HomePage'
import MenuPage from './components/pages/MenuPage'
import SpacePage from './components/pages/SpacePage'
import ContactPage from './components/pages/ContactPage'
import NotFoundPage from './components/pages/NotFoundPage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/menu"      element={<MenuPage />} />
        <Route path="/khong-gian" element={<SpacePage />} />
        <Route path="/lien-he"   element={<ContactPage />} />
        <Route path="*"          element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <ZaloFloat />
    </>
  )
}
