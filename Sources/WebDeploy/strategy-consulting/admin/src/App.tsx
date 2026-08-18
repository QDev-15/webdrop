import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
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
        <Route path="/"                  element={<Dashboard />} />
        <Route path="/slides"            element={<HeroSlideList />} />
        <Route path="/slides/new"        element={<HeroSlideForm />} />
        <Route path="/slides/:id/edit"   element={<HeroSlideForm />} />
        <Route path="/services"          element={<ServiceList />} />
        <Route path="/services/new"      element={<ServiceForm />} />
        <Route path="/services/:id/edit" element={<ServiceForm />} />
        <Route path="/contacts"          element={<ContactList />} />
        <Route path="/media"             element={<MediaPage />} />
        <Route path="/settings"          element={<Settings />} />
        <Route path="/profile"           element={<ProfilePage />} />
        {/* Không có trang quản lý Users trong scaffold — chỉ Profile (đổi mật khẩu tài khoản hiện tại) */}
        <Route path="*"                  element={<Navigate to="/" replace />} />
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
