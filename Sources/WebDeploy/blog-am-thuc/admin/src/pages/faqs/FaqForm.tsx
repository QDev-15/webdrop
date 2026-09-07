import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  question: string
  answer: string
  sort_order: number
  status: string
}

const empty: FormData = { question: '', answer: '', sort_order: 0, status: 'published' }

export default function FaqForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData>(`/faqs/${id}`)
      .then(d => setForm({ ...empty, ...d }))
      .catch(() => setError('Không tìm thấy.'))
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
        <div className="page-title">{isEdit ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</div>
        <button onClick={() => navigate('/faqs')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Câu hỏi *</label>
          <input className="form-control" value={form.question} onChange={e => set('question', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Câu trả lời *</label>
          <textarea className="form-control" rows={5} value={form.answer} onChange={e => set('answer', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hiển thị</option>
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
