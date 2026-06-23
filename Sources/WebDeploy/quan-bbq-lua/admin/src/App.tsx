import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'
import Settings from './pages/settings/Settings'

// Slides
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'

// Menu
import MenuCategoryList from './pages/menu/MenuCategoryList'
import MenuItemList from './pages/menu/MenuItemList'
import MenuItemForm from './pages/menu/MenuItemForm'

// Reservations
import ReservationList from './pages/reservations/ReservationList'

// Gallery
import GalleryPage from './pages/gallery/GalleryPage'

// Testimonials
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'

// Contacts
import ContactList from './pages/contacts/ContactList'

// Media
import MediaPage from './pages/media/MediaPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

      <Route path="/*" element={
        <RequireAuth>
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<Settings />} />

              {/* Slides */}
              <Route path="slides" element={<HeroSlideList />} />
              <Route path="slides/new" element={<HeroSlideForm />} />
              <Route path="slides/:id/edit" element={<HeroSlideForm />} />

              {/* Menu */}
              <Route path="menu-categories" element={<MenuCategoryList />} />
              <Route path="menu-items" element={<MenuItemList />} />
              <Route path="menu-items/new" element={<MenuItemForm />} />
              <Route path="menu-items/:id/edit" element={<MenuItemForm />} />

              {/* Reservations */}
              <Route path="reservations" element={<ReservationList />} />

              {/* Gallery */}
              <Route path="gallery" element={<GalleryPage />} />

              {/* Testimonials */}
              <Route path="testimonials" element={<TestimonialList />} />
              <Route path="testimonials/new" element={<TestimonialForm />} />
              <Route path="testimonials/:id/edit" element={<TestimonialForm />} />

              {/* Contacts */}
              <Route path="contacts" element={<ContactList />} />

              {/* Media */}
              <Route path="media" element={<MediaPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AdminLayout>
        </RequireAuth>
      } />
    </Routes>
  )
}
