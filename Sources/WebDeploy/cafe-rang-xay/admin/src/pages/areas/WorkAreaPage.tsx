import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Item {
  id: number
  name: string
  caption: string
  detail_title: string
  short_sub: string
  description: string
  image: string
  sort_order: number
  status: string
}

type ItemForm = Omit<Item, 'id'>

const emptyForm: ItemForm = { name: '', caption: '', detail_title: '', short_sub: '', description: '', image: '', sort_order: 0, status: 'published' }

export default function WorkAreaPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Item[]>('/work-areas')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: Item) {
    setEditing(item)
    setForm({
      name: item.name, caption: item.caption ?? '', detail_title: item.detail_title ?? '', short_sub: item.short_sub ?? '',
      description: item.description ?? '', image: item.image ?? '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published',
    })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên khu vực là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/work-areas/${editing.id}`, form) }
      else { await api.post('/work-areas', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa khu vực này?')) return
    await api.delete(`/work-areas/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Khu vực xưởng</div>
          <div className="page-sub">Dùng chung cho trang chủ (preview) và trang Không gian (chi tiết) — {items.length} khu vực</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm khu vực</button>
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
                <label className="form-label">Tên hiển thị trang chủ *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Khu Rang" required />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả ngắn (trang chủ)</label>
                <input type="text" className="form-control" value={form.short_sub} onChange={e => set('short_sub', e.target.value)} placeholder="Vd: Máy rang trống · Quan sát trực tiếp" />
              </div>
              <div className="form-group">
                <label className="form-label">Nhãn nhỏ (trang Không gian)</label>
                <input type="text" className="form-control" value={form.caption} onChange={e => set('caption', e.target.value)} placeholder="Vd: Khu rang" />
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề chi tiết (trang Không gian)</label>
                <input type="text" className="form-control" value={form.detail_title} onChange={e => set('detail_title', e.target.value)} placeholder="Vd: Rang Trống Micro-Batch" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả chi tiết</label>
              <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

      <div className="table-wrap">
        <table>
          <thead><tr><th>Ảnh</th><th>Tên</th><th>Tiêu đề chi tiết</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.image ? <img src={item.image} alt={item.name} className="thumb" /> : <div className="thumb" />}</td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{item.detail_title || '—'}</td>
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
        {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">🏭</div><div className="empty-state-text">Chưa có khu vực nào.</div></div>}
      </div>
    </div>
  )
}
