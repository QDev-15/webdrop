import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ContactList from './pages/contacts/ContactList'
import ContactDetail from './pages/contacts/ContactDetail'
import ServiceCategoryList from './pages/services/ServiceCategoryList'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import BookingList from './pages/bookings/BookingList'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'
import UserList from './pages/users/UserList'
import ProfilePage from './pages/profile/ProfilePage'
import MediaPage from './pages/media/MediaPage'

function ProtectedRoutes() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return (
    <AdminLayout>
      <Routes>
        <Route path="/"                      element={<Dashboard />} />
        <Route path="/settings"              element={<Settings />} />
        <Route path="/hero"                  element={<HeroSlideList />} />
        <Route path="/hero/new"              element={<HeroSlideForm />} />
        <Route path="/hero/:id/edit"         element={<HeroSlideForm />} />
        <Route path="/contacts"             element={<ContactList />} />
        <Route path="/contacts/:id"          element={<ContactDetail />} />
        <Route path="/service-categories"    element={<ServiceCategoryList />} />
        <Route path="/services"              element={<ServiceList />} />
        <Route path="/services/new"          element={<ServiceForm />} />
        <Route path="/services/:id/edit"     element={<ServiceForm />} />
        <Route path="/bookings"              element={<BookingList />} />
        <Route path="/testimonials"          element={<TestimonialList />} />
        <Route path="/testimonials/new"      element={<TestimonialForm />} />
        <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
        <Route path="/team"                  element={<TeamList />} />
        <Route path="/team/new"              element={<TeamForm />} />
        <Route path="/team/:id/edit"         element={<TeamForm />} />
        <Route path="/users"                 element={<UserList />} />
        <Route path="/profile"              element={<ProfilePage />} />
        <Route path="/media"                element={<MediaPage />} />
        <Route path="*"                      element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*"     element={<ProtectedRoutes />} />
    </Routes>
  )
}
