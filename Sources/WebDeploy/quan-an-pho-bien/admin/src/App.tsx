import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import MenuCategoryList from './pages/menu/MenuCategoryList'
import MenuItemList from './pages/menu/MenuItemList'
import MenuItemForm from './pages/menu/MenuItemForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import GalleryList from './pages/gallery/GalleryPage'
import ContactList from './pages/contacts/ContactList'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'
import ProfilePage from './pages/profile/ProfilePage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <AdminLayout>{children}</AdminLayout>
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/slides" element={<RequireAuth><HeroSlideList /></RequireAuth>} />
      <Route path="/slides/new" element={<RequireAuth><HeroSlideForm /></RequireAuth>} />
      <Route path="/slides/:id/edit" element={<RequireAuth><HeroSlideForm /></RequireAuth>} />
      <Route path="/menu-categories" element={<RequireAuth><MenuCategoryList /></RequireAuth>} />
      <Route path="/menu-items" element={<RequireAuth><MenuItemList /></RequireAuth>} />
      <Route path="/menu-items/new" element={<RequireAuth><MenuItemForm /></RequireAuth>} />
      <Route path="/menu-items/:id/edit" element={<RequireAuth><MenuItemForm /></RequireAuth>} />
      <Route path="/testimonials" element={<RequireAuth><TestimonialList /></RequireAuth>} />
      <Route path="/testimonials/new" element={<RequireAuth><TestimonialForm /></RequireAuth>} />
      <Route path="/testimonials/:id/edit" element={<RequireAuth><TestimonialForm /></RequireAuth>} />
      <Route path="/gallery" element={<RequireAuth><GalleryList /></RequireAuth>} />
      <Route path="/contacts" element={<RequireAuth><ContactList /></RequireAuth>} />
      <Route path="/media" element={<RequireAuth><MediaPage /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
