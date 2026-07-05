import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_meta: string
  author_avatar: string
  stars: number
  quote: string
  is_active: number
  sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Testimonial[]>('/testimonials').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Đánh giá khách hàng</div>
          <div className="page-subtitle">Quản lý nhận xét từ khách hàng gia đình</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tác giả</th>
                <th>Meta (ví dụ: Phụ huynh bé X)</th>
                <th>Nội dung</th>
                <th>Sao</th>
                <th>Hiển thị</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td>
                    {t.author_avatar && (
                      <img src={t.author_avatar} alt={t.author_name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '50%' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{t.author_name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{t.author_meta}</td>
                  <td style={{ color: 'var(--text-2)', maxWidth: '260px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.quote}</div>
                  </td>
                  <td style={{ color: '#f59e0b' }}>{'★'.repeat(t.stars)}</td>
                  <td>{t.is_active ? <span style={{ color: 'var(--accent)' }}>Có</span> : <span style={{ color: 'var(--text-3)' }}>Ẩn</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chưa có đánh giá nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
