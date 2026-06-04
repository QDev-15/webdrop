import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamData { name: string; position: string; bio: string; avatar: string; sort_order: number; status: string }

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TeamData>({ name: '', position: '', bio: '', avatar: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Array<TeamData & { id: number }>>('/team').then(arr => {
      const found = arr.find(m => m.id === Number(id))
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Họ tên không được để trống.'); return }
    setSaving(true); setError('')
    try {
      isEdit ? await api.put(`/team/${id}`, form) : await api.post('/team', form)
      navigate('/team')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa thành viên' : 'Thêm thành viên mới'}</div></div>
        <button onClick={() => navigate('/team')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '540px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức vụ</label>
            <input className="form-control" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="CEO, Designer, Developer..." />
          </div>
          <div className="form-group">
            <label className="form-label">Giới thiệu</label>
            <textarea className="form-control" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh avatar (URL)</label>
            <input className="form-control" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
            {form.avatar && <img src={form.avatar} alt="avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginTop: '8px', border: '2px solid var(--border)' }} />}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" onClick={() => navigate('/team')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
