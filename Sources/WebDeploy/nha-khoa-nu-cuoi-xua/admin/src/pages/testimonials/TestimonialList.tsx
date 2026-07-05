import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_meta: string
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
    if (!confirm('Xoa danh gia nay?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Danh gia khach hang</div>
          <div className="page-subtitle">Cam nhan tu khach hang cua Nu Cuoi Xua</div>
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
                <th>Khach hang</th>
                <th>Dich vu / Vai tro</th>
                <th>Diem sao</th>
                <th>Noi dung</th>
                <th>Thu tu</th>
                <th>Hien thi</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500 }}>{t.author_name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{t.author_meta}</td>
                  <td>
                    <span style={{ color: '#f59e0b' }}>{'★'.repeat(Math.min(5, t.stars || 5))}</span>
                  </td>
                  <td style={{ maxWidth: '240px', color: 'var(--text-2)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.quote}
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{t.sort_order}</td>
                  <td>{t.is_active ? <span style={{ color: 'var(--accent)' }}>Co</span> : <span style={{ color: 'var(--text-3)' }}>An</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                      <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chua co danh gia nao</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
