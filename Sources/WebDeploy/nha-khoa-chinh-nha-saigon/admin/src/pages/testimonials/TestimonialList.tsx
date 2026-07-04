import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  content: string
  rating: number
  is_featured: number
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
    if (!confirm('Xoa danh gia nay?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Danh gia khach hang</div>
          <div className="page-subtitle">Quan ly cac danh gia tu khach hang</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Them danh gia</Link>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Dang tai...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tac gia</th>
                <th>Vai tro</th>
                <th>Noi dung</th>
                <th>Sao</th>
                <th>Hien thi</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500 }}>{t.author_name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{t.author_role}</td>
                  <td style={{ color: 'var(--text-2)', maxWidth: '280px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.content}</div>
                  </td>
                  <td>{'★'.repeat(t.rating)}</td>
                  <td>{t.is_featured ? <span style={{ color: 'var(--accent)' }}>Co</span> : <span style={{ color: 'var(--text-3)' }}>Khong</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                      <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xoa</button>
                    </div>
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
