import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Space {
  id: number
  name: string
  caption: string
  overlay_text: string
  description: string
  image: string
  sort_order: number
  status: string
}

interface SpaceForm {
  name: string
  caption: string
  overlay_text: string
  description: string
  image: string
  sort_order: number
  status: string
}

const emptyForm: SpaceForm = { name: '', caption: '', overlay_text: '', description: '', image: '', sort_order: 0, status: 'published' }

export default function SpacePage() {
  const [items, setItems] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Space | null>(null)
  const [form, setForm] = useState<SpaceForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Space[]>('/spaces')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: Space) {
    setEditing(item)
    setForm({
      name: item.name, caption: item.caption ?? '', overlay_text: item.overlay_text ?? '',
      description: item.description ?? '', image: item.image ?? '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published',
    })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof SpaceForm>(k: K, v: SpaceForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên khu vực là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/spaces/${editing.id}`, form) }
      else { await api.post('/spaces', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa khu vực này?')) return
    await api.delete(`/spaces/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Khu vực quán</div>
          <div className="page-sub">Hiển thị ở trang chủ (preview) và trang Không gian ({items.length} khu vực)</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm khu vực</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa khu vực' : 'Thêm khu vực mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tên khu vực *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Quầy Bar Mở" required />
              </div>
              <div className="form-group">
                <label className="form-label">Tên tiếng Anh (caption)</label>
                <input type="text" className="form-control" value={form.caption} onChange={e => set('caption', e.target.value)} placeholder="Vd: Open Bar Counter" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Chú thích ngắn (hiển thị ở thẻ preview trang chủ)</label>
              <input type="text" className="form-control" value={form.overlay_text} onChange={e => set('overlay_text', e.target.value)} placeholder="Vd: Xem barista pha chế trực tiếp" />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả đầy đủ (hiển thị ở trang Không gian)</label>
              <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh khu vực" value={form.image} onChange={v => set('image', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Thứ tự</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiện thị</option>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
            <div style={{ aspectRatio: '4/3', background: 'var(--warm)' }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>{item.caption}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(item)} className="btn-ghost btn-sm">Sửa</button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">🏠</div><div className="empty-state-text">Chưa có khu vực nào.</div></div>}
    </div>
  )
}
