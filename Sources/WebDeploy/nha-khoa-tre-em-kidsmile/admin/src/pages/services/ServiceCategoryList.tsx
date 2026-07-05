import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
}

export default function ServiceCategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', slug: '', sort_order: '0' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setCategories(await api.get<Category[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/service-categories', {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        sort_order: Number(form.sort_order),
      })
      setForm({ name: '', slug: '', sort_order: '0' })
      load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa nhóm dịch vụ này?')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Nhóm dịch vụ</div>
          <div className="page-sub">
            <Link to="/services" style={{ color: 'var(--accent)' }}>← Danh sách dịch vụ</Link>
          </div>
        </div>
      </div>

      {/* Add form */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Thêm nhóm mới</div>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label htmlFor="cat-name" className="form-label">Tên nhóm <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span></label>
            <input id="cat-name" type="text" className="form-control" placeholder="Khám & phòng ngừa"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="cat-slug" className="form-label">Slug</label>
            <input id="cat-slug" type="text" className="form-control" placeholder="kham-phong-ngua"
              value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          </div>
          <div className="form-group">
            <label htmlFor="cat-order" className="form-label">Thứ tự</label>
            <input id="cat-order" type="number" className="form-control"
              value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
          </div>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : '+ Thêm nhóm'}
          </button>
        </form>
      </div>

      {/* List */}
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
            {categories.map(cat => (
              <tr key={cat.id}>
                <td style={{ fontWeight: 500 }}>{cat.name}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{cat.slug}</td>
                <td>{cat.sort_order}</td>
                <td>
                  <button onClick={() => handleDelete(cat.id)} className="btn-danger btn-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <div className="empty-state-text">Chưa có nhóm dịch vụ nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
