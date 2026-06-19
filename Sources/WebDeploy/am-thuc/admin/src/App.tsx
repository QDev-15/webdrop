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
import ReservationList from './pages/reservations/ReservationList'
import GalleryPage from './pages/gallery/GalleryPage'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import ContactList from './pages/contacts/ContactList'
import Settings from './pages/settings/Settings'
import MediaPage from './pages/media/MediaPage'
import ProfilePage from './pages/profile/ProfilePage'

function ProtectedRoutes() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ fontSize: 14, color: 'var(--text-3)' }}>Đang tải...</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <AdminLayout />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/slides" element={<HeroSlideList />} />
        <Route path="/slides/new" element={<HeroSlideForm />} />
        <Route path="/slides/:id/edit" element={<HeroSlideForm />} />
        <Route path="/menu-categories" element={<MenuCategoryList />} />
        <Route path="/menu-items" element={<MenuItemList />} />
        <Route path="/menu-items/new" element={<MenuItemForm />} />
        <Route path="/menu-items/:id/edit" element={<MenuItemForm />} />
        <Route path="/reservations" element={<ReservationList />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/testimonials" element={<TestimonialList />} />
        <Route path="/testimonials/new" element={<TestimonialForm />} />
        <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
