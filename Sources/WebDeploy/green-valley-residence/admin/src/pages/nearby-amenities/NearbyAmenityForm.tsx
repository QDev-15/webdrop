import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData { name: string; distance: string; sort_order: number }
const empty: FormData = { name: '', distance: '', sort_order: 0 }

export default function NearbyAmenityForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData & { id: number }>(`/nearby-amenities/${id}`)
      .then(d => setForm({ name: d.name, distance: d.distance ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy tiện ích.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên tiện ích là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/nearby-amenities/${id}`, form)
      else await api.post('/nearby-amenities', form)
      navigate('/nearby-amenities')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa tiện ích' : 'Thêm tiện ích mới'}</div>
        <button onClick={() => navigate('/nearby-amenities')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên tiện ích *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Trường Quốc tế ABC School" required />
        </div>
        <div className="form-group">
          <label className="form-label">Khoảng cách</label>
          <input type="text" className="form-control" value={form.distance} onChange={e => set('distance', e.target.value)} placeholder="Vd: 500m" />
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/nearby-amenities')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
