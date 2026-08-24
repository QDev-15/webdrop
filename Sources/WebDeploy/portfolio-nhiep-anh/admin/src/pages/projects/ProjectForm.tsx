import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  title: string
  slug: string
  category: string
  description: string
  image: string
  client_name: string
  year: string
  location: string
  overview2_label: string
  overview2_value: string
  scope_text: string
  duration: string
  challenge: string
  solution: string
  gallery_images: string
  stats: string
  testimonial_content: string
  testimonial_author: string
  testimonial_role: string
  testimonial_avatar: string
  featured: boolean
  sort_order: number
  status: string
}

const empty: FormData = {
  title: '', slug: '', category: '', description: '', image: '',
  client_name: '', year: '', location: '', overview2_label: '', overview2_value: '',
  scope_text: '', duration: '', challenge: '', solution: '', gallery_images: '', stats: '',
  testimonial_content: '', testimonial_author: '', testimonial_role: '', testimonial_avatar: '',
  featured: false, sort_order: 0, status: 'published',
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/projects/${id}`)
      .then(d => setForm({
        title: String(d.title ?? ''), slug: String(d.slug ?? ''), category: String(d.category ?? ''),
        description: String(d.description ?? ''), image: String(d.image ?? ''),
        client_name: String(d.client_name ?? ''), year: String(d.year ?? ''), location: String(d.location ?? ''),
        overview2_label: String(d.overview2_label ?? ''), overview2_value: String(d.overview2_value ?? ''),
        scope_text: String(d.scope_text ?? ''), duration: String(d.duration ?? ''),
        challenge: String(d.challenge ?? ''), solution: String(d.solution ?? ''),
        gallery_images: String(d.gallery_images ?? ''), stats: String(d.stats ?? ''),
        testimonial_content: String(d.testimonial_content ?? ''), testimonial_author: String(d.testimonial_author ?? ''),
        testimonial_role: String(d.testimonial_role ?? ''), testimonial_avatar: String(d.testimonial_avatar ?? ''),
        featured: Number(d.featured ?? 0) === 1, sort_order: Number(d.sort_order ?? 0), status: String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không tìm thấy dự án.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = { ...form, featured: form.featured ? 1 : 0 }
      if (isEdit) {
        await api.put(`/projects/${id}`, payload)
      } else {
        await api.post('/projects', payload)
      }
      navigate('/projects')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</div>
          <div className="page-sub">Thẻ dự án hiển thị ở trang chủ &amp; trang Dự án. Điền thêm phần Case Study bên dưới nếu muốn có trang chi tiết đầy đủ.</div>
        </div>
        <button onClick={() => navigate('/projects')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Thông tin thẻ dự án</h3>
        <div className="form-group">
          <label className="form-label">Tiêu đề * (vd: Thảo &amp; Huy — Đà Lạt)</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Slug (để trống sẽ tự tạo từ tiêu đề)</label>
            <input type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="thao-huy-da-lat" />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục (badge)</label>
            <input type="text" className="form-control" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Destination Wedding" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn (hiển thị trên thẻ)</label>
          <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện dự án" value={form.image} onChange={v => set('image', v)} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '24px 0 16px', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>Case Study — trang chi tiết (tùy chọn)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Khách hàng (Tên A &amp; Tên B)</label>
            <input type="text" className="form-control" value={form.client_name} onChange={e => set('client_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Năm</label>
            <input type="text" className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2025" />
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Dải thông tin tổng quan (4 ô)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Địa điểm</label>
            <input type="text" className="form-control" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Rừng thông, Đà Lạt" />
          </div>
          <div className="form-group">
            <label className="form-label">Dịch vụ cung cấp</label>
            <input type="text" className="form-control" value={form.scope_text} onChange={e => set('scope_text', e.target.value)} placeholder="Phóng sự cưới trọn gói + quay phim" />
          </div>
          <div className="form-group">
            <label className="form-label">Nhãn ô thứ 2 (tùy biến)</label>
            <input type="text" className="form-control" value={form.overview2_label} onChange={e => set('overview2_label', e.target.value)} placeholder="Số khách mời / Phong cách..." />
          </div>
          <div className="form-group">
            <label className="form-label">Giá trị ô thứ 2</label>
            <input type="text" className="form-control" value={form.overview2_value} onChange={e => set('overview2_value', e.target.value)} placeholder="80 khách / Phim xưa (film-look)..." />
          </div>
          <div className="form-group">
            <label className="form-label">Thời lượng tác nghiệp</label>
            <input type="text" className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="2 ngày (lễ + tiệc)" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Thách thức (Challenge) — mỗi đoạn cách nhau 1 dòng trống</label>
          <textarea className="form-control" rows={5} value={form.challenge} onChange={e => set('challenge', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Giải pháp (Solution) — đoạn đầu là mở bài, các dòng bắt đầu bằng "- " sẽ hiển thị dạng danh sách</label>
          <textarea className="form-control" rows={7} value={form.solution} onChange={e => set('solution', e.target.value)} placeholder={'Mở bài...\n\n- Gạch đầu dòng 1\n- Gạch đầu dòng 2'} />
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh gallery (mỗi dòng 1 URL — ảnh đầu sẽ hiển thị lớn hơn)</label>
          <textarea className="form-control" rows={4} value={form.gallery_images} onChange={e => set('gallery_images', e.target.value)} placeholder={'https://...jpg\nhttps://...jpg\nhttps://...jpg'} />
        </div>
        <div className="form-group">
          <label className="form-label">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
          <textarea className="form-control" rows={4} value={form.stats} onChange={e => set('stats', e.target.value)} placeholder={'850|+|Ảnh gốc bàn giao\n15| ngày|Thời gian bàn giao'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Đánh giá khách hàng (case study)</div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá</label>
          <textarea className="form-control" rows={3} value={form.testimonial_content} onChange={e => set('testimonial_content', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên khách hàng</label>
            <input type="text" className="form-control" value={form.testimonial_author} onChange={e => set('testimonial_author', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò / bối cảnh</label>
            <input type="text" className="form-control" value={form.testimonial_role} onChange={e => set('testimonial_role', e.target.value)} placeholder="Cô dâu — Đám cưới tại Đà Lạt, 2025" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh chân dung khách hàng" value={form.testimonial_avatar} onChange={v => set('testimonial_avatar', v)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 28 }}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Dự án nổi bật (trang chủ)</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/projects')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
