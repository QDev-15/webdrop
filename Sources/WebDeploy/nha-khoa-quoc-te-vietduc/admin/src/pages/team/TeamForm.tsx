import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface DoctorData {
  name: string
  role: string
  flag: string
  experience_years: number
  photo: string
  tags: string
  description: string
  sort_order: number
  is_active: number
}

const empty: DoctorData = {
  name: '', role: '', flag: 'Trong nước', experience_years: 0,
  photo: '', tags: '', description: '', sort_order: 0, is_active: 1,
}

export default function TeamForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [form, setForm]   = useState<DoctorData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<DoctorData & { id: number; tags: string[] }>(`/team/${id}`)
      .then(d => setForm({
        name:             d.name,
        role:             d.role ?? '',
        flag:             d.flag ?? 'Trong nước',
        experience_years: d.experience_years ?? 0,
        photo:            d.photo ?? '',
        tags:             Array.isArray(d.tags) ? d.tags.join('|') : (d.tags ?? ''),
        description:      d.description ?? '',
        sort_order:       d.sort_order ?? 0,
        is_active:        d.is_active ?? 1,
      }))
      .catch(() => setError('Không tìm thấy bác sĩ.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof DoctorData>(k: K, v: DoctorData[K]) {
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

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page" style={{ maxWidth: 680 }}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">{isEdit ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}</h1>
        <button onClick={() => navigate('/team')} className="adm-btn-ghost">Quay lại</button>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="adm-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="d-name">Họ tên *</label>
            <input id="d-name" className="adm-input" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="d-role">Chức danh</label>
            <input id="d-role" className="adm-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Vd: Chuyên Gia Implant" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="d-flag">Phân loại</label>
            <select id="d-flag" className="adm-input" value={form.flag} onChange={e => set('flag', e.target.value)}>
              <option value="Trong nuoc">Trong nước</option>
              <option value="Quoc te">Quốc tế</option>
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="d-exp">Kinh nghiệm (năm)</label>
            <input id="d-exp" type="number" className="adm-input" value={form.experience_years} onChange={e => set('experience_years', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="d-order">Thứ tự</label>
            <input id="d-order" type="number" className="adm-input" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="d-tags">Chuyên môn (cách nhau bằng |)</label>
          <input id="d-tags" className="adm-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Vd: Implant|Phẫu thuật hàm mặt" />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="d-desc">Giới thiệu</label>
          <textarea id="d-desc" className="adm-input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="adm-field">
          <ImageField label="Ảnh bác sĩ" value={form.photo} onChange={v => set('photo', v)} />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="d-active">Trạng thái</label>
          <select id="d-active" className="adm-input" style={{ maxWidth: 200 }} value={form.is_active} onChange={e => set('is_active', parseInt(e.target.value))}>
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/team')} className="adm-btn-ghost">Hủy</button>
          <button type="submit" className="adm-btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
