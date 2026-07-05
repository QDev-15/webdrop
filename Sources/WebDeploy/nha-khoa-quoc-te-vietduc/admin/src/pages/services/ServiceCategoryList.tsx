import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  description: string
  sort_order: number
  is_active: number
}

export default function ServiceCategoryList() {
  const [items, setItems]   = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm]     = useState({ name: '', description: '', sort_order: 0, is_active: 1 })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  function openCreate() {
    setEditing(null)
    setForm({ name: '', description: '', sort_order: 0, is_active: 1 })
    setShowForm(true)
  }

  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, description: c.description, sort_order: c.sort_order, is_active: c.is_active })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/service-categories/${editing.id}`, form)
      } else {
        await api.post('/service-categories', form)
      }
      setShowForm(false)
      load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa nhóm dịch vụ này?')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Nhóm Dịch Vụ</h1>
          <p className="adm-page-sub">{items.length} nhóm</p>
        </div>
        <button onClick={openCreate} className="adm-btn-primary">+ Thêm nhóm</button>
      </div>

      {showForm && (
        <div className="adm-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <h2 className="adm-modal-title">{editing ? 'Chỉnh sửa nhóm' : 'Thêm nhóm mới'}</h2>
            <div className="adm-field">
              <label className="adm-label">Tên nhóm *</label>
              <input className="adm-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="adm-field">
              <label className="adm-label">Mô tả</label>
              <textarea className="adm-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="adm-field">
                <label className="adm-label">Thứ tự</label>
                <input className="adm-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Trạng thái</label>
                <select className="adm-input" value={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: parseInt(e.target.value) }))}>
                  <option value={1}>Hiển thị</option>
                  <option value={0}>Ẩn</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={() => setShowForm(false)} className="adm-btn-ghost">Hủy</button>
              <button onClick={handleSave} className="adm-btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Tên nhóm</th>
              <th>Mô tả</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{c.description || '—'}</td>
                <td>{c.sort_order}</td>
                <td><span className={`adm-badge ${c.is_active ? 'active' : 'inactive'}`}>{c.is_active ? 'Hiện' : 'Ẩn'}</span></td>
                <td>
                  <button onClick={() => openEdit(c)} className="adm-btn-ghost adm-btn-sm">Sửa</button>
                  {' '}
                  <button onClick={() => handleDelete(c.id)} className="adm-btn-danger adm-btn-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="adm-empty">Chưa có nhóm dịch vụ nào.</p>}
      </div>
    </div>
  )
}
