import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import ProfilePage from './pages/profile/ProfilePage'
import MediaPage from './pages/media/MediaPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'

// Hero Slides & Contacts (scaffold-provided)
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ContactList from './pages/contacts/ContactList'

// Domain-specific pages
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
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
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
                <Route path="dashboard" element={<Dashboard />} />

                {/* Hero slides */}
                <Route path="slides" element={<HeroSlideList />} />
                <Route path="slides/new" element={<HeroSlideForm />} />
                <Route path="slides/:id/edit" element={<HeroSlideForm />} />

                {/* Services */}
                <Route path="service-categories" element={<ServiceCategoryList />} />
                <Route path="services" element={<ServiceList />} />
                <Route path="services/new" element={<ServiceForm />} />
                <Route path="services/:id/edit" element={<ServiceForm />} />

                {/* Bookings */}
                <Route path="bookings" element={<BookingList />} />

                {/* Doctors */}
                <Route path="team" element={<TeamList />} />
                <Route path="team/new" element={<TeamForm />} />
                <Route path="team/:id/edit" element={<TeamForm />} />

                {/* Testimonials */}
                <Route path="testimonials" element={<TestimonialList />} />
                <Route path="testimonials/new" element={<TestimonialForm />} />
                <Route path="testimonials/:id/edit" element={<TestimonialForm />} />

                {/* Contacts */}
                <Route path="contacts" element={<ContactList />} />

                {/* Settings & system */}
                <Route path="settings" element={<Settings />} />
                <Route path="media" element={<MediaPage />} />
                <Route path="profile" element={<ProfilePage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
