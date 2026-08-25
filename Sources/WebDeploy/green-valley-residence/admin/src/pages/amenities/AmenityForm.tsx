import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  name: string
  description: string
  image: string
  sort_order: number
}

const empty: FormData = { name: '', description: '', image: '', sort_order: 0 }

export default function AmenityForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData & { id: number }>(`/amenities/${id}`)
      .then(d => setForm({ name: d.name, description: d.description ?? '', image: d.image ?? '', sort_order: d.sort_order ?? 0 }))
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
      if (isEdit) await api.put(`/amenities/${id}`, form)
      else await api.post('/amenities', form)
      navigate('/amenities')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa tiện ích' : 'Thêm tiện ích mới'}</div>
        <button onClick={() => navigate('/amenities')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên tiện ích *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Hồ bơi vô cực tầng thượng" required />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Vd: View toàn cảnh sông Sài Gòn, tầng 35 mỗi tháp" />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh tiện ích" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/amenities')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
