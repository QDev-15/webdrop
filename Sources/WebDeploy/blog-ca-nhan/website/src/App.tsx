import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/pages/HomePage'
import PostPage from './components/pages/PostPage'
import CategoryPage from './components/pages/CategoryPage'
import SearchPage from './components/pages/SearchPage'
import ContactPage from './components/pages/ContactPage'
import AboutPage from './components/pages/AboutPage'
import ArchivePage from './components/pages/ArchivePage'

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bai-viet/:slug" element={<PostPage />} />
          <Route path="/danh-muc/:slug" element={<CategoryPage />} />
          <Route path="/tag/:slug" element={<CategoryPage />} />
          <Route path="/tim-kiem" element={<SearchPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/ve-toi" element={<AboutPage />} />
          <Route path="/tat-ca-bai-viet" element={<ArchivePage />} />
        </Routes>
        <Footer />
      </SiteProvider>
    </BrowserRouter>
  )
}
