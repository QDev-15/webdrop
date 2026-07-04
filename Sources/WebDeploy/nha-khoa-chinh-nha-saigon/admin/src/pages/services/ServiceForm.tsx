import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ServiceFormData {
  number: string
  name: string
  description: string
  duration: string
  price: string
  badge: string
  is_featured: number
  sort_order: number
}

const EMPTY: ServiceFormData = { number: '', name: '', description: '', duration: '', price: '', badge: '', is_featured: 0, sort_order: 0 }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ServiceFormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<ServiceFormData & { id: number }>(`/services`).then((items: any) => {
      const found = Array.isArray(items) ? items.find((s: any) => s.id === Number(id)) : null
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof ServiceFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { setError('Vui long nhap ten dich vu.'); return }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
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
          <div className="page-title">{isEdit ? 'Sua dich vu' : 'Them dich vu'}</div>
          <div className="page-subtitle">Quan ly dich vu nieng rang</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">So thu tu</label>
            <input className="form-control" value={form.number} onChange={e => set('number', e.target.value)} placeholder="01" />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Ten dich vu <span className="req">*</span></label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Mac cai kim loai" required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mo ta</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Giai phap kinh dien voi hieu qua dieu chinh cao..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Thoi gian dieu tri</label>
            <input className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="12-24 thang" />
          </div>
          <div className="form-group">
            <label className="form-label">Gia tu</label>
            <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="tu 25.000.000d" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Badge (vi du: Pho bien nhat)</label>
            <input className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="Pho bien nhat" />
          </div>
          <div className="form-group">
            <label className="form-label">Sap xep</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_featured === 1} onChange={e => set('is_featured', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hien thi trang chu (noi bat)
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
