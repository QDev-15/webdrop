import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialForm {
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
  is_featured: number
  sort_order: number
}

const EMPTY: TestimonialForm = {
  author_name: '', author_role: '', author_avatar: '',
  content: '', rating: 5, is_featured: 1, sort_order: 0,
}

export default function TestimonialFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<TestimonialForm>(EMPTY)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<TestimonialForm & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({
        author_name: d.author_name ?? '',
        author_role: d.author_role ?? '',
        author_avatar: d.author_avatar ?? '',
        content: d.content ?? '',
        rating: d.rating ?? 5,
        is_featured: d.is_featured ?? 1,
        sort_order: d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TestimonialForm>(k: K, v: TestimonialForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.author_name.trim() || !form.content.trim()) {
      setError('Tên bệnh nhân và nội dung là bắt buộc.')
      return
    }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div>
        </div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rv-name" className="form-label">Tên bệnh nhân *</label>
            <input id="rv-name" type="text" className="form-control" value={form.author_name}
              onChange={e => set('author_name', e.target.value)} required placeholder="Nguyễn Văn A" />
          </div>
          <div className="form-group">
            <label htmlFor="rv-role" className="form-label">Chức danh / Nghề nghiệp</label>
            <input id="rv-role" type="text" className="form-control" value={form.author_role}
              onChange={e => set('author_role', e.target.value)} placeholder="Nhân viên văn phòng" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="rv-content" className="form-label">Nội dung đánh giá *</label>
          <textarea id="rv-content" className="form-control" value={form.content}
            onChange={e => set('content', e.target.value)}
            rows={4} required placeholder='"Lần đầu tiên tôi đi khám răng mà không thấy sợ..."' />
        </div>

        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)}
            placeholder="https://... (ảnh bệnh nhân, tùy chọn)" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rv-rating" className="form-label">Số sao (1–5)</label>
            <select id="rv-rating" className="form-control" value={form.rating}
              onChange={e => set('rating', parseInt(e.target.value))}>
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>{n} sao — {'★'.repeat(n)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="rv-order" className="form-label">Thứ tự sắp xếp</label>
            <input id="rv-order" type="number" className="form-control" value={form.sort_order}
              onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="rv-featured" checked={form.is_featured === 1}
            onChange={e => set('is_featured', e.target.checked ? 1 : 0)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
          <label htmlFor="rv-featured" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Hiển thị trên trang chủ</label>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </form>
    </div>
  )
}
