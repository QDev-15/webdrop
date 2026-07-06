import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  author_name: string
  author_avatar: string
  author_location: string
  content: string
  stars: string
  product_purchased: string
  is_active: boolean
  sort_order: string
}

const EMPTY: FormData = {
  author_name: '', author_avatar: '', author_location: '',
  content: '', stars: '5', product_purchased: '', is_active: true, sort_order: '0'
}

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
    api.get<Record<string, unknown>>(`/testimonials/${id}`)
      .then(d => setForm({
        author_name: String(d.author_name ?? ''),
        author_avatar: String(d.author_avatar ?? ''),
        author_location: String(d.author_location ?? ''),
        content: String(d.content ?? ''),
        stars: String(d.stars ?? '5'),
        product_purchased: String(d.product_purchased ?? ''),
        is_active: Boolean(d.is_active),
        sort_order: String(d.sort_order ?? '0'),
      }))
      .catch(() => setError('Không tải được đánh giá'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim()) { setError('Tên khách hàng không được để trống'); return }
    if (!form.content.trim()) { setError('Nội dung nhận xét không được để trống'); return }
    setSaving(true); setError('')
    const payload = {
      ...form,
      stars: Number(form.stars) || 5,
      sort_order: Number(form.sort_order) || 0,
    }
    try {
      if (isEdit) {
        await api.post(`/testimonials/${id}/update`, payload)
      } else {
        await api.post('/testimonials', payload)
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
            <input type="text" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="VD: Nguyễn Thị Lan" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Địa điểm</label>
            <input type="text" value={form.author_location} onChange={e => set('author_location', e.target.value)} placeholder="VD: TP. Hồ Chí Minh" />
          </div>
        </div>

        <div className="form-group">
          <label>URL Ảnh đại diện</label>
          <input type="text" value={form.author_avatar} onChange={e => set('author_avatar', e.target.value)} placeholder="https://..." />
        </div>

        <div className="form-group">
          <label>Nội dung nhận xét <span className="req">*</span></label>
          <textarea rows={4} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nhập nội dung đánh giá của khách hàng..." />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đánh giá sao</label>
            <select value={form.stars} onChange={e => set('stars', e.target.value)}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao {'★'.repeat(n)}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label>Sản phẩm đã mua</label>
            <input type="text" value={form.product_purchased} onChange={e => set('product_purchased', e.target.value)} placeholder="VD: Túi vải đay thủ công" />
          </div>
        </div>

        <div className="form-row" style={{ gap: 24 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thứ tự sắp xếp</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} min={0} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-check" style={{ marginTop: 28 }}>
              <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
              <span>Hiển thị trên website</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/testimonials')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
