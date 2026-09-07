import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Item {
  id: number
  icon: string
  name: string
  description: string
  tag: string
  sort_order: number
  status: string
}

interface ItemForm {
  icon: string
  name: string
  description: string
  tag: string
  sort_order: number
  status: string
}

const emptyForm: ItemForm = { icon: '☕', name: '', description: '', tag: '', sort_order: 0, status: 'published' }

export default function BrewMethodPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Item[]>('/brew-methods')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: Item) {
    setEditing(item)
    setForm({ icon: item.icon ?? '☕', name: item.name, description: item.description ?? '', tag: item.tag ?? '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published' })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên phương pháp là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/brew-methods/${editing.id}`, form) }
      else { await api.post('/brew-methods', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa phương pháp này?')) return
    await api.delete(`/brew-methods/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Phương pháp pha chế</div>
          <div className="page-sub">Hiển thị ở trang chủ — mục "Phương pháp pha chế" ({items.length} mục)</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm phương pháp</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa' : 'Thêm mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="☕" />
              </div>
              <div className="form-group">
                <label className="form-label">Tên phương pháp *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tag ngắn</label>
                <input type="text" className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Vd: Đậm đà · Nhanh" />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Hủy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Thêm mới')}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: 24, width: 44, height: 44, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{item.name} {item.tag && <span style={{ fontSize: 11, color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 20, marginLeft: 8 }}>{item.tag}</span>}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
              <span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span>
              <button onClick={() => openEdit(item)} className="btn-ghost btn-sm">Sửa</button>
              <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">☕</div><div className="empty-state-text">Chưa có phương pháp nào.</div></div>}
    </div>
  )
}
