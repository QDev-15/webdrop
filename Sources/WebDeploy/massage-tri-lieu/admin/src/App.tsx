import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'
import MediaPage from './pages/media/MediaPage'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ContactList from './pages/contacts/ContactList'
import Settings from './pages/settings/Settings'
import ServiceCategoryList from './pages/services/ServiceCategoryList'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import BookingList from './pages/bookings/BookingList'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'

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
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/media" element={<PrivateRoute><MediaPage /></PrivateRoute>} />

      <Route path="/slides" element={<PrivateRoute><HeroSlideList /></PrivateRoute>} />
      <Route path="/slides/new" element={<PrivateRoute><HeroSlideForm /></PrivateRoute>} />
      <Route path="/slides/:id/edit" element={<PrivateRoute><HeroSlideForm /></PrivateRoute>} />

      <Route path="/service-categories" element={<PrivateRoute><ServiceCategoryList /></PrivateRoute>} />
      <Route path="/services" element={<PrivateRoute><ServiceList /></PrivateRoute>} />
      <Route path="/services/new" element={<PrivateRoute><ServiceForm /></PrivateRoute>} />
      <Route path="/services/:id/edit" element={<PrivateRoute><ServiceForm /></PrivateRoute>} />

      <Route path="/bookings" element={<PrivateRoute><BookingList /></PrivateRoute>} />
      <Route path="/contacts" element={<PrivateRoute><ContactList /></PrivateRoute>} />

      <Route path="/testimonials" element={<PrivateRoute><TestimonialList /></PrivateRoute>} />
      <Route path="/testimonials/new" element={<PrivateRoute><TestimonialForm /></PrivateRoute>} />
      <Route path="/testimonials/:id/edit" element={<PrivateRoute><TestimonialForm /></PrivateRoute>} />

      <Route path="/team" element={<PrivateRoute><TeamList /></PrivateRoute>} />
      <Route path="/team/new" element={<PrivateRoute><TeamForm /></PrivateRoute>} />
      <Route path="/team/:id/edit" element={<PrivateRoute><TeamForm /></PrivateRoute>} />

      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
