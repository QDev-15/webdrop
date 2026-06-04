import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact { id: number; name: string; phone: string; email: string; service: string; preferred_date: string; status: string; created_at: string }

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [filter])

  async function load() {
    try { setItems(await api.get<Contact[]>('/contacts' + (filter ? `?status=${filter}` : ''))) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`); load()
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { new: 'badge-info', read: 'badge-muted', replied: 'badge-success' }
    const label: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }
    return <span className={`badge ${map[s] || 'badge-muted'}`}>{label[s] || s}</span>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Liên hệ & Đặt lịch</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'new', 'read', 'replied'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
              {s === '' ? 'Tất cả' : s === 'new' ? 'Mới' : s === 'read' ? 'Đã đọc' : 'Đã trả lời'}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Khách hàng</th><th>Điện thoại</th><th>Dịch vụ</th><th>Ngày hẹn</th><th>Trạng thái</th><th>Ngày gửi</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>Đang tải...</td></tr>
              : items.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>Không có liên hệ nào</td></tr>
              : items.map(c => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/contacts/${c.id}`} style={{ fontWeight: '500', color: 'var(--accent)' }}>{c.name}</Link>
                    {c.email && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{c.email}</div>}
                  </td>
                  <td>{c.phone || '—'}</td>
                  <td style={{ fontSize: '12px' }}>{c.service || '—'}</td>
                  <td style={{ fontSize: '12px' }}>{c.preferred_date || '—'}</td>
                  <td>{statusBadge(c.status)}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/contacts/${c.id}`} className="btn btn-ghost btn-sm">Xem</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
