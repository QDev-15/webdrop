import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  created_at: string
}

const statusOpts = [
  { value: 'new', label: 'Mới', color: '#1d4ed8' },
  { value: 'read', label: 'Đã đọc', color: '#6b6760' },
  { value: 'replied', label: 'Đã trả lời', color: '#1a6b52' },
]

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Contact[]>('/contacts')) }
    finally { setLoading(false) }
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

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Liên hệ</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{items.length} liên hệ</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 16 }}>
        {/* List */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {items.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Chưa có liên hệ nào</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Người gửi', 'Chủ đề', 'Trạng thái', 'Ngày', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const s = statusOpts.find(o => o.value === item.status)
                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: selected?.id === item.id ? 'var(--accent-light)' : item.status === 'new' ? 'rgba(29,78,216,.03)' : 'transparent' }}
                      onClick={() => setSelected(item)}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subject || '(không có)'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: (s?.color ?? '#6b6760') + '18', color: s?.color ?? '#6b6760', fontWeight: 500 }}>
                          {s?.label ?? item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Chi tiết liên hệ</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Họ tên</div><div style={{ fontSize: 14, fontWeight: 500 }}>{selected.name}</div></div>
              {selected.phone && <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Điện thoại</div><div style={{ fontSize: 14 }}>{selected.phone}</div></div>}
              {selected.email && <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Email</div><div style={{ fontSize: 14 }}>{selected.email}</div></div>}
              {selected.subject && <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Chủ đề</div><div style={{ fontSize: 14 }}>{selected.subject}</div></div>}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Nội dung</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, background: 'var(--bg)', padding: 12, borderRadius: 8 }}>{selected.message}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>Trạng thái</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {statusOpts.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { updateStatus(selected.id, opt.value); setSelected({ ...selected, status: opt.value }) }}
                      style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: `1px solid ${selected.status === opt.value ? opt.color : 'var(--border)'}`, background: selected.status === opt.value ? opt.color + '18' : 'transparent', color: selected.status === opt.value ? opt.color : 'var(--text-3)', cursor: 'pointer', fontWeight: selected.status === opt.value ? 600 : 400 }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(selected.id)} style={{ marginTop: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer', fontSize: 13 }}>
                Xóa liên hệ này
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
