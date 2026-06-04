'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { HeroSlide } from '@prisma/client'
import type { Slide, TitlePart, SlideButton } from '@/data/slides.config'

const TYPES = [
  { value: 'intro',       label: 'Giới thiệu — Tiêu đề + stats + buttons' },
  { value: 'features',    label: 'Tính năng — Icon list + tags + buttons' },
  { value: 'grid',        label: 'Grid — Icon grid ngành nghề + buttons' },
  { value: 'pricing',     label: 'Bảng giá — 3 gói + tags + buttons' },
  { value: 'testimonial', label: 'Đánh giá — Quote + tác giả + buttons' },
]

const DEFAULT_DATA: Record<string, object> = {
  intro: {
    subtitle: '',
    stats: [{ value: '', label: '' }],
  },
  features: {
    features: [{ icon: '⚡', text: '', highlight: '' }],
    tags: [],
  },
  grid: {
    items: [{ icon: '🏢', label: '', desc: '' }],
  },
  pricing: {
    plans: [{ name: '', price: '', desc: '', hot: false }],
    tags: [],
  },
  testimonial: {
    quote: '',
    author: { name: '', role: '', avatar: '' },
  },
}

const DEFAULT_TITLE: TitlePart[] = [{ text: 'Tiêu đề slide' }]
const DEFAULT_BUTTONS: SlideButton[] = [
  { label: 'Nút chính', variant: 'primary', action: { type: 'scroll', target: 'templates' } },
]

function toSlideForDB(type: string, bg: string, badge: string, titleRaw: string, dataRaw: string, buttonsRaw: string) {
  return {
    type,
    bg,
    badge,
    title:   JSON.parse(titleRaw),
    data:    JSON.parse(dataRaw),
    buttons: JSON.parse(buttonsRaw),
  }
}

export default function SlideForm({ slide }: { slide?: HeroSlide }) {
  const router = useRouter()
  const isEdit = !!slide

  const [type,    setType]    = useState<string>(slide?.type    ?? 'intro')
  const [bg,      setBg]      = useState(slide?.bg      ?? '')
  const [badge,   setBadge]   = useState(slide?.badge   ?? '')
  const [status,  setStatus]  = useState(slide?.status  ?? 'published')
  const [titleRaw,   setTitleRaw]   = useState(JSON.stringify(slide?.title   ?? DEFAULT_TITLE,   null, 2))
  const [dataRaw,    setDataRaw]    = useState(JSON.stringify(slide?.data    ?? DEFAULT_DATA['intro'], null, 2))
  const [buttonsRaw, setButtonsRaw] = useState(JSON.stringify(slide?.buttons ?? DEFAULT_BUTTONS, null, 2))

  const [saving,  setSaving]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error,   setError]   = useState('')

  function handleTypeChange(newType: string) {
    setType(newType)
    setDataRaw(JSON.stringify(DEFAULT_DATA[newType] ?? {}, null, 2))
  }

  async function handleSave() {
    setSaving(true); setError('')
    try {
      const body = {
        ...toSlideForDB(type, bg, badge, titleRaw, dataRaw, buttonsRaw),
        status,
      }
      const url    = isEdit ? `/api/admin/slides/${slide.id}` : '/api/admin/slides'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Lỗi lưu'); return }
      router.push('/admin/slides')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'JSON không hợp lệ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!slide || !confirm('Xóa slide này?')) return
    setDeleting(true)
    await fetch(`/api/admin/slides/${slide.id}`, { method: 'DELETE' })
    router.push('/admin/slides')
    router.refresh()
  }

  return (
    <div className="p-4" style={{ maxWidth: 860 }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => router.back()}>← Quay lại</button>
        <h4 className="mb-0 fw-600">{isEdit ? 'Sửa slide' : 'Thêm slide mới'}</h4>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="row g-3">

        {/* Type */}
        <div className="col-12">
          <label className="form-label fw-500 small">Loại slide</label>
          <select className="form-select form-select-sm" value={type} onChange={e => handleTypeChange(e.target.value)}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Badge */}
        <div className="col-12">
          <label className="form-label fw-500 small">Badge (dòng nhỏ trên tiêu đề)</label>
          <input className="form-control form-control-sm" value={badge} onChange={e => setBadge(e.target.value)}
            placeholder="Website chuyên nghiệp · Triển khai trọn gói" />
        </div>

        {/* Background */}
        <div className="col-12">
          <label className="form-label fw-500 small">Background image URL</label>
          <input className="form-control form-control-sm" value={bg} onChange={e => setBg(e.target.value)}
            placeholder="https://images.unsplash.com/..." />
          {bg && <img src={bg} alt="" className="mt-2 rounded" style={{ height: 80, objectFit: 'cover', opacity: .7 }} />}
        </div>

        {/* Title JSON */}
        <div className="col-12">
          <label className="form-label fw-500 small">
            Title <span className="text-muted">(JSON — TitlePart[])</span>
          </label>
          <div className="small text-muted mb-1">
            Variant: <code>"normal"</code> | <code>"em"</code> (xanh nghiêng) | <code>"muted"</code> (mờ) · Xuống dòng: <code>{"{ \"br\": true }"}</code>
          </div>
          <textarea className="form-control form-control-sm font-monospace" rows={5}
            value={titleRaw} onChange={e => setTitleRaw(e.target.value)} />
        </div>

        {/* Data JSON */}
        <div className="col-12">
          <label className="form-label fw-500 small">
            Nội dung <span className="text-muted">(JSON — theo từng loại slide)</span>
          </label>
          <textarea className="form-control form-control-sm font-monospace" rows={12}
            value={dataRaw} onChange={e => setDataRaw(e.target.value)} />
        </div>

        {/* Buttons JSON */}
        <div className="col-12">
          <label className="form-label fw-500 small">
            Buttons <span className="text-muted">(JSON — SlideButton[])</span>
          </label>
          <div className="small text-muted mb-1">
            Action: <code>{"{ \"type\": \"scroll\", \"target\": \"templates\" }"}</code> hoặc <code>{"{ \"type\": \"link\", \"href\": \"/contact\" }"}</code>
          </div>
          <textarea className="form-control form-control-sm font-monospace" rows={6}
            value={buttonsRaw} onChange={e => setButtonsRaw(e.target.value)} />
        </div>

        {/* Status */}
        <div className="col-12">
          <label className="form-label fw-500 small">Trạng thái</label>
          <select className="form-select form-select-sm" value={status} onChange={e => setStatus(e.target.value as 'published' | 'draft')}>
            <option value="published">Hiển thị</option>
            <option value="draft">Ẩn</option>
          </select>
        </div>

        {/* Actions */}
        <div className="col-12 d-flex gap-2 pt-2">
          <button className="btn btn-dark btn-sm px-4" onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo slide'}
          </button>
          {isEdit && (
            <button className="btn btn-outline-danger btn-sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? '...' : 'Xóa slide'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
