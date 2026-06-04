import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Contact { id: number; name: string; email: string; phone: string; subject: string; message: string; status: string; created_at: string }

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Contact[]>('/contacts')) }
    finally { setLoading(false) }
  }

  async function handleStatus(id: number, status: string) {
    await api.put(`/contacts/${id}`, { status })
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`)
    setSelected(null); load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr"><h1>Liên hệ</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px' }}>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Họ tên</th><th>SĐT / Email</th><th>Chủ đề</th><th>Trạng thái</th><th>Ngày</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ cursor: 'pointer', background: selected?.id === item.id ? 'var(--accent-light)' : '' }}
                  onClick={() => setSelected(item)}>
                  <td style={{ fontWeight: item.status === 'new' ? 600 : 400 }}>{item.name}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-2)' }}>{item.phone || item.email}</td>
                  <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>{item.subject}</td>
                  <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                  <td style={{ fontSize: '11px', color: 'var(--text-3)' }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); handleDelete(item.id) }}>Xóa</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-title">Chưa có liên hệ nào</div></div></td></tr>}
            </tbody>
          </table>
        </div>
        {selected && (
          <div className="form-card" style={{ position: 'sticky', top: '0', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Chi tiết</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Họ tên</span>{selected.name}</div>
              {selected.phone && <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Điện thoại</span>{selected.phone}</div>}
              {selected.email && <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Email</span>{selected.email}</div>}
              {selected.subject && <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Chủ đề</span>{selected.subject}</div>}
              <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Nội dung</span><div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '6px', lineHeight: '1.6' }}>{selected.message}</div></div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleStatus(selected.id, 'read')}>Đánh dấu đã đọc</button>
                <button className="btn btn-primary btn-sm" onClick={() => handleStatus(selected.id, 'replied')}>Đã phản hồi</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
