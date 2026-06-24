import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  sort_order: number
  active: number
}

export default function ServiceCategoryList() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', sort_order: 0, active: 1 })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    api.get<Category[]>('/service-categories').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm({ name: '', slug: '', description: '', sort_order: 0, active: 1 }); setShowForm(true); setMsg('') }
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description, sort_order: c.sort_order, active: c.active }); setShowForm(true); setMsg('') }

  const handleSave = async () => {
    if (!form.name) { setMsg('Vui lòng nhập tên danh mục.'); return }
    setSaving(true); setMsg('')
    try {
      if (editing) { await api.put(`/service-categories/${editing.id}`, form) }
      else { await api.post('/service-categories', form) }
      setShowForm(false); load()
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Lỗi lưu') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa danh mục này?')) return
    try { await api.delete(`/service-categories/${id}`); load() } catch {}
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục dịch vụ</div>
          <div className="page-sub">Phân loại các dịch vụ massage</div>
        </div>
        <button className="btn-accent" onClick={openNew}>+ Thêm danh mục</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, maxWidth: 560 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</div>
          {msg && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 10 }}>{msg}</div>}
          {[
            { key: 'name', label: 'Tên danh mục *', type: 'text' },
            { key: 'slug', label: 'Slug (URL)', type: 'text' },
            { key: 'description', label: 'Mô tả', type: 'text' },
            { key: 'sort_order', label: 'Thứ tự', type: 'number' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>{f.label}</label>
              <input type={f.type} value={(form as any)[f.key] ?? ''} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, outline: 'none', fontFamily: 'var(--sans)' }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Trạng thái</label>
            <select value={form.active} onChange={e => setForm(p => ({ ...p, active: +e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, marginTop: 4 }}>
              <option value={1}>Hiện thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-accent" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: 'var(--text-3)' }}>Đang tải...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>ID</th><th>Tên</th><th>Slug</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{c.slug}</td>
                  <td>{c.sort_order}</td>
                  <td><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: c.active ? 'var(--accent-light)' : 'var(--warm)', color: c.active ? 'var(--accent)' : 'var(--text-3)' }}>{c.active ? 'Hiện thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
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
