import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TeamFormData {
  name: string
  title: string
  bio: string
  image: string
  specialties: string
  is_published: boolean
  sort_order: number
}

const empty: TeamFormData = {
  name: '',
  title: '',
  bio: '',
  image: '',
  specialties: '',
  is_published: true,
  sort_order: 0,
}

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<TeamFormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<{ id: number; name: string; title: string; bio: string; image: string; specialties: string; is_published: number; sort_order: number }>(`/team/${id}`)
      .then(d => setForm({
        name: d.name ?? '',
        title: d.title ?? '',
        bio: d.bio ?? '',
        image: d.image ?? '',
        specialties: d.specialties ?? '',
        is_published: Boolean(d.is_published),
        sort_order: d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tìm thấy thành viên.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TeamFormData>(k: K, v: TeamFormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên thành viên là bắt buộc.'); return }
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, is_published: form.is_published ? 1 : 0 }
      if (isEdit) {
        await api.put(`/team/${id}`, payload)
      } else {
        await api.post('/team', payload)
      }
      navigate('/team')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}</div>
        </div>
        <button onClick={() => navigate('/team')} className="btn-ghost">Quay lại</button>
      </div>

      {error && (
        <div style={{ padding: '10px 16px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gap: 20 }}>

          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Nguyễn Thị Lan"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Chức vụ</label>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Chuyên viên trị liệu cao cấp"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Giới thiệu</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              placeholder="Giới thiệu ngắn về thành viên, kinh nghiệm và thành tựu..."
            />
          </div>

          <div className="form-group">
            <ImageField
              label="Ảnh thành viên"
              value={form.image}
              onChange={v => set('image', v)}
              placeholder="URL ảnh thành viên"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Chuyên môn</label>
            <textarea
              className="form-control"
              rows={3}
              value={form.specialties}
              onChange={e => set('specialties', e.target.value)}
              placeholder="Massage toàn thân, Chăm sóc da mặt, Trị liệu đá nóng..."
            />
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              Nhập mỗi chuyên môn trên một dòng hoặc phân cách bằng dấu phẩy
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input
                type="number"
                className="form-control"
                value={form.sort_order}
                onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => set('is_published', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 14 }}>Hiển thị công khai</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <button type="button" onClick={() => navigate('/team')} className="btn-ghost">Hủy</button>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm thành viên')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
