import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { renderTitle } from '../utils/text'

interface FormState {
  name: string
  email: string
  project_type: string
  budget: string
  message: string
}

const emptyForm: FormState = { name: '', email: '', project_type: '', budget: '', message: '' }

export default function ContactPage() {
  const { settings } = useSite()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Đỗ Khánh Linh'} | Product Designer`,
    description: settings.contact_hero_sub,
  })

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSent(false)
    if (!form.name.trim() || !form.email.trim()) { setError('Tên và email không được để trống.'); return }
    setSending(true)
    try {
      await api.post('/public/contact', form)
      setSent(true)
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main>
      <section className="pux-page-hero">
        <span className="blob blob-a"></span>
        <span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="pux-crumb"><Link to="/">Trang chủ</Link> / Liên hệ</div>
          <div className="eyebrow eyebrow-light" data-reveal>{settings.contact_hero_eyebrow || 'Liên hệ'}</div>
          <h1 className="sec-title on-dark" style={{ maxWidth: 640 }} data-reveal>{renderTitle(settings.contact_hero_title || 'Cùng thiết kế *bước tiếp theo cho sản phẩm.*')}</h1>
          <p className="sec-sub on-dark" data-reveal data-reveal-d1>{settings.contact_hero_sub}</p>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-5" data-reveal>
              <div className="eyebrow">Thông tin liên hệ</div>
              <h2 className="sec-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>{renderTitle(settings.contact_info_title || 'Chọn cách *bạn thấy tiện nhất.*')}</h2>
              <div className="mt-4 d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>✉</div>
                  <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.6px' }}>Email</div><div style={{ fontSize: 14.5, color: 'var(--text)', fontWeight: 600 }}>{settings.site_email}</div></div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>📞</div>
                  <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.6px' }}>Điện thoại / Zalo</div><div style={{ fontSize: 14.5, color: 'var(--text)', fontWeight: 600 }}>{settings.site_phone}</div></div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gold-light)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>📍</div>
                  <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.6px' }}>Địa điểm</div><div style={{ fontSize: 14.5, color: 'var(--text)', fontWeight: 600 }}>{settings.site_address}</div></div>
                </div>
                {settings.availability_status && (
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>●</div>
                    <div><div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.6px' }}>Trạng thái</div><div style={{ fontSize: 14.5, color: 'var(--accent)', fontWeight: 600 }}>{settings.availability_status}</div></div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 12 }}>Mạng xã hội</div>
                <div className="d-flex gap-2">
                  {settings.social_linkedin && <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="pux-social-link" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-2)' }}>in</a>}
                  {settings.social_behance && <a href={settings.social_behance} target="_blank" rel="noopener noreferrer" className="pux-social-link" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-2)' }}>be</a>}
                  {settings.social_dribbble && <a href={settings.social_dribbble} target="_blank" rel="noopener noreferrer" className="pux-social-link" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-2)' }}>dr</a>}
                  {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="pux-social-link" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-2)' }}>fb</a>}
                </div>
              </div>
            </div>

            <div className="col-lg-7" data-reveal data-reveal-d1>
              <div className="pux-card p-4 p-md-5 pux-form">
                {sent && <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ Đã gửi — Linh sẽ phản hồi trong 24h</div>}
                {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="puxName">Tên của bạn</label>
                      <input id="puxName" type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="puxEmail">Email</label>
                      <input id="puxEmail" type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@congty.com" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="puxProjectType">Loại dự án</label>
                      <select id="puxProjectType" className="form-select" value={form.project_type} onChange={e => set('project_type', e.target.value)}>
                        <option value="">-- Chọn loại dự án --</option>
                        <option>UX Audit</option>
                        <option>Mobile App Design (Fintech/E-commerce)</option>
                        <option>SaaS Dashboard Design</option>
                        <option>Design System</option>
                        <option>Tư vấn Product Design</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="puxBudget">Ngân sách dự kiến</label>
                      <select id="puxBudget" className="form-select" value={form.budget} onChange={e => set('budget', e.target.value)}>
                        <option value="">-- Chọn khoảng ngân sách --</option>
                        <option>Dưới 15 triệu</option>
                        <option>15 – 40 triệu</option>
                        <option>40 – 90 triệu</option>
                        <option>Trên 90 triệu</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="puxMessage">Mô tả dự án</label>
                      <textarea id="puxMessage" className="form-control" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Mô tả ngắn về sản phẩm, vấn đề bạn đang gặp và timeline mong muốn..." required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="pux-btn pux-btn-accent pux-btn-block" disabled={sending}>
                        {sending ? 'Đang gửi...' : 'Gửi yêu cầu →'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAPS */}
      {settings.map_embed && (
        <section className="sec-pad" style={{ paddingTop: 0 }}>
          <div className="wd-container">
            <div className="eyebrow" data-reveal>{settings.map_section_eyebrow || 'Vị trí'}</div>
            <h2 className="sec-title mb-4" data-reveal>{renderTitle(settings.map_section_title || 'Làm việc tại *TP. Hồ Chí Minh,* nhận dự án từ xa toàn quốc.')}</h2>
            <div style={{ height: 380, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(29,23,48,.1)', border: '1px solid var(--border)' }} data-reveal>
              <iframe src={settings.map_embed} loading="lazy" title="Vị trí làm việc" style={{ width: '100%', height: '100%', border: 0 }} referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
