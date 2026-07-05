import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialFormData {
  author_name: string
  author_meta: string
  author_avatar: string
  stars: number
  quote: string
  sort_order: number
  is_active: number
}

const EMPTY: TestimonialFormData = {
  author_name: '',
  author_meta: '',
  author_avatar: '',
  stars: 5,
  quote: '',
  sort_order: 0,
  is_active: 1,
}

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TestimonialFormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<TestimonialFormData[]>('/testimonials').then((items: any) => {
      const found = Array.isArray(items) ? items.find((t: any) => t.id === Number(id)) : null
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof TestimonialFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim()) { setError('Vui long nhap ten khach hang.'); return }
    if (!form.quote.trim()) { setError('Vui long nhap noi dung danh gia.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (err: any) {
      setError(err.message || 'Co loi xay ra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sua danh gia' : 'Them danh gia moi'}</div>
          <div className="page-subtitle">Cam nhan khach hang Nu Cuoi Xua</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Ten khach hang <span className="req">*</span></label>
            <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Nguyen Thi Lan" required />
          </div>
          <div className="form-group">
            <label className="form-label">Diem sao (1–5)</label>
            <input className="form-control" type="number" min={1} max={5} value={form.stars} onChange={e => set('stars', Number(e.target.value))} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Dich vu da dung / Vai tro</label>
          <input className="form-control" value={form.author_meta} onChange={e => set('author_meta', e.target.value)} placeholder="Khach hang (Nieng rang Invisalign)" />
        </div>

        <div className="form-group">
          <label className="form-label">Anh dai dien (tuy chon)</label>
          <ImageField value={form.author_avatar} onChange={v => set('author_avatar', v)} placeholder="URL anh khach hang" />
        </div>

        <div className="form-group">
          <label className="form-label">Noi dung danh gia <span className="req">*</span></label>
          <textarea
            className="form-control"
            rows={4}
            value={form.quote}
            onChange={e => set('quote', e.target.value)}
            placeholder="Phan hoi that cua khach hang ve dich vu..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Thu tu hien thi</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_active === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hien thi tren website
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : 'Luu danh gia'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Huy</button>
        </div>
      </form>
    </>
  )
}
