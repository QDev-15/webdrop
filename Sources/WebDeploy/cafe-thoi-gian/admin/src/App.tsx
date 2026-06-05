import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import SlideList from './pages/slides/SlideList'
import SlideForm from './pages/slides/SlideForm'
import MenuCategoryList from './pages/menu/MenuCategoryList'
import MenuItemList from './pages/menu/MenuItemList'
import MenuItemForm from './pages/menu/MenuItemForm'
import GalleryPage from './pages/gallery/GalleryPage'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import ReservationList from './pages/reservations/ReservationList'
import ContactList from './pages/contacts/ContactList'
import ContactDetail from './pages/contacts/ContactDetail'
import SettingsPage from './pages/settings/SettingsPage'
import MediaPage from './pages/media/MediaPage'
import ProfilePage from './pages/profile/ProfilePage'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )

  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/slides" element={<SlideList />} />
          <Route path="/slides/new" element={<SlideForm />} />
          <Route path="/slides/:id/edit" element={<SlideForm />} />
          <Route path="/menu-categories" element={<MenuCategoryList />} />
          <Route path="/menu-items" element={<MenuItemList />} />
          <Route path="/menu-items/new" element={<MenuItemForm />} />
          <Route path="/menu-items/:id/edit" element={<MenuItemForm />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/testimonials" element={<TestimonialList />} />
          <Route path="/testimonials/new" element={<TestimonialForm />} />
          <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/contacts" element={<ContactList />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  )
}
