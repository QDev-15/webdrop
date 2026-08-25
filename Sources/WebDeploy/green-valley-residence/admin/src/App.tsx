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
import UnitTypeList from './pages/unit-types/UnitTypeList'
import UnitTypeForm from './pages/unit-types/UnitTypeForm'
import AmenityList from './pages/amenities/AmenityList'
import AmenityForm from './pages/amenities/AmenityForm'
import NearbyAmenityList from './pages/nearby-amenities/NearbyAmenityList'
import NearbyAmenityForm from './pages/nearby-amenities/NearbyAmenityForm'
import PaymentPhaseList from './pages/payment-phases/PaymentPhaseList'
import PaymentPhaseForm from './pages/payment-phases/PaymentPhaseForm'
import SalesPolicyList from './pages/sales-policies/SalesPolicyList'
import SalesPolicyForm from './pages/sales-policies/SalesPolicyForm'
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

        <Route path="/unit-types" element={<UnitTypeList />} />
        <Route path="/unit-types/new" element={<UnitTypeForm />} />
        <Route path="/unit-types/:id/edit" element={<UnitTypeForm />} />

        <Route path="/amenities" element={<AmenityList />} />
        <Route path="/amenities/new" element={<AmenityForm />} />
        <Route path="/amenities/:id/edit" element={<AmenityForm />} />

        <Route path="/nearby-amenities" element={<NearbyAmenityList />} />
        <Route path="/nearby-amenities/new" element={<NearbyAmenityForm />} />
        <Route path="/nearby-amenities/:id/edit" element={<NearbyAmenityForm />} />

        <Route path="/payment-phases" element={<PaymentPhaseList />} />
        <Route path="/payment-phases/new" element={<PaymentPhaseForm />} />
        <Route path="/payment-phases/:id/edit" element={<PaymentPhaseForm />} />

        <Route path="/sales-policies" element={<SalesPolicyList />} />
        <Route path="/sales-policies/new" element={<SalesPolicyForm />} />
        <Route path="/sales-policies/:id/edit" element={<SalesPolicyForm />} />

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
