import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'
import ProfilePage from './pages/profile/ProfilePage'
import MediaPage from './pages/media/MediaPage'

// Hero Slides
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'

// Contacts
import ContactList from './pages/contacts/ContactList'

// Menu
import MenuCategoryList from './pages/menu/MenuCategoryList'
import MenuItemList from './pages/menu/MenuItemList'
import MenuItemForm from './pages/menu/MenuItemForm'

// Reservations
import ReservationList from './pages/reservations/ReservationList'

// Gallery
import GalleryPage from './pages/gallery/GalleryPage'

// Testimonials
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'

function PrivateRoute({ children }: { children: React.ReactNode }) {
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

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/media" element={<PrivateRoute><MediaPage /></PrivateRoute>} />

      {/* Hero Slides */}
      <Route path="/slides" element={<PrivateRoute><HeroSlideList /></PrivateRoute>} />
      <Route path="/slides/new" element={<PrivateRoute><HeroSlideForm /></PrivateRoute>} />
      <Route path="/slides/:id/edit" element={<PrivateRoute><HeroSlideForm /></PrivateRoute>} />

      {/* Contacts */}
      <Route path="/contacts" element={<PrivateRoute><ContactList /></PrivateRoute>} />

      {/* Menu */}
      <Route path="/menu-categories" element={<PrivateRoute><MenuCategoryList /></PrivateRoute>} />
      <Route path="/menu-items" element={<PrivateRoute><MenuItemList /></PrivateRoute>} />
      <Route path="/menu-items/new" element={<PrivateRoute><MenuItemForm /></PrivateRoute>} />
      <Route path="/menu-items/:id/edit" element={<PrivateRoute><MenuItemForm /></PrivateRoute>} />

      {/* Reservations */}
      <Route path="/reservations" element={<PrivateRoute><ReservationList /></PrivateRoute>} />

      {/* Gallery */}
      <Route path="/gallery" element={<PrivateRoute><GalleryPage /></PrivateRoute>} />

      {/* Testimonials */}
      <Route path="/testimonials" element={<PrivateRoute><TestimonialList /></PrivateRoute>} />
      <Route path="/testimonials/new" element={<PrivateRoute><TestimonialForm /></PrivateRoute>} />
      <Route path="/testimonials/:id/edit" element={<PrivateRoute><TestimonialForm /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
