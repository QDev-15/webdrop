import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Page from './pages/Page'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/lien-he"    element={<Contact />} />
        <Route path="/:slug"      element={<Page />} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
