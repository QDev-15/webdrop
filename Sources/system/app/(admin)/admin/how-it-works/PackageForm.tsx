'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Step {
  id: number
  title: string
  desc: string
  sortOrder: number
}

interface PackageFormProps {
  mode: 'new' | 'edit'
  initialData?: {
    id: number
    name: string
    slug: string
    tagline: string
    icon: string
    price: string
    hot: boolean
    ctaLabel: string
    ctaHref: string
    suitable: string[]
    status: string
    steps: Step[]
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

export default function PackageForm({ mode, initialData }: PackageFormProps) {
  const router = useRouter()
  const pkgId = initialData?.id

  // Package fields
  const [name,     setName]     = useState(initialData?.name     ?? '')
  const [slug,     setSlug]     = useState(initialData?.slug     ?? '')
  const [tagline,  setTagline]  = useState(initialData?.tagline  ?? '')
  const [icon,     setIcon]     = useState(initialData?.icon     ?? '📦')
  const [price,    setPrice]    = useState(initialData?.price    ?? '')
  const [hot,      setHot]      = useState(initialData?.hot      ?? false)
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel ?? '')
  const [ctaHref,  setCtaHref]  = useState(initialData?.ctaHref  ?? '')
  const [status,   setStatus]   = useState(initialData?.status   ?? 'published')

  // Suitable tags
  const [suitable, setSuitable] = useState<string[]>(initialData?.suitable ?? [])
  const [suitInput, setSuitInput] = useState('')

  // Steps
  const [steps,    setSteps]    = useState<Step[]>(initialData?.steps ?? [])
  const [editingStep, setEditingStep] = useState<number | null>(null)  // step id being edited
  const [stepTitle, setStepTitle] = useState('')
  const [stepDesc,  setStepDesc]  = useState('')
  const [addingStep, setAddingStep] = useState(false)
  const [newStepTitle, setNewStepTitle] = useState('')
  const [newStepDesc,  setNewStepDesc]  = useState('')

  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const slugEdited = useRef(mode === 'edit')

  function autoSlug(v: string) {
    return v.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  function handleNameChange(v: string) {
    setName(v)
    if (!slugEdited.current) setSlug(autoSlug(v))
  }

  // ── Step actions ────────────────────────────────────────────
  function startEditStep(s: Step) {
    setEditingStep(s.id)
    setStepTitle(s.title)
    setStepDesc(s.desc)
  }

  async function saveEditStep(s: Step) {
    if (!stepTitle.trim()) return
    const res = await fetch(`/api/admin/how-it-works/${pkgId}/steps/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: stepTitle.trim(), desc: stepDesc.trim() }),
    })
    const data = await res.json()
    setSteps(prev => prev.map(x => x.id === s.id ? { ...x, title: data.step.title, desc: data.step.desc ?? '' } : x))
    setEditingStep(null)
  }

  async function deleteStep(id: number) {
    if (!confirm('Xóa bước này?')) return
    await fetch(`/api/admin/how-it-works/${pkgId}/steps/${id}`, { method: 'DELETE' })
    const newSteps = steps.filter(s => s.id !== id).map((s, i) => ({ ...s, sortOrder: i }))
    setSteps(newSteps)
    if (newSteps.length > 0) {
      await fetch(`/api/admin/how-it-works/${pkgId}/steps/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newSteps.map(s => s.id) }),
      })
    }
  }

  async function moveStep(idx: number, dir: -1 | 1) {
    const newSteps = [...steps]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= newSteps.length) return
    ;[newSteps[idx], newSteps[swapIdx]] = [newSteps[swapIdx], newSteps[idx]]
    const reordered = newSteps.map((s, i) => ({ ...s, sortOrder: i }))
    setSteps(reordered)
    await fetch(`/api/admin/how-it-works/${pkgId}/steps/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: reordered.map(s => s.id) }),
    })
  }

  async function addStep() {
    if (!newStepTitle.trim() || !pkgId) return
    const res = await fetch(`/api/admin/how-it-works/${pkgId}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newStepTitle.trim(), desc: newStepDesc.trim() }),
    })
    const data = await res.json()
    setSteps(prev => [...prev, { ...data.step, desc: data.step.desc ?? '' }])
    setNewStepTitle('')
    setNewStepDesc('')
    setAddingStep(false)
  }

  // ── Suitable tags ────────────────────────────────────────────
  function addSuitable() {
    const v = suitInput.trim()
    if (!v || suitable.includes(v)) return
    setSuitable(prev => [...prev, v])
    setSuitInput('')
  }

  function removeSuitable(v: string) {
    setSuitable(prev => prev.filter(s => s !== v))
  }

  // ── Save package ─────────────────────────────────────────────
  async function handleSave() {
    if (!name.trim() || !slug.trim()) { setError('Tên và slug là bắt buộc'); return }
    setSaving(true); setError('')
    const body = { name: name.trim(), slug: slug.trim(), tagline, icon, price, hot, ctaLabel, ctaHref, suitable, status }
    const res = mode === 'new'
      ? await fetch('/api/admin/how-it-works', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch(`/api/admin/how-it-works/${pkgId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Lỗi lưu'); setSaving(false); return }

    if (mode === 'new') {
      router.push(`/admin/how-it-works/${data.package.id}/edit`)
    } else {
      router.refresh()
      setSaving(false)
    }
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-600">{mode === 'new' ? 'Thêm gói mới' : `Chỉnh sửa: ${initialData?.name}`}</h4>
          {mode === 'new' && <p className="text-muted small mb-0">Sau khi tạo, bạn có thể thêm các bước quy trình</p>}
        </div>
        <a href="/admin/how-it-works" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}>← Quay lại</a>
      </div>

      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <div className="row g-4">
        {/* ── Left: Package info ── */}
        <div className="col-lg-7">

          {/* Basic info */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Thông tin gói</div>
            <div className="row g-3">
              <div className="col-md-8">
                <label style={labelCls}>Tên gói <span style={{ color: '#dc2626' }}>*</span></label>
                <input style={inputCls} value={name} onChange={e => handleNameChange(e.target.value)} placeholder="VD: Gói Web cơ bản" />
              </div>
              <div className="col-md-4">
                <label style={labelCls}>Icon (emoji)</label>
                <input style={{ ...inputCls, fontSize: 22, textAlign: 'center' }} value={icon} onChange={e => setIcon(e.target.value)} placeholder="📦" maxLength={4} />
              </div>
              <div className="col-12">
                <label style={labelCls}>Slug <span style={{ color: '#dc2626' }}>*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <span style={{ padding: '9px 10px', background: 'var(--warm)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>/how-it-works#</span>
                  <input style={{ ...inputCls, borderRadius: '0 8px 8px 0' }} value={slug} onChange={e => { setSlug(e.target.value); slugEdited.current = true }} placeholder="goi-web-co-ban" />
                </div>
              </div>
              <div className="col-12">
                <label style={labelCls}>Tagline (mô tả ngắn)</label>
                <input style={inputCls} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="VD: Website đầy đủ — deploy xong là chạy luôn" />
              </div>
              <div className="col-md-6">
                <label style={labelCls}>Giá hiển thị</label>
                <input style={inputCls} value={price} onChange={e => setPrice(e.target.value)} placeholder="Từ 3.000.000đ" />
              </div>
              <div className="col-md-6">
                <label style={labelCls}>Trạng thái</label>
                <select style={inputCls} value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
              <div className="col-12">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: hot ? 'var(--accent-light)' : 'var(--bg)', border: `1px solid ${hot ? 'var(--accent-mid)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', transition: 'all .15s' }}
                  onClick={() => setHot(!hot)}>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: hot ? 'var(--accent)' : 'var(--border)', position: 'relative', transition: 'all .2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: hot ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: hot ? 'var(--accent)' : 'var(--text)' }}>Gói phổ biến nhất</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Hiển thị badge &quot;PHỔ BIẾN NHẤT&quot; phía trên gói</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Nút kêu gọi hành động (CTA)</div>
            <div className="row g-3">
              <div className="col-md-5">
                <label style={labelCls}>Tên nút</label>
                <input style={inputCls} value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} placeholder="VD: Đặt hàng ngay" />
              </div>
              <div className="col-md-7">
                <label style={labelCls}>Đường dẫn</label>
                <input style={inputCls} value={ctaHref} onChange={e => setCtaHref(e.target.value)} placeholder="/templates hoặc /contact" />
              </div>
            </div>
          </div>

          {/* Suitable for */}
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Phù hợp với</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>Mỗi mục hiển thị dưới dạng badge ✓ ở cuối section gói</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {suitable.map(s => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, color: 'var(--text)' }}>
                  ✓ {s}
                  <button onClick={() => removeSuitable(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 13, padding: 0, lineHeight: 1 }}>×</button>
                </span>
              ))}
              {suitable.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Chưa có mục nào</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...inputCls, flex: 1 }} value={suitInput} onChange={e => setSuitInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSuitable())}
                placeholder="VD: Không rành kỹ thuật" />
              <button onClick={addSuitable} style={{ padding: '9px 16px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-mid)', borderRadius: 8, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Thêm</button>
            </div>
          </div>
        </div>

        {/* ── Right: Steps ── */}
        <div className="col-lg-5">
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Bước quy trình</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
              {mode === 'new' ? 'Lưu gói trước rồi mới thêm được bước' : `${steps.length} bước · Kéo nút ▲▼ để sắp xếp`}
            </div>

            {mode === 'edit' && (
              <>
                {/* Steps list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {steps.map((s, idx) => (
                    <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      {editingStep === s.id ? (
                        /* Edit mode */
                        <div style={{ padding: '12px 14px', background: 'var(--accent-light)' }}>
                          <input style={{ ...inputCls, marginBottom: 8 }} value={stepTitle} onChange={e => setStepTitle(e.target.value)} placeholder="Tên bước" autoFocus />
                          <textarea rows={3} style={{ ...inputCls, resize: 'vertical', marginBottom: 8 }} value={stepDesc} onChange={e => setStepDesc(e.target.value)} placeholder="Mô tả bước này..." />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => saveEditStep(s)} style={{ flex: 1, padding: '7px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>Lưu</button>
                            <button onClick={() => setEditingStep(null)} style={{ padding: '7px 14px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>Hủy</button>
                          </div>
                        </div>
                      ) : (
                        /* View mode */
                        <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                            <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} style={{ width: 22, height: 20, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: idx === 0 ? .4 : 1 }}>▲</button>
                            <button onClick={() => moveStep(idx, 1)} disabled={idx === steps.length - 1} style={{ width: 22, height: 20, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 10, opacity: idx === steps.length - 1 ? .4 : 1 }}>▼</button>
                          </div>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{s.desc}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button onClick={() => startEditStep(s)} style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-2)', background: 'var(--bg)' }}>Sửa</button>
                            <button onClick={() => deleteStep(s.id)} style={{ padding: '4px 8px', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#dc2626', background: '#fef2f2' }}>✕</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add step form */}
                {addingStep ? (
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                    <input style={{ ...inputCls, marginBottom: 8 }} value={newStepTitle} onChange={e => setNewStepTitle(e.target.value)} placeholder="Tên bước *" autoFocus />
                    <textarea rows={3} style={{ ...inputCls, resize: 'vertical', marginBottom: 8 }} value={newStepDesc} onChange={e => setNewStepDesc(e.target.value)} placeholder="Mô tả bước này..." />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={addStep} disabled={!newStepTitle.trim()} style={{ flex: 1, padding: '8px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, cursor: newStepTitle.trim() ? 'pointer' : 'not-allowed', opacity: newStepTitle.trim() ? 1 : .5 }}>+ Thêm bước</button>
                      <button onClick={() => { setAddingStep(false); setNewStepTitle(''); setNewStepDesc('') }} style={{ padding: '8px 14px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingStep(true)}
                    style={{ width: '100%', padding: '10px', border: '1px dashed var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-2)', background: 'transparent', cursor: 'pointer' }}>
                    + Thêm bước quy trình
                  </button>
                )}
              </>
            )}

            {mode === 'new' && (
              <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: 10, textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
                Lưu gói trước → sẽ có thể thêm bước tại đây
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <a href="/admin/how-it-works" style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>Hủy</a>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: '10px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
          {saving ? 'Đang lưu...' : mode === 'new' ? 'Tạo gói' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  )
}
