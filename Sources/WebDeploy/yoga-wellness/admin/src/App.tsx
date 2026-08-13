import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'
import ServiceCategoryList from './pages/services/ServiceCategoryList'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import BookingList from './pages/bookings/BookingList'
import ContactList from './pages/contacts/ContactList'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'

function ProtectedRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="admin-loading">Đang tải...</div>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/services/new" element={<ServiceForm />} />
        <Route path="/services/:id" element={<ServiceForm />} />
        <Route path="/service-categories" element={<ServiceCategoryList />} />
        <Route path="/team" element={<TeamList />} />
        <Route path="/team/new" element={<TeamForm />} />
        <Route path="/team/:id" element={<TeamForm />} />
        <Route path="/testimonials" element={<TestimonialList />} />
        <Route path="/testimonials/new" element={<TestimonialForm />} />
        <Route path="/testimonials/:id" element={<TestimonialForm />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/slides" element={<HeroSlideList />} />
        <Route path="/slides/new" element={<HeroSlideForm />} />
        <Route path="/slides/:id" element={<HeroSlideForm />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  )
}

function AppContent() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
