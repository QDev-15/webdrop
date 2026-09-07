import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface ContentBlock {
  id: number
  section: string
  icon: string
  title: string
  description: string
  sort_order: number
  status: string
}

interface BlockForm {
  section: string
  icon: string
  title: string
  description: string
  sort_order: number
  status: string
}

const SECTIONS = [
  { key: 'why-us',    label: 'Vì sao chọn (Trang chủ)' },
  { key: 'values',    label: 'Giá trị cốt lõi (Giới thiệu)' },
  { key: 'amenities', label: 'Tiện ích (Không gian)' },
]

function emptyForm(section: string): BlockForm {
  return { section, icon: '', title: '', description: '', sort_order: 0, status: 'published' }
}

export default function ContentBlockPage() {
  const [activeSection, setActiveSection] = useState('why-us')
  const [items, setItems] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ContentBlock | null>(null)
  const [form, setForm] = useState<BlockForm>(emptyForm('why-us'))
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [activeSection])

  async function load() {
    setLoading(true)
    try { setItems(await api.get<ContentBlock[]>(`/content-blocks?section=${activeSection}`)) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm(activeSection)); setError(''); setShowForm(true) }

  function openEdit(item: ContentBlock) {
    setEditing(item)
    setForm({ section: item.section, icon: item.icon ?? '', title: item.title, description: item.description ?? '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published' })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof BlockForm>(k: K, v: BlockForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/content-blocks/${editing.id}`, form) }
      else { await api.post('/content-blocks', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa mục này?')) return
    await api.delete(`/content-blocks/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Nội dung ngắn (icon + text)</div>
          <div className="page-sub">Quản lý các khối "Vì sao chọn", "Giá trị cốt lõi", "Tiện ích"</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm mục</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={activeSection === s.key ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}
          >
            {s.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa mục' : 'Thêm mục mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Icon (emoji)</label>
                <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="☕" />
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề *</label>
                <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: Máy pha chuyên nghiệp" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn (để trống nếu không cần, vd: mục Tiện ích)" rows={2} />
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

      {loading ? <div className="admin-loading">Đang tải...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Tiêu đề</th>
                <th>Mô tả</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontSize: 20 }}>{item.icon}</td>
                  <td style={{ fontWeight: 500 }}>{item.title}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.description || '—'}</td>
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
          {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">Chưa có mục nào trong nhóm này.</div></div>}
        </div>
      )}
    </div>
  )
}
