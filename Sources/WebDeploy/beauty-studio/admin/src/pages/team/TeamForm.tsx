import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface MemberData {
  name: string
  role: string
  bio: string
  avatar: string
  sort_order: number
  is_visible: number
}

const empty: MemberData = { name: '', role: '', bio: '', avatar: '', sort_order: 0, is_visible: 1 }

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]   = useState<MemberData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<MemberData & { id: number }>(`/team/${id}`)
        .then(d => setForm({ name: d.name, role: d.role, bio: d.bio, avatar: d.avatar, sort_order: d.sort_order, is_visible: d.is_visible }))
        .catch(() => setError('Không tải được thông tin.'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/team/${id}`, form) }
      else { await api.post('/team', form) }
      navigate('/team')
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi lưu') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa thành viên' : 'Thêm thành viên'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/team')}>← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Ảnh đại diện</label>
            <ImageField value={form.avatar} onChange={v => setForm(p => ({ ...p, avatar: v }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Tên *</label>
            <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức danh *</label>
            <input className="form-control" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="vd: Senior Hair Stylist" required />
          </div>
          <div className="form-group">
            <label className="form-label">Giới thiệu ngắn</label>
            <textarea className="form-control" rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Kinh nghiệm, chuyên môn..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.is_visible} onChange={e => setForm(p => ({ ...p, is_visible: +e.target.value }))}>
                <option value={1}>Hiển thị</option>
                <option value={0}>Ẩn</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
