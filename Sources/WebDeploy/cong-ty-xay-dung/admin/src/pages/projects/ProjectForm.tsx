import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category { id: number; name: string; slug: string }

interface ProjectData {
  title: string
  category_id: string
  category: string
  location: string
  area: string
  floors: string
  duration: string
  year: string
  description: string
  content: string
  image: string
  featured: number
  sort_order: number
  status: string
}

const empty: ProjectData = {
  title: '', category_id: '', category: '', location: '', area: '',
  floors: '', duration: '', year: '', description: '', content: '',
  image: '', featured: 0, sort_order: 0, status: 'published',
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [data, setData] = useState<ProjectData>(empty)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  useEffect(() => {
    api.get<Category[]>('/project-categories').then(setCategories).catch(() => {})
    if (isEdit) {
      api.get<ProjectData>(`/projects/${id}`).then(p => setData(p as ProjectData)).catch(() => navigate('/projects'))
    }
  }, [id, isEdit, navigate])

  const f = (field: keyof ProjectData) => ({
    value: String(data[field]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setData(p => ({ ...p, [field]: e.target.value })),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveErr('')
    setLoading(true)
    try {
      const payload = { ...data, category_id: data.category_id ? parseInt(data.category_id) : null }
      if (isEdit) await api.put(`/projects/${id}`, payload)
      else await api.post('/projects', payload)
      navigate('/projects')
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/projects" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isEdit ? 'Sửa dự án' : 'Thêm dự án mới'}</h1>
      </div>

      {saveErr && <div className="alert alert-error">{saveErr}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-2" style={{ gap: 24 }}>
          <div className="card">
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Thông tin công trình</h2>
            <div className="form-group">
              <label className="form-label">Tên công trình *</label>
              <input className="form-input" required {...f('title')} />
            </div>
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={data.category_id}
                onChange={e => {
                  const cat = categories.find(c => String(c.id) === e.target.value)
                  setData(p => ({ ...p, category_id: e.target.value, category: cat?.slug || '' }))
                }}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Địa điểm</label>
              <input className="form-input" placeholder="Quận 1, TP. Hồ Chí Minh" {...f('location')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Diện tích</label>
                <input className="form-input" placeholder="12.000 m²" {...f('area')} />
              </div>
              <div className="form-group">
                <label className="form-label">Số tầng / Quy mô</label>
                <input className="form-input" placeholder="18 tầng" {...f('floors')} />
              </div>
              <div className="form-group">
                <label className="form-label">Thời gian thi công</label>
                <input className="form-input" placeholder="24 tháng" {...f('duration')} />
              </div>
              <div className="form-group">
                <label className="form-label">Năm hoàn thành</label>
                <input className="form-input" placeholder="2024" {...f('year')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả ngắn</label>
              <textarea className="form-textarea" rows={3} {...f('description')} />
            </div>
            <div className="form-group">
              <label className="form-label">Nội dung chi tiết</label>
              <textarea className="form-textarea" rows={5} {...f('content')} />
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Hình ảnh</h2>
              <div className="form-group">
                <label className="form-label">URL ảnh đại diện</label>
                <input className="form-input" placeholder="https://..." {...f('image')} />
              </div>
              {data.image && <img src={data.image} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginTop: 8 }} alt="" />}
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Cài đặt</h2>
              <div className="form-group">
                <label className="form-label">Thứ tự sắp xếp</label>
                <input className="form-input" type="number" min={0} {...f('sort_order')} />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" {...f('status')}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Nháp</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="featured" checked={!!data.featured}
                  onChange={e => setData(p => ({ ...p, featured: e.target.checked ? 1 : 0 }))} />
                <label htmlFor="featured" style={{ fontSize: 13, cursor: 'pointer' }}>Dự án nổi bật (hiển thị trang chủ)</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                {loading ? 'Đang lưu...' : 'Lưu dự án'}
              </button>
              <Link to="/projects" className="btn btn-ghost">Hủy</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
