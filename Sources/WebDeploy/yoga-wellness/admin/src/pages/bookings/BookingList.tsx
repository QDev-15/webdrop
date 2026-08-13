import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Booking {
  id: number
  name: string
  email: string
  phone: string
  service_name: string
  experience_level: string
  preferred_time: string
  start_date: string
  status: string
  created_at: string
}

export default function BookingList() {
  const [items, setItems] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.get<Booking[]>('/bookings')
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
    if (!confirm('Xóa đặt lịch này?')) return
    try {
      await api.delete(`/bookings/${id}`)
      load()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Đặt lịch</div>
          <div className="page-sub">Danh sách các lần khách đặt lịch</div>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Chưa có đặt lịch nào</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Dịch vụ</th>
                <th>Ngày bắt đầu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.service_name}</td>
                  <td>{item.start_date}</td>
                  <td>{item.status === 'new' ? '🆕 Mới' : item.status === 'confirmed' ? '✓ Xác nhận' : '○ Khác'}</td>
                  <td>
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
