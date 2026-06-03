import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial { id: number; author_name: string; author_title: string; rating: number; sort_order: number; status: string }

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { setLoading(true); api.get<Testimonial[]>('/testimonials').then(setItems).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])
  const del = async (id: number) => { if (!confirm('Xóa đánh giá?')) return; await api.delete(`/testimonials/${id}`); load() }

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Đánh giá khách hàng</h1></div>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>
      <div className="card">
        {loading ? <p className="text-muted">Đang tải...</p> : (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>#</th><th>Tên</th><th>Chức vụ</th><th>Rating</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td className="td-name">{t.author_name}</td>
                    <td>{t.author_title}</td>
                    <td style={{ color: '#f59e0b' }}>{'★'.repeat(t.rating)}</td>
                    <td>{t.sort_order}</td>
                    <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/testimonials/${t.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => del(t.id)} className="btn btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '32px' }}>Chưa có đánh giá.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
