import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './components/pages/HomePage'
import DichVuPage from './components/pages/DichVuPage'
import DuAnPage from './components/pages/DuAnPage'
import LienHePage from './components/pages/LienHePage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dich-vu" element={<DichVuPage />} />
        <Route path="/du-an" element={<DuAnPage />} />
        <Route path="/lien-he" element={<LienHePage />} />
      </Routes>
      <Footer />
      <ZaloFloat />
    </>
  )
}
