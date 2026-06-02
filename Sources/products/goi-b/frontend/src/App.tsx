import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PostList from './pages/posts/PostList'
import PostForm from './pages/posts/PostForm'
import PageList from './pages/pages/PageList'
import PageForm from './pages/pages/PageForm'
import CategoryList from './pages/categories/CategoryList'
import ContactList from './pages/contacts/ContactList'
import Settings from './pages/settings/Settings'
import BannerList from './pages/banners/BannerList'
import BannerForm from './pages/banners/BannerForm'
import MediaList from './pages/media/MediaList'

// Route guard — dùng Outlet pattern để tránh nested <Routes>
function Guard() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6b6760', fontSize: 14 }}>
      Đang tải...
    </div>
  )
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected routes — Guard + AdminLayout dùng Outlet */}
      <Route element={<Guard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<PostList />} />
          <Route path="posts/new" element={<PostForm />} />
          <Route path="posts/:id/edit" element={<PostForm />} />
          <Route path="pages" element={<PageList />} />
          <Route path="pages/new" element={<PageForm />} />
          <Route path="pages/:id/edit" element={<PageForm />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="settings" element={<Settings />} />
          <Route path="banners" element={<BannerList />} />
          <Route path="banners/new" element={<BannerForm />} />
          <Route path="banners/:id/edit" element={<BannerForm />} />
          <Route path="media" element={<MediaList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
