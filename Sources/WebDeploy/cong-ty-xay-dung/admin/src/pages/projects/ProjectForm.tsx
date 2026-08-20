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
  investor_name: string
  project_type_label: string
  scale_text: string
  result_summary: string
  challenge: string
  solution: string
  gallery_images: string
  stats: string
  testimonial_content: string
  testimonial_author: string
  testimonial_title: string
}

const DEFAULT: ProjectForm = {
  name: '', category: 'dan-dung', description: '', location: '',
  year_completed: new Date().getFullYear().toString(), area: '', floors: '',
  duration: '', value: '', image: '', featured: 0, sort_order: 0, status: 'published',
  investor_name: '', project_type_label: '', scale_text: '', result_summary: '',
  challenge: '', solution: '', gallery_images: '', stats: '',
  testimonial_content: '', testimonial_author: '', testimonial_title: '',
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
        if (found) setForm({
          ...found,
          // Cột case-study có thể là NULL (dự án seed từ trước hoặc chưa từng điền) — ép về '' để input luôn controlled
          investor_name: found.investor_name || '',
          project_type_label: found.project_type_label || '',
          scale_text: found.scale_text || '',
          result_summary: found.result_summary || '',
          challenge: found.challenge || '',
          solution: found.solution || '',
          gallery_images: found.gallery_images || '',
          stats: found.stats || '',
          testimonial_content: found.testimonial_content || '',
          testimonial_author: found.testimonial_author || '',
          testimonial_title: found.testimonial_title || '',
        })
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
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0 8px' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 -6px' }}>Case Study — Trang chi tiết công trình</h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: 0 }}>
            Điền các mục dưới đây để trang chi tiết công trình (bấm vào card ở trang Dự án) hiển thị đầy đủ case study — bỏ trống thì trang chi tiết chỉ hiển thị overview cơ bản.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Chủ đầu tư</label>
              <input className="form-control" value={form.investor_name} onChange={e => set('investor_name', e.target.value)} placeholder="Công ty CP Đầu Tư ABC" />
            </div>
            <div className="form-group">
              <label className="form-label">Loại công trình (overview bar)</label>
              <input className="form-control" value={form.project_type_label} onChange={e => set('project_type_label', e.target.value)} placeholder="Biệt thự nghỉ dưỡng 3 tầng" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Quy mô (overview bar)</label>
              <input className="form-control" value={form.scale_text} onChange={e => set('scale_text', e.target.value)} placeholder="450 m² sàn / 800 m² đất" />
            </div>
            <div className="form-group">
              <label className="form-label">Kết quả chính (overview bar)</label>
              <input className="form-control" value={form.result_summary} onChange={e => set('result_summary', e.target.value)} placeholder="Bàn giao sớm 2 tuần" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bối cảnh &amp; Thách thức</label>
            <textarea className="form-control" value={form.challenge} onChange={e => set('challenge', e.target.value)} rows={4} placeholder="Đoạn văn mô tả tình huống thực tế của chủ đầu tư trước khi hợp tác..." />
          </div>
          <div className="form-group">
            <label className="form-label">Giải pháp thi công</label>
            <textarea className="form-control" value={form.solution} onChange={e => set('solution', e.target.value)} rows={5} placeholder={'Đoạn mô tả chung...\n\n- Đầu việc 1 — mô tả\n- Đầu việc 2 — mô tả\n(mỗi đoạn cách nhau 1 dòng trống; đoạn toàn dòng bắt đầu bằng "-" sẽ hiển thị dạng danh sách)'} />
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh gallery (mỗi dòng 1 link ảnh, tối thiểu 3 ảnh)</label>
            <textarea className="form-control" value={form.gallery_images} onChange={e => set('gallery_images', e.target.value)} rows={3} placeholder={'https://...anh-1.jpg\nhttps://...anh-2.jpg\nhttps://...anh-3.jpg'} />
          </div>
          <div className="form-group">
            <label className="form-label">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
            <textarea className="form-control" value={form.stats} onChange={e => set('stats', e.target.value)} rows={4} placeholder={'100|%|Đúng & vượt tiến độ\n450|m²|Diện tích sàn hoàn thiện\n8| tháng|Thời gian hoàn thành'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Testimonial — Tên người phát biểu</label>
              <input className="form-control" value={form.testimonial_author} onChange={e => set('testimonial_author', e.target.value)} placeholder="Anh Minh Tuấn" />
            </div>
            <div className="form-group">
              <label className="form-label">Testimonial — Chức danh · Đơn vị</label>
              <input className="form-control" value={form.testimonial_title} onChange={e => set('testimonial_title', e.target.value)} placeholder="Chủ đầu tư · Biệt thự The Riverside" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Testimonial — Nội dung</label>
            <textarea className="form-control" value={form.testimonial_content} onChange={e => set('testimonial_content', e.target.value)} rows={3} placeholder="Trích dẫn đánh giá của chủ đầu tư về công trình này..." />
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
