import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  sort_order: number
  status: string
  thread_count: number
}

interface FormData {
  name: string
  description: string
  icon: string
  sort_order: number
  status: string
}

const defaults: FormData = { name: '', description: '', icon: '', sort_order: 0, status: 'published' }

export default function CategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(defaults)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setCats(await api.get<Category[]>('/forum-categories')) }
    finally { setLoading(false) }
  }

  const set = (k: keyof FormData, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  function openNew() {
    setForm(defaults); setEditId(null); setError(''); setShowForm(true)
  }

  function openEdit(c: Category) {
    setForm({ name: c.name, description: c.description ?? '', icon: c.icon ?? '', sort_order: c.sort_order, status: c.status })
    setEditId(c.id); setError(''); setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (editId) await api.put(`/forum-categories/${editId}`, form)
      else await api.post('/forum-categories', form)
      setShowForm(false); setEditId(null); setForm(defaults); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này? Các bài viết trong danh mục sẽ bị mất liên kết.')) return
    await api.delete(`/forum-categories/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục diễn đàn</div>
          <div className="page-sub">Quản lý các danh mục chủ đề</div>
        </div>
        <button className="btn-accent" onClick={openNew}>+ Thêm danh mục</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24, maxWidth: 560 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            {editId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Tên danh mục *</label>
                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Icon (emoji)</label>
                <input className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="vd: 💻 🎨 🚀" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <input className="form-control" value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Thứ tự</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editId ? 'Lưu thay đổi' : 'Thêm')}</button>
              <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditId(null) }}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-3)' }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Bài viết</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: 22 }}>{c.icon}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 200 }}>{c.description}</td>
                  <td>{c.thread_count}</td>
                  <td>{c.sort_order}</td>
                  <td><span className={`badge badge-${c.status}`}>{c.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-ghost btn-sm" onClick={() => openEdit(c)}>Sửa</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
