import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormState {
  name: string
  title: string
  role: string
  specialty: string
  education: string
  experience: string
  cases_count: string
  certifications: string
  image: string
  badge: string
  sort_order: string
  status: string
}

const EMPTY: FormState = {
  name:           '',
  title:          '',
  role:           '',
  specialty:      '',
  education:      '',
  experience:     '',
  cases_count:    '',
  certifications: '',
  image:          '',
  badge:          '',
  sort_order:     '0',
  status:         'published',
}

export default function TeamForm() {
  const { id }        = useParams<{ id: string }>()
  const navigate      = useNavigate()
  const isEdit        = Boolean(id)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/team/${id}`)
      .then(d => setForm({
        name:           String(d.name ?? ''),
        title:          String(d.title ?? ''),
        role:           String(d.role ?? ''),
        specialty:      String(d.specialty ?? ''),
        education:      String(d.education ?? ''),
        experience:     String(d.experience ?? ''),
        cases_count:    String(d.cases_count ?? ''),
        certifications: String(d.certifications ?? ''),
        image:          String(d.image ?? ''),
        badge:          String(d.badge ?? ''),
        sort_order:     String(d.sort_order ?? '0'),
        status:         String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không thể tải dữ liệu bác sĩ.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên bác sĩ không được để trống.'); return }
    setSaving(true); setError('')
    const payload = {
      ...form,
      cases_count: form.cases_count ? Number(form.cases_count) : 0,
      sort_order:  Number(form.sort_order),
    }
    try {
      if (isEdit) {
        await api.put(`/team/${id}`, payload)
      } else {
        await api.post('/team', payload)
      }
      navigate('/team')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu thông tin bác sĩ.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa hồ sơ bác sĩ' : 'Thêm bác sĩ mới'}</div>
          <div className="page-sub">Thông tin đội ngũ chuyên gia chỉnh nha</div>
        </div>
        <button onClick={() => navigate('/team')} className="btn-ghost">← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          <div className="card" style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tên bác sĩ *</label>
                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: BS. CKII Trần Minh Anh" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Badge hiển thị</label>
                <input className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="VD: Trưởng khoa" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Chức danh</label>
                <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="VD: Bác sĩ Chuyên khoa Chỉnh nha" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Vai trò</label>
                <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="VD: Trưởng khoa Chỉnh nha" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Chuyên khoa</label>
              <input className="form-control" value={form.specialty} onChange={e => set('specialty', e.target.value)} placeholder="VD: Niềng răng Invisalign, mắc cài sứ, khớp cắn phức tạp" />
            </div>
            <div className="form-group">
              <label className="form-label">Học vấn / Bằng cấp</label>
              <textarea className="form-control" rows={3} value={form.education} onChange={e => set('education', e.target.value)} placeholder="VD: Chuyên khoa I Chỉnh nha — ĐH Y Dược TP.HCM | Chứng chỉ Invisalign Diamond Provider" />
            </div>
            <div className="form-group">
              <label className="form-label">Chứng chỉ / Thành tích</label>
              <textarea className="form-control" rows={3} value={form.certifications} onChange={e => set('certifications', e.target.value)} placeholder="VD: Invisalign Diamond Provider | Hội Chỉnh nha Việt Nam | Bộ Y Tế cấp phép" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Kinh nghiệm</label>
                <input className="form-control" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="VD: 15+ năm" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Số ca thực hiện</label>
                <input className="form-control" type="number" value={form.cases_count} onChange={e => set('cases_count', e.target.value)} placeholder="VD: 1800" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ display: 'grid', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thứ tự hiển thị</label>
                <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
              </div>
            </div>
            <div className="card">
              <label className="form-label">Ảnh bác sĩ</label>
              <ImageField value={form.image} onChange={v => set('image', v)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} className="btn-accent" style={{ flex: 1 }}>
                {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm bác sĩ'}
              </button>
              <button type="button" onClick={() => navigate('/team')} className="btn-ghost">Huỷ</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
