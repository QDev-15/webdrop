import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface DoctorFormData {
  name: string
  role: string
  photo: string
  experience_years: number
  tags: string
  quote: string
  sort_order: number
  is_active: number
}

const EMPTY: DoctorFormData = {
  name: '',
  role: '',
  photo: '',
  experience_years: 0,
  tags: '',
  quote: '',
  sort_order: 0,
  is_active: 1,
}

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<DoctorFormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<DoctorFormData[]>('/team').then((items: any) => {
      const found = Array.isArray(items) ? items.find((d: any) => d.id === Number(id)) : null
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof DoctorFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Vui long nhap ten bac si.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/team/${id}`, form)
      } else {
        await api.post('/team', form)
      }
      navigate('/team')
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
          <div className="page-title">{isEdit ? 'Sua thong tin bac si' : 'Them bac si moi'}</div>
          <div className="page-subtitle">Doi ngu bac si Nu Cuoi Xua Nha Khoa</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Ho ten bac si <span className="req">*</span></label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="BS. Nguyen Thi Mai" required />
          </div>
          <div className="form-group">
            <label className="form-label">So nam kinh nghiem</label>
            <input className="form-control" type="number" min={0} value={form.experience_years} onChange={e => set('experience_years', Number(e.target.value))} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Chuyen khoa / Chuc vu</label>
          <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Truong phong kham — Nha khoa tham my" />
        </div>

        <div className="form-group">
          <label className="form-label">Anh bac si (3/4 ratio khuyen nghi)</label>
          <ImageField value={form.photo} onChange={v => set('photo', v)} placeholder="URL anh bac si" />
        </div>

        <div className="form-group">
          <label className="form-label">Tags chuyen mon (phan cach bang dau phay)</label>
          <input className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Nha khoa tham my,Implant,Nieng rang trong suot" />
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Vi du: Nha khoa tong quat,Nieng rang,Tay trang</div>
        </div>

        <div className="form-group">
          <label className="form-label">Cau noi / Quote (hien thi tren the bac si)</label>
          <textarea
            className="form-control"
            rows={2}
            value={form.quote}
            onChange={e => set('quote', e.target.value)}
            placeholder='"Moi nu cuoi dep bat dau tu mot net bac si tan tam."'
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
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : 'Luu bac si'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/team')}>Huy</button>
        </div>
      </form>
    </>
  )
}
