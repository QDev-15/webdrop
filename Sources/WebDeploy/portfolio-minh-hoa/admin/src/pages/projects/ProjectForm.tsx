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
  year: string
  client_name: string
  role_text: string
  publication_type: string
  duration: string
  illustration_count: string
  challenge: string
  process_heading: string
  process_steps: string
  gallery_images: string
  result_summary: string
  result_stats: string
  testimonial_content: string
  testimonial_author: string
  testimonial_role: string
  testimonial_avatar: string
  featured: boolean
  sort_order: number
  status: string
}

const empty: FormData = {
  title: '', slug: '', category: '', description: '', image: '', year: '',
  client_name: '', role_text: '', publication_type: '', duration: '', illustration_count: '',
  challenge: '', process_heading: '', process_steps: '', gallery_images: '',
  result_summary: '', result_stats: '',
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
        description: String(d.description ?? ''), image: String(d.image ?? ''), year: String(d.year ?? ''),
        client_name: String(d.client_name ?? ''), role_text: String(d.role_text ?? ''),
        publication_type: String(d.publication_type ?? ''), duration: String(d.duration ?? ''), illustration_count: String(d.illustration_count ?? ''),
        challenge: String(d.challenge ?? ''), process_heading: String(d.process_heading ?? ''), process_steps: String(d.process_steps ?? ''),
        gallery_images: String(d.gallery_images ?? ''),
        result_summary: String(d.result_summary ?? ''), result_stats: String(d.result_stats ?? ''),
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
          <label className="form-label">Tiêu đề * (vd: Chuyến Phiêu Lưu Của Bống)</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Slug (để trống sẽ tự tạo từ tiêu đề)</label>
            <input type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="chuyen-phieu-luu-cua-bong" />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục (badge)</label>
            <input type="text" className="form-control" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Sách thiếu nhi / Editorial / Character Design" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn (hiển thị trên trang chi tiết)</label>
          <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <ImageField label="Ảnh đại diện dự án" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Năm thực hiện</label>
            <input type="text" className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2025" />
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '24px 0 16px', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>Case Study — trang chi tiết (tùy chọn)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Khách hàng</label>
            <input type="text" className="form-control" value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="[Nhà xuất bản Sách Thiếu Nhi]" />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò</label>
            <input type="text" className="form-control" value={form.role_text} onChange={e => set('role_text', e.target.value)} placeholder="Character Design + Illustration" />
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Dải thông tin tổng quan (4 ô)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Loại hình xuất bản</label>
            <input type="text" className="form-control" value={form.publication_type} onChange={e => set('publication_type', e.target.value)} placeholder="Sách tranh 32 trang, khổ 21×21cm" />
          </div>
          <div className="form-group">
            <label className="form-label">Thời gian thực hiện</label>
            <input type="text" className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="10 tuần" />
          </div>
          <div className="form-group">
            <label className="form-label">Số lượng illustration</label>
            <input type="text" className="form-control" value={form.illustration_count} onChange={e => set('illustration_count', e.target.value)} placeholder="34 tranh + bìa" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Bối cảnh &amp; Thách thức — mỗi đoạn cách nhau 1 dòng trống</label>
          <textarea className="form-control" rows={5} value={form.challenge} onChange={e => set('challenge', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề mục quy trình (dùng *từ* để tô màu)</label>
            <input type="text" className="form-control" value={form.process_heading} onChange={e => set('process_heading', e.target.value)} placeholder="Quy trình *sáng tác*" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Các bước quy trình (mỗi dòng: tiêu đề|mô tả)</label>
          <textarea className="form-control" rows={5} value={form.process_steps} onChange={e => set('process_steps', e.target.value)} placeholder={'Thumbnail sketch toàn bộ 34 trang|Phác thảo bố cục nhanh...\nCharacter sheet cho Bống...|3 vòng feedback...'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh gallery (mỗi dòng 1 URL — ảnh đầu sẽ hiển thị lớn hơn)</label>
          <textarea className="form-control" rows={4} value={form.gallery_images} onChange={e => set('gallery_images', e.target.value)} placeholder={'https://...jpg\nhttps://...jpg\nhttps://...jpg'} />
        </div>
        <div className="form-group">
          <label className="form-label">Đoạn văn kết quả</label>
          <textarea className="form-control" rows={3} value={form.result_summary} onChange={e => set('result_summary', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
          <textarea className="form-control" rows={3} value={form.result_stats} onChange={e => set('result_stats', e.target.value)} placeholder={'34||Illustration hoàn thành đúng hạn\n5000|+|Bản in đầu phát hành'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Đánh giá khách hàng (case study)</div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá</label>
          <textarea className="form-control" rows={3} value={form.testimonial_content} onChange={e => set('testimonial_content', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên khách hàng</label>
            <input type="text" className="form-control" value={form.testimonial_author} onChange={e => set('testimonial_author', e.target.value)} placeholder="[Tên Biên tập viên]" />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò / bối cảnh</label>
            <input type="text" className="form-control" value={form.testimonial_role} onChange={e => set('testimonial_role', e.target.value)} placeholder="Biên tập viên, [Nhà xuất bản Sách Thiếu Nhi]" />
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
