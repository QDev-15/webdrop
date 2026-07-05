import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
}

interface CatForm {
  name: string
  slug: string
  sort_order: number
}

export default function ServiceCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<CatForm>({ name: '', slug: '', sort_order: 0 })
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setCats(await api.get<Category[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  function slugify(text: string) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  function startNew() {
    setForm({ name: '', slug: '', sort_order: cats.length })
    setEditId(null)
    setShowForm(true)
    setError('')
  }

  function startEdit(c: Category) {
    setForm({ name: c.name, slug: c.slug, sort_order: c.sort_order })
    setEditId(c.id)
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên nhóm là bắt buộc.'); return }
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/service-categories/${editId}`, form)
      } else {
        await api.post('/service-categories', form)
      }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa nhóm này? Các dịch vụ trong nhóm sẽ không còn được phân loại.')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Nhóm dịch vụ</div>
          <div className="page-sub">{cats.length} nhóm · <Link to="/services" style={{ color: 'var(--accent)' }}>← Về dịch vụ</Link></div>
        </div>
        <button onClick={startNew} className="btn-accent">+ Thêm nhóm</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24, maxWidth: 520 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>{editId ? 'Chỉnh sửa nhóm' : 'Thêm nhóm mới'}</div>
          {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cat-name" className="form-label">Tên nhóm *</label>
              <input id="cat-name" type="text" className="form-control" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} required />
            </div>
            <div className="form-group">
              <label htmlFor="cat-slug" className="form-label">Slug</label>
              <input id="cat-slug" type="text" className="form-control" value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="cat-order" className="form-label">Thứ tự</label>
              <input id="cat-order" type="number" className="form-control" value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} min={0} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editId ? 'Cập nhật' : 'Thêm mới')}</button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên nhóm</th>
              <th>Slug</th>
              <th>Thứ tự</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.slug}</td>
                <td>{c.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => startEdit(c)} className="btn-ghost btn-sm">Sửa</button>
                    <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cats.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🗂️</div>
            <div className="empty-state-text">Chưa có nhóm dịch vụ nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
