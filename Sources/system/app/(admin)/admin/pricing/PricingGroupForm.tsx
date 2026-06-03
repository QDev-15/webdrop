'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Plan {
  id: number; name: string; price: string
  features: string[]; hot: boolean
  ctaLabel: string; ctaHref: string; sortOrder: number
}

interface PricingGroupFormProps {
  mode: 'new' | 'edit'
  initialData?: {
    id: number; slug: string; eyebrow: string; title: string; titleEm: string
    subtitle: string; footnote: string; bg: string; type: string
    description: string; tags: string[]; ctaLabel: string; ctaHref: string
    status: string; plans: Plan[]
  }
}

const inputCls: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid var(--border)', background: 'var(--bg)',
  fontSize: 13, fontFamily: 'var(--sans)', outline: 'none',
  color: 'var(--text)', boxSizing: 'border-box',
}
const labelCls: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }
const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }

export default function PricingGroupForm({ mode, initialData }: PricingGroupFormProps) {
  const router = useRouter()
  const gid = initialData?.id

  const [slug,        setSlug]        = useState(initialData?.slug        ?? '')
  const [eyebrow,     setEyebrow]     = useState(initialData?.eyebrow     ?? '')
  const [title,       setTitle]       = useState(initialData?.title       ?? '')
  const [titleEm,     setTitleEm]     = useState(initialData?.titleEm     ?? '')
  const [subtitle,    setSubtitle]    = useState(initialData?.subtitle    ?? '')
  const [footnote,    setFootnote]    = useState(initialData?.footnote    ?? '')
  const [bg,          setBg]          = useState(initialData?.bg          ?? 'light')
  const [type,        setType]        = useState(initialData?.type        ?? 'cards')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [tags,        setTags]        = useState<string[]>(initialData?.tags ?? [])
  const [tagInput,    setTagInput]    = useState('')
  const [ctaLabel,    setCtaLabel]    = useState(initialData?.ctaLabel    ?? '')
  const [ctaHref,     setCtaHref]     = useState(initialData?.ctaHref     ?? '')
  const [status,      setStatus]      = useState(initialData?.status      ?? 'published')

  // Plans state
  const [plans,       setPlans]       = useState<Plan[]>(initialData?.plans ?? [])
  const [addingPlan,  setAddingPlan]  = useState(false)
  const [editingPlan, setEditingPlan] = useState<number | null>(null)

  // New plan form
  const [newName,     setNewName]     = useState('')
  const [newPrice,    setNewPrice]    = useState('')
  const [newFeatures, setNewFeatures] = useState('')
  const [newHot,      setNewHot]      = useState(false)
  const [newCtaLabel, setNewCtaLabel] = useState('')
  const [newCtaHref,  setNewCtaHref]  = useState('')

  // Edit plan form
  const [editName,     setEditName]     = useState('')
  const [editPrice,    setEditPrice]    = useState('')
  const [editFeatures, setEditFeatures] = useState('')
  const [editHot,      setEditHot]      = useState(false)
  const [editCtaLabel, setEditCtaLabel] = useState('')
  const [editCtaHref,  setEditCtaHref]  = useState('')

  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const slugEdited = useRef(mode === 'edit')

  function autoSlug(v: string) {
    return v.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }
  function handleTitleChange(v: string) {
    setTitle(v)
    if (!slugEdited.current) setSlug(autoSlug(v))
  }

  // Tags
  function addTag() {
    const v = tagInput.trim()
    if (!v || tags.includes(v)) return
    setTags(prev => [...prev, v]); setTagInput('')
  }

  // Plans
  async function addPlan() {
    if (!newName.trim() || !gid) return
    const res = await fetch(`/api/admin/pricing/groups/${gid}/plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newName.trim(), price: newPrice.trim(),
        features: newFeatures.split('\n').map(s => s.trim()).filter(Boolean),
        hot: newHot, ctaLabel: newCtaLabel.trim(), ctaHref: newCtaHref.trim(),
      }),
    })
    const data = await res.json()
    setPlans(prev => [...prev, { ...data.plan, features: data.plan.features ?? [], ctaLabel: data.plan.ctaLabel ?? '', ctaHref: data.plan.ctaHref ?? '' }])
    setNewName(''); setNewPrice(''); setNewFeatures(''); setNewHot(false); setNewCtaLabel(''); setNewCtaHref('')
    setAddingPlan(false)
  }

  function startEditPlan(p: Plan) {
    setEditingPlan(p.id); setEditName(p.name); setEditPrice(p.price)
    setEditFeatures(p.features.join('\n')); setEditHot(p.hot)
    setEditCtaLabel(p.ctaLabel); setEditCtaHref(p.ctaHref)
  }

  async function saveEditPlan(p: Plan) {
    const res = await fetch(`/api/admin/pricing/groups/${gid}/plans/${p.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editName.trim(), price: editPrice.trim(),
        features: editFeatures.split('\n').map(s => s.trim()).filter(Boolean),
        hot: editHot, ctaLabel: editCtaLabel.trim(), ctaHref: editCtaHref.trim(),
      }),
    })
    const data = await res.json()
    setPlans(prev => prev.map(x => x.id === p.id ? { ...x, ...data.plan, features: data.plan.features ?? [], ctaLabel: data.plan.ctaLabel ?? '', ctaHref: data.plan.ctaHref ?? '' } : x))
    setEditingPlan(null)
  }

  async function deletePlan(id: number) {
    if (!confirm('Xóa thẻ giá này?')) return
    await fetch(`/api/admin/pricing/groups/${gid}/plans/${id}`, { method: 'DELETE' })
    const newPlans = plans.filter(p => p.id !== id).map((p, i) => ({ ...p, sortOrder: i }))
    setPlans(newPlans)
    if (newPlans.length > 0) {
      await fetch(`/api/admin/pricing/groups/${gid}/plans/reorder`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newPlans.map(p => p.id) }),
      })
    }
  }

  async function movePlan(idx: number, dir: -1 | 1) {
    const newPlans = [...plans]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= newPlans.length) return
    ;[newPlans[idx], newPlans[swapIdx]] = [newPlans[swapIdx], newPlans[idx]]
    const reordered = newPlans.map((p, i) => ({ ...p, sortOrder: i }))
    setPlans(reordered)
    await fetch(`/api/admin/pricing/groups/${gid}/plans/reorder`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: reordered.map(p => p.id) }),
    })
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) { setError('Tiêu đề và slug là bắt buộc'); return }
    setSaving(true); setError('')
    const body = { slug, eyebrow, title, titleEm, subtitle, footnote, bg, type, description, tags, ctaLabel, ctaHref, status }
    const res = mode === 'new'
      ? await fetch('/api/admin/pricing/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch(`/api/admin/pricing/groups/${gid}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Lỗi lưu'); setSaving(false); return }
    if (mode === 'new') {
      router.push(`/admin/pricing/${data.group.id}/edit`)
    } else {
      router.refresh(); setSaving(false)
    }
  }

  const planFormFields = (
    name: string, setName: (v: string) => void,
    price: string, setPrice: (v: string) => void,
    features: string, setFeatures: (v: string) => void,
    hot: boolean, setHot: (v: boolean) => void,
    cLabel: string, setCLabel: (v: string) => void,
    cHref: string, setCHref: (v: string) => void,
    onSave: () => void, onCancel: () => void, saveLabel: string,
  ) => (
    <div style={{ padding: '14px', background: 'var(--accent-light)', borderRadius: 10, marginBottom: 8 }}>
      <div className="row g-2">
        <div className="col-md-6">
          <label style={labelCls}>Tên gói *</label>
          <input style={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="VD: Standard" autoFocus />
        </div>
        <div className="col-md-6">
          <label style={labelCls}>Giá</label>
          <input style={inputCls} value={price} onChange={e => setPrice(e.target.value)} placeholder="7.000.000 – 12.000.000đ" />
        </div>
        <div className="col-12">
          <label style={labelCls}>Tính năng (mỗi dòng 1 tính năng)</label>
          <textarea rows={4} style={{ ...inputCls, resize: 'vertical' }} value={features} onChange={e => setFeatures(e.target.value)} placeholder={'5–7 trang\nBlog/tin tức\nAdmin quản lý nội dung'} />
        </div>
        <div className="col-md-5">
          <label style={labelCls}>Nút CTA</label>
          <input style={inputCls} value={cLabel} onChange={e => setCLabel(e.target.value)} placeholder="Đặt hàng ngay" />
        </div>
        <div className="col-md-7">
          <label style={labelCls}>Link CTA</label>
          <input style={inputCls} value={cHref} onChange={e => setCHref(e.target.value)} placeholder="/checkout" />
        </div>
        <div className="col-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: hot ? 'var(--accent-light)' : 'var(--bg)', border: `1px solid ${hot ? 'var(--accent-mid)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer' }}
            onClick={() => setHot(!hot)}>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: hot ? 'var(--accent)' : 'var(--border)', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: hot ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
            </div>
            <span style={{ fontSize: 12, color: hot ? 'var(--accent)' : 'var(--text-2)', fontWeight: hot ? 500 : 400 }}>Gói phổ biến nhất (badge &quot;Phổ biến nhất&quot;)</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={onSave} disabled={!name.trim()} style={{ flex: 1, padding: '8px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, cursor: name.trim() ? 'pointer' : 'not-allowed', opacity: name.trim() ? 1 : .5 }}>{saveLabel}</button>
        <button onClick={onCancel} style={{ padding: '8px 14px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>Hủy</button>
      </div>
    </div>
  )

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-600">{mode === 'new' ? 'Thêm nhóm giá' : `Chỉnh sửa: ${initialData?.title}`}</h4>
          {mode === 'new' && <p className="text-muted small mb-0">Sau khi tạo, thêm thẻ giá vào nhóm</p>}
        </div>
        <a href="/admin/pricing" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}>← Quay lại</a>
      </div>

      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <div className="row g-4">
        {/* ── Left: Group info ── */}
        <div className="col-lg-6">
          {/* Section info */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Thông tin section</div>
            <div className="row g-3">
              <div className="col-12">
                <label style={labelCls}>Slug (anchor #id) *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <span style={{ padding: '9px 10px', background: 'var(--warm)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: 12, color: 'var(--text-3)' }}>/pricing#</span>
                  <input style={{ ...inputCls, borderRadius: '0 8px 8px 0' }} value={slug} onChange={e => { setSlug(e.target.value); slugEdited.current = true }} placeholder="goi-template" />
                </div>
              </div>
              <div className="col-md-6">
                <label style={labelCls}>Eyebrow label</label>
                <input style={inputCls} value={eyebrow} onChange={e => setEyebrow(e.target.value)} placeholder="Gói Template" />
              </div>
              <div className="col-md-6">
                <label style={labelCls}>Trạng thái</label>
                <select style={inputCls} value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
              <div className="col-md-7">
                <label style={labelCls}>Tiêu đề *</label>
                <input style={inputCls} value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Template" />
              </div>
              <div className="col-md-5">
                <label style={labelCls}>Phần in nghiêng <em style={{ color: 'var(--accent)' }}>xanh</em></label>
                <input style={inputCls} value={titleEm} onChange={e => setTitleEm(e.target.value)} placeholder="thuần HTML/CSS" />
              </div>
              <div className="col-12">
                <label style={labelCls}>Mô tả ngắn (subtitle)</label>
                <textarea rows={2} style={{ ...inputCls, resize: 'vertical' }} value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Mở thẳng trên trình duyệt, không cần build..." />
              </div>
              <div className="col-12">
                <label style={labelCls}>Chú thích phía dưới (footnote)</label>
                <input style={inputCls} value={footnote} onChange={e => setFootnote(e.target.value)} placeholder="Bundle 5 template: Tiết kiệm 30–40% so với mua lẻ" />
              </div>
              <div className="col-md-6">
                <label style={labelCls}>Màu nền</label>
                <select style={inputCls} value={bg} onChange={e => setBg(e.target.value)}>
                  <option value="light">Sáng (trắng/off-white)</option>
                  <option value="warm">Ấm (warm beige)</option>
                  <option value="dark">Tối (dark)</option>
                </select>
              </div>
              <div className="col-md-6">
                <label style={labelCls}>Kiểu layout</label>
                <select style={inputCls} value={type} onChange={e => setType(e.target.value)}>
                  <option value="cards">Thẻ giá (grid cards)</option>
                  <option value="banner">Banner CTA (dark banner)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Banner-specific fields */}
          {type === 'banner' && (
            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Banner CTA</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>Dành cho nhóm hiển thị dạng dark banner (Gói Theo Yêu cầu)</div>
              <div className="row g-3">
                <div className="col-12">
                  <label style={labelCls}>Mô tả (trong banner)</label>
                  <textarea rows={3} style={{ ...inputCls, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Thiết kế theo yêu cầu, 2 phase rõ ràng. Từ 20.000.000đ tùy scope." />
                </div>
                <div className="col-md-5">
                  <label style={labelCls}>Nút CTA</label>
                  <input style={inputCls} value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} placeholder="Liên hệ tư vấn →" />
                </div>
                <div className="col-md-7">
                  <label style={labelCls}>Link CTA</label>
                  <input style={inputCls} value={ctaHref} onChange={e => setCtaHref(e.target.value)} placeholder="/contact" />
                </div>
                <div className="col-12">
                  <label style={labelCls}>Tags (badge nhỏ trong banner)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 8 }}>
                    {tags.map(t => (
                      <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 20, fontSize: 11.5, color: 'rgba(255,255,255,.7)', background: 'var(--warm)', color: 'var(--text)' }}>
                        {t}
                        <button onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 12, padding: 0 }}>×</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...inputCls, flex: 1 }} value={tagInput} onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="VD: Wireframe → Design" />
                    <button onClick={addTag} style={{ padding: '9px 14px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-mid)', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>+ Thêm</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Plans ── */}
        <div className="col-lg-6">
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              {type === 'cards' ? 'Thẻ giá' : 'Gói trong Banner'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
              {mode === 'new' ? 'Lưu nhóm trước rồi mới thêm thẻ giá' : `${plans.length} thẻ giá · Nút ▲▼ để sắp xếp`}
            </div>

            {mode === 'edit' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {plans.map((p, idx) => (
                    <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      {editingPlan === p.id ? (
                        planFormFields(
                          editName, setEditName, editPrice, setEditPrice,
                          editFeatures, setEditFeatures, editHot, setEditHot,
                          editCtaLabel, setEditCtaLabel, editCtaHref, setEditCtaHref,
                          () => saveEditPlan(p), () => setEditingPlan(null), 'Lưu thẻ'
                        )
                      ) : (
                        <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <button onClick={() => movePlan(idx, -1)} disabled={idx === 0} style={{ width: 22, height: 20, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: idx === 0 ? .4 : 1 }}>▲</button>
                            <button onClick={() => movePlan(idx, 1)} disabled={idx === plans.length - 1} style={{ width: 22, height: 20, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === plans.length - 1 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: idx === plans.length - 1 ? .4 : 1 }}>▼</button>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                              {p.hot && <span style={{ fontSize: 10, background: 'var(--accent)', color: '#fff', padding: '1px 7px', borderRadius: 8 }}>HOT</span>}
                              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>{p.price}</span>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.features.length} tính năng · CTA: {p.ctaLabel || '—'}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => startEditPlan(p)} style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-2)', background: 'var(--bg)' }}>Sửa</button>
                            <button onClick={() => deletePlan(p.id)} style={{ padding: '4px 8px', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#dc2626', background: '#fef2f2' }}>✕</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {addingPlan ? (
                  planFormFields(
                    newName, setNewName, newPrice, setNewPrice,
                    newFeatures, setNewFeatures, newHot, setNewHot,
                    newCtaLabel, setNewCtaLabel, newCtaHref, setNewCtaHref,
                    addPlan,
                    () => { setAddingPlan(false); setNewName(''); setNewPrice(''); setNewFeatures(''); setNewHot(false); setNewCtaLabel(''); setNewCtaHref('') },
                    '+ Thêm thẻ giá'
                  )
                ) : (
                  <button onClick={() => setAddingPlan(true)} style={{ width: '100%', padding: '10px', border: '1px dashed var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-2)', background: 'transparent', cursor: 'pointer' }}>
                    + Thêm thẻ giá
                  </button>
                )}
              </>
            )}

            {mode === 'new' && (
              <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: 10, textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
                Lưu nhóm trước → có thể thêm thẻ giá tại đây
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <a href="/admin/pricing" style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>Hủy</a>
        <button onClick={handleSave} disabled={saving} style={{ padding: '10px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
          {saving ? 'Đang lưu...' : mode === 'new' ? 'Tạo nhóm' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  )
}
