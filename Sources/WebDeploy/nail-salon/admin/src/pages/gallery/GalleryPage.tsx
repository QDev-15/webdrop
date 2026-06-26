import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface GalleryItem { id: number; image: string; title: string; sort_order: number }
const blank = { image: '', title: '', sort_order: '0' }

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(blank)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function load() {
    api.get<GalleryItem[]>('/gallery').then(data => { setItems(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  function startEdit(item: GalleryItem) {
    setEditId(item.id)
    setForm({ image: item.image, title: item.title, sort_order: item.sort_order.toString() })
  }
  function cancelEdit() { setEditId(null); setForm(blank); setError('') }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const payload = { image: form.image, title: form.title, sort_order: +form.sort_order }
    try {
      if (editId) await api.put(`/gallery/${editId}`, payload)
      else await api.post('/gallery', payload)
      cancelEdit(); load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa ảnh này?')) return
    await api.delete(`/gallery/${id}`)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Gallery ảnh</div>
          <div className="page-sub">Quản lý bộ sưu tập ảnh nail</div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Form thêm / sửa */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>{editId ? 'Chỉnh sửa ảnh' : 'Thêm ảnh mới'}</div>
        <form onSubmit={handleSubmit}>
          <ImageField label="Ảnh" value={form.image} onChange={v => set('image', v)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tiêu đề (tuỳ chọn)</label>
              <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="VD: Nail Art Mùa Hè" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving || !form.image}>{saving ? 'Đang lưu...' : (editId ? 'Lưu thay đổi' : '+ Thêm ảnh')}</button>
            {editId && <button type="button" className="btn-ghost" onClick={cancelEdit}>Hủy</button>}
          </div>
        </form>
      </div>

      {/* Grid ảnh */}
      {items.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">🖼️</div><div className="empty-state-text">Chưa có ảnh nào</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--warm)' }}>
                {item.image
                  ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>🖼️</div>}
              </div>
              <div style={{ padding: '10px 12px' }}>
                {item.title && <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.title}</div>}
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>Thứ tự: {item.sort_order}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => startEdit(item)}>Sửa</button>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
