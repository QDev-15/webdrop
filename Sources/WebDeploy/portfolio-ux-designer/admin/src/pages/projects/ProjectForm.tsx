import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  title: string
  slug: string
  category: string
  image: string
  short_desc: string
  year: string
  has_case_study: boolean
  client_name: string
  hero_desc: string
  industry: string
  duration: string
  services_provided: string
  key_result: string
  challenge_title: string
  challenge_intro: string
  challenge_details: string
  solution_items: string
  gallery_images: string
  results_note: string
  results_items: string
  testimonial_content: string
  testimonial_author: string
  testimonial_role: string
  featured: boolean
  sort_order: number
  status: string
}

const empty: FormData = {
  title: '', slug: '', category: '', image: '', short_desc: '', year: '',
  has_case_study: false, client_name: '', hero_desc: '',
  industry: '', duration: '', services_provided: '', key_result: '',
  challenge_title: '', challenge_intro: '', challenge_details: '',
  solution_items: '', gallery_images: '', results_note: '', results_items: '',
  testimonial_content: '', testimonial_author: '', testimonial_role: '',
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
        image: String(d.image ?? ''), short_desc: String(d.short_desc ?? ''), year: String(d.year ?? ''),
        has_case_study: Number(d.has_case_study ?? 0) === 1,
        client_name: String(d.client_name ?? ''), hero_desc: String(d.hero_desc ?? ''),
        industry: String(d.industry ?? ''), duration: String(d.duration ?? ''),
        services_provided: String(d.services_provided ?? ''), key_result: String(d.key_result ?? ''),
        challenge_title: String(d.challenge_title ?? ''), challenge_intro: String(d.challenge_intro ?? ''), challenge_details: String(d.challenge_details ?? ''),
        solution_items: String(d.solution_items ?? ''),
        gallery_images: String(d.gallery_images ?? ''),
        results_note: String(d.results_note ?? ''), results_items: String(d.results_items ?? ''),
        testimonial_content: String(d.testimonial_content ?? ''), testimonial_author: String(d.testimonial_author ?? ''), testimonial_role: String(d.testimonial_role ?? ''),
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
      const payload = { ...form, has_case_study: form.has_case_study ? 1 : 0, featured: form.featured ? 1 : 0 }
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
    <div style={{ maxWidth: 780 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</div>
          <div className="page-sub">Thẻ dự án hiển thị ở trang chủ (bento) &amp; trang Dự án. Bật "Case Study" để có trang chi tiết đầy đủ.</div>
        </div>
        <button onClick={() => navigate('/projects')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Thông tin thẻ dự án</h3>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Tiêu đề * (vd: Redesign app ví điện tử FinPay)</label>
          <input id="title" type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="slug">Slug (để trống sẽ tự tạo từ tiêu đề)</label>
            <input id="slug" type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="redesign-app-vi-dien-tu-finpay" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="category">Danh mục</label>
            <input id="category" type="text" className="form-control" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Mobile App · Fintech" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="short_desc">Mô tả ngắn (hiển thị ở thẻ lưới trang Dự án)</label>
            <input id="short_desc" type="text" className="form-control" value={form.short_desc} onChange={e => set('short_desc', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="year">Năm thực hiện</label>
            <input id="year" type="text" className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2025" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện dự án (thẻ)" value={form.image} onChange={v => set('image', v)} />
        </div>

        <div style={{ margin: '20px 0', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.has_case_study} onChange={e => set('has_case_study', e.target.checked)} />
            <span className="form-label" style={{ margin: 0 }}>Có trang Case Study chi tiết riêng</span>
          </label>
        </div>

        {form.has_case_study && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 16px' }}>Case Study — trang chi tiết</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="client_name">Khách hàng</label>
                <input id="client_name" type="text" className="form-control" value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="FinPay Technologies" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="industry">Ngành</label>
                <input id="industry" type="text" className="form-control" value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="Fintech · Ví điện tử" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="duration">Thời gian thực hiện</label>
                <input id="duration" type="text" className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="10 tuần" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="services_provided">Dịch vụ cung cấp</label>
                <input id="services_provided" type="text" className="form-control" value={form.services_provided} onChange={e => set('services_provided', e.target.value)} placeholder="UX Research · UI Design · Usability Testing" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="key_result">Kết quả chính (hiển thị màu nhấn trong overview bar)</label>
              <input id="key_result" type="text" className="form-control" value={form.key_result} onChange={e => set('key_result', e.target.value)} placeholder="+32% conversion nạp tiền" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="hero_desc">Mô tả dài (dưới tiêu đề case study)</label>
              <textarea id="hero_desc" className="form-control" rows={3} value={form.hero_desc} onChange={e => set('hero_desc', e.target.value)} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Bối cảnh &amp; thách thức</div>
            <div className="form-group">
              <label className="form-label" htmlFor="challenge_title">Tiêu đề (dùng *từ* để in nghiêng màu nhấn)</label>
              <input id="challenge_title" type="text" className="form-control" value={form.challenge_title} onChange={e => set('challenge_title', e.target.value)} placeholder="Người dùng bỏ giữa chừng ngay tại *bước xác nhận giao dịch.*" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="challenge_intro">Đoạn văn cột trái</label>
              <textarea id="challenge_intro" className="form-control" rows={3} value={form.challenge_intro} onChange={e => set('challenge_intro', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="challenge_details">Đoạn văn cột phải — mỗi đoạn cách nhau 1 dòng trống</label>
              <textarea id="challenge_details" className="form-control" rows={4} value={form.challenge_details} onChange={e => set('challenge_details', e.target.value)} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Giải pháp — quy trình 4 bước</div>
            <div className="form-group">
              <label className="form-label" htmlFor="solution_items">Mỗi dòng: Nhãn bước|Ảnh URL|Tiêu đề|Mô tả</label>
              <textarea id="solution_items" className="form-control" rows={8} value={form.solution_items} onChange={e => set('solution_items', e.target.value)}
                placeholder={'01 · UX Research|https://...jpg|Phỏng vấn 18 người dùng...|Nội dung mô tả...'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gallery_images">Ảnh gallery (mỗi dòng: URL|Mô tả ảnh|Kích thước ô — g-tall lớn, g2/g3 thường)</label>
              <textarea id="gallery_images" className="form-control" rows={5} value={form.gallery_images} onChange={e => set('gallery_images', e.target.value)}
                placeholder={'https://...jpg|Màn hình chính|g-tall\nhttps://...jpg|Màn hình phụ|g2'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Kết quả</div>
            <div className="form-group">
              <label className="form-label" htmlFor="results_items">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
              <textarea id="results_items" className="form-control" rows={4} value={form.results_items} onChange={e => set('results_items', e.target.value)}
                placeholder={'32|%|Tăng conversion nạp tiền\n45|%|Tăng task success rate'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="results_note">Ghi chú dưới số liệu kết quả</label>
              <textarea id="results_note" className="form-control" rows={2} value={form.results_note} onChange={e => set('results_note', e.target.value)} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Đánh giá khách hàng (case study)</div>
            <div className="form-group">
              <label className="form-label" htmlFor="testimonial_content">Nội dung đánh giá</label>
              <textarea id="testimonial_content" className="form-control" rows={3} value={form.testimonial_content} onChange={e => set('testimonial_content', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="testimonial_author">Tên khách hàng</label>
                <input id="testimonial_author" type="text" className="form-control" value={form.testimonial_author} onChange={e => set('testimonial_author', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="testimonial_role">Vai trò / bối cảnh</label>
                <input id="testimonial_role" type="text" className="form-control" value={form.testimonial_role} onChange={e => set('testimonial_role', e.target.value)} placeholder="Chief Product Officer, FinPay Technologies" />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="sort_order">Thứ tự hiển thị</label>
            <input id="sort_order" type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Trạng thái</label>
            <select id="status" className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
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
