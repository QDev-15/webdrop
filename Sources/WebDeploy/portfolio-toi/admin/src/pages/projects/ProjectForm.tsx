import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ProjectForm {
  title: string
  category: string
  description: string
  content: string
  image: string
  tags: string
  project_url: string
  github_url: string
  featured: number
  sort_order: number
  status: string
}

const empty: ProjectForm = {
  title: '', category: '', description: '', content: '', image: '',
  tags: '', project_url: '', github_url: '', featured: 0, sort_order: 0, status: 'published'
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ProjectForm>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean(id)

  useEffect(() => {
    if (id) {
      api.get<ProjectForm & { id: number }>(`/projects/${id}`).then(p => {
        setForm({
          title: p.title, category: p.category ?? '', description: p.description ?? '',
          content: p.content ?? '', image: p.image ?? '', tags: p.tags ?? '',
          project_url: p.project_url ?? '', github_url: p.github_url ?? '',
          featured: p.featured, sort_order: p.sort_order, status: p.status
        })
      }).catch(() => setError('Không thể tải dữ liệu.'))
    }
  }, [id])

  const set = (key: keyof ProjectForm, val: string | number) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) await api.put(`/projects/${id}`, form)
      else await api.post('/projects', form)
      navigate('/projects')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa dự án' : 'Thêm dự án mới'}</div>
        </div>
        <button onClick={() => navigate('/projects')} className="btn-ghost">← Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên dự án *</label>
            <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tên dự án" required />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <input type="text" className="form-control" value={form.category} onChange={e => set('category', e.target.value)} placeholder="UI/UX Design · Mobile" />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về dự án..." />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung chi tiết</label>
            <textarea className="form-control" style={{ minHeight: 120 }} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Mô tả chi tiết..." />
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
            <input type="text" className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Figma, React, TypeScript" />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Link demo</label>
              <input type="url" className="form-control" value={form.project_url} onChange={e => set('project_url', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="form-label">Link GitHub</label>
              <input type="url" className="form-control" value={form.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
            </div>
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', parseInt(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Nổi bật</option>
              </select>
            </div>
            <div>
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu dự án'}</button>
            <button type="button" onClick={() => navigate('/projects')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
