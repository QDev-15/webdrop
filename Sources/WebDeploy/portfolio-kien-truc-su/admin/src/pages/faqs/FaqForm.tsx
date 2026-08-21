import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  question: string
  answer: string
  page: string
  sort_order: number
  status: string
}

const empty: FormData = { question: '', answer: '', page: 'dich-vu', sort_order: 0, status: 'published' }

export default function FaqForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/faqs/${id}`)
      .then(d => setForm({
        question: String(d.question ?? ''), answer: String(d.answer ?? ''), page: String(d.page ?? 'dich-vu'),
        sort_order: Number(d.sort_order ?? 0), status: String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không tìm thấy câu hỏi.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.question.trim() || !form.answer.trim()) { setError('Câu hỏi và câu trả lời không được để trống.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/faqs/${id}`, form)
      else await api.post('/faqs', form)
      navigate('/faqs')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</div></div>
        <button onClick={() => navigate('/faqs')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="question">Câu hỏi *</label>
          <input id="question" type="text" className="form-control" value={form.question} onChange={e => set('question', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="answer">Câu trả lời *</label>
          <textarea id="answer" className="form-control" rows={5} value={form.answer} onChange={e => set('answer', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="sort_order">Thứ tự hiển thị</label>
            <input id="sort_order" type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Trạng thái</label>
            <select id="status" className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/faqs')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
