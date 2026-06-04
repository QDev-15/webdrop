import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial { id: number; author_name: string; author_title: string; content: string; rating: number; sort_order: number; status: string }

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<Testimonial[]>('/testimonials').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Đánh giá khách hàng</div><div className="page-subtitle">Quản lý testimonials</div></div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">Chưa có đánh giá nào.</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tên</th><th>Chức vụ</th><th>Nội dung</th><th>Sao</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.author_name}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{t.author_title}</td>
                    <td style={{ color: 'var(--text-2)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>{t.content}</td>
                    <td style={{ color: '#f59e0b' }}>{'★'.repeat(t.rating)}</td>
                    <td><span className={`badge badge-${t.status}`}><span className="badge-dot" />{t.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td><div className="td-actions">
                      <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/testimonials/${t.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}
