import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Faq { id: number; question: string; answer: string; sort_order: number; status: string }

export default function FaqList() {
  const [items, setItems] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ question: '', answer: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Faq[]>('/faqs')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa câu hỏi này?')) return
    await api.delete(`/faqs/${id}`)
    load()
  }

  function startAdd() {
    setEditId(null)
    setForm({ question: '', answer: '', sort_order: items.length + 1, status: 'published' })
    setAlert('')
  }

  function startEdit(f: Faq) {
    setEditId(f.id)
    setForm({ question: f.question, answer: f.answer, sort_order: f.sort_order || 0, status: f.status })
    setAlert('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.question || !form.answer) { setAlert('Câu hỏi và câu trả lời không được để trống'); return }
    setSaving(true)
    try {
      if (editId) await api.put(`/faqs/${editId}`, form)
      else        await api.post('/faqs', form)
      setEditId(null); load(); setAlert('')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr">
        <h1>Câu hỏi thường gặp</h1>
        <button className="btn btn-primary" onClick={startAdd}>+ Thêm câu hỏi</button>
      </div>

      <div className="form-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>{editId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h3>
        {alert && <div className="alert alert-error">{alert}</div>}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Câu hỏi *</label>
            <input className="form-input" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Câu trả lời *</label>
            <textarea className="form-textarea" value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={4} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
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
            <tr><th>Câu hỏi</th><th>Trả lời</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, maxWidth: '260px' }}>{item.question}</td>
                <td style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-2)' }}>{item.answer}</td>
                <td>{item.sort_order}</td>
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
