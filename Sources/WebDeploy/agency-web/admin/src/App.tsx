import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SlideList from './pages/slides/SlideList'
import SlideForm from './pages/slides/SlideForm'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import FaqList from './pages/faqs/FaqList'
import FaqForm from './pages/faqs/FaqForm'
import PricingList from './pages/pricing/PricingList'
import PricingForm from './pages/pricing/PricingForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import ContactList from './pages/contacts/ContactList'
import ContactDetail from './pages/contacts/ContactDetail'
import SettingsPage from './pages/settings/SettingsPage'
import MediaPage from './pages/media/MediaPage'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import ProfilePage from './pages/profile/ProfilePage'

function ProtectedRoutes() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-3)' }}>Đang tải...</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/slides" element={<SlideList />} />
        <Route path="/slides/new" element={<SlideForm />} />
        <Route path="/slides/:id/edit" element={<SlideForm />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/services/new" element={<ServiceForm />} />
        <Route path="/services/:id/edit" element={<ServiceForm />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />
        <Route path="/faqs" element={<FaqList />} />
        <Route path="/faqs/new" element={<FaqForm />} />
        <Route path="/faqs/:id/edit" element={<FaqForm />} />
        <Route path="/pricing" element={<PricingList />} />
        <Route path="/pricing/new" element={<PricingForm />} />
        <Route path="/pricing/:id/edit" element={<PricingForm />} />
        <Route path="/team" element={<TeamList />} />
        <Route path="/team/new" element={<TeamForm />} />
        <Route path="/team/:id/edit" element={<TeamForm />} />
        <Route path="/testimonials" element={<TestimonialList />} />
        <Route path="/testimonials/new" element={<TestimonialForm />} />
        <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/contacts/:id" element={<ContactDetail />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  )
}
