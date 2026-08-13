import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  description: string
  duration: number
  level: string
  image: string
  max_capacity: number
  status: string
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.get<Service[]>('/services')
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
    if (!confirm('Xóa dịch vụ này?')) return
    try {
      await api.delete(`/services/${id}`)
      load()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ yoga</div>
          <div className="page-sub">Quản lý các lớp học yoga</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Chưa có dịch vụ nào</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Thời gian</th>
                <th>Cấp độ</th>
                <th>Sức chứa</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontSize: '18px' }}>{item.image ? '📷' : '❌'}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.duration} phút</td>
                  <td>{item.level}</td>
                  <td>{item.max_capacity} người</td>
                  <td>{item.status === 'published' ? '✓ Hiển thị' : '○ Ẩn'}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/admin/services/${item.id}`} className="btn-ghost btn-sm">Sửa</Link>
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
