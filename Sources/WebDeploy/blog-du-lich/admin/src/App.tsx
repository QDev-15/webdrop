import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import CategoryList from './pages/categories/CategoryList'
import CategoryForm from './pages/categories/CategoryForm'
import PostList from './pages/posts/PostList'
import PostForm from './pages/posts/PostForm'
import DestinationList from './pages/destinations/DestinationList'
import DestinationForm from './pages/destinations/DestinationForm'
import FaqList from './pages/faqs/FaqList'
import FaqForm from './pages/faqs/FaqForm'
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
        <Route path="/"                       element={<Dashboard />} />
        <Route path="/slides"                 element={<HeroSlideList />} />
        <Route path="/slides/new"             element={<HeroSlideForm />} />
        <Route path="/slides/:id/edit"        element={<HeroSlideForm />} />
        <Route path="/categories"             element={<CategoryList />} />
        <Route path="/categories/new"         element={<CategoryForm />} />
        <Route path="/categories/:id/edit"    element={<CategoryForm />} />
        <Route path="/posts"                  element={<PostList />} />
        <Route path="/posts/new"              element={<PostForm />} />
        <Route path="/posts/:id/edit"         element={<PostForm />} />
        <Route path="/destinations"           element={<DestinationList />} />
        <Route path="/destinations/new"       element={<DestinationForm />} />
        <Route path="/destinations/:id/edit"  element={<DestinationForm />} />
        <Route path="/faqs"                   element={<FaqList />} />
        <Route path="/faqs/new"               element={<FaqForm />} />
        <Route path="/faqs/:id/edit"          element={<FaqForm />} />
        <Route path="/contacts"               element={<ContactList />} />
        <Route path="/media"                  element={<MediaPage />} />
        <Route path="/settings"               element={<Settings />} />
        <Route path="/profile"                element={<ProfilePage />} />
        <Route path="*"                       element={<Navigate to="/" replace />} />
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
