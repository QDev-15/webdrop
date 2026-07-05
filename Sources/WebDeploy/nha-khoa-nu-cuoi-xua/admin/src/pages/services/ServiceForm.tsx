import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }

interface ServiceFormData {
  category_id: number | ''
  name: string
  tag: string
  image: string
  description: string
  price: string
  price_unit: string
  sort_order: number
  is_active: number
}

const EMPTY: ServiceFormData = {
  category_id: '',
  name: '',
  tag: '',
  image: '',
  description: '',
  price: '',
  price_unit: 'VND',
  sort_order: 0,
  is_active: 1,
}

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ServiceFormData>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    if (!isEdit) return
    api.get<ServiceFormData[]>('/services').then((items: any) => {
      const found = Array.isArray(items) ? items.find((s: any) => s.id === Number(id)) : null
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof ServiceFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Vui long nhap ten dich vu.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, category_id: form.category_id === '' ? null : form.category_id }
      if (isEdit) {
        await api.put(`/services/${id}`, payload)
      } else {
        await api.post('/services', payload)
      }
      navigate('/services')
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
          <div className="page-title">{isEdit ? 'Sua dich vu' : 'Them dich vu moi'}</div>
          <div className="page-subtitle">Dich vu nha khoa Nu Cuoi Xua</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Ten dich vu <span className="req">*</span></label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tay trang rang" required />
          </div>
          <div className="form-group">
            <label className="form-label">Nhom dich vu</label>
            <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value === '' ? '' : Number(e.target.value))}>
              <option value="">-- Chon nhom --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tag (nhan nho)</label>
            <input className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Pho bien / Hot / Moi" />
          </div>
          <div className="form-group">
            <label className="form-label">Thu tu hien thi</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Hinh anh dich vu</label>
          <ImageField value={form.image} onChange={v => set('image', v)} placeholder="URL hinh anh dich vu" />
        </div>

        <div className="form-group">
          <label className="form-label">Mo ta dich vu</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mo ta ngan ve dich vu nay..." />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Gia (vi du: 500.000)</label>
            <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="500.000" />
          </div>
          <div className="form-group">
            <label className="form-label">Don vi gia</label>
            <input className="form-control" value={form.price_unit} onChange={e => set('price_unit', e.target.value)} placeholder="VND / rang / ham" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_active === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hien thi tren website
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : 'Luu dich vu'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/services')}>Huy</button>
        </div>
      </form>
    </>
  )
}
