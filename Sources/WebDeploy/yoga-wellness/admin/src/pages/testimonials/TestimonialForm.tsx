import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id?: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
  featured: number
  status: string
}

export default function TestimonialForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState<Testimonial>({
    author_name: '',
    author_role: '',
    author_avatar: '',
    content: '',
    rating: 5,
    featured: 0,
    status: 'published'
  })
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      api.get<Testimonial>(`/testimonials/${id}`)
        .then(setForm)
        .catch(err => setError((err as Error).message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked ? 1 : 0 : (name === 'rating' ? parseFloat(value) : value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate('/testimonials')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '14px' }}>← Quay lại</button>
      </div>

      <div className="form-card">
        <h2 className="page-title">{id ? 'Sửa bình luận' : 'Thêm bình luận mới'}</h2>

        {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="form-label">Tên khách *</label>
            <input className="form-control" name="author_name" value={form.author_name} onChange={handleChange} required />
          </div>

          <div>
            <label className="form-label">Chức vụ/Tình trạng</label>
            <input className="form-control" name="author_role" value={form.author_role} onChange={handleChange} placeholder="VD: Student, Working Professional" />
          </div>

          <div>
            <label className="form-label">Nội dung bình luận *</label>
            <textarea className="form-control" name="content" value={form.content} onChange={handleChange} rows={4} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Đánh giá (sao) *</label>
              <select className="form-control" name="rating" value={form.rating} onChange={handleChange}>
                <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
                <option value="4">⭐⭐⭐⭐ 4 sao</option>
                <option value="3">⭐⭐⭐ 3 sao</option>
                <option value="2">⭐⭐ 2 sao</option>
                <option value="1">⭐ 1 sao</option>
              </select>
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Ảnh đại diện URL</label>
            <input className="form-control" name="author_avatar" value={form.author_avatar} onChange={handleChange} placeholder="https://..." />
          </div>

          <div>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 500 }}>
              <input
                type="checkbox"
                name="featured"
                checked={!!form.featured}
                onChange={handleChange}
              />
              Ghim lên đầu
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" className="btn-accent">Lưu</button>
            <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
