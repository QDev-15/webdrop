import { Link } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Trang không tồn tại')
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 20px' }}>
      <div>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>☕</div>
        <h1 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>Trang không tìm thấy</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-2)', marginBottom: '28px' }}>Có vẻ bạn đã đi lạc — không sao, hãy quay lại trang chủ.</p>
        <Link to="/" className="btn-accent">Về trang chủ</Link>
      </div>
    </div>
  )
}
