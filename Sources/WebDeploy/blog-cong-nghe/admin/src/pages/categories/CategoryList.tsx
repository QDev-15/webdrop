import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  sort_order: number
  post_count: number
}

const emptyForm = { id: 0, name: '', slug: '', icon: '', sort_order: 0 }

export default function CategoryList() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/categories')) }
    finally { setLoading(false) }
  }

  function openNew() {
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  function openEdit(c: Category) {
    setForm({ id: c.id, name: c.name, slug: c.slug, icon: c.icon, sort_order: c.sort_order })
    setError('')
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên chuyên mục là bắt buộc.'); return }
    setSaving(true)
    try {
      if (form.id) {
        await api.put(`/categories/${form.id}`, form)
      } else {
        await api.post('/categories', form)
      }
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa chuyên mục này? Các bài viết thuộc chuyên mục sẽ không bị xóa nhưng mất liên kết.')) return
    await api.delete(`/categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục</div>
          <div className="page-sub">Chuyên mục bài viết ({items.length} chuyên mục)</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm chuyên mục</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20, maxWidth: 560 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>{form.id ? 'Chỉnh sửa chuyên mục' : 'Thêm chuyên mục mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Tên chuyên mục *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Vd: Tin tức công nghệ" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Slug (để trống sẽ tự tạo)</label>
              <input type="text" className="form-control" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="tin-tuc" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (Bootstrap Icons, vd: bi-broadcast)</label>
              <input type="text" className="form-control" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="bi-broadcast" />
            </div>
          </div>
          <div className="form-group" style={{ maxWidth: 160 }}>
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} min={0} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Hủy</button>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (form.id ? 'Cập nhật' : 'Thêm mới')}</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-text">Chưa có chuyên mục nào. Thêm chuyên mục đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên chuyên mục</th>
                <th>Slug</th>
                <th>Icon</th>
                <th>Số bài viết</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-3)' }}>{c.slug}</td>
                  <td><i className={`bi ${c.icon}`}></i> {c.icon}</td>
                  <td>{c.post_count}</td>
                  <td>{c.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(c)} className="btn-ghost btn-sm">Sửa</button>
                      <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
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
