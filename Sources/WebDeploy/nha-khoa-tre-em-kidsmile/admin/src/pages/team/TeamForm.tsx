import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

export default function TeamForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    photo: '',
    experience_years: '0',
    specialties: '',
    sort_order: '0',
    is_active: true,
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/team/${id}`)
      .then(data => {
        setForm({
          name: String(data.name ?? ''),
          role: String(data.role ?? ''),
          bio: String(data.bio ?? ''),
          photo: String(data.photo ?? ''),
          experience_years: String(data.experience_years ?? '0'),
          specialties: String(data.specialties ?? ''),
          sort_order: String(data.sort_order ?? '0'),
          is_active: Boolean(data.is_active),
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(key: string, val: string | boolean) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) { setError('Tên bác sĩ là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        experience_years: Number(form.experience_years),
        sort_order: Number(form.sort_order),
        is_active: form.is_active ? 1 : 0,
      }
      if (isEdit) {
        await api.put(`/team/${id}`, payload)
      } else {
        await api.post('/team', payload)
      }
      navigate('/team')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}</div>
          <div className="page-sub"><Link to="/team" style={{ color: 'var(--accent)' }}>← Danh sách bác sĩ</Link></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="tm-name" className="form-label">
                Họ tên <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input id="tm-name" type="text" className="form-control"
                placeholder="BS. Nguyễn Thị Mai Anh"
                value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="tm-role" className="form-label">Chức danh</label>
              <input id="tm-role" type="text" className="form-control"
                placeholder="Trưởng khoa Nha Nhi"
                value={form.role} onChange={e => set('role', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="tm-bio" className="form-label">Giới thiệu</label>
              <textarea id="tm-bio" className="form-control" rows={4}
                value={form.bio} onChange={e => set('bio', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Ảnh đại diện</label>
              <ImageField
                value={form.photo}
                onChange={val => set('photo', val)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="tm-spec" className="form-label">Chuyên môn (phân cách bằng |)</label>
              <input id="tm-spec" type="text" className="form-control"
                placeholder="Chỉnh nha sớm|Tâm lý trẻ em"
                value={form.specialties} onChange={e => set('specialties', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="tm-exp" className="form-label">Số năm kinh nghiệm</label>
                <input id="tm-exp" type="number" className="form-control" min="0"
                  value={form.experience_years} onChange={e => set('experience_years', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="tm-order" className="form-label">Thứ tự hiển thị</label>
                <input id="tm-order" type="number" className="form-control"
                  value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_active}
                onChange={e => set('is_active', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Đang hoạt động</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? '💾 Lưu thay đổi' : '+ Thêm bác sĩ'}
          </button>
          <Link to="/team" className="btn-ghost">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
