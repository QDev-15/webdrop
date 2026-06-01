import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--sans)', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: 440 }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: 'var(--warm2)', lineHeight: 1, marginBottom: 16 }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.5px', marginBottom: 10 }}>Trang không tồn tại</h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 28 }}>
          Trang bạn tìm kiếm đã bị xoá, đổi tên hoặc chưa được tạo.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '10px 22px', borderRadius: 9, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Về trang chủ
          </Link>
          <Link href="/templates" style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 13, textDecoration: 'none' }}>
            Xem mẫu thiết kế
          </Link>
        </div>
      </div>
    </div>
  )
}
