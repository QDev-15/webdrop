import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import FaqList from './pages/faqs/FaqList'
import FaqForm from './pages/faqs/FaqForm'
import PricingList from './pages/pricing/PricingList'
import PricingForm from './pages/pricing/PricingForm'
import TimelineList from './pages/timeline/TimelineList'
import TimelineForm from './pages/timeline/TimelineForm'
import ContactList from './pages/contacts/ContactList'
import MediaPage from './pages/media/MediaPage'
import ProfilePage from './pages/profile/ProfilePage'

function ProtectedRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <AdminLayout>
      <Routes>
        <Route path="/"                       element={<Dashboard />} />
        <Route path="/slides"                 element={<HeroSlideList />} />
        <Route path="/slides/new"             element={<HeroSlideForm />} />
        <Route path="/slides/:id/edit"        element={<HeroSlideForm />} />
        <Route path="/projects"               element={<ProjectList />} />
        <Route path="/projects/new"           element={<ProjectForm />} />
        <Route path="/projects/:id/edit"      element={<ProjectForm />} />
        <Route path="/testimonials"           element={<TestimonialList />} />
        <Route path="/testimonials/new"       element={<TestimonialForm />} />
        <Route path="/testimonials/:id/edit"  element={<TestimonialForm />} />
        <Route path="/faqs"                   element={<FaqList />} />
        <Route path="/faqs/new"               element={<FaqForm />} />
        <Route path="/faqs/:id/edit"          element={<FaqForm />} />
        <Route path="/pricing"                element={<PricingList />} />
        <Route path="/pricing/new"            element={<PricingForm />} />
        <Route path="/pricing/:id/edit"       element={<PricingForm />} />
        <Route path="/timeline"               element={<TimelineList />} />
        <Route path="/timeline/new"           element={<TimelineForm />} />
        <Route path="/timeline/:id/edit"      element={<TimelineForm />} />
        <Route path="/contacts"               element={<ContactList />} />
        <Route path="/media"                  element={<MediaPage />} />
        <Route path="/settings"               element={<Settings />} />
        <Route path="/profile"                element={<ProfilePage />} />
        <Route path="*"                       element={<Navigate to="/" replace />} />
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
