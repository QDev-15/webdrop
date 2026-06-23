import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import ProfilePage from './pages/profile/ProfilePage'
import MediaPage from './pages/media/MediaPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'

import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'

import ServiceCategoryList from './pages/services/ServiceCategoryList'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'

import BookingList from './pages/bookings/BookingList'

import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'

import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'

import ContactList from './pages/contacts/ContactList'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="slides"       element={<HeroSlideList />} />
                <Route path="slides/new"   element={<HeroSlideForm />} />
                <Route path="slides/:id/edit" element={<HeroSlideForm />} />

                <Route path="service-categories" element={<ServiceCategoryList />} />

                <Route path="services"       element={<ServiceList />} />
                <Route path="services/new"   element={<ServiceForm />} />
                <Route path="services/:id/edit" element={<ServiceForm />} />

                <Route path="bookings" element={<BookingList />} />

                <Route path="team"       element={<TeamList />} />
                <Route path="team/new"   element={<TeamForm />} />
                <Route path="team/:id/edit" element={<TeamForm />} />

                <Route path="testimonials"          element={<TestimonialList />} />
                <Route path="testimonials/new"      element={<TestimonialForm />} />
                <Route path="testimonials/:id/edit" element={<TestimonialForm />} />

                <Route path="contacts" element={<ContactList />} />
                <Route path="media"    element={<MediaPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile"  element={<ProfilePage />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
