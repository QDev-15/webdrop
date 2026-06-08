import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import ImageField from '../../components/ImageField'
import { api } from '../../api/client'

interface SvcForm {
  name: string
  description: string
  content: string
  icon: string
  image: string
  tags: string
  featured: number
  sort_order: number
  status: string
}

const INIT: SvcForm = { name: '', description: '', content: '', icon: '◆', image: '', tags: '', featured: 0, sort_order: 0, status: 'published' }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<SvcForm>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<SvcForm & { id: number }>(`/services/${id}`)
        .then(d => setForm({ name: d.name, description: d.description || '', content: d.content || '', icon: d.icon || '◆', image: d.image || '', tags: d.tags || '', featured: d.featured, sort_order: d.sort_order, status: d.status }))
        .catch(() => setError('Không tìm thấy dịch vụ.'))
    }
  }, [id, isEdit])

  const set = (k: keyof SvcForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name) { setError('Tên dịch vụ không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/services/${id}`, form) }
      else { await api.post('/services', form) }
      navigate('/services')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout title={isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h1>
        <button className="btn-ghost" onClick={() => navigate('/services')}>Quay lại</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Icon</label>
              <input className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="◆" />
            </div>
            <div className="form-group">
              <label className="form-label">Tên dịch vụ *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung chi tiết</label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={5} />
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
            <input className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Logo Design, Brand Guidelines, Visual Identity" />
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
            <button type="button" className="btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
