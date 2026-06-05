import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  sort_order: number
  status: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', image: '', category: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    api.get<GalleryItem[]>('/gallery').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.post('/gallery', form)
      setAdding(false); setForm({ title: '', description: '', image: '', category: '', sort_order: 0, status: 'published' })
      load()
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Lỗi thêm ảnh') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa ảnh này?')) return
    await api.delete(`/gallery/${id}`)
    load()
  }

  const toggleStatus = async (item: GalleryItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published'
    await api.put(`/gallery/${item.id}`, { ...item, status: newStatus })
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Gallery ảnh</div>
          <div className="page-sub">{items.length} ảnh trong bộ sưu tập</div>
        </div>
        <button className="btn-accent" onClick={() => setAdding(!adding)}>+ Thêm ảnh</button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}>Thêm ảnh mới</div>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Tiêu đề</label>
                <input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <input className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="khong-gian, do-uong..." />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">URL ảnh *</label>
                <input className="form-control" type="url" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} required placeholder="https://..." />
                {form.image && <img src={form.image} style={{ marginTop: '8px', maxHeight: '80px', borderRadius: '6px' }} alt="preview" onError={e => (e.currentTarget.style.display = 'none')} />}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-accent btn-sm" disabled={saving}>{saving ? 'Đang lưu...' : 'Thêm ảnh'}</button>
              <button type="button" className="btn-ghost btn-sm" onClick={() => setAdding(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f0ede8" width="100" height="100"/><text y=".9em" font-size="50" x="25">🖼</text></svg>')} />
                <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
                  <button className="btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)} title="Xóa">✕</button>
                </div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>{item.title || 'Không có tiêu đề'}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{item.category || '—'}</span>
                  <button
                    style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', cursor: 'pointer', background: item.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', color: item.status === 'published' ? 'var(--accent)' : 'var(--text-3)', border: 'none' }}
                    onClick={() => toggleStatus(item)}
                  >
                    {item.status === 'published' ? 'Hiện' : 'Ẩn'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1/-1' }}>
              <div className="empty-state"><div className="empty-state-icon">🖼</div><div className="empty-state-text">Chưa có ảnh nào</div></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
