import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface TestimonialData {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const EMPTY: TestimonialData = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<TestimonialData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<TestimonialData & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({ author_name: d.author_name, author_title: d.author_title || '', author_avatar: d.author_avatar || '', content: d.content, rating: d.rating, sort_order: d.sort_order, status: d.status }))
      .catch(() => setError('Không tìm thấy nhận xét'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(key: keyof TestimonialData, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa nhận xét' : 'Thêm nhận xét'}</h1>
      </div>

      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tên khách hàng *</label>
              <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ · Công ty</label>
              <input type="text" className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="CEO · Công ty ABC" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL Ảnh đại diện</label>
            <input type="url" className="form-control" value={form.author_avatar} onChange={e => set('author_avatar', e.target.value)} placeholder="https://..." />
            {form.author_avatar && <img src={form.author_avatar} alt="" className="img-preview" style={{ marginTop: '8px', borderRadius: '50%' }} />}
          </div>

          <div className="form-group">
            <label className="form-label">Nội dung nhận xét *</label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={4} required />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <select className="form-select" value={form.rating} onChange={e => set('rating', +e.target.value)}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>

          <hr className="section-sep" />
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm nhận xét')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
