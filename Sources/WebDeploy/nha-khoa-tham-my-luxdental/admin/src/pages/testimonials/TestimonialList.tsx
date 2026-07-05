import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  stars: number
  is_featured: number
  sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = () => {
    api.get<Testimonial[]>('/testimonials').then(setItems).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const del = async (id: number) => {
    if (!confirm('Xóa đánh giá này?')) return
    try { await api.delete(`/testimonials/${id}`); setMsg('Đã xóa.'); load() }
    catch { setMsg('Lỗi xóa.') }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Đánh giá khách hàng</h1>
        <Link to="/testimonials/new" style={{ padding: '9px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          + Thêm đánh giá
        </Link>
      </div>
      {msg && <div style={{ marginBottom: 12, color: 'var(--accent)', fontSize: 13 }}>{msg}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(t => (
          <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {t.author_avatar && <img src={t.author_avatar} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '50%' }} />}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.author_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.author_role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: t.is_featured ? '#dcfce7' : '#f1f5f9', color: t.is_featured ? '#15803d' : '#64748b' }}>
                  {t.is_featured ? 'Hiển thị' : 'Ẩn'}
                </span>
                <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(t.stars)}</span>
                <Link to={`/testimonials/${t.id}/edit`} style={{ padding: '5px 12px', background: 'var(--warm)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, textDecoration: 'none', color: 'var(--text)' }}>Sửa</Link>
                <button onClick={() => del(t.id)} style={{ padding: '5px 12px', background: '#fee2e2', color: 'var(--danger)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Xóa</button>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{t.content}</p>
          </div>
        ))}
        {items.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có đánh giá nào.</div>}
      </div>
    </div>
  )
}
