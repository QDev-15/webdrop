import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number; name: string; slug: string; description: string; icon: string; sort_order: number; is_active: number
}

export default function ServiceCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '', sort_order: '0', is_active: '1' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function load() {
    api.get<Category[]>('/service-categories')
      .then(setCats)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('Xoá danh mục này?')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  function startEdit(c: Category) {
    setEditingId(c.id)
    setForm({ name: c.name, description: c.description ?? '', icon: c.icon ?? '', sort_order: String(c.sort_order), is_active: String(c.is_active) })
    setError('')
  }

  function startNew() {
    setEditingId(0)
    setForm({ name: '', description: '', icon: '', sort_order: '0', is_active: '1' })
    setError('')
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Tên danh mục là bắt buộc.'); return }
    setSaving(true)
    try {
      if (editingId === 0) {
        await api.post('/service-categories', { ...form, sort_order: Number(form.sort_order), is_active: Number(form.is_active) })
      } else {
        await api.put(`/service-categories/${editingId}`, { ...form, sort_order: Number(form.sort_order), is_active: Number(form.is_active) })
      }
      setEditingId(null)
      load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh mục điều trị</h1>
          <p className="page-sub">Quản lý các nhóm dịch vụ điều trị da</p>
        </div>
        <button className="btn btn-primary" onClick={startNew}>+ Thêm danh mục</button>
      </div>

      {editingId !== null && (
        <div className="form-card">
          <h3 className="form-card-title">{editingId === 0 ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}</h3>
          {error && <div className="form-error">{error}</div>}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tên danh mục *</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Điều trị mụn" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🔴" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Hiển thị</label>
              <select className="form-input" value={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.value }))}>
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setEditingId(null)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr><th>Icon</th><th>Tên danh mục</th><th>Slug</th><th>Thứ tự</th><th>Hiển thị</th><th></th></tr>
        </thead>
        <tbody>
          {cats.length === 0 && <tr><td colSpan={6} className="table-empty">Chưa có danh mục.</td></tr>}
          {cats.map(c => (
            <tr key={c.id}>
              <td>{c.icon}</td>
              <td>{c.name}</td>
              <td><code>{c.slug}</code></td>
              <td>{c.sort_order}</td>
              <td><span className={`status-badge ${c.is_active ? 'done' : 'cancelled'}`}>{c.is_active ? 'Có' : 'Không'}</span></td>
              <td className="table-actions">
                <button className="btn-icon" onClick={() => startEdit(c)}>✎</button>
                <button className="btn-icon danger" onClick={() => handleDelete(c.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
