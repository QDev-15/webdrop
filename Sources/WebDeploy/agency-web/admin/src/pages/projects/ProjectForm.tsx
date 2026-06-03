import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface PjForm { title: string; category: string; industry: string; description: string; image: string; client: string; url: string; featured: number; sort_order: number; status: string }
const EMPTY: PjForm = { title: '', category: 'web', industry: '', description: '', image: '', client: '', url: '', featured: 0, sort_order: 0, status: 'published' }

export default function ProjectForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = Boolean(id)
  const [form, setForm] = useState<PjForm>(EMPTY)
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api.get<PjForm & { id: number }>(`/projects/${id}`).then(p => setForm(p)).catch(() => {})
  }, [id, isEdit])

  const set = (k: keyof PjForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) await api.put(`/projects/${id}`, form)
      else await api.post('/projects', form)
      navigate('/projects')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.') }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa Dự án' : 'Thêm Dự án mới'}</h1>
        <button onClick={() => navigate('/projects')} className="btn btn-ghost">← Quay lại</button>
      </div>
      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={save}>
          <div className="form-group">
            <label className="form-label">Tên dự án <span className="text-danger">*</span></label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Loại</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="web">Website</option><option value="app">Mobile App</option><option value="brand">Thương hiệu</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ngành nghề</label>
              <input className="form-control" value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="Bất động sản, F&B, Startup..." />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Ảnh (URL)</label>
              <input className="form-control" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Khách hàng</label>
              <input className="form-control" value={form.client} onChange={e => set('client', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL dự án (nếu có)</label>
            <input className="form-control" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-select" value={form.featured} onChange={e => set('featured', +e.target.value)}>
                <option value={0}>Không</option><option value={1}>Có</option>
              </select>
            </div>
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
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/projects')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
