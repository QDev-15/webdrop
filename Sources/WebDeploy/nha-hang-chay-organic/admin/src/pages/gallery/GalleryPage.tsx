import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  sort_order: number
  status: string
}

interface ItemForm {
  title: string
  description: string
  image: string
  category: string
  sort_order: number
  status: string
}

const emptyForm: ItemForm = { title: '', description: '', image: '', category: '', sort_order: 0, status: 'published' }

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<GalleryItem[]>('/gallery')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: GalleryItem) {
    setEditing(item)
    setForm({ title: item.title ?? '', description: item.description ?? '', image: item.image, category: item.category ?? '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published' })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image) { setError('Ảnh là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/gallery/${editing.id}`, form) }
      else { await api.post('/gallery', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa ảnh này?')) return
    await api.delete(`/gallery/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Thư viện ảnh</div>
          <div className="page-sub">{items.length} ảnh</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm ảnh</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa ảnh' : 'Thêm ảnh mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <ImageField label="Ảnh *" value={form.image} onChange={v => set('image', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tiêu đề</label>
                <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tiêu đề ảnh" />
              </div>
              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">-- Chọn danh mục --</option>
                  <option value="Món ăn">Món ăn</option>
                  <option value="Không gian">Không gian</option>
                  <option value="Nông trại">Nông trại</option>
                  <option value="Sự kiện">Sự kiện</option>
                  <option value="Đội ngũ">Đội ngũ</option>
                </select>
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
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <input type="text" className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ảnh" />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Hủy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Thêm mới')}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', opacity: 0, transition: 'opacity .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                <button onClick={() => openEdit(item)} className="btn-ghost btn-sm">Sửa</button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'Không có tiêu đề'}</div>
              {item.category && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.category}</div>}
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">📸</div><div className="empty-state-text">Chưa có ảnh nào. Thêm ảnh đầu tiên!</div></div>}
    </div>
  )
}
