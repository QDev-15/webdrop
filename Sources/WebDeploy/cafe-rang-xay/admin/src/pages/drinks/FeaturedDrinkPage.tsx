import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Item {
  id: number
  image: string
  origin: string
  name: string
  description: string
  price: number | null
  sort_order: number
  status: string
}

interface ItemForm {
  image: string
  origin: string
  name: string
  description: string
  price: string
  sort_order: number
  status: string
}

const emptyForm: ItemForm = { image: '', origin: '', name: '', description: '', price: '', sort_order: 0, status: 'published' }

export default function FeaturedDrinkPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Item[]>('/featured-drinks')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: Item) {
    setEditing(item)
    setForm({
      image: item.image ?? '', origin: item.origin ?? '', name: item.name, description: item.description ?? '',
      price: item.price != null ? String(item.price) : '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published',
    })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên thức uống là bắt buộc.'); return }
    setSaving(true); setError('')
    const payload = { ...form, price: form.price !== '' ? parseFloat(form.price) : null }
    try {
      if (editing) { await api.put(`/featured-drinks/${editing.id}`, payload) }
      else { await api.post('/featured-drinks', payload) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa thức uống này?')) return
    await api.delete(`/featured-drinks/${id}`)
    load()
  }

  function formatPrice(price: number | null): string {
    if (price == null) return '—'
    return price.toLocaleString('vi-VN') + 'đ'
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Thức uống nổi bật</div>
          <div className="page-sub">Hiển thị ở trang chủ — mục "Thức uống nổi bật" ({items.length} mục)</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm thức uống</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa' : 'Thêm mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <ImageField label="Ảnh *" value={form.image} onChange={v => set('image', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Xuất xứ / dòng blend</label>
                <input type="text" className="form-control" value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="Vd: Cầu Đất, Đà Lạt" />
              </div>
              <div className="form-group">
                <label className="form-label">Tên thức uống *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Giá (VND)</label>
                <input type="number" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <input type="text" className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về hương vị" />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)} style={{ maxWidth: 200 }}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Hủy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Thêm mới')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Ảnh</th><th>Tên</th><th>Xuất xứ</th><th>Giá</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.image ? <img src={item.image} alt={item.name} className="thumb" /> : <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>☕</div>}</td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{item.origin || '—'}</td>
                <td style={{ fontWeight: 500 }}>{formatPrice(item.price)}</td>
                <td>{item.sort_order}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(item)} className="btn-ghost btn-sm">Sửa</button>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">☕</div><div className="empty-state-text">Chưa có thức uống nổi bật nào.</div></div>}
      </div>
    </div>
  )
}
