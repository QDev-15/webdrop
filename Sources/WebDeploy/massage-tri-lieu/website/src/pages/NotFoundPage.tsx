import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 20px 60px' }}>
      <div>
        <div style={{ fontSize: 72, fontWeight: 600, color: 'var(--accent)', lineHeight: 1, marginBottom: 16 }}>404</div>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Trang khong ton tai</h1>
        <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 28 }}>Trang ban tim kiem da duoc di chuyen hoac khong ton tai.</p>
        <Link to="/" className="mrt-btn-primary">Ve trang chu</Link>
      </div>
    </div>
  )
}
