import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ProjectData {
  title: string
  category: string
  industry: string
  description: string
  image: string
  client: string
  tags: string
  featured: number
  sort_order: number
  status: string
}

const EMPTY: ProjectData = { title: '', category: '', industry: '', description: '', image: '', client: '', tags: '', featured: 0, sort_order: 0, status: 'published' }

const CATEGORIES = ['Brand Identity', 'Digital Design', 'Campaign', 'Social Media', 'Event Branding', 'Digital Marketing', 'Khác']

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<ProjectData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<ProjectData & { id: number }>(`/projects/${id}`)
      .then(d => setForm({ title: d.title, category: d.category || '', industry: d.industry || '', description: d.description || '', image: d.image || '', client: d.client || '', tags: d.tags || '', featured: d.featured, sort_order: d.sort_order, status: d.status }))
      .catch(() => setError('Không tìm thấy dự án'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(key: keyof ProjectData, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/projects/${id}`, form)
      } else {
        await api.post('/projects', form)
      }
      navigate('/projects')
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
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án'}</h1>
      </div>

      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề dự án *</label>
            <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Chọn danh mục</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ngành / Industry</label>
              <input type="text" className="form-control" value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="F&B, FinTech, Beauty..." />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Khách hàng</label>
            <input type="text" className="form-control" value={form.client} onChange={e => set('client', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh thumbnail (URL)</label>
            <input type="url" className="form-control" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            {form.image && <img src={form.image} alt="" className="img-preview" style={{ marginTop: '8px' }} />}
          </div>

          <div className="form-group">
            <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
            <input type="text" className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Logo, Brand Guide, Stationery" />
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

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured === 1} onChange={e => set('featured', e.target.checked ? 1 : 0)} />
              <span className="form-label" style={{ margin: 0 }}>Nổi bật (hiển thị trong featured work trang chủ)</span>
            </label>
          </div>

          <hr className="section-sep" />
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm dự án')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/projects')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
