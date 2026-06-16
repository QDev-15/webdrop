import { useEffect, useState } from 'react'
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

interface GalleryForm {
  title: string
  description: string
  image: string
  category: string
  sort_order: number
  status: string
}

const DEFAULT_FORM: GalleryForm = { title: '', description: '', image: '', category: '', sort_order: 0, status: 'published' }

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<GalleryForm>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<GalleryItem[]>('/gallery')) }
    finally { setLoading(false) }
  }

  function openAdd() { setEditing(null); setForm(DEFAULT_FORM); setShowForm(true) }
  function openEdit(item: GalleryItem) {
    setEditing(item)
    setForm({ title: item.title, description: item.description, image: item.image, category: item.category, sort_order: item.sort_order, status: item.status })
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image) { alert('Vui lòng chọn ảnh'); return }
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/gallery/${editing.id}`, form)
      } else {
        await api.post('/gallery', form)
      }
      setShowForm(false)
      load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa ảnh này?')) return
    await api.delete(`/gallery/${id}`)
    load()
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Thư viện ảnh</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{items.length} ảnh</p>
        </div>
        <button onClick={openAdd} className="btn-accent">+ Thêm ảnh</button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editing ? 'Sửa ảnh' : 'Thêm ảnh mới'}</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gap: 14 }}>
              <ImageField label="Ảnh *" value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} />
              <div>
                <label className="form-label">Tiêu đề</label>
                <input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Tiêu đề ảnh..." />
              </div>
              <div>
                <label className="form-label">Mô tả</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả ngắn..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Danh mục</label>
                  <input className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="food, interior, kitchen..." />
                </div>
                <div>
                  <label className="form-label">Thứ tự</label>
                  <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="form-label">Trạng thái</label>
                  <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="published">Hiển thị</option>
                    <option value="draft">Ẩn</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>Hủy</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖼</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>Chưa có ảnh nào</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img src={item.image} alt={item.title || ''} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, padding: '2px 7px', borderRadius: 5, background: item.status === 'published' ? 'var(--accent)' : 'rgba(0,0,0,.5)', color: '#fff', fontWeight: 500 }}>
                  {item.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                </span>
              </div>
              <div style={{ padding: '10px 12px' }}>
                {item.title && <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.title}</div>}
                {item.category && <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>{item.category}</div>}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(item)} style={{ flex: 1, fontSize: 12, padding: '5px 0', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-2)' }}>Sửa</button>
                  <button onClick={() => handleDelete(item.id)} style={{ flex: 1, fontSize: 12, padding: '5px 0', borderRadius: 6, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer' }}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
