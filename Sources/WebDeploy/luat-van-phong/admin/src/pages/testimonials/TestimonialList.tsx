import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Testimonial { id: number; author_name: string; author_title: string; content: string; case_type: string; status: string }

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ author_name: '', author_title: '', content: '', case_type: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  function startAdd() {
    setEditId(null)
    setForm({ author_name: '', author_title: '', content: '', case_type: '', sort_order: 0, status: 'published' })
    setAlert('')
  }

  function startEdit(t: Testimonial) {
    setEditId(t.id)
    setForm({ author_name: t.author_name, author_title: t.author_title || '', content: t.content, case_type: t.case_type || '', sort_order: 0, status: t.status })
    setAlert('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name || !form.content) { setAlert('Tên và nội dung không được để trống'); return }
    setSaving(true)
    try {
      if (editId) await api.put(`/testimonials/${editId}`, form)
      else        await api.post('/testimonials', form)
      setEditId(null); load(); setAlert('')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr">
        <h1>Đánh giá thân chủ</h1>
        <button className="btn btn-primary" onClick={startAdd}>+ Thêm đánh giá</button>
      </div>

      {(editId !== null || editId === null && form.author_name === '' && false) && null}

      {/* Inline form */}
      <div className="form-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>{editId ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</h3>
        {alert && <div className="alert alert-error">{alert}</div>}
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên tác giả *</label>
              <input className="form-input" value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ / Mô tả</label>
              <input className="form-input" value={form.author_title} onChange={e => setForm(f => ({ ...f, author_title: e.target.value }))} placeholder="Giám đốc, Công ty XYZ" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung *</label>
            <textarea className="form-textarea" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Loại vụ việc</label>
              <input className="form-input" value={form.case_type} onChange={e => setForm(f => ({ ...f, case_type: e.target.value }))} placeholder="Vụ M&A" />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (editId ? 'Cập nhật' : 'Thêm')}</button>
            {editId && <button type="button" className="btn btn-ghost" onClick={() => setEditId(null)}>Hủy</button>}
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Tác giả</th><th>Nội dung</th><th>Loại vụ việc</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.author_name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{item.author_title}</div>
                </td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-2)' }}>{item.content}</td>
                <td>{item.case_type}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(item)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
