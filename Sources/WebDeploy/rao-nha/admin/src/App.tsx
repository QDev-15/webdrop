import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/login/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import ProfilePage from './pages/profile/ProfilePage'
import MediaPage from './pages/media/MediaPage'
import HeroSlideList from './pages/slides/HeroSlideList'
import HeroSlideForm from './pages/slides/HeroSlideForm'
import ContactList from './pages/contacts/ContactList'
import ListingList from './pages/listings/ListingList'
import ListingPackageList from './pages/listing-packages/ListingPackageList'
import AccountList from './pages/accounts/AccountList'
import WalletTransactionList from './pages/wallet/WalletTransactionList'
import FaqList from './pages/faqs/FaqList'
import FaqForm from './pages/faqs/FaqForm'
import ArticleList from './pages/articles/ArticleList'
import ArticleForm from './pages/articles/ArticleForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import Settings from './pages/settings/Settings'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={
        <PrivateRoute>
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="slides" element={<HeroSlideList />} />
              <Route path="slides/new" element={<HeroSlideForm />} />
              <Route path="slides/:id/edit" element={<HeroSlideForm />} />
              <Route path="listings" element={<ListingList />} />
              <Route path="listing-packages" element={<ListingPackageList />} />
              <Route path="accounts" element={<AccountList />} />
              <Route path="wallet-transactions" element={<WalletTransactionList />} />
              <Route path="faqs" element={<FaqList />} />
              <Route path="faqs/new" element={<FaqForm />} />
              <Route path="faqs/:id/edit" element={<FaqForm />} />
              <Route path="articles" element={<ArticleList />} />
              <Route path="articles/new" element={<ArticleForm />} />
              <Route path="articles/:id/edit" element={<ArticleForm />} />
              <Route path="testimonials" element={<TestimonialList />} />
              <Route path="testimonials/new" element={<TestimonialForm />} />
              <Route path="testimonials/:id/edit" element={<TestimonialForm />} />
              <Route path="contacts" element={<ContactList />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </AdminLayout>
        </PrivateRoute>
      } />
    </Routes>
  )
}
