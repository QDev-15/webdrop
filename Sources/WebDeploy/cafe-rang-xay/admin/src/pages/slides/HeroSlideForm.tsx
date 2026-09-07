import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// Ghi chú encode dữ liệu (không đổi cột core hero_slides — xem Database.php):
// - title:   dùng "*từ*" để in nghiêng màu accent, Enter để xuống dòng (giống <br> trong template)
// - subtitle: "<nhãn eyebrow>||<đoạn mô tả>||<chữ nút chính>||<link nút chính>"
// - image:   4 URL nối bằng xuống dòng "\n" (lưới ảnh magazine grid)
// - button_text/button_link: CHỈ nút OUTLINE (nút phụ, biến đổi theo slide)

interface FormState {
  title: string
  label: string
  desc: string
  primaryText: string
  primaryLink: string
  button_text: string
  button_link: string
  images: string[]
  sort_order: number
  status: string
}

const empty: FormState = {
  title: '', label: '', desc: '', primaryText: 'Xem thực đơn', primaryLink: '/thuc-don',
  button_text: '', button_link: '',
  images: ['', '', '', ''],
  sort_order: 0, status: 'published',
}

export default function HeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<{ title: string; subtitle: string; button_text: string; button_link: string; image: string; sort_order: number; status: string }>(`/hero-slides/${id}`)
      .then(d => {
        const parts = (d.subtitle || '').split('||')
        const images = (d.image || '').split(/\r?\n/).map(s => s.trim())
        while (images.length < 4) images.push('')
        setForm({
          title: d.title,
          label: parts[0] ?? '', desc: parts[1] ?? '',
          primaryText: parts[2] ?? 'Xem thực đơn', primaryLink: parts[3] ?? '/thuc-don',
          button_text: d.button_text ?? '', button_link: d.button_link ?? '',
          images: images.slice(0, 4),
          sort_order: d.sort_order ?? 0, status: d.status ?? 'published',
        })
      })
      .catch(() => setError('Không tìm thấy slide.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function setImage(i: number, v: string) {
    setForm(f => {
      const images = [...f.images]
      images[i] = v
      return { ...f, images }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        subtitle: `${form.label}||${form.desc}||${form.primaryText}||${form.primaryLink}`,
        button_text: form.button_text,
        button_link: form.button_link,
        image: form.images.filter(Boolean).join('\n'),
        sort_order: form.sort_order,
        status: form.status,
      }
      if (isEdit) {
        await api.put(`/hero-slides/${id}`, payload)
      } else {
        await api.post('/hero-slides', payload)
      }
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa Slide' : 'Thêm Slide mới'}</div>
          <div className="page-sub">Carousel hero trang chủ — 4 slide, mỗi slide 1 nhãn nhỏ + tiêu đề + mô tả + 2 nút + 4 ảnh lưới</div>
        </div>
        <button onClick={() => navigate('/slides')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Nhãn nhỏ (eyebrow)</label>
          <input type="text" className="form-control" value={form.label} onChange={e => set('label', e.target.value)} placeholder="Vd: 🔥 Rang mẻ nhỏ mỗi ngày" />
        </div>
        <div className="form-group">
          <label className="form-label">Tiêu đề chính *</label>
          <textarea className="form-control" rows={2} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Dùng *từ* để in nghiêng, Enter để xuống dòng" required />
        </div>
        <div className="form-group">
          <label className="form-label">Đoạn mô tả</label>
          <textarea className="form-control" value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Nội dung mô tả slide" rows={3} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chữ nút chính (accent)</label>
            <input type="text" className="form-control" value={form.primaryText} onChange={e => set('primaryText', e.target.value)} placeholder="Vd: Xem thực đơn" />
          </div>
          <div className="form-group">
            <label className="form-label">Liên kết nút chính</label>
            <input type="text" className="form-control" value={form.primaryLink} onChange={e => set('primaryLink', e.target.value)} placeholder="/thuc-don" />
          </div>
          <div className="form-group">
            <label className="form-label">Chữ nút phụ (outline)</label>
            <input type="text" className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Vd: Khám phá xưởng rang →" />
          </div>
          <div className="form-group">
            <label className="form-label">Liên kết nút phụ</label>
            <input type="text" className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/khong-gian" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {form.images.map((img, i) => (
            <ImageField key={i} label={`Ảnh lưới ${i + 1}${i === 0 || i === 3 ? ' (dọc, span 2 ô)' : ''}`} value={img} onChange={v => setImage(i, v)} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
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
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/slides')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
