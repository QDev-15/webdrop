import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TeamMember {
  id?: number
  name: string
  role: string
  bio: string
  photo: string
  sort_order: number
  is_active: number
}

const INIT: TeamMember = {
  name: '', role: '', bio: '', photo: '', sort_order: 0, is_active: 1,
}

export default function TeamForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<TeamMember>(INIT)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<TeamMember[]>('/team').then(list => {
        const found = list.find((m: TeamMember & { id?: number }) => m.id === Number(id))
        if (found) setForm(found)
      }).catch(console.error).finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (k: keyof TeamMember, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên bác sĩ không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/team/${id}`, form)
      } else {
        await api.post('/team', form)
      }
      navigate('/team')
    } catch (e: unknown) {
      setError((e as Error).message || 'Lỗi khi lưu.')
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa thông tin bác sĩ' : 'Thêm bác sĩ'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-grid">
          <div className="form-field">
            <label>Họ tên bác sĩ *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="BS. Nguyễn Văn A" />
          </div>
          <div className="form-field">
            <label>Chuyên khoa</label>
            <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Chuyên khoa Implant & AI định vị" />
          </div>
        </div>

        <div className="form-field">
          <ImageField label="Ảnh bác sĩ" value={form.photo} onChange={v => set('photo', v)} />
        </div>

        <div className="form-field">
          <label>Giới thiệu ngắn</label>
          <textarea rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="12 năm kinh nghiệm, chứng chỉ quốc tế..." />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Thứ tự</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
          </div>
          <div className="form-field">
            <label>Trạng thái</label>
            <select value={form.is_active} onChange={e => set('is_active', Number(e.target.value))}>
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/team')}>Huỷ</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm bác sĩ'}
          </button>
        </div>
      </form>
    </div>
  )
}
