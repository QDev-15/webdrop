import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Consultation { id: number; name: string; phone: string; email: string; field: string; message: string; time_pref: string; status: string; created_at: string }

const STATUS_OPTIONS = ['new', 'contacted', 'done', 'cancelled']
const STATUS_LABELS: Record<string, string> = { new: 'Mới', contacted: 'Đã liên hệ', done: 'Hoàn thành', cancelled: 'Đã hủy' }

export default function ConsultationList() {
  const [items, setItems] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Consultation | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Consultation[]>('/consultations')) }
    finally { setLoading(false) }
  }

  async function handleStatus(id: number, status: string) {
    await api.put(`/consultations/${id}`, { status })
    load()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đăng ký này?')) return
    await api.delete(`/consultations/${id}`)
    setSelected(null); load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr"><h1>Đăng ký tư vấn</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px' }}>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Họ tên</th><th>Điện thoại</th><th>Lĩnh vực</th><th>Trạng thái</th><th>Ngày</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ cursor: 'pointer', background: selected?.id === item.id ? 'var(--accent-light)' : '' }}
                  onClick={() => setSelected(item)}>
                  <td style={{ fontWeight: item.status === 'new' ? 600 : 400 }}>{item.name}</td>
                  <td>{item.phone}</td>
                  <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--text-2)' }}>{item.field}</td>
                  <td><span className={`badge badge-${item.status}`}>{STATUS_LABELS[item.status] || item.status}</span></td>
                  <td style={{ fontSize: '11px', color: 'var(--text-3)' }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); handleDelete(item.id) }}>Xóa</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-title">Chưa có đăng ký nào</div></div></td></tr>}
            </tbody>
          </table>
        </div>
        {selected && (
          <div className="form-card" style={{ position: 'sticky', top: '0', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Chi tiết tư vấn</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Họ tên</span>{selected.name}</div>
              <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Điện thoại</span><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
              {selected.email && <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Email</span>{selected.email}</div>}
              {selected.field && <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Lĩnh vực</span>{selected.field}</div>}
              {selected.time_pref && <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Thời gian liên hệ</span>{selected.time_pref}</div>}
              {selected.message && <div><span style={{ color: 'var(--text-3)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Mô tả vụ việc</span><div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '6px', lineHeight: '1.6' }}>{selected.message}</div></div>}
              <div style={{ marginTop: '8px' }}>
                <label className="form-label">Cập nhật trạng thái</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} className={`btn btn-sm ${selected.status === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handleStatus(selected.id, s)}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
