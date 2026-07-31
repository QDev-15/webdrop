import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import DashboardPage from './pages/dashboard/Dashboard'
import ProductList from './pages/products/ProductList'
import ProductForm from './pages/products/ProductForm'
import ProductCategoryList from './pages/product-categories/ProductCategoryList'
import ProductCategoryForm from './pages/product-categories/ProductCategoryForm'
import OrderList from './pages/orders/OrderList'
import OrderDetail from './pages/orders/OrderDetail'
import Settings from './pages/settings/Settings'
import ProfilePage from './pages/profile/ProfilePage'
import ContactList from './pages/contacts/ContactList'
import MediaPage from './pages/media/MediaPage'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div style={{padding: '20px'}}>Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />

  return <AdminLayout>{children}</AdminLayout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/products/:id/edit" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/product-categories" element={<ProtectedRoute><ProductCategoryList /></ProtectedRoute>} />
      <Route path="/product-categories/new" element={<ProtectedRoute><ProductCategoryForm /></ProtectedRoute>} />
      <Route path="/product-categories/:id/edit" element={<ProtectedRoute><ProductCategoryForm /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />
      <Route path="/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
      <Route path="/slides" element={<ProtectedRoute><HeroSlideList /></ProtectedRoute>} />
      <Route path="/slides/new" element={<ProtectedRoute><HeroSlideForm /></ProtectedRoute>} />
      <Route path="/slides/:id/edit" element={<ProtectedRoute><HeroSlideForm /></ProtectedRoute>} />
    </Routes>
  )
}
