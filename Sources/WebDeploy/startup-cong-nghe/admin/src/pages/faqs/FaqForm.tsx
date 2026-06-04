import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FaqData { question: string; answer: string; sort_order: number; status: string }

export default function FaqForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FaqData>({ question: '', answer: '', sort_order: 0, status: 'published' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<FaqData[]>('/faqs').then((items: FaqData[]) => {
        const found = (items as Array<FaqData & { id: number }>).find(f => f.id === Number(id))
        if (found) setForm(found)
      }).catch(() => setError('Không tìm thấy'))
    }
  }, [id, isEdit])

  const set = (field: keyof FaqData, value: string | number) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) await api.put(`/faqs/${id}`, form)
      else await api.post('/faqs', form)
      navigate('/faqs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header"><h1 className="page-title">{isEdit ? 'Sửa câu hỏi FAQ' : 'Thêm câu hỏi FAQ'}</h1></div>
      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Câu hỏi *</label>
            <input type="text" className="form-control" value={form.question} onChange={e => set('question', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Câu trả lời *</label>
            <textarea className="form-control" rows={5} value={form.answer} onChange={e => set('answer', e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/faqs')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
