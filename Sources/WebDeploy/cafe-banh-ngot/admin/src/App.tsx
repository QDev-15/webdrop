import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import MenuCategoryList from './pages/menu/MenuCategoryList'
import MenuItemList from './pages/menu/MenuItemList'
import MenuItemForm from './pages/menu/MenuItemForm'
import GalleryPage from './pages/gallery/GalleryPage'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import ContactList from './pages/contacts/ContactList'
import Settings from './pages/settings/Settings'
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
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/slides" element={<HeroSlideList />} />
          <Route path="/slides/new" element={<HeroSlideForm />} />
          <Route path="/slides/:id/edit" element={<HeroSlideForm />} />
          <Route path="/menu-categories" element={<MenuCategoryList />} />
          <Route path="/menu-items" element={<MenuItemList />} />
          <Route path="/menu-items/new" element={<MenuItemForm />} />
          <Route path="/menu-items/:id/edit" element={<MenuItemForm />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/testimonials" element={<TestimonialList />} />
          <Route path="/testimonials/new" element={<TestimonialForm />} />
          <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />
          <Route path="/contacts" element={<ContactList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  )
}
