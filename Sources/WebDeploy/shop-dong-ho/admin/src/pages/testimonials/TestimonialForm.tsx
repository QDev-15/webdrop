import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  author_name: string
  author_location: string
  author_avatar: string
  content: string
  sort_order: number
}

const EMPTY: FormData = { author_name: '', author_location: '', author_avatar: '', content: '', sort_order: 0 }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<FormData & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({
        author_name: d.author_name,
        author_location: d.author_location ?? '',
        author_avatar: d.author_avatar ?? '',
        content: d.content ?? '',
        sort_order: d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tải được đánh giá'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) { setError('Tên khách hàng và nội dung không được để trống'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.post(`/testimonials/${id}/update`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch {
      setError('Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Tên khách hàng <span className="req">*</span></label>
            <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="VD: Ngọc Hân" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Khu vực</label>
            <input type="text" className="form-control" value={form.author_location} onChange={e => set('author_location', e.target.value)} placeholder="VD: TP. Thủ Đức" />
          </div>
        </div>

        <div className="form-group">
          <label>Ảnh đại diện</label>
          <ImageField value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>

        <div className="form-group">
          <label>Nội dung đánh giá <span className="req">*</span></label>
          <textarea rows={4} className="form-control" value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nội dung đánh giá của khách hàng..." />
        </div>

        <div className="form-group">
          <label>Thứ tự sắp xếp</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/testimonials')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
