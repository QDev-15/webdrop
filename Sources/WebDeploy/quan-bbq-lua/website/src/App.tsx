import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import GalleryPage from './pages/GalleryPage'
import ReservationPage from './pages/ReservationPage'
import ContactPage from './pages/ContactPage'
import './styles/template.css'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/thuc-don" element={<MenuPage />} />
            <Route path="/khong-gian" element={<GalleryPage />} />
            <Route path="/dat-ban" element={<ReservationPage />} />
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </SiteProvider>
    </BrowserRouter>
  )
}
