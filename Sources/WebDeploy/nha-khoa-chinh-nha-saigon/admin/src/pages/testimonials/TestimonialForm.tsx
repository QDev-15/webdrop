import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface TestimonialFormData {
  author_name: string
  author_role: string
  content: string
  rating: number
  avatar_initial: string
  is_featured: number
  sort_order: number
}

const EMPTY: TestimonialFormData = { author_name: '', author_role: '', content: '', rating: 5, avatar_initial: '', is_featured: 1, sort_order: 0 }

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
    if (!form.author_name || !form.content) { setError('Vui long nhap ten va noi dung.'); return }
    setSaving(true)
    setError('')
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
          <div className="page-title">{isEdit ? 'Sua danh gia' : 'Them danh gia'}</div>
          <div className="page-subtitle">Quan ly danh gia khach hang</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Ten tac gia <span className="req">*</span></label>
            <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Nguyen Van A" required />
          </div>
          <div className="form-group">
            <label className="form-label">Chu viet tat avatar</label>
            <input className="form-control" value={form.avatar_initial} onChange={e => set('avatar_initial', e.target.value)} placeholder="N" maxLength={2} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Vai tro (vi du: Khach hang Invisalign)</label>
          <input className="form-control" value={form.author_role} onChange={e => set('author_role', e.target.value)} placeholder="Khach hang Invisalign" />
        </div>
        <div className="form-group">
          <label className="form-label">Noi dung danh gia <span className="req">*</span></label>
          <textarea className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Sao danh gia (1-5)</label>
            <select className="form-control" value={form.rating} onChange={e => set('rating', Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} sao</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thu tu hien thi</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_featured === 1} onChange={e => set('is_featured', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hien thi trang chu
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
