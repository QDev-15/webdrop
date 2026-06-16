import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Đánh giá</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{items.length} đánh giá</p>
        </div>
        <Link to="/testimonials/new" className="btn-accent" style={{ textDecoration: 'none' }}>+ Thêm đánh giá</Link>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>Chưa có đánh giá nào</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {item.author_avatar ? (
                  <img src={item.author_avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👤</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.author_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.author_title}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#f59e0b' }}>{'★'.repeat(item.rating)}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, background: item.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', color: item.status === 'published' ? 'var(--accent)' : 'var(--text-3)', fontWeight: 500 }}>
                        {item.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10 }}>"{item.content}"</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/testimonials/${item.id}/edit`} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', textDecoration: 'none' }}>Sửa</Link>
                    <button onClick={() => handleDelete(item.id)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer' }}>Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
