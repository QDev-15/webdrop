import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

interface User { id: number; name: string; email: string; role: string; created_at: string }

export default function UserList() {
  const { user: me } = useAuth()
  const [items, setItems] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<User[]>('/users').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xoa tai khoan nay?')) return
    await api.delete(`/users/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Tai khoan</div>
          <div className="page-subtitle">Quan ly nguoi dung admin</div>
        </div>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Dang tai...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ho ten</th>
                <th>Email</th>
                <th>Vai tro</th>
                <th>Ngay tao</th>
                {me?.role === 'superadmin' && <th>Hanh dong</th>}
              </tr>
            </thead>
            <tbody>
              {items.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>
                    {u.name}
                    {u.id === me?.id && (
                      <span style={{ fontSize: '10px', color: 'var(--accent)', marginLeft: '6px' }}>(ban)</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role === 'superadmin' ? 'published' : 'draft'}`}>
                      <span className="badge-dot" />
                      {u.role === 'superadmin' ? 'Quan tri vien' : 'Nguoi dung'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>
                    {new Date(u.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  {me?.role === 'superadmin' && (
                    <td>
                      <div className="td-actions">
                        {u.id !== me.id && (
                          <button onClick={() => handleDelete(u.id)} className="btn-danger btn-sm">Xoa</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
