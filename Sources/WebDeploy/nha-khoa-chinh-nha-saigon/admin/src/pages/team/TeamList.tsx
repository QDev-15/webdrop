import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  specialties: string
  tag: string
  sort_order: number
}

export default function TeamList() {
  const [items, setItems] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Doctor[]>('/team').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xoa bac si nay?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Doi ngu bac si</div>
          <div className="page-subtitle">Quan ly bac si chuyen khoa chinh nha</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Them bac si</Link>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Dang tai...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Anh</th>
                <th>Ho ten</th>
                <th>Chuyen khoa</th>
                <th>Kinh nghiem</th>
                <th>Tag</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {items.map(d => (
                <tr key={d.id}>
                  <td>
                    {d.photo && (
                      <img src={d.photo} alt={d.name} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{d.name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{d.role}</td>
                  <td style={{ color: 'var(--text-2)' }}>{d.experience_years} nam</td>
                  <td>{d.tag && <span className="badge badge-published"><span className="badge-dot" />{d.tag}</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/team/${d.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                      <button onClick={() => handleDelete(d.id)} className="btn-danger btn-sm">Xoa</button>
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
