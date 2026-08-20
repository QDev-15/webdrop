import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FaqForm {
  question: string
  answer: string
  page: string
  sort_order: number
  status: string
}

const DEFAULT: FaqForm = { question: '', answer: '', page: 'dich-vu', sort_order: 0, status: 'published' }

export default function FaqForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FaqForm>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<(FaqForm & { id: number })[]>('/faqs').then(arr => {
        const found = arr.find(f => f.id === Number(id))
        if (found) setForm({ ...found })
      }).catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof FaqForm, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) { setError('Câu hỏi và câu trả lời không được để trống.'); return }
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/faqs/${id}`, form)
      } else {
        await api.post('/faqs', form)
      }
      navigate('/faqs')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/faqs')}>Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Câu hỏi *</label>
            <input className="form-control" value={form.question} onChange={e => set('question', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Câu trả lời *</label>
            <textarea className="form-control" value={form.answer} onChange={e => set('answer', e.target.value)} rows={4} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Trang hiển thị</label>
              <input className="form-control" value={form.page} onChange={e => set('page', e.target.value)} placeholder="dich-vu" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hiển thị</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/faqs')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
