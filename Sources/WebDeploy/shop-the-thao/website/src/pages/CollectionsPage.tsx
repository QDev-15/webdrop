import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CollectionsPage() {
  useDocumentMeta({ title: 'Bộ sưu tập', description: 'Các bộ sưu tập sản phẩm thể thao nổi bật' })

  const collections = [
    { id: 1, name: 'Áo thể thao cơ bản', desc: 'Các chiếc áo thể thao chất lượng cao, thoải mái cho mọi hoạt động' },
    { id: 2, name: 'Giày chạy bộ', desc: 'Giày chạy bộ công nghệ mới, hỗ trợ tốt cho chân' },
    { id: 3, name: 'Dụng cụ yoga', desc: 'Thảm yoga, dụng cụ hỗ trợ tập yoga chuyên nghiệp' },
  ]

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '60px 0' }}>
        <h1 style={{ marginBottom: 12 }}>Bộ sưu tập</h1>
        <p style={{ marginBottom: 40, color: 'var(--text-2)' }}>Khám phá các bộ sưu tập sản phẩm được lựa chọn kỹ lưỡng</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {collections.map(col => (
            <Link
              key={col.id}
              to="/"
              style={{
                padding: 20,
                background: 'white',
                borderRadius: 8,
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all .2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(0,0,0,.07)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'none'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              <h3 style={{ marginBottom: 8, fontSize: 18, fontWeight: 600 }}>{col.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12 }}>{col.desc}</p>
              <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>Xem bộ sưu tập →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
