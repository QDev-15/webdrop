import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface DoctorFormData {
  name: string
  role: string
  photo: string
  description: string
  experience_years: number
  specialties: string
  tag: string
  sort_order: number
}

const EMPTY: DoctorFormData = { name: '', role: '', photo: '', description: '', experience_years: 0, specialties: '', tag: '', sort_order: 0 }

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
    if (!form.name) { setError('Vui lòng nhập tên bác sĩ.'); return }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.post(`/team/${id}/update`, form)
      } else {
        await api.post('/team', form)
      }
      navigate('/team')
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa thông tin bác sĩ' : 'Thêm bác sĩ'}</div>
          <div className="page-subtitle">Quản lý đội ngũ bác sĩ chuyên khoa</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Họ tên bác sĩ <span className="req">*</span></label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="BS. Nguyễn Văn A" required />
          </div>
          <div className="form-group">
            <label className="form-label">Tag (ví dụ: Giám đốc chuyên môn)</label>
            <input className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Giám đốc chuyên môn" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Chức vụ / Chuyên khoa</label>
          <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Giám đốc chuyên môn · Implant" />
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh đại diện</label>
          <ImageField value={form.photo} onChange={v => set('photo', v)} placeholder="URL ảnh bác sĩ" />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả kinh nghiệm</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Hơn 18 năm kinh nghiệm trong lĩnh vực Implant..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Số năm kinh nghiệm</label>
            <input className="form-control" type="number" value={form.experience_years} onChange={e => set('experience_years', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Chuyên môn (phân cách bằng |)</label>
          <textarea className="form-control" rows={2} value={form.specialties} onChange={e => set('specialties', e.target.value)} placeholder="Implant nha khoa|Phục hình toàn hàm|Tu nghiệp Hàn Quốc" />
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Mỗi chuyên khoa một mục, phân cách bằng |</div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bác sĩ'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
        </div>
      </form>
    </>
  )
}
