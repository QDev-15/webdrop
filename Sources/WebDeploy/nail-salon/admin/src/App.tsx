import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'

const Dashboard       = lazy(() => import('./pages/dashboard/Dashboard'))
const HeroSlideList   = lazy(() => import('./pages/slides/HeroSlideList'))
const HeroSlideForm   = lazy(() => import('./pages/slides/HeroSlideForm'))
const ServiceCategoryList = lazy(() => import('./pages/services/ServiceCategoryList'))
const ServiceList     = lazy(() => import('./pages/services/ServiceList'))
const ServiceForm     = lazy(() => import('./pages/services/ServiceForm'))
const BookingList     = lazy(() => import('./pages/bookings/BookingList'))
const TestimonialList = lazy(() => import('./pages/testimonials/TestimonialList'))
const TestimonialForm = lazy(() => import('./pages/testimonials/TestimonialForm'))
const TeamList        = lazy(() => import('./pages/team/TeamList'))
const TeamForm        = lazy(() => import('./pages/team/TeamForm'))
const GalleryPage     = lazy(() => import('./pages/gallery/GalleryPage'))
const ContactList     = lazy(() => import('./pages/contacts/ContactList'))
const MediaPage       = lazy(() => import('./pages/media/MediaPage'))
const Settings        = lazy(() => import('./pages/settings/Settings'))
const ProfilePage     = lazy(() => import('./pages/profile/ProfilePage'))
const UsersPage       = lazy(() => import('./pages/users/UsersPage'))

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoutes() {
  return (
    <RequireAuth>
      <AdminLayout>
        <Suspense fallback={<div className="admin-loading">Đang tải...</div>}>
          <Routes>
            <Route path="/"                        element={<Dashboard />} />
            <Route path="/slides"                  element={<HeroSlideList />} />
            <Route path="/slides/new"              element={<HeroSlideForm />} />
            <Route path="/slides/:id/edit"         element={<HeroSlideForm />} />
            <Route path="/service-categories"      element={<ServiceCategoryList />} />
            <Route path="/services"                element={<ServiceList />} />
            <Route path="/services/new"            element={<ServiceForm />} />
            <Route path="/services/:id/edit"       element={<ServiceForm />} />
            <Route path="/bookings"                element={<BookingList />} />
            <Route path="/testimonials"            element={<TestimonialList />} />
            <Route path="/testimonials/new"        element={<TestimonialForm />} />
            <Route path="/testimonials/:id/edit"   element={<TestimonialForm />} />
            <Route path="/team"                    element={<TeamList />} />
            <Route path="/team/new"                element={<TeamForm />} />
            <Route path="/team/:id/edit"           element={<TeamForm />} />
            <Route path="/gallery"                 element={<GalleryPage />} />
            <Route path="/contacts"                element={<ContactList />} />
            <Route path="/media"                   element={<MediaPage />} />
            <Route path="/settings"                element={<Settings />} />
            <Route path="/profile"                 element={<ProfilePage />} />
            <Route path="/users"                   element={<UsersPage />} />
            <Route path="*"                        element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AdminLayout>
    </RequireAuth>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*"     element={<AdminRoutes />} />
    </Routes>
  )
}
