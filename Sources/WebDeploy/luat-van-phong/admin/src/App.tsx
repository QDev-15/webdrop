import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SlideList from './pages/slides/SlideList'
import SlideForm from './pages/slides/SlideForm'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import LawyerList from './pages/lawyers/LawyerList'
import LawyerForm from './pages/lawyers/LawyerForm'
import CaseList from './pages/cases/CaseList'
import CaseForm from './pages/cases/CaseForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import ContactList from './pages/contacts/ContactList'
import ConsultationList from './pages/consultations/ConsultationList'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AdminLayout>
            <Routes>
              <Route path="/"                  element={<Dashboard />} />
              <Route path="/slides"            element={<SlideList />} />
              <Route path="/slides/new"        element={<SlideForm />} />
              <Route path="/slides/:id/edit"   element={<SlideForm />} />
              <Route path="/services"          element={<ServiceList />} />
              <Route path="/services/new"      element={<ServiceForm />} />
              <Route path="/services/:id/edit" element={<ServiceForm />} />
              <Route path="/lawyers"           element={<LawyerList />} />
              <Route path="/lawyers/new"       element={<LawyerForm />} />
              <Route path="/lawyers/:id/edit"  element={<LawyerForm />} />
              <Route path="/cases"             element={<CaseList />} />
              <Route path="/cases/new"         element={<CaseForm />} />
              <Route path="/cases/:id/edit"    element={<CaseForm />} />
              <Route path="/testimonials"      element={<TestimonialList />} />
              <Route path="/contacts"          element={<ContactList />} />
              <Route path="/consultations"     element={<ConsultationList />} />
              <Route path="/media"             element={<MediaPage />} />
              <Route path="/settings"          element={<Settings />} />
              <Route path="*"                  element={<Navigate to="/" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}
