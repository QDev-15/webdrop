import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Testimonial { id: number; author_name: string; author_title: string; content: string; rating: number; sort_order: number; status: string }

interface FormData { author_name: string; author_title: string; author_avatar: string; content: string; rating: number; sort_order: number; status: string }

const emptyForm: FormData = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialList() {
  const [items, setItems]     = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Testimonial | null>(null)
  const [form, setForm]         = useState<FormData>(emptyForm)
  const [saving, setSaving]     = useState(false)

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

  function openEdit(item: Testimonial) {
    setEditing(item)
    setForm({ author_name: item.author_name, author_title: item.author_title, author_avatar: '', content: item.content, rating: item.rating, sort_order: item.sort_order, status: item.status })
    setShowForm(true)
  }

  function openNew() { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const set = (field: keyof FormData, value: string | number) => setForm(f => ({ ...f, [field]: value }))

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) await api.put(`/testimonials/${editing.id}`, form)
      else await api.post('/testimonials', form)
      setShowForm(false)
      load()
    } catch (err) { alert(err instanceof Error ? err.message : 'Lỗi') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Đánh giá khách hàng</h1><p className="page-sub">Quản lý testimonials</p></div>
        <button className="btn btn-primary" onClick={openNew}>+ Thêm đánh giá</button>
      </div>

      {showForm && (
        <div className="card" style={{ maxWidth: 700, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{editing ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Tên tác giả *</label><input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Chức vụ / Công ty</label><input type="text" className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">URL ảnh đại diện</label><input type="text" className="form-control" value={form.author_avatar} onChange={e => set('author_avatar', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Nội dung đánh giá *</label><textarea className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Số sao (1-5)</label><input type="number" className="form-control" min={1} max={5} value={form.rating} onChange={e => set('rating', parseInt(e.target.value))} /></div>
            <div className="form-group"><label className="form-label">Thứ tự</label><input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value))} /></div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </div>
      )}

      <div className="card">
        {items.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">★</div><div className="empty-state-text">Chưa có đánh giá nào</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tác giả</th><th>Chức vụ</th><th>Nội dung</th><th>Sao</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.author_name}</strong></td>
                    <td className="td-muted">{item.author_title}</td>
                    <td className="td-muted" style={{ maxWidth: 300 }}>{item.content.slice(0, 80)}...</td>
                    <td>{'★'.repeat(item.rating)}</td>
                    <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Sửa</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
