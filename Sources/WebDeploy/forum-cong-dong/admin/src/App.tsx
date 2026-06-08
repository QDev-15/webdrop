import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import CategoryList from './pages/categories/CategoryList'
import CategoryForm from './pages/categories/CategoryForm'
import ThreadList from './pages/threads/ThreadList'
import ThreadForm from './pages/threads/ThreadForm'
import TagList from './pages/tags/TagList'
import SlideList from './pages/slides/SlideList'
import SlideForm from './pages/slides/SlideForm'
import ContactList from './pages/contacts/ContactList'
import MediaPage from './pages/media/MediaPage'
import Settings from './pages/settings/Settings'
import ProfilePage from './pages/profile/ProfilePage'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Dang tai...</div>
  if (!user) return <Navigate to="/login" replace />
  return <AdminLayout>{children}</AdminLayout>
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/forum-categories" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
      <Route path="/forum-categories/new" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
      <Route path="/forum-categories/:id/edit" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
      <Route path="/forum-threads" element={<PrivateRoute><ThreadList /></PrivateRoute>} />
      <Route path="/forum-threads/new" element={<PrivateRoute><ThreadForm /></PrivateRoute>} />
      <Route path="/forum-threads/:id/edit" element={<PrivateRoute><ThreadForm /></PrivateRoute>} />
      <Route path="/forum-tags" element={<PrivateRoute><TagList /></PrivateRoute>} />
      <Route path="/slides" element={<PrivateRoute><SlideList /></PrivateRoute>} />
      <Route path="/slides/new" element={<PrivateRoute><SlideForm /></PrivateRoute>} />
      <Route path="/slides/:id/edit" element={<PrivateRoute><SlideForm /></PrivateRoute>} />
      <Route path="/contacts" element={<PrivateRoute><ContactList /></PrivateRoute>} />
      <Route path="/media" element={<PrivateRoute><MediaPage /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
