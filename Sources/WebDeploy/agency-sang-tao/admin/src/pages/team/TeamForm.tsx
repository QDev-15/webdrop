import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import ImageField from '../../components/ImageField'
import { api } from '../../api/client'

interface MemberForm {
  name: string
  position: string
  bio: string
  avatar: string
  experience: string
  sort_order: number
  status: string
}

const INIT: MemberForm = { name: '', position: '', bio: '', avatar: '', experience: '', sort_order: 0, status: 'published' }

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<MemberForm>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<MemberForm & { id: number }>(`/team-members/${id}`)
        .then(d => setForm({ name: d.name, position: d.position || '', bio: d.bio || '', avatar: d.avatar || '', experience: d.experience || '', sort_order: d.sort_order, status: d.status }))
        .catch(() => setError('Không tìm thấy thành viên.'))
    }
  }, [id, isEdit])

  const set = (k: keyof MemberForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name) { setError('Tên không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/team-members/${id}`, form) }
      else { await api.post('/team-members', form) }
      navigate('/team')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout title={isEdit ? 'Sửa thành viên' : 'Thêm thành viên'}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa thành viên' : 'Thêm thành viên'}</h1>
        <button className="btn-ghost" onClick={() => navigate('/team')}>Quay lại</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức vụ</label>
            <input className="form-control" value={form.position} onChange={e => set('position', e.target.value)} placeholder="Creative Director" />
          </div>
          <div className="form-group">
            <label className="form-label">Kinh nghiệm</label>
            <input className="form-control" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="10 năm kinh nghiệm · Brand & Strategy" />
          </div>
          <div className="form-group">
            <label className="form-label">Giới thiệu</label>
            <textarea className="form-control" value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.avatar} onChange={v => set('avatar', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
