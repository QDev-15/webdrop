import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Chuyển trang qua <Link>/navigate() không tự cuộn lên đầu như full page load —
// gọi 1 lần duy nhất ở AppShell (component bọc <Routes>, nằm trong <BrowserRouter>),
// KHÔNG gọi lặp lại trong từng page component.
export function useScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
}
