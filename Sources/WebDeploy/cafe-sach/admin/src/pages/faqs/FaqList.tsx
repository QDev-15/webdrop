import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
  status: string
}

interface ItemForm {
  question: string
  answer: string
  sort_order: number
  status: string
}

const emptyForm: ItemForm = { question: '', answer: '', sort_order: 0, status: 'published' }

export default function FaqList() {
  const [items, setItems] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Faq[]>('/faqs')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: Faq) {
    setEditing(item)
    setForm({ question: item.question, answer: item.answer, sort_order: item.sort_order ?? 0, status: item.status ?? 'published' })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) { setError('Câu hỏi và câu trả lời là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/faqs/${editing.id}`, form) }
      else { await api.post('/faqs', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa câu hỏi này?')) return
    await api.delete(`/faqs/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Câu hỏi thường gặp</div>
          <div className="page-sub">{items.length} câu hỏi</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm câu hỏi</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Câu hỏi *</label>
              <input type="text" className="form-control" value={form.question} onChange={e => set('question', e.target.value)} placeholder="Vd: Quán mở cửa giờ nào?" required />
            </div>
            <div className="form-group">
              <label className="form-label">Câu trả lời *</label>
              <textarea className="form-control" value={form.answer} onChange={e => set('answer', e.target.value)} placeholder="Nội dung câu trả lời..." rows={4} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Thứ tự</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiện</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Hủy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Thêm mới')}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{item.question}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{item.answer}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span>
                <button onClick={() => openEdit(item)} className="btn-ghost btn-sm">Sửa</button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">❓</div><div className="empty-state-text">Chưa có câu hỏi nào.</div></div>}
    </div>
  )
}
