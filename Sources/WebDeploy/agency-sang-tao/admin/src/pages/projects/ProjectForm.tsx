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
  year: string
  duration: string
  scope_text: string
  result_summary: string
  challenge: string
  solution: string
  gallery_images: string
  stats: string
  testimonial_content: string
  testimonial_author: string
  testimonial_title: string
  testimonial_avatar: string
}

const CATS = ['Brand Identity', 'Digital Design', 'Campaign', 'Social Media', 'Event Branding', 'Digital Marketing']
const INIT: ProjForm = {
  title: '', category: 'Brand Identity', description: '', image: '', tags: '', client_name: '', featured: 0, sort_order: 0, status: 'published',
  year: '', duration: '', scope_text: '', result_summary: '', challenge: '', solution: '', gallery_images: '', stats: '',
  testimonial_content: '', testimonial_author: '', testimonial_title: '', testimonial_avatar: '',
}

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
        .then(d => setForm({
          title: d.title, category: d.category || '', description: d.description || '', image: d.image || '', tags: d.tags || '', client_name: d.client_name || '', featured: d.featured, sort_order: d.sort_order, status: d.status,
          year: d.year || '', duration: d.duration || '', scope_text: d.scope_text || '', result_summary: d.result_summary || '', challenge: d.challenge || '', solution: d.solution || '',
          gallery_images: d.gallery_images || '', stats: d.stats || '',
          testimonial_content: d.testimonial_content || '', testimonial_author: d.testimonial_author || '', testimonial_title: d.testimonial_title || '', testimonial_avatar: d.testimonial_avatar || '',
        }))
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
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Case Study — Trang chi tiết dự án</h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: '-8px 0 0' }}>
            Điền các mục dưới đây để trang chi tiết dự án (bấm vào card ở trang Dự án) hiển thị đầy đủ case study — bỏ trống thì trang chi tiết chỉ hiển thị overview cơ bản.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Năm thực hiện</label>
              <input className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024" />
            </div>
            <div className="form-group">
              <label className="form-label">Thời gian thực hiện</label>
              <input className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="6 tuần" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Dịch vụ cung cấp (overview bar)</label>
              <input className="form-control" value={form.scope_text} onChange={e => set('scope_text', e.target.value)} placeholder="Brand Strategy, Logo, Guidelines" />
            </div>
            <div className="form-group">
              <label className="form-label">Kết quả chính (overview bar)</label>
              <input className="form-control" value={form.result_summary} onChange={e => set('result_summary', e.target.value)} placeholder="+40% nhận diện thương hiệu" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bối cảnh &amp; Thách thức</label>
            <textarea className="form-control" value={form.challenge} onChange={e => set('challenge', e.target.value)} rows={4} placeholder="Đoạn văn mô tả tình huống thực tế của khách hàng trước khi hợp tác..." />
          </div>
          <div className="form-group">
            <label className="form-label">Giải pháp / Cách tiếp cận</label>
            <textarea className="form-control" value={form.solution} onChange={e => set('solution', e.target.value)} rows={5} placeholder={'Đoạn mô tả chung...\n\n- Bước 1: ...\n- Bước 2: ...\n(mỗi đoạn cách nhau 1 dòng trống; đoạn toàn dòng bắt đầu bằng "-" sẽ hiển thị dạng danh sách)'} />
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh gallery (mỗi dòng 1 link ảnh, tối thiểu 3 ảnh)</label>
            <textarea className="form-control" value={form.gallery_images} onChange={e => set('gallery_images', e.target.value)} rows={3} placeholder={'https://...anh-1.jpg\nhttps://...anh-2.jpg\nhttps://...anh-3.jpg'} />
          </div>
          <div className="form-group">
            <label className="form-label">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
            <textarea className="form-control" value={form.stats} onChange={e => set('stats', e.target.value)} rows={4} placeholder={'40|%|Tăng nhận diện thương hiệu\n120|+|Ấn phẩm được chuẩn hóa\n6| tuần|Thời gian hoàn thành'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Testimonial — Tên khách hàng</label>
              <input className="form-control" value={form.testimonial_author} onChange={e => set('testimonial_author', e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div className="form-group">
              <label className="form-label">Testimonial — Chức danh · Công ty</label>
              <input className="form-control" value={form.testimonial_title} onChange={e => set('testimonial_title', e.target.value)} placeholder="CEO · Công ty ABC" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Testimonial — Ảnh đại diện" value={form.testimonial_avatar} onChange={v => set('testimonial_avatar', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Testimonial — Nội dung</label>
            <textarea className="form-control" value={form.testimonial_content} onChange={e => set('testimonial_content', e.target.value)} rows={3} placeholder="Trích dẫn đánh giá riêng của khách hàng dự án này..." />
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
