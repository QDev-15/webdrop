import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  sort_order: number
  service_count: number
}

export default function ServiceCategoryList() {
  const [items, setItems]     = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm]       = useState({ name: '', description: '', sort_order: 0 })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  function openNew() {
    setEditing(null)
    setForm({ name: '', description: '', sort_order: items.length })
    setError('')
  }

  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, description: c.description, sort_order: c.sort_order })
    setError('')
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Tên danh mục không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (editing) {
        await api.put(`/service-categories/${editing.id}`, form)
      } else {
        await api.post('/service-categories', form)
      }
      setEditing(null)
      setForm({ name: '', description: '', sort_order: 0 })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu danh mục.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoá danh mục này? Các dịch vụ thuộc danh mục cũng sẽ bị xoá.')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục dịch vụ</div>
          <div className="page-sub">{items.length} danh mục</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm danh mục</button>
      </div>

      {/* Form */}
      {(editing !== undefined || form.name !== '') && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 15 }}>
            {editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tên danh mục *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Thẩm mỹ gương mặt" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Thứ tự hiển thị</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <input className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả ngắn về danh mục..." />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={saving} className="btn-accent">
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button onClick={() => { setEditing(null); setForm({ name: '', description: '', sort_order: 0 }); setError('') }} className="btn-ghost">Huỷ</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⊞</div>
          <div className="empty-state-text">Chưa có danh mục nào. Thêm danh mục đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Số dịch vụ</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{c.description || '—'}</td>
                  <td><span className="badge badge-published">{c.service_count} dịch vụ</span></td>
                  <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{c.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(c)} className="btn-ghost btn-sm">Sửa</button>
                      <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xoá</button>
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
