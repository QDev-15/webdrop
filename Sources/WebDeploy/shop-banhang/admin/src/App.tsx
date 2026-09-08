import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ProductsPage from './pages/products/ProductsPage'
import CustomersPage from './pages/customers/CustomersPage'
import StockImportPage from './pages/stock/StockImportPage'
import StocktakePage from './pages/stock/StocktakePage'
import ReportsPage from './pages/reports/ReportsPage'
import ContactList from './pages/contacts/ContactList'
import MediaPage from './pages/media/MediaPage'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import Settings from './pages/settings/Settings'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AccessDenied() {
  const { user, logout } = useAuth()
  return (
    <div className="login-page">
      <div className="login-box" style={{ textAlign: 'center' }}>
        <div className="login-logo">shop-banhang<span>.</span>Admin</div>
        <p style={{ margin: '16px 0', color: 'var(--text-2)', fontSize: 14 }}>
          Tài khoản <strong>{user?.name}</strong> không có quyền truy cập trang quản trị.
          Chỉ tài khoản <strong>Quản lý</strong> mới vào được khu vực này — nhân viên thu ngân
          vui lòng dùng POS bán hàng ở trang chính.
        </p>
        <button className="btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }} onClick={() => logout()}>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Routes><Route path="*" element={<LoginPage />} /></Routes>
  // Lớp gate UX phía client — mọi endpoint admin-only phía backend đã tự
  // Auth::requireRole('superadmin') độc lập, đây chỉ là bảo vệ thêm ở giao diện.
  if (user.role !== 'superadmin') return <AccessDenied />

  return (
    <RequireAuth>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/slides" element={<HeroSlideList />} />
          <Route path="/slides/new" element={<HeroSlideForm />} />
          <Route path="/slides/:id" element={<HeroSlideForm />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/stock-imports" element={<StockImportPage />} />
          <Route path="/stocktake" element={<StocktakePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/contacts" element={<ContactList />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </RequireAuth>
  )
}
