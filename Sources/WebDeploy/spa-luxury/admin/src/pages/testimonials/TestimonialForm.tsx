import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialFormData {
  name: string
  role: string
  location: string
  rating: number
  content: string
  avatar: string
  is_published: boolean
  sort_order: number
}

const empty: TestimonialFormData = {
  name: '',
  role: '',
  location: '',
  rating: 5,
  content: '',
  avatar: '',
  is_published: true,
  sort_order: 0,
}

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<TestimonialFormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<{ id: number; name: string; role: string; location: string; rating: number; content: string; avatar: string; is_published: number; sort_order: number }>(`/testimonials/${id}`)
      .then(d => setForm({
        name: d.name ?? '',
        role: d.role ?? '',
        location: d.location ?? '',
        rating: d.rating ?? 5,
        content: d.content ?? '',
        avatar: d.avatar ?? '',
        is_published: Boolean(d.is_published),
        sort_order: d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TestimonialFormData>(k: K, v: TestimonialFormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên khách hàng là bắt buộc.'); return }
    if (!form.content.trim()) { setError('Nội dung đánh giá là bắt buộc.'); return }
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, is_published: form.is_published ? 1 : 0 }
      if (isEdit) {
        await api.put(`/testimonials/${id}`, payload)
      } else {
        await api.post('/testimonials', payload)
      }
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
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

      {error && (
        <div style={{ padding: '10px 16px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gap: 20 }}>

          <div className="form-group">
            <label className="form-label">Họ tên khách hàng *</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Nguyễn Thị Hoa"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Vai trò / Nghề nghiệp</label>
              <input
                type="text"
                className="form-control"
                value={form.role}
                onChange={e => set('role', e.target.value)}
                placeholder="Giáo viên, Nhân viên văn phòng..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Địa điểm</label>
              <input
                type="text"
                className="form-control"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="TP. Hồ Chí Minh"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Đánh giá sao</label>
            <select
              className="form-control"
              value={form.rating}
              onChange={e => set('rating', parseInt(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n} sao)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea
              className="form-control"
              rows={5}
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder="Chia sẻ trải nghiệm của khách hàng..."
              required
            />
          </div>

          <div className="form-group">
            <ImageField
              label="Ảnh đại diện (Avatar)"
              value={form.avatar}
              onChange={v => set('avatar', v)}
              placeholder="URL ảnh đại diện"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input
                type="number"
                className="form-control"
                value={form.sort_order}
                onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => set('is_published', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 14 }}>Hiển thị công khai</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Hủy</button>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm đánh giá')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
