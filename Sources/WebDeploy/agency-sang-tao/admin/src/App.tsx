import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import ContactList from './pages/contacts/ContactList'
import ContactDetail from './pages/contacts/ContactDetail'
import MediaPage from './pages/media/MediaPage'
import SettingsPage from './pages/settings/SettingsPage'

function ProtectedRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6b6760', fontFamily: 'DM Sans, sans-serif' }}>Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/services/new" element={<ServiceForm />} />
        <Route path="/services/:id/edit" element={<ServiceForm />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />
        <Route path="/team" element={<TeamList />} />
        <Route path="/team/new" element={<TeamForm />} />
        <Route path="/team/:id/edit" element={<TeamForm />} />
        <Route path="/testimonials" element={<TestimonialList />} />
        <Route path="/testimonials/new" element={<TestimonialForm />} />
        <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/contacts/:id" element={<ContactDetail />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
