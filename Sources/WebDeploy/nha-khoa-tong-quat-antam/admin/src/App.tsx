import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ContactList from './pages/contacts/ContactList'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import MediaPage from './pages/media/MediaPage'
import ProfilePage from './pages/profile/ProfilePage'
import Settings from './pages/settings/Settings'
import ServiceList from './pages/services/ServiceList'
import ServiceCategoryList from './pages/services/ServiceCategoryList'
import ServiceForm from './pages/services/ServiceForm'
import BookingList from './pages/bookings/BookingList'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={
        <RequireAuth>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/services" element={<ServiceList />} />
              <Route path="/services/categories" element={<ServiceCategoryList />} />
              <Route path="/services/new" element={<ServiceForm />} />
              <Route path="/services/:id/edit" element={<ServiceForm />} />
              <Route path="/team" element={<TeamList />} />
              <Route path="/team/new" element={<TeamForm />} />
              <Route path="/team/:id/edit" element={<TeamForm />} />
              <Route path="/testimonials" element={<TestimonialList />} />
              <Route path="/testimonials/new" element={<TestimonialForm />} />
              <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
              <Route path="/contacts" element={<ContactList />} />
              <Route path="/slides" element={<HeroSlideList />} />
              <Route path="/slides/new" element={<HeroSlideForm />} />
              <Route path="/slides/:id/edit" element={<HeroSlideForm />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AdminLayout>
        </RequireAuth>
      } />
    </Routes>
  )
}
