import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'

// Hero slides
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'

// Products (Bakery)
import MenuCategoryList from './pages/menu/MenuCategoryList'
import MenuItemList from './pages/menu/MenuItemList'
import MenuItemForm from './pages/menu/MenuItemForm'

// Orders (Đặt bánh)
import ReservationList from './pages/reservations/ReservationList'

// Gallery
import GalleryPage from './pages/gallery/GalleryPage'

// Testimonials
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'

// Media
import MediaPage from './pages/media/MediaPage'

// Contacts
import ContactList from './pages/contacts/ContactList'

// Settings
import Settings from './pages/settings/Settings'

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
        path="/*"
        element={
          <RequireAuth>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Slides */}
                <Route path="/slides" element={<HeroSlideList />} />
                <Route path="/slides/new" element={<HeroSlideForm />} />
                <Route path="/slides/:id/edit" element={<HeroSlideForm />} />

                {/* Products */}
                <Route path="/product-categories" element={<MenuCategoryList />} />
                <Route path="/products" element={<MenuItemList />} />
                <Route path="/products/new" element={<MenuItemForm />} />
                <Route path="/products/:id/edit" element={<MenuItemForm />} />

                {/* Orders */}
                <Route path="/orders" element={<ReservationList />} />

                {/* Gallery */}
                <Route path="/gallery" element={<GalleryPage />} />

                {/* Testimonials */}
                <Route path="/testimonials" element={<TestimonialList />} />
                <Route path="/testimonials/new" element={<TestimonialForm />} />
                <Route path="/testimonials/:id/edit" element={<TestimonialForm />} />

                {/* Media */}
                <Route path="/media" element={<MediaPage />} />

                {/* Contacts */}
                <Route path="/contacts" element={<ContactList />} />

                {/* Settings */}
                <Route path="/settings" element={<Settings />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminLayout>
          </RequireAuth>
        }
      />
    </Routes>
  )
}
