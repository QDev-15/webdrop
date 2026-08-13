import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
  featured: number
  status: string
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.get<Testimonial[]>('/testimonials')
      setItems(data)
      setError('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa bình luận này?')) return
    try {
      await api.delete(`/testimonials/${id}`)
      load()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Bình luận khách</div>
          <div className="page-sub">Quản lý đánh giá và bình luận từ khách hàng</div>
        </div>
        <Link to="/admin/testimonials/new" className="btn-accent">+ Thêm bình luận</Link>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Chưa có bình luận nào</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Chức vụ</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.author_name}</td>
                  <td>{item.author_role}</td>
                  <td>{'⭐'.repeat(Math.floor(item.rating))}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.content}</td>
                  <td>{item.status === 'published' ? '✓ Hiển thị' : '○ Ẩn'}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/admin/testimonials/${item.id}`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
