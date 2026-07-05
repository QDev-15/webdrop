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

const EMPTY: DoctorFormData = { name: '', role: '', photo: '', experience_years: 0, tags: '', quote: '', sort_order: 0, is_active: 1 }

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
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/team/${id}`, form)
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
          <div className="page-subtitle">Đội ngũ bác sĩ Sunrise Nha Khoa Gia Đình</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Họ tên bác sĩ <span className="req">*</span></label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="BS. Nguyễn Thị Lan Anh" required />
          </div>
          <div className="form-group">
            <label className="form-label">Số năm kinh nghiệm</label>
            <input className="form-control" type="number" value={form.experience_years} onChange={e => set('experience_years', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Chuyên khoa (ví dụ: Trưởng phòng khám)</label>
          <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Chuyên khoa Nha nhi" />
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh đại diện</label>
          <ImageField value={form.photo} onChange={v => set('photo', v)} placeholder="URL ảnh bác sĩ" />
        </div>
        <div className="form-group">
          <label className="form-label">Tags chuyên môn (phân cách bằng dấu phẩy)</label>
          <input className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Nha khoa tổng quát,Implant,Phòng ngừa" />
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Ví dụ: Nha khoa trẻ em,Phòng ngừa,Niềng răng</div>
        </div>
        <div className="form-group">
          <label className="form-label">Quote / Câu nói nhận bắt (hiển thị trên thẻ bác sĩ)</label>
          <textarea className="form-control" rows={2} value={form.quote} onChange={e => set('quote', e.target.value)} placeholder='"Mỗi nụ cười khỏe mạnh đều bắt đầu từ sự thấu hiểu và kiên nhẫn."' />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_active === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hiển thị trên website
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bác sĩ'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
        </div>
      </form>
    </>
  )
}
