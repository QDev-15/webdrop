import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
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
import CouponList from './pages/coupons/CouponList'
import CouponForm from './pages/coupons/CouponForm'

function ProtectedRoutes() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/') {
      navigate('/')
    }
  }, [user, loading, navigate, location.pathname])

  if (loading) {
    return <div style={{ padding: '64px', textAlign: 'center' }}>Đang tải...</div>
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/product-categories" element={<ProductCategoryList />} />
        <Route path="/product-categories/new" element={<ProductCategoryForm />} />
        <Route path="/product-categories/:id/edit" element={<ProductCategoryForm />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:code" element={<OrderDetail />} />
        <Route path="/coupons" element={<CouponList />} />
        <Route path="/coupons/new" element={<CouponForm />} />
        <Route path="/coupons/:id/edit" element={<CouponForm />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/slides" element={<HeroSlideList />} />
        <Route path="/slides/new" element={<HeroSlideForm />} />
        <Route path="/slides/:id/edit" element={<HeroSlideForm />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  )
}
