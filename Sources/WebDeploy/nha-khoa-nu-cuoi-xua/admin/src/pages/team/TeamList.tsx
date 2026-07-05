import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  tags: string
  sort_order: number
  is_active: number
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
          <div className="page-subtitle">Bac si chuyen khoa cua Nu Cuoi Xua Nha Khoa</div>
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
                <th>Tags</th>
                <th>Thu tu</th>
                <th>Hien thi</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {items.map(d => (
                <tr key={d.id}>
                  <td>
                    {d.photo ? (
                      <img src={d.photo} alt={d.name} style={{ width: '36px', height: '46px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '36px', height: '46px', background: 'var(--warm2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '18px' }}>👤</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{d.name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{d.role}</td>
                  <td style={{ color: 'var(--text-2)' }}>{d.experience_years} nam</td>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.tags}</td>
                  <td style={{ color: 'var(--text-2)' }}>{d.sort_order}</td>
                  <td>{d.is_active ? <span style={{ color: 'var(--accent)' }}>Co</span> : <span style={{ color: 'var(--text-3)' }}>An</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/team/${d.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                      <button onClick={() => handleDelete(d.id)} className="btn-danger btn-sm">Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chua co bac si nao</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
