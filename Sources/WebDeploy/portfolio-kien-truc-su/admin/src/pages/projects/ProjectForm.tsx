import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  title: string
  slug: string
  category: string
  image: string
  location: string
  year: string
  has_case_study: boolean
  client_name: string
  area: string
  duration: string
  budget: string
  cover_image: string
  challenge_title: string
  challenge_body: string
  solution_title: string
  solution_layout: string
  solution_items: string
  gallery_images: string
  results_title: string
  results_items: string
  testimonial_content: string
  testimonial_author: string
  testimonial_role: string
  featured: boolean
  sort_order: number
  status: string
}

const empty: FormData = {
  title: '', slug: '', category: '', image: '', location: '', year: '',
  has_case_study: false, client_name: '', area: '', duration: '', budget: '', cover_image: '',
  challenge_title: '', challenge_body: '', solution_title: '', solution_layout: 'grid', solution_items: '',
  gallery_images: '', results_title: '', results_items: '',
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
        image: String(d.image ?? ''), location: String(d.location ?? ''), year: String(d.year ?? ''),
        has_case_study: Number(d.has_case_study ?? 0) === 1,
        client_name: String(d.client_name ?? ''), area: String(d.area ?? ''), duration: String(d.duration ?? ''), budget: String(d.budget ?? ''),
        cover_image: String(d.cover_image ?? ''),
        challenge_title: String(d.challenge_title ?? ''), challenge_body: String(d.challenge_body ?? ''),
        solution_title: String(d.solution_title ?? ''), solution_layout: String(d.solution_layout ?? 'grid'), solution_items: String(d.solution_items ?? ''),
        gallery_images: String(d.gallery_images ?? ''),
        results_title: String(d.results_title ?? ''), results_items: String(d.results_items ?? ''),
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
          <div className="page-sub">Thẻ dự án hiển thị ở trang chủ &amp; trang Dự án. Bật "Case Study" để có trang chi tiết đầy đủ.</div>
        </div>
        <button onClick={() => navigate('/projects')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Thông tin thẻ dự án</h3>
        <div className="form-group">
          <label className="form-label">Tiêu đề * (vd: Nhà Phố Tối Giản)</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Slug (để trống sẽ tự tạo từ tiêu đề)</label>
            <input type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="nha-pho-toi-gian-long-bien" />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <input type="text" className="form-control" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Nhà ở dân dụng / Cải tạo công trình cũ" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Địa điểm</label>
            <input type="text" className="form-control" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Long Biên, Hà Nội" />
          </div>
          <div className="form-group">
            <label className="form-label">Năm hoàn thành</label>
            <input type="text" className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024" />
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
                <label className="form-label">Khách hàng</label>
                <input type="text" className="form-control" value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Anh Hoàng & gia đình" />
              </div>
              <div className="form-group">
                <label className="form-label">Diện tích</label>
                <input type="text" className="form-control" value={form.area} onChange={e => set('area', e.target.value)} placeholder="120m² đất · 4 tầng" />
              </div>
              <div className="form-group">
                <label className="form-label">Thời gian thi công</label>
                <input type="text" className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="8 tháng" />
              </div>
              <div className="form-group">
                <label className="form-label">Ngân sách</label>
                <input type="text" className="form-control" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="~2,8 tỷ VNĐ" />
              </div>
            </div>
            <div className="form-group">
              <ImageField label="Ảnh bìa (full-width đầu trang case study)" value={form.cover_image} onChange={v => set('cover_image', v)} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Bối cảnh &amp; thách thức</div>
            <div className="form-group">
              <label className="form-label">Tiêu đề (dùng *từ* để in nghiêng màu nhấn)</label>
              <input type="text" className="form-control" value={form.challenge_title} onChange={e => set('challenge_title', e.target.value)} placeholder="Đất hình thang hẹp, *hai con nhỏ, ngân sách có hạn*" />
            </div>
            <div className="form-group">
              <label className="form-label">Nội dung — mỗi đoạn cách nhau 1 dòng trống</label>
              <textarea className="form-control" rows={5} value={form.challenge_body} onChange={e => set('challenge_body', e.target.value)} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Giải pháp thiết kế</div>
            <div className="form-group">
              <label className="form-label">Tiêu đề (dùng *từ* để in nghiêng màu nhấn)</label>
              <input type="text" className="form-control" value={form.solution_title} onChange={e => set('solution_title', e.target.value)} placeholder="Khối hộp xuyên sáng, *giếng trời làm trung tâm*" />
            </div>
            <div className="form-group">
              <label className="form-label">Kiểu hiển thị</label>
              <select className="form-control" value={form.solution_layout} onChange={e => set('solution_layout', e.target.value)}>
                <option value="grid">Lưới 2 cột (4 mục ngắn — vd Concept/Vật liệu/Công năng/Cầu thang)</option>
                <option value="list">Danh sách đánh số (5+ bước dài — vd quy trình cải tạo)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Các mục giải pháp (mỗi dòng: Tiêu đề::Mô tả)</label>
              <textarea className="form-control" rows={6} value={form.solution_items} onChange={e => set('solution_items', e.target.value)}
                placeholder={'Concept::Toàn bộ công trình...\nVật liệu::Bê tông mài...'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Ảnh gallery (mỗi dòng: URL|Mô tả ảnh|Kích thước ô — g1 lớn, g2/g3 thường)</label>
              <textarea className="form-control" rows={5} value={form.gallery_images} onChange={e => set('gallery_images', e.target.value)}
                placeholder={'https://...jpg|Mặt tiền nhà|g1\nhttps://...jpg|Nội thất|g2'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '16px 0 10px' }}>Kết quả</div>
            <div className="form-group">
              <label className="form-label">Tiêu đề (dùng *từ* để in nghiêng màu nhấn)</label>
              <input type="text" className="form-control" value={form.results_title} onChange={e => set('results_title', e.target.value)} placeholder="Đo lường được, *không chỉ đẹp trên bản vẽ*" />
            </div>
            <div className="form-group">
              <label className="form-label">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
              <textarea className="form-control" rows={4} value={form.results_items} onChange={e => set('results_items', e.target.value)}
                placeholder={'30|%|Tiết kiệm điện chiếu sáng...\n8||Tháng thi công'} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
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
                <input type="text" className="form-control" value={form.testimonial_role} onChange={e => set('testimonial_role', e.target.value)} placeholder="Chủ nhà — Nhà Phố Tối Giản, Long Biên" />
              </div>
            </div>
          </>
        )}

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
