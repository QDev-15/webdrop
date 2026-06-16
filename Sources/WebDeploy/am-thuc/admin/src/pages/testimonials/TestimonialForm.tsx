import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialForm {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const DEFAULT: TestimonialForm = {
  author_name: '',
  author_title: '',
  author_avatar: '',
  content: '',
  rating: 5,
  sort_order: 0,
  status: 'published',
}

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TestimonialForm>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<Array<TestimonialForm & { id: number }>>('/testimonials')
        .then(items => {
          const found = items.find(i => i.id === parseInt(id!))
          if (found) setForm(found)
        })
        .catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof TestimonialForm, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.author_name || !form.content) { setError('Tên tác giả và nội dung không được để trống.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          {isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="form-label">Tên tác giả *</label>
            <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Nguyễn Văn A" required />
          </div>
          <div>
            <label className="form-label">Chức danh / Mô tả</label>
            <input type="text" className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="Food Blogger · Hà Nội" />
          </div>
          <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)} placeholder="https://... ảnh tác giả" />
          <div>
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nhà hàng rất ngon, phục vụ tuyệt vời..." required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Số sao (1-5)</label>
              <select className="form-control" value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao {'★'.repeat(n)}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', fontSize: 13, border: '1px solid #fdd' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm đánh giá'}</button>
            <button type="button" onClick={() => navigate('/testimonials')} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>Hủy</button>
          </div>
        </div>
      </form>
    </div>
  )
}
