import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialData {
  author_name: string
  author_role: string
  content: string
  rating: number
  avatar_url: string
  is_featured: boolean
  sort_order: number
}

const empty: TestimonialData = { author_name: '', author_role: '', content: '', rating: 5, avatar_url: '', is_featured: true, sort_order: 0 }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<TestimonialData>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<unknown[]>('/testimonials')
      .then(items => {
        const arr = items as Array<{ id: number; author_name: string; author_role: string; content: string; rating: number; avatar_url: string; is_featured: number; sort_order: number }>
        const found = arr.find(t => String(t.id) === id)
        if (found) setForm({ ...found, is_featured: Boolean(found.is_featured) })
      })
      .catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof TestimonialData, v: string | boolean | number) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim()) { setError('Tên tác giả là bắt buộc.'); return }
    if (!form.content.trim()) { setError('Nội dung đánh giá là bắt buộc.'); return }
    setSaving(true)
    setError('')
    const body = { ...form, is_featured: form.is_featured ? 1 : 0 }
    try {
      if (isEdit) {
        await api.post(`/testimonials/${id}/update`, body)
      } else {
        await api.post('/testimonials', body)
      }
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-field">
            <label>Tên khách hàng *</label>
            <input type="text" value={form.author_name} onChange={e => set('author_name', e.target.value)} required placeholder="Nguyễn Văn A" />
          </div>
          <div className="form-field">
            <label>Vai trò / Chức danh</label>
            <input type="text" value={form.author_role} onChange={e => set('author_role', e.target.value)} placeholder="Doanh nhân, TP. Hà Nội" />
          </div>
        </div>

        <div className="form-field">
          <label>Nội dung đánh giá *</label>
          <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={4} required placeholder="Nhập nội dung đánh giá..." />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Đánh giá sao</label>
            <select value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
              <option value={5}>★★★★★ (5 sao)</option>
              <option value={4}>★★★★☆ (4 sao)</option>
              <option value={3}>★★★☆☆ (3 sao)</option>
              <option value={2}>★★☆☆☆ (2 sao)</option>
              <option value={1}>★☆☆☆☆ (1 sao)</option>
            </select>
          </div>
          <div className="form-field">
            <label>Thứ tự hiển thị</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <ImageField
          label="Ảnh đại diện"
          value={form.avatar_url}
          onChange={v => set('avatar_url', v)}
        />

        <div className="form-field form-checkbox">
          <label>
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
            Hiển thị trên website
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </>
  )
}
