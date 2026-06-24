import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormState {
  name: string; role: string; speciality: string; experience: string
  image: string; sort_order: string; is_active: string
}

export default function TeamForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    name: '', role: '', speciality: '', experience: '', image: '', sort_order: '0', is_active: '1',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<Record<string, string>>(`/team/${id}`)
        .then(data => setForm({
          name: data.name ?? '', role: data.role ?? '', speciality: data.speciality ?? '',
          experience: data.experience ?? '', image: data.image ?? '',
          sort_order: String(data.sort_order ?? '0'), is_active: String(data.is_active ?? '1'),
        }))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên bác sĩ là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, sort_order: Number(form.sort_order), is_active: Number(form.is_active) }
      if (isEdit) await api.put(`/team/${id}`, payload)
      else await api.post('/team', payload)
      navigate('/team')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}</h1>
        <button className="btn btn-ghost" onClick={() => navigate('/team')}>← Quay lại</button>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Tên bác sĩ *</label>
            <input className="form-input" value={form.name} onChange={set('name')} required placeholder="BS. Nguyễn Minh Tú" />
          </div>
          <div className="form-group">
            <label className="form-label">Chức danh</label>
            <input className="form-input" value={form.role} onChange={set('role')} placeholder="Bác sĩ Da liễu CKI" />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Chuyên môn</label>
            <input className="form-input" value={form.speciality} onChange={set('speciality')} placeholder="Điều trị mụn & nám" />
          </div>
          <div className="form-group">
            <label className="form-label">Kinh nghiệm</label>
            <input className="form-input" value={form.experience} onChange={set('experience')} placeholder="12 năm kinh nghiệm" />
          </div>
        </div>

        <div className="form-group">
          <ImageField
            label="Ảnh bác sĩ"
            value={form.image}
            onChange={url => setForm(f => ({ ...f, image: url }))}
            placeholder="https://..."
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-input" value={form.sort_order} onChange={set('sort_order')} />
          </div>
          <div className="form-group">
            <label className="form-label">Hiển thị</label>
            <select className="form-input" value={form.is_active} onChange={set('is_active')}>
              <option value="1">Có</option>
              <option value="0">Không</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
