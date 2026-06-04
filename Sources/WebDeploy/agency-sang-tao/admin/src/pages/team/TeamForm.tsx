import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface MemberData {
  name: string
  position: string
  bio: string
  experience: string
  avatar: string
  sort_order: number
  status: string
}

const EMPTY: MemberData = { name: '', position: '', bio: '', experience: '', avatar: '', sort_order: 0, status: 'published' }

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<MemberData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<MemberData & { id: number }>(`/team-members/${id}`)
      .then(d => setForm({ name: d.name, position: d.position || '', bio: d.bio || '', experience: d.experience || '', avatar: d.avatar || '', sort_order: d.sort_order, status: d.status }))
      .catch(() => setError('Không tìm thấy thành viên'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(key: keyof MemberData, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/team-members/${id}`, form)
      } else {
        await api.post('/team-members', form)
      }
      navigate('/team')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa thành viên' : 'Thêm thành viên'}</h1>
      </div>

      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tên *</label>
              <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ</label>
              <input type="text" className="form-control" value={form.position} onChange={e => set('position', e.target.value)} placeholder="Creative Director" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kinh nghiệm</label>
            <input type="text" className="form-control" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="10 năm kinh nghiệm · Brand Strategy" />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-control" value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label">URL Ảnh đại diện</label>
            <input type="url" className="form-control" value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="https://..." />
            {form.avatar && <img src={form.avatar} alt="" className="img-preview" style={{ marginTop: '8px', borderRadius: '50%' }} />}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>

          <hr className="section-sep" />
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm thành viên')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
