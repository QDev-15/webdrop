import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface FaqFormData {
  question: string
  answer: string
  page: string
  sort_order: number
  status: string
}

const INIT: FaqFormData = { question: '', answer: '', page: 'dich-vu', sort_order: 0, status: 'published' }

export default function FaqForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FaqFormData>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<FaqFormData & { id: number }>(`/faqs/${id}`)
        .then(d => setForm({ question: d.question, answer: d.answer, page: d.page || 'dich-vu', sort_order: d.sort_order, status: d.status }))
        .catch(() => setError('Không tìm thấy câu hỏi.'))
    }
  }, [id, isEdit])

  const set = (k: keyof FaqFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.question || !form.answer) { setError('Câu hỏi và câu trả lời không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/faqs/${id}`, form) }
      else { await api.post('/faqs', form) }
      navigate('/faqs')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout title={isEdit ? 'Sửa FAQ' : 'Thêm FAQ'}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</h1>
        <button className="btn-ghost" onClick={() => navigate('/faqs')}>Quay lại</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Câu hỏi *</label>
            <input className="form-control" value={form.question} onChange={e => set('question', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Câu trả lời *</label>
            <textarea className="form-control" value={form.answer} onChange={e => set('answer', e.target.value)} rows={4} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Trang hiển thị</label>
              <input className="form-control" value={form.page} onChange={e => set('page', e.target.value)} placeholder="dich-vu" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Đã đăng</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/faqs')}>Hủy</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
