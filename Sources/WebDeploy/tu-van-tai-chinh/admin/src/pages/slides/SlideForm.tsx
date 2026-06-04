import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface FormState {
  title: string; subtitle: string; button_text: string; button_link: string
  image: string; sort_order: number; status: string
}

const DEFAULT: FormState = { title: '', subtitle: '', button_text: 'Tìm hiểu thêm', button_link: '/lien-he', image: '', sort_order: 0, status: 'published' }

export default function SlideForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<FormState>(`/hero-slides/${id}`).then(s => setForm(s)).catch(() => nav('/slides'))
    }
  }, [id])

  const set = (k: keyof FormState, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setError('Tiêu đề không được để trống.'); return }
    setLoading(true)
    try {
      if (isEdit) await api.put(`/hero-slides/${id}`, form)
      else await api.post('/hero-slides', form)
      nav('/slides')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/slides" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>{isEdit ? 'Sửa slide' : 'Thêm slide'}</h1>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả phụ</label>
            <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Nút CTA</label>
              <input className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút</label>
              <input className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL Hình ảnh</label>
            <input className="form-control" type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            {form.image && <img src={form.image} alt="" style={{ marginTop: '8px', height: '120px', borderRadius: '6px', objectFit: 'cover' }} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <Link to="/slides" className="btn btn-ghost">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
