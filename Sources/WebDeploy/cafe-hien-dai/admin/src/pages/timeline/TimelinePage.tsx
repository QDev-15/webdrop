import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface TimelineItem {
  id: number
  year: string
  phase: string
  title: string
  description: string
  sort_order: number
  status: string
}

interface ItemForm {
  year: string
  phase: string
  title: string
  description: string
  sort_order: number
  status: string
}

const emptyForm: ItemForm = { year: '', phase: '', title: '', description: '', sort_order: 0, status: 'published' }

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TimelineItem | null>(null)
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TimelineItem[]>('/timeline-items')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: TimelineItem) {
    setEditing(item)
    setForm({ year: item.year, phase: item.phase ?? '', title: item.title, description: item.description ?? '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published' })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.year.trim() || !form.title.trim()) { setError('Năm và tiêu đề là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/timeline-items/${editing.id}`, form) }
      else { await api.post('/timeline-items', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa mốc thời gian này?')) return
    await api.delete(`/timeline-items/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hành trình</div>
          <div className="page-sub">{items.length} mốc thời gian</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm mốc</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa mốc thời gian' : 'Thêm mốc mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Năm *</label>
                <input type="text" className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="Vd: 2019" required />
              </div>
              <div className="form-group">
                <label className="form-label">Giai đoạn</label>
                <input type="text" className="form-control" value={form.phase} onChange={e => set('phase', e.target.value)} placeholder="Vd: Khởi đầu" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tiêu đề *</label>
              <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: Mở quầy pha chế đầu tiên" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Năm</th>
              <th>Giai đoạn</th>
              <th>Tiêu đề</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.year}</td>
                <td style={{ color: 'var(--accent)', fontSize: 13 }}>{item.phase}</td>
                <td>{item.title}</td>
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
        {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-text">Chưa có mốc thời gian nào.</div></div>}
      </div>
    </div>
  )
}
