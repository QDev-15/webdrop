import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialData {
  author_name: string
  author_role: string
  author_avatar: string
  stars: number
  content: string
  is_active: number
  sort_order: number
}

const empty: TestimonialData = {
  author_name: '', author_role: '', author_avatar: '',
  stars: 5, content: '', is_active: 1, sort_order: 0,
}

export default function TestimonialForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [form, setForm]   = useState<TestimonialData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<TestimonialData & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({
        author_name:   d.author_name,
        author_role:   d.author_role ?? '',
        author_avatar: d.author_avatar ?? '',
        stars:         d.stars ?? 5,
        content:       d.content,
        is_active:     d.is_active ?? 1,
        sort_order:    d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TestimonialData>(k: K, v: TestimonialData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.author_name.trim() || !form.content.trim()) {
      setError('Tên khách hàng và nội dung là bắt buộc.'); return
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

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page" style={{ maxWidth: 640 }}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</h1>
        <button onClick={() => navigate('/testimonials')} className="adm-btn-ghost">Quay lại</button>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="adm-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="t-name">Họ tên *</label>
            <input id="t-name" className="adm-input" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="t-role">Chức danh / Thông tin</label>
            <input id="t-role" className="adm-input" value={form.author_role} onChange={e => set('author_role', e.target.value)} placeholder="Vd: Khách hàng — Cấy Implant" />
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="t-content">Nội dung *</label>
          <textarea id="t-content" className="adm-input" rows={5} value={form.content} onChange={e => set('content', e.target.value)} required />
        </div>

        <div className="adm-field">
          <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="t-stars">Số sao</label>
            <select id="t-stars" className="adm-input" value={form.stars} onChange={e => set('stars', parseInt(e.target.value))}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="t-order">Thứ tự</label>
            <input id="t-order" type="number" className="adm-input" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="t-active">Trạng thái</label>
            <select id="t-active" className="adm-input" value={form.is_active} onChange={e => set('is_active', parseInt(e.target.value))}>
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/testimonials')} className="adm-btn-ghost">Hủy</button>
          <button type="submit" className="adm-btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
