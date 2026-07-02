import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TeamFormState {
  name: string
  role: string
  specialty: string
  image: string
  sort_order: number
  status: string
}

const empty: TeamFormState = { name: '', role: '', specialty: '', image: '', sort_order: 0, status: 'published' }

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TeamFormState>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<TeamFormState & { id: number }>(`/team/${id}`)
      .then(d => setForm({ name: d.name, role: d.role ?? '', specialty: d.specialty ?? '', image: d.image ?? '', sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
      .catch(() => setError('Không tìm thấy stylist.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TeamFormState>(k: K, v: TeamFormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/team/${id}`, form)
      else await api.post('/team', form)
      navigate('/team')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa stylist' : 'Thêm stylist mới'}</div>
        </div>
        <button onClick={() => navigate('/team')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Họ tên *</label>
          <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Minh Tuấn" required />
        </div>
        <div className="form-group">
          <label className="form-label">Chức danh</label>
          <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Master Barber" />
        </div>
        <div className="form-group">
          <label className="form-label">Chuyên môn</label>
          <textarea className="form-control" rows={3} value={form.specialty} onChange={e => set('specialty', e.target.value)} placeholder="Chuyên cắt fade, taper. 8 năm kinh nghiệm tại Mỹ & Việt Nam." />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh chân dung" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/team')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
