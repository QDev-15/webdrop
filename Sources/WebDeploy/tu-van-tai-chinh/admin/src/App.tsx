import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SlideList from './pages/slides/SlideList'
import SlideForm from './pages/slides/SlideForm'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import TeamList from './pages/team/TeamList'
import TeamForm from './pages/team/TeamForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import ContactList from './pages/contacts/ContactList'
import ContactDetail from './pages/contacts/ContactDetail'
import FaqList from './pages/faqs/FaqList'
import FaqForm from './pages/faqs/FaqForm'
import PricingList from './pages/pricing/PricingList'
import PricingForm from './pages/pricing/PricingForm'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'
import ProfilePage from './pages/profile/ProfilePage'

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }
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
        <Route path="/team" element={<TeamList />} />
        <Route path="/team/new" element={<TeamForm />} />
        <Route path="/team/:id/edit" element={<TeamForm />} />
        <Route path="/testimonials" element={<TestimonialList />} />
        <Route path="/testimonials/new" element={<TestimonialForm />} />
        <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/contacts/:id" element={<ContactDetail />} />
        <Route path="/faqs" element={<FaqList />} />
        <Route path="/faqs/new" element={<FaqForm />} />
        <Route path="/faqs/:id/edit" element={<FaqForm />} />
        <Route path="/pricing" element={<PricingList />} />
        <Route path="/pricing/new" element={<PricingForm />} />
        <Route path="/pricing/:id/edit" element={<PricingForm />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  )
}
