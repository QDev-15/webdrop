import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TData {
  author_name: string; author_title: string; author_avatar: string
  content: string; rating: number; sort_order: number; status: string
}
const empty: TData = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id
  const [data, setData] = useState<TData>(empty)
  const [loading, setLoading] = useState(false); const [err, setErr] = useState('')

  useEffect(() => {
    if (isEdit) api.get<TData>(`/testimonials/${id}`).then(t => setData(t as TData)).catch(() => navigate('/testimonials'))
  }, [id, isEdit, navigate])

  const f = (field: keyof TData) => ({
    value: String(data[field]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setData(p => ({ ...p, [field]: e.target.value }))
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      if (isEdit) await api.put(`/testimonials/${id}`, data)
      else await api.post('/testimonials', data)
      navigate('/testimonials')
    } catch (e) { setErr(e instanceof Error ? e.message : 'Lỗi lưu') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/testimonials" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h1>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="form-group">
            <label className="form-label">Tên khách hàng *</label>
            <input className="form-input" required {...f('author_name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Chức vụ / Công ty</label>
            <input className="form-input" placeholder="Giám đốc, Công ty ABC" {...f('author_title')} />
          </div>
          <div className="form-group">
            <label className="form-label">URL ảnh đại diện</label>
            <input className="form-input" placeholder="https://..." {...f('author_avatar')} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-textarea" rows={4} required {...f('content')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group">
              <label className="form-label">Số sao (1-5)</label>
              <select className="form-select" {...f('rating')}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-input" type="number" min={0} {...f('sort_order')} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" {...f('status')}>
                <option value="published">Hiển thị</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu đánh giá'}</button>
            <Link to="/testimonials" className="btn btn-ghost">Hủy</Link>
          </div>
        </div>
      </form>
    </div>
  )
}
