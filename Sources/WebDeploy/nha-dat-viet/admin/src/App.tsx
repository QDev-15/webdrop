import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'
import MediaPage from './pages/media/MediaPage'
import SettingsPage from './pages/settings/Settings'
import ContactList from './pages/contacts/ContactList'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import PropertyList from './pages/properties/PropertyList'
import PropertyForm from './pages/properties/PropertyForm'
import AgentList from './pages/agents/AgentList'
import AgentForm from './pages/agents/AgentForm'
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import FaqList from './pages/faqs/FaqList'
import FaqForm from './pages/faqs/FaqForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="admin-loading">Đang tải...</div>

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route path="/slides" element={<HeroSlideList />} />
        <Route path="/slides/new" element={<HeroSlideForm />} />
        <Route path="/slides/:id/edit" element={<HeroSlideForm />} />

        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/new" element={<PropertyForm />} />
        <Route path="/properties/:id/edit" element={<PropertyForm />} />

        <Route path="/agents" element={<AgentList />} />
        <Route path="/agents/new" element={<AgentForm />} />
        <Route path="/agents/:id/edit" element={<AgentForm />} />

        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />

        <Route path="/faqs" element={<FaqList />} />
        <Route path="/faqs/new" element={<FaqForm />} />
        <Route path="/faqs/:id/edit" element={<FaqForm />} />

        <Route path="/testimonials" element={<TestimonialList />} />
        <Route path="/testimonials/new" element={<TestimonialForm />} />
        <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />

        <Route path="/contacts" element={<ContactList />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  )
}
