import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ProjectData {
  title: string; description: string; image: string; client: string; category: string; tags: string; link: string; featured: number; sort_order: number; status: string
  year: string; duration: string; scope_text: string; result_summary: string; challenge: string; solution: string
  gallery_images: string; stats: string
  testimonial_content: string; testimonial_author: string; testimonial_title: string; testimonial_avatar: string
}

const INIT: ProjectData = {
  title: '', description: '', image: '', client: '', category: 'web', tags: '', link: '', featured: 0, sort_order: 0, status: 'published',
  year: '', duration: '', scope_text: '', result_summary: '', challenge: '', solution: '', gallery_images: '', stats: '',
  testimonial_content: '', testimonial_author: '', testimonial_title: '', testimonial_avatar: '',
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ProjectData>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<ProjectData & { id: number }>(`/projects/${id}`).then(d => setForm({
      ...d,
      year: d.year || '', duration: d.duration || '', scope_text: d.scope_text || '', result_summary: d.result_summary || '',
      challenge: d.challenge || '', solution: d.solution || '', gallery_images: d.gallery_images || '', stats: d.stats || '',
      testimonial_content: d.testimonial_content || '', testimonial_author: d.testimonial_author || '', testimonial_title: d.testimonial_title || '', testimonial_avatar: d.testimonial_avatar || '',
    })).catch(console.error)
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

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0 8px' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 -6px' }}>Case Study — Trang chi tiết dự án</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-3)', margin: '0' }}>
            Điền các mục dưới đây để trang chi tiết dự án (bấm vào card ở trang Dự án) hiển thị đầy đủ case study — bỏ trống thì trang chi tiết chỉ hiển thị overview cơ bản.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Năm thực hiện</label>
              <input className="form-control" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2025" />
            </div>
            <div className="form-group">
              <label className="form-label">Thời gian thực hiện</label>
              <input className="form-control" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="10 tuần" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Dịch vụ cung cấp (overview bar)</label>
              <input className="form-control" value={form.scope_text} onChange={e => setForm({ ...form, scope_text: e.target.value })} placeholder="Web Portal, CMS, Tích hợp bản đồ" />
            </div>
            <div className="form-group">
              <label className="form-label">Kết quả chính (overview bar)</label>
              <input className="form-control" value={form.result_summary} onChange={e => setForm({ ...form, result_summary: e.target.value })} placeholder="+85% lượt truy cập tự nhiên" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bối cảnh &amp; Thách thức</label>
            <textarea className="form-control" value={form.challenge} onChange={e => setForm({ ...form, challenge: e.target.value })} rows={4} placeholder="Đoạn văn mô tả tình huống thực tế của khách hàng trước khi hợp tác..." />
          </div>
          <div className="form-group">
            <label className="form-label">Giải pháp / Cách tiếp cận</label>
            <textarea className="form-control" value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} rows={5} placeholder={'Đoạn mô tả chung...\n\n- Nhãn bước 1 — mô tả\n- Nhãn bước 2 — mô tả\n(mỗi đoạn cách nhau 1 dòng trống; đoạn toàn dòng bắt đầu bằng "-" sẽ hiển thị dạng danh sách, phần trước dấu — sẽ in đậm)'} />
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh gallery (mỗi dòng 1 link ảnh, tối thiểu 3 ảnh)</label>
            <textarea className="form-control" value={form.gallery_images} onChange={e => setForm({ ...form, gallery_images: e.target.value })} rows={3} placeholder={'https://...anh-1.jpg\nhttps://...anh-2.jpg\nhttps://...anh-3.jpg'} />
          </div>
          <div className="form-group">
            <label className="form-label">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
            <textarea className="form-control" value={form.stats} onChange={e => setForm({ ...form, stats: e.target.value })} rows={4} placeholder={'10000|+|Sản phẩm được quản lý\n85|%|Tăng truy cập tự nhiên\n10| tuần|Thời gian hoàn thành'} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Testimonial — Tên khách hàng</label>
              <input className="form-control" value={form.testimonial_author} onChange={e => setForm({ ...form, testimonial_author: e.target.value })} placeholder="Nguyễn Văn A" />
            </div>
            <div className="form-group">
              <label className="form-label">Testimonial — Chức danh · Công ty</label>
              <input className="form-control" value={form.testimonial_title} onChange={e => setForm({ ...form, testimonial_title: e.target.value })} placeholder="CEO · Công ty ABC" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Testimonial — Ảnh đại diện (URL)</label>
            <input className="form-control" value={form.testimonial_avatar} onChange={e => setForm({ ...form, testimonial_avatar: e.target.value })} placeholder="https://..." />
            {form.testimonial_avatar && <img src={form.testimonial_avatar} alt="preview" className="img-preview" />}
          </div>
          <div className="form-group">
            <label className="form-label">Testimonial — Nội dung</label>
            <textarea className="form-control" value={form.testimonial_content} onChange={e => setForm({ ...form, testimonial_content: e.target.value })} rows={3} placeholder="Trích dẫn đánh giá riêng của khách hàng dự án này..." />
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
