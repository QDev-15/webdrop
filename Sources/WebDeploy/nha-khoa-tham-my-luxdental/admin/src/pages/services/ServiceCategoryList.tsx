import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
}

export default function ServiceCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [msg, setMsg] = useState('')

  const load = () => {
    api.get<Category[]>('/service-categories').then(setCats).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const startEdit = (c: Category) => { setEditId(c.id); setEditName(c.name); setEditSlug(c.slug) }

  const saveEdit = async () => {
    if (!editName.trim()) return
    try {
      await api.put(`/service-categories/${editId}`, { name: editName, slug: editSlug, sort_order: 0 })
      setEditId(null); setMsg('Đã cập nhật!'); load()
    } catch { setMsg('Lỗi cập nhật.') }
  }

  const addNew = async () => {
    if (!newName.trim()) return
    try {
      await api.post('/service-categories', { name: newName, slug: newSlug || undefined })
      setNewName(''); setNewSlug(''); setMsg('Đã thêm!'); load()
    } catch { setMsg('Lỗi thêm mới.') }
  }

  const del = async (id: number) => {
    if (!confirm('Xóa nhóm dịch vụ này?')) return
    try {
      await api.delete(`/service-categories/${id}`)
      setMsg('Đã xóa.'); load()
    } catch { setMsg('Lỗi xóa.') }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Nhóm dịch vụ</h1>
      {msg && <div style={{ marginBottom: 12, color: 'var(--accent)', fontSize: 13 }}>{msg}</div>}

      {/* Add form */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Thêm nhóm mới</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Tên nhóm *"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13 }} />
          <input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="slug (tùy chọn)"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13 }} />
          <button onClick={addNew}
            style={{ padding: '8px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Thêm
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Tên nhóm</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-2)' }}>Slug</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, color: 'var(--text-2)' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 16px', fontSize: 14 }}>
                  {editId === c.id
                    ? <input value={editName} onChange={e => setEditName(e.target.value)}
                        style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, width: 200 }} />
                    : c.name}
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-2)' }}>
                  {editId === c.id
                    ? <input value={editSlug} onChange={e => setEditSlug(e.target.value)}
                        style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, width: 160 }} />
                    : c.slug}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  {editId === c.id ? (
                    <>
                      <button onClick={saveEdit} style={{ padding: '5px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginRight: 6 }}>Lưu</button>
                      <button onClick={() => setEditId(null)} style={{ padding: '5px 12px', background: 'var(--warm)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(c)} style={{ padding: '5px 12px', background: 'var(--warm)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginRight: 6 }}>Sửa</button>
                      <button onClick={() => del(c.id)} style={{ padding: '5px 12px', background: '#fee2e2', color: 'var(--danger)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Xóa</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cats.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có nhóm nào.</div>}
      </div>
    </div>
  )
}
