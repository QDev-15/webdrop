import { type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/dashboard/Dashboard'
import SlidesList from './pages/slides/SlidesList'
import SlideForm from './pages/slides/SlideForm'
import ProjectsList from './pages/projects/ProjectsList'
import ProjectForm from './pages/projects/ProjectForm'
import ServicesList from './pages/services/ServicesList'
import ServiceForm from './pages/services/ServiceForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'
import TestimonialsList from './pages/testimonials/TestimonialsList'
import TestimonialsForm from './pages/testimonials/TestimonialsForm'
import ContactsList from './pages/contacts/ContactsList'
import ContactDetail from './pages/contacts/ContactDetail'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'
import ProfilePage from './pages/profile/ProfilePage'
import './styles/admin.css'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/slides" element={<PrivateRoute><SlidesList /></PrivateRoute>} />
      <Route path="/slides/new" element={<PrivateRoute><SlideForm /></PrivateRoute>} />
      <Route path="/slides/:id/edit" element={<PrivateRoute><SlideForm /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><ProjectsList /></PrivateRoute>} />
      <Route path="/projects/new" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
      <Route path="/projects/:id/edit" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
      <Route path="/services" element={<PrivateRoute><ServicesList /></PrivateRoute>} />
      <Route path="/services/new" element={<PrivateRoute><ServiceForm /></PrivateRoute>} />
      <Route path="/services/:id/edit" element={<PrivateRoute><ServiceForm /></PrivateRoute>} />
      <Route path="/team" element={<PrivateRoute><TeamList /></PrivateRoute>} />
      <Route path="/team/new" element={<PrivateRoute><TeamForm /></PrivateRoute>} />
      <Route path="/team/:id/edit" element={<PrivateRoute><TeamForm /></PrivateRoute>} />
      <Route path="/testimonials" element={<PrivateRoute><TestimonialsList /></PrivateRoute>} />
      <Route path="/testimonials/new" element={<PrivateRoute><TestimonialsForm /></PrivateRoute>} />
      <Route path="/testimonials/:id/edit" element={<PrivateRoute><TestimonialsForm /></PrivateRoute>} />
      <Route path="/contacts" element={<PrivateRoute><ContactsList /></PrivateRoute>} />
      <Route path="/contacts/:id" element={<PrivateRoute><ContactDetail /></PrivateRoute>} />
      <Route path="/media" element={<PrivateRoute><MediaPage /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
