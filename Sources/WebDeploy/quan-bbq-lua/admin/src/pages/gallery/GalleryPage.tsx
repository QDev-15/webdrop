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
    if (!form.image) { setError('Anh la bat buoc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/gallery/${editing.id}`, form) }
      else { await api.post('/gallery', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Luu that bai.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoa anh nay?')) return
    await api.delete(`/gallery/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Thu vien anh</div>
          <div className="page-sub">{items.length} anh</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Them anh</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chinh sua anh' : 'Them anh moi'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <ImageField label="Anh *" value={form.image} onChange={v => set('image', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tieu de</label>
                <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tieu de anh" />
              </div>
              <div className="form-group">
                <label className="form-label">Danh muc</label>
                <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">-- Chon danh muc --</option>
                  <option value="interior">Noi that</option>
                  <option value="food">Mon an</option>
                  <option value="kitchen">Bep</option>
                  <option value="wine">Ruou vang</option>
                  <option value="event">Su kien</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Thu tu</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Trang thai</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hien thi</option>
                  <option value="draft">An</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mo ta</label>
              <input type="text" className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mo ta anh" />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Huy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : (editing ? 'Cap nhat' : 'Them moi')}</button>
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
                <button onClick={() => openEdit(item)} className="btn-ghost btn-sm">Sua</button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xoa</button>
              </div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || 'Khong co tieu de'}</div>
              {item.category && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.category}</div>}
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">📸</div><div className="empty-state-text">Chua co anh nao. Them anh dau tien!</div></div>}
    </div>
  )
}
