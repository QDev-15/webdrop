import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SlideList from './pages/slides/SlideList'
import SlideForm from './pages/slides/SlideForm'
import FeatureList from './pages/features/FeatureList'
import FeatureForm from './pages/features/FeatureForm'
import PricingList from './pages/pricing/PricingList'
import PricingForm from './pages/pricing/PricingForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import ContactList from './pages/contacts/ContactList'
import DemoList from './pages/demos/DemoList'
import FaqList from './pages/faqs/FaqList'
import FaqForm from './pages/faqs/FaqForm'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'

function ProtectedRoute({ children }: { children: ReactNode }) {
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
              <Route path="/"                    element={<Dashboard />} />
              <Route path="/slides"              element={<SlideList />} />
              <Route path="/slides/new"          element={<SlideForm />} />
              <Route path="/slides/:id/edit"     element={<SlideForm />} />
              <Route path="/features"            element={<FeatureList />} />
              <Route path="/features/new"        element={<FeatureForm />} />
              <Route path="/features/:id/edit"   element={<FeatureForm />} />
              <Route path="/pricing"             element={<PricingList />} />
              <Route path="/pricing/new"         element={<PricingForm />} />
              <Route path="/pricing/:id/edit"    element={<PricingForm />} />
              <Route path="/testimonials"        element={<TestimonialList />} />
              <Route path="/contacts"            element={<ContactList />} />
              <Route path="/demos"               element={<DemoList />} />
              <Route path="/faqs"                element={<FaqList />} />
              <Route path="/faqs/new"            element={<FaqForm />} />
              <Route path="/faqs/:id/edit"       element={<FaqForm />} />
              <Route path="/media"               element={<MediaPage />} />
              <Route path="/settings"            element={<Settings />} />
              <Route path="*"                    element={<Navigate to="/" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}
