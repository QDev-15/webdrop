import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import Home from './components/pages/Home'
import SanPham from './components/pages/SanPham'
import BangGia from './components/pages/BangGia'
import LienHe from './components/pages/LienHe'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/san-pham"  element={<SanPham />} />
        <Route path="/bang-gia"  element={<BangGia />} />
        <Route path="/lien-he"   element={<LienHe />} />
        <Route path="*"          element={<Home />} />
      </Routes>
      <Footer />
      <ZaloFloat />
    </>
  )
}
