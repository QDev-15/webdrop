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
import ReservationList from './pages/reservations/ReservationList'
import GalleryPage from './pages/gallery/GalleryPage'
import TestimonialList from './pages/testimonials/TestimonialList'
import ContactList from './pages/contacts/ContactList'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'
import ProfilePage from './pages/profile/ProfilePage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="slides" element={<HeroSlideList />} />
        <Route path="slides/new" element={<HeroSlideForm />} />
        <Route path="slides/:id/edit" element={<HeroSlideForm />} />
        <Route path="menu-categories" element={<MenuCategoryList />} />
        <Route path="menu-items" element={<MenuItemList />} />
        <Route path="menu-items/new" element={<MenuItemForm />} />
        <Route path="menu-items/:id/edit" element={<MenuItemForm />} />
        <Route path="reservations" element={<ReservationList />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="testimonials" element={<TestimonialList />} />
        <Route path="contacts" element={<ContactList />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
