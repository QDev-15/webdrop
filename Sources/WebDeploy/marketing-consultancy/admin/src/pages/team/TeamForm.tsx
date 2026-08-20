import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TeamFormData {
  name: string
  position: string
  bio: string
  avatar: string
  tier: string
  sort_order: number
  status: string
}

const empty: TeamFormData = {
  name: '', position: '', bio: '', avatar: '', tier: 'consultant', sort_order: 0, status: 'published',
}

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<TeamFormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<TeamFormData & { id: number }>(`/team/${id}`)
      .then(d => setForm({
        name: d.name, position: d.position ?? '', bio: d.bio ?? '', avatar: d.avatar ?? '',
        tier: d.tier ?? 'consultant', sort_order: d.sort_order ?? 0, status: d.status ?? 'published',
      }))
      .catch(() => setError('Không tìm thấy thành viên.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TeamFormData>(k: K, v: TeamFormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Họ tên là bắt buộc.'); return }
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
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}</div>
        </div>
        <button onClick={() => navigate('/team')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Họ tên *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
        </div>
        <div className="form-group">
          <label className="form-label">Chức vụ</label>
          <input type="text" className="form-control" value={form.position} onChange={e => set('position', e.target.value)} placeholder="CEO & Founder, Content Strategist..." />
        </div>
        <div className="form-group">
          <label className="form-label">Giới thiệu</label>
          <textarea className="form-control" value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Kinh nghiệm, thành tích nổi bật..." rows={3} />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện (hoặc dùng emoji, vd: 👨 / 👩)" value={form.avatar} onChange={v => set('avatar', v)} placeholder="https://... hoặc emoji 👨" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nhóm</label>
            <select className="form-control" value={form.tier} onChange={e => set('tier', e.target.value)}>
              <option value="leadership">Ban lãnh đạo</option>
              <option value="consultant">Đội tư vấn</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Trạng thái</label>
          <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="published">Hiển thị</option>
            <option value="draft">Ẩn</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/team')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
