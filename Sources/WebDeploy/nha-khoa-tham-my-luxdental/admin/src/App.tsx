import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'
import MediaPage from './pages/media/MediaPage'
import ProfilePage from './pages/profile/ProfilePage'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ContactList from './pages/contacts/ContactList'
import ServiceCategoryList from './pages/services/ServiceCategoryList'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import BookingList from './pages/bookings/BookingList'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/slides" element={<ProtectedRoute><HeroSlideList /></ProtectedRoute>} />
      <Route path="/slides/new" element={<ProtectedRoute><HeroSlideForm /></ProtectedRoute>} />
      <Route path="/slides/:id/edit" element={<ProtectedRoute><HeroSlideForm /></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />
      <Route path="/service-categories" element={<ProtectedRoute><ServiceCategoryList /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><ServiceList /></ProtectedRoute>} />
      <Route path="/services/new" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
      <Route path="/services/:id/edit" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />
      <Route path="/testimonials" element={<ProtectedRoute><TestimonialList /></ProtectedRoute>} />
      <Route path="/testimonials/new" element={<ProtectedRoute><TestimonialForm /></ProtectedRoute>} />
      <Route path="/testimonials/:id/edit" element={<ProtectedRoute><TestimonialForm /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
      <Route path="/team/new" element={<ProtectedRoute><TeamForm /></ProtectedRoute>} />
      <Route path="/team/:id/edit" element={<ProtectedRoute><TeamForm /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
