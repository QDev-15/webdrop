import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  service: string
  message: string
  status: string
  created_at: string
}

export default function ContactsList() {
  const [items, setItems]     = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Contact[]>('/contacts').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  const handleStatus = async (id: number, status: string) => {
    await api.put(`/contacts/${id}`, { status })
    load()
  }

  const statusClass: Record<string, string> = { new: 'badge-new', read: 'badge-read', replied: 'badge-replied' }
  const statusLabel: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

  return (
    <AdminLayout title="Liên hệ">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liên hệ</h1>
          <p className="page-sub">Tin nhắn từ khách hàng</p>
        </div>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tên</th><th>Liên hệ</th><th>Dịch vụ</th><th>Nội dung</th><th>Trạng thái</th><th>Ngày</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>
                    {item.email && <div style={{ fontSize: 13 }}>{item.email}</div>}
                    {item.phone && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{item.phone}</div>}
                  </td>
                  <td style={{ fontSize: 13 }}>{item.service || '—'}</td>
                  <td style={{ maxWidth: 200, fontSize: 13, color: 'var(--text-2)' }}>{item.message?.substring(0, 60)}...</td>
                  <td>
                    <span className={`badge ${statusClass[item.status] || 'badge-draft'}`}>{statusLabel[item.status] || item.status}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      <Link to={`/contacts/${item.id}`} className="btn-ghost btn-sm">Xem</Link>
                      {item.status !== 'replied' && (
                        <button className="btn-ghost btn-sm" onClick={() => handleStatus(item.id, 'replied')}>Đã trả lời</button>
                      )}
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có liên hệ nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
