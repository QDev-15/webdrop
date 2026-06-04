import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
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
    if (!confirm('Xóa nhận xét này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Nhận xét khách hàng</h1>
          <div className="page-hd-sub">{items.length} nhận xét</div>
        </div>
        <Link to="/testimonials/new" className="btn btn-primary btn-sm">+ Thêm nhận xét</Link>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Chức vụ / Công ty</th>
                <th>Nội dung</th>
                <th>Rating</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có nhận xét</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td className="td-name">{item.author_name}</td>
                  <td>{item.author_title || '—'}</td>
                  <td style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.content}
                  </td>
                  <td>{'★'.repeat(item.rating)}</td>
                  <td><span className={`badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/testimonials/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
