import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FaqForm { question: string; answer: string; sort_order: number }
const empty: FaqForm = { question: '', answer: '', sort_order: 0 }

export default function FaqFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FaqForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<FaqForm & { id: number }>(`/faqs/${id}`)
      .then(d => setForm({ question: d.question, answer: d.answer ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy câu hỏi.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FaqForm>(k: K, v: FaqForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.question.trim()) { setError('Câu hỏi là bắt buộc.'); return }
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
        <div className="page-title">{isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</div>
        <button onClick={() => navigate('/faqs')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Câu hỏi *</label>
          <input type="text" className="form-control" value={form.question} onChange={e => set('question', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Câu trả lời</label>
          <textarea className="form-control" rows={4} value={form.answer} onChange={e => set('answer', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/faqs')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
