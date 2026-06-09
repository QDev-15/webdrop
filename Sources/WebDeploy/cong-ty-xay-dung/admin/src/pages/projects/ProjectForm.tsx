import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ProjectForm {
  name: string
  category: string
  description: string
  location: string
  year_completed: string
  area: string
  floors: string
  duration: string
  value: string
  image: string
  featured: number
  sort_order: number
  status: string
}

const DEFAULT: ProjectForm = {
  name: '', category: 'dan-dung', description: '', location: '',
  year_completed: new Date().getFullYear().toString(), area: '', floors: '',
  duration: '', value: '', image: '', featured: 0, sort_order: 0, status: 'published'
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<ProjectForm>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<(ProjectForm & { id: number })[]>('/projects').then(arr => {
        const found = arr.find(p => p.id === Number(id))
        if (found) setForm({ ...found })
      }).catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof ProjectForm, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/projects/${id}`, form)
      } else {
        await api.post('/projects', form)
      }
      navigate('/projects')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/projects')}>Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên dự án *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Tên dự án" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Hạng mục</label>
              <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="dan-dung">Dân dụng</option>
                <option value="cong-nghiep">Công nghiệp</option>
                <option value="thuong-mai">Thương mại</option>
                <option value="biet-thu">Biệt thự</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Địa điểm</label>
              <input className="form-control" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Quận, TP.HCM" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Mô tả dự án" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Năm hoàn thành</label>
              <input className="form-control" value={form.year_completed} onChange={e => set('year_completed', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Diện tích</label>
              <input className="form-control" value={form.area} onChange={e => set('area', e.target.value)} placeholder="5.000 m²" />
            </div>
            <div className="form-group">
              <label className="form-label">Số tầng</label>
              <input className="form-control" value={form.floors} onChange={e => set('floors', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Thời gian thi công</label>
              <input className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="12 tháng" />
            </div>
            <div className="form-group">
              <label className="form-label">Giá trị công trình</label>
              <input className="form-control" value={form.value} onChange={e => set('value', e.target.value)} placeholder="50 tỷ" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', Number(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/projects')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
