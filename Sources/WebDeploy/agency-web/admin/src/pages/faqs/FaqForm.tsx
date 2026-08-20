import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FaqData { question: string; answer: string; page: string; sort_order: number; status: string }

export default function FaqForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FaqData>({ question: '', answer: '', page: 'dich-vu', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<FaqData & { id: number }>(`/faqs/${id}`).then(d => setForm(d)).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) { setError('Câu hỏi và câu trả lời không được để trống.'); return }
    setSaving(true); setError('')
    try {
      isEdit ? await api.put(`/faqs/${id}`, form) : await api.post('/faqs', form)
      navigate('/faqs')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</div></div>
        <button onClick={() => navigate('/faqs')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Câu hỏi *</label>
            <input className="form-control" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Câu trả lời *</label>
            <textarea className="form-control" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} rows={4} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trang hiển thị</label>
              <input className="form-control" value={form.page} onChange={e => setForm({ ...form, page: e.target.value })} placeholder="dich-vu" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="published">Hiển thị</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu câu hỏi'}</button>
            <button type="button" onClick={() => navigate('/faqs')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
