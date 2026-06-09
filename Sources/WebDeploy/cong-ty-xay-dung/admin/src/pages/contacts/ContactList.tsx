import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  project_type: string
  status: string
  created_at: string
}

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setItems(await api.get<Contact[]>('/contacts'))
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: number, status: string) {
    await api.put(`/contacts/${id}`, { status })
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`)
    setSelected(null)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Liên hệ</div>
          <div className="page-sub">Yêu cầu báo giá và liên hệ từ khách hàng</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✉</div>
              <div className="empty-state-text">Chưa có liên hệ nào</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Loại công trình</th>
                  <th>Trạng thái</th>
                  <th>Ngày gửi</th>
                  <th style={{ width: 100 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(c); updateStatus(c.id, 'read') }}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.subject}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{c.phone}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.email}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{c.project_type}</td>
                    <td>
                      <span className={`badge badge-${c.status}`}>
                        {c.status === 'new' ? 'Mới' : c.status === 'read' ? 'Đã đọc' : 'Đã trả lời'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {new Date(c.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <button className="btn-danger btn-sm" onClick={e => { e.stopPropagation(); handleDelete(c.id) }}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>Chi tiết liên hệ</div>
              <button className="btn-ghost btn-sm" onClick={() => setSelected(null)}>Đóng</button>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>Họ tên</div>
                <div style={{ fontWeight: 500 }}>{selected.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>Điện thoại</div>
                <div>{selected.phone}</div>
              </div>
              {selected.email && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>Email</div>
                  <div>{selected.email}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>Loại công trình</div>
                <div>{selected.project_type || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Nội dung</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, background: 'var(--bg)', padding: 12, borderRadius: 8 }}>{selected.message}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn-accent btn-sm" onClick={() => updateStatus(selected.id, 'replied')}>Đánh dấu đã trả lời</button>
                <button className="btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Xóa</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
