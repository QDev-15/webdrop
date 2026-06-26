import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Category { id: number; name: string; icon: string; sort_order: number }

export default function ServiceCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', icon: '💅', sort_order: 0 })
  const [editId, setEditId] = useState<number | null>(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const data = await api.get<Category[]>('/service-categories')
    setCats(data)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      if (editId) {
        await api.put(`/service-categories/${editId}`, form)
        setMsg('Đã cập nhật danh mục.')
      } else {
        await api.post('/service-categories', form)
        setMsg('Đã thêm danh mục.')
      }
      setForm({ name: '', icon: '💅', sort_order: 0 })
      setEditId(null)
      load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
  }

  function startEdit(c: Category) {
    setEditId(c.id)
    setForm({ name: c.name, icon: c.icon, sort_order: c.sort_order })
    setMsg(''); setError('')
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này? Các dịch vụ thuộc danh mục sẽ không còn category.')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục dịch vụ</div>
          <div className="page-sub">Quản lý nhóm dịch vụ nail</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Form */}
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            {editId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </div>
          {msg && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên danh mục *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Nail Tay" required />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input className="form-control" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="💅" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự sắp xếp</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-accent">{editId ? 'Cập nhật' : 'Thêm danh mục'}</button>
              {editId && <button type="button" className="btn-ghost" onClick={() => { setEditId(null); setForm({ name: '', icon: '💅', sort_order: 0 }) }}>Hủy</button>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Icon</th><th>Tên</th><th>Thứ tự</th><th></th></tr></thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: 22 }}>{c.icon}</td>
                  <td>{c.name}</td>
                  <td>{c.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost btn-sm" onClick={() => startEdit(c)}>Sửa</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {cats.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-3)', padding: 24 }}>Chưa có danh mục</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
