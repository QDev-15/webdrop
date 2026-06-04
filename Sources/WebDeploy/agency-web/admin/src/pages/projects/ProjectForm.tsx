import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ProjectData { title: string; description: string; image: string; client: string; category: string; tags: string; link: string; featured: number; sort_order: number; status: string }

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ProjectData>({ title: '', description: '', image: '', client: '', category: 'web', tags: '', link: '', featured: 0, sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<ProjectData & { id: number }>(`/projects/${id}`).then(d => setForm(d)).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Tên dự án không được để trống.'); return }
    setSaving(true); setError('')
    try {
      isEdit ? await api.put(`/projects/${id}`, form) : await api.post('/projects', form)
      navigate('/projects')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa dự án' : 'Thêm dự án mới'}</div></div>
        <button onClick={() => navigate('/projects')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên dự án *</label>
            <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="web">Website</option>
                <option value="app">App</option>
                <option value="brand">Thương hiệu</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Khách hàng</label>
              <input className="form-control" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh (URL)</label>
            <input className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            {form.image && <img src={form.image} alt="preview" className="img-preview" />}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Link demo</label>
              <input className="form-control" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (cách nhau bởi dấu phẩy)</label>
              <input className="form-control" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, PHP, Mobile" />
            </div>
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
          <div className="form-group">
            <label className="toggle">
              <input type="checkbox" checked={form.featured === 1} onChange={e => setForm({ ...form, featured: e.target.checked ? 1 : 0 })} />
              <span className="toggle-slider" />
              <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Dự án nổi bật</span>
            </label>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu dự án'}</button>
            <button type="button" onClick={() => navigate('/projects')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
