import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormState {
  author_name: string; author_location: string; author_avatar: string
  content: string; rating: number; sort_order: number
}

const EMPTY: FormState = {
  author_name: '', author_location: '', author_avatar: '', content: '', rating: 5, sort_order: 0
}

export default function TestimonialForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof FormState, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  useEffect(() => {
    if (isEdit) {
      api.get<FormState[]>('/testimonials').then(list => {
        const item = list.find((t: any) => String(t.id) === id)
        if (item) setForm(item)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [id, isEdit])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi lưu') }
    setSaving(false)
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</div></div>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Thông tin đánh giá</div>

            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Nguyễn Lan Anh" required />
            </div>
            <div className="form-group">
              <label className="form-label">Vị trí / Khu vực</label>
              <input className="form-control" value={form.author_location} onChange={e => set('author_location', e.target.value)} placeholder="Quận 1, TP.HCM" />
            </div>
            <div className="form-group">
              <label className="form-label">Số sao</label>
              <select className="form-control" value={form.rating} onChange={e => set('rating', +e.target.value)}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nội dung đánh giá *</label>
              <textarea className="form-control" rows={5} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nhận xét của khách hàng..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Ảnh đại diện</div>
            <ImageField
              value={form.author_avatar}
              onChange={url => set('author_avatar', url)}
              label="Ảnh đại diện"
              hint="Ảnh khuôn mặt, tỷ lệ 1:1"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : '💾 Lưu đánh giá'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
