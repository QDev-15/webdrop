import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialFormData {
  author_name: string
  author_meta: string
  author_avatar: string
  stars: number
  quote: string
  is_active: number
  sort_order: number
}

const EMPTY: TestimonialFormData = { author_name: '', author_meta: '', author_avatar: '', stars: 5, quote: '', is_active: 1, sort_order: 0 }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TestimonialFormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<TestimonialFormData[]>('/testimonials').then((items: any) => {
      const found = Array.isArray(items) ? items.find((t: any) => t.id === Number(id)) : null
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof TestimonialFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name || !form.quote) { setError('Vui lòng nhập tên tác giả và nội dung đánh giá.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</div>
          <div className="page-subtitle">Nhận xét từ khách hàng gia đình</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Tên tác giả <span className="req">*</span></label>
            <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Chị Nguyễn Thị A" required />
          </div>
          <div className="form-group">
            <label className="form-label">Số sao (1-5)</label>
            <select className="form-control" value={form.stars} onChange={e => set('stars', Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} sao</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Meta (ví dụ: Phụ huynh bé Bông, Khách hàng thân thiết)</label>
          <input className="form-control" value={form.author_meta} onChange={e => set('author_meta', e.target.value)} placeholder="Phụ huynh bé Bông" />
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh đại diện (URL)</label>
          <ImageField value={form.author_avatar} onChange={v => set('author_avatar', v)} placeholder="URL ảnh khách hàng" />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá <span className="req">*</span></label>
          <textarea className="form-control" rows={4} value={form.quote} onChange={e => set('quote', e.target.value)} placeholder='"Bé nhà mình rất sợ nha sĩ nhưng đến Sunrise thì hết sợ luôn..."' required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_active === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hiển thị trên website
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu đánh giá'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
        </div>
      </form>
    </>
  )
}
