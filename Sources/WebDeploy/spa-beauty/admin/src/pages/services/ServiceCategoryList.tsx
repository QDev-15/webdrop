import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Category { id: number; name: string; icon: string; sort_order: number }

export default function ServiceCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', icon: '💆', sort_order: 0 })
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try { setCats(await api.get<Category[]>('/service-categories')) }
    catch { setError('Không thể tải danh mục.') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm({ name: '', icon: '💆', sort_order: cats.length })
    setShowForm(true)
    setMsg(''); setError('')
  }

  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, icon: c.icon, sort_order: c.sort_order })
    setShowForm(true)
    setMsg(''); setError('')
  }

  async function save() {
    setMsg(''); setError('')
    try {
      if (editing) {
        await api.put(`/service-categories/${editing.id}`, form)
        setMsg('Đã cập nhật danh mục.')
      } else {
        await api.post('/service-categories', form)
        setMsg('Đã tạo danh mục.')
      }
      setShowForm(false)
      load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
  }

  async function remove(id: number) {
    if (!confirm('Xóa danh mục này?')) return
    try { await api.delete(`/service-categories/${id}`); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Lỗi xóa') }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Danh mục dịch vụ</div></div>
        <button className="btn-accent" onClick={openNew}>+ Thêm danh mục</button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>{editing ? 'Sửa danh mục' : 'Thêm danh mục'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Tên danh mục *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Massage" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon</label>
              <input className="form-control" value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))} placeholder="💆" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: +e.target.value}))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn-accent" onClick={save}>Lưu</button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </div>
      )}

      {loading ? <div className="admin-loading">Đang tải...</div> : (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>Icon</th><th>Tên danh mục</th><th>Thứ tự</th><th>Thao tác</th></tr></thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: 22 }}>{c.icon}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td>{c.sort_order}</td>
                  <td>
                    <button className="btn-ghost btn-sm" onClick={() => openEdit(c)}>Sửa</button>
                    <button className="btn-ghost btn-sm" style={{ color: 'var(--danger)', marginLeft: 6 }} onClick={() => remove(c.id)}>Xóa</button>
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
