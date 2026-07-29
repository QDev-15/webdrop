import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import DashboardPage from './pages/dashboard/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/products" element={<div>Sản phẩm</div>} />
                  <Route path="/orders" element={<div>Đơn hàng</div>} />
                  <Route path="/settings" element={<div>Cài đặt</div>} />
                </Routes>
              </AdminLayout>
            }
          />
          <Route path="/" element={<Navigate to="/admin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
