import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface DoctorForm {
  name: string
  role: string
  bio: string
  photo: string
  experience_years: number
  specialties: string
  sort_order: number
  is_active: number
}

const EMPTY: DoctorForm = {
  name: '', role: '', bio: '', photo: '',
  experience_years: 0, specialties: '',
  sort_order: 0, is_active: 1,
}

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<DoctorForm>(EMPTY)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<DoctorForm & { id: number }>(`/team/${id}`)
      .then(d => setForm({
        name: d.name ?? '',
        role: d.role ?? '',
        bio: d.bio ?? '',
        photo: d.photo ?? '',
        experience_years: d.experience_years ?? 0,
        specialties: d.specialties ?? '',
        sort_order: d.sort_order ?? 0,
        is_active: d.is_active ?? 1,
      }))
      .catch(() => setError('Không tìm thấy bác sĩ.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof DoctorForm>(k: K, v: DoctorForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên bác sĩ là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/team/${id}`, form)
      } else {
        await api.post('/team', form)
      }
      navigate('/team')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}</div>
        </div>
        <button onClick={() => navigate('/team')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tf-name" className="form-label">Tên bác sĩ *</label>
            <input id="tf-name" type="text" className="form-control" value={form.name}
              onChange={e => set('name', e.target.value)} required placeholder="BS. Nguyễn Văn A" />
          </div>
          <div className="form-group">
            <label htmlFor="tf-role" className="form-label">Chức danh</label>
            <input id="tf-role" type="text" className="form-control" value={form.role}
              onChange={e => set('role', e.target.value)} placeholder="Trưởng khoa Tổng quát" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tf-bio" className="form-label">Tiểu sử</label>
          <textarea id="tf-bio" className="form-control" value={form.bio}
            onChange={e => set('bio', e.target.value)}
            rows={3} placeholder="Mô tả ngắn về bác sĩ, chuyên môn, phong cách..." />
        </div>

        <div className="form-group">
          <ImageField label="Ảnh bác sĩ" value={form.photo} onChange={v => set('photo', v)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tf-exp" className="form-label">Năm kinh nghiệm</label>
            <input id="tf-exp" type="number" className="form-control" value={form.experience_years}
              onChange={e => set('experience_years', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label htmlFor="tf-order" className="form-label">Thứ tự sắp xếp</label>
            <input id="tf-order" type="number" className="form-control" value={form.sort_order}
              onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tf-spec" className="form-label">Chuyên môn (phân cách bằng |)</label>
          <input id="tf-spec" type="text" className="form-control" value={form.specialties}
            onChange={e => set('specialties', e.target.value)}
            placeholder="12 năm kinh nghiệm|Chuyên nha chu|ĐH Y Dược TP.HCM" />
          <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>Mỗi thẻ tag phân cách bằng ký tự |</div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="tf-active" checked={form.is_active === 1}
            onChange={e => set('is_active', e.target.checked ? 1 : 0)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
          <label htmlFor="tf-active" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Hiển thị trên website</label>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/team')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </form>
    </div>
  )
}
