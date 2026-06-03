import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface TmForm { name: string; position: string; bio: string; avatar: string; sort_order: number; status: string }
const EMPTY: TmForm = { name: '', position: '', bio: '', avatar: '', sort_order: 0, status: 'published' }

export default function TeamForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = Boolean(id)
  const [form, setForm] = useState<TmForm>(EMPTY)
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false)

  useEffect(() => { if (!isEdit) return; api.get<TmForm & { id: number }>(`/team-members/${id}`).then(m => setForm(m)).catch(() => {}) }, [id, isEdit])

  const set = (k: keyof TmForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) await api.put(`/team-members/${id}`, form)
      else await api.post('/team-members', form)
      navigate('/team')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.') }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa Thành viên' : 'Thêm Thành viên mới'}</h1>
        <button onClick={() => navigate('/team')} className="btn btn-ghost">← Quay lại</button>
      </div>
      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={save}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tên <span className="text-danger">*</span></label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ</label>
              <input className="form-control" value={form.position} onChange={e => set('position', e.target.value)} placeholder="CEO & Co-founder" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-control" value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Avatar (URL)</label>
            <input className="form-control" value={form.avatar} onChange={e => set('avatar', e.target.value)} placeholder="https://..." />
            {form.avatar && <img src={form.avatar} alt="" className="img-preview mt-3" style={{ borderRadius: '50%' }} />}
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Published</option><option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
