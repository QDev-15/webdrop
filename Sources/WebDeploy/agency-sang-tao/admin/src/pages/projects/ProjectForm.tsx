import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import ImageField from '../../components/ImageField'
import { api } from '../../api/client'

interface ProjForm {
  title: string
  category: string
  description: string
  image: string
  tags: string
  client_name: string
  featured: number
  sort_order: number
  status: string
}

const CATS = ['Brand Identity', 'Digital Design', 'Campaign', 'Social Media', 'Event Branding', 'Digital Marketing']
const INIT: ProjForm = { title: '', category: 'Brand Identity', description: '', image: '', tags: '', client_name: '', featured: 0, sort_order: 0, status: 'published' }

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ProjForm>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<ProjForm & { id: number }>(`/projects/${id}`)
        .then(d => setForm({ title: d.title, category: d.category || '', description: d.description || '', image: d.image || '', tags: d.tags || '', client_name: d.client_name || '', featured: d.featured, sort_order: d.sort_order, status: d.status }))
        .catch(() => setError('Không tìm thấy dự án.'))
    }
  }, [id, isEdit])

  const set = (k: keyof ProjForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title) { setError('Tiêu đề không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/projects/${id}`, form) }
      else { await api.post('/projects', form) }
      navigate('/projects')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout title={isEdit ? 'Sửa dự án' : 'Thêm dự án'}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa dự án' : 'Thêm dự án'}</h1>
        <button className="btn-ghost" onClick={() => navigate('/projects')}>Quay lại</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề dự án *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Khách hàng</label>
              <input className="form-control" value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Tên khách hàng" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
            <input className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Logo, Brand Guide, Stationery" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', parseInt(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Đã đăng</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/projects')}>Hủy</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
