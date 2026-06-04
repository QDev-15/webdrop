import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import ContactList from './pages/contacts/ContactList'
import ContactDetail from './pages/contacts/ContactDetail'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6b6760' }}>Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <RequireAuth>
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="services" element={<ServiceList />} />
              <Route path="services/new" element={<ServiceForm />} />
              <Route path="services/:id/edit" element={<ServiceForm />} />
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              <Route path="testimonials" element={<TestimonialList />} />
              <Route path="testimonials/new" element={<TestimonialForm />} />
              <Route path="testimonials/:id/edit" element={<TestimonialForm />} />
              <Route path="contacts" element={<ContactList />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </AdminLayout>
        </RequireAuth>
      } />
    </Routes>
  )
}
