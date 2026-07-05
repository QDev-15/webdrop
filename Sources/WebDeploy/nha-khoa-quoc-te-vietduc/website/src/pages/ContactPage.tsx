import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

const BRANCHES = [
  { id: 'hcm', label: 'TP.HCM',    addrKey: 'branch_hcm_address', phoneKey: 'branch_hcm_phone' },
  { id: 'hn',  label: 'Hà Nội',    addrKey: 'branch_hn_address',  phoneKey: 'branch_hn_phone'  },
  { id: 'dn',  label: 'Đà Nẵng',   addrKey: 'branch_dn_address',  phoneKey: 'branch_dn_phone'  },
  { id: 'ct',  label: 'Cần Thơ',   addrKey: 'branch_ct_address',  phoneKey: 'branch_ct_phone'  },
  { id: 'nt',  label: 'Nha Trang', addrKey: 'branch_nt_address',  phoneKey: 'branch_nt_phone'  },
]

export default function ContactPage() {
  const { settings } = useSite()
  const [activeBranch, setActiveBranch] = useState('hcm')
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    setStatus('loading')
    try {
      await api.post('/public/contact', form)
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  const branch = BRANCHES.find(b => b.id === activeBranch)!
  const branchAddr  = settings[branch.addrKey]  || settings.site_address || '123 Nguyễn Huệ, Q.1'
  const branchPhone = settings[branch.phoneKey] || settings.site_phone   || '1900 1234'

  return (
    <>
      <section className="vd-page-hero">
        <div className="wd-container">
          <div className="vd-ph-inner">
            <div className="vd-ph-crumb">
              <Link to="/">Trang chủ</Link>
              <span>›</span>
              <span>Liên hệ</span>
            </div>
            <h1 className="vd-ph-title">Liên Hệ <em>Việt Đức</em></h1>
            <p className="vd-ph-sub">{BRANCHES.length} chi nhánh trên toàn quốc — luôn có mặt phục vụ bạn.</p>
          </div>
        </div>
      </section>

      <section className="vd-sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            {/* Left: contact info + branch tabs */}
            <div className="col-lg-5" data-reveal="true">
              {/* Contact basics */}
              <div style={{ marginBottom: 40 }}>
                <div className="vd-eyebrow" style={{ marginBottom: 12 }}>Thông Tin Chung</div>
                {[
                  { icon: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z', label: 'Hotline', value: settings.site_phone || '1900 1234' },
                  { icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', label: 'Email', value: settings.site_email || 'contact@vietduc.vn' },
                  { icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z', label: 'Giờ làm việc', value: settings.working_hours || 'T2-T7: 8:00-20:00' },
                ].map(item => (
                  <div key={item.label} className="vd-contact-info-item">
                    <div className="vd-ci-icon">
                      <svg viewBox="0 0 24 24"><path d={item.icon} /></svg>
                    </div>
                    <div>
                      <div className="vd-ci-label">{item.label}</div>
                      <div className="vd-ci-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Branch tabs */}
              <div>
                <div className="vd-eyebrow" style={{ marginBottom: 16 }}>Chi Nhánh</div>
                <div className="vd-branch-tab-list">
                  {BRANCHES.map(b => (
                    <button
                      key={b.id}
                      className={`vd-branch-tab${activeBranch === b.id ? ' active' : ''}`}
                      onClick={() => setActiveBranch(b.id)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '20px', background: 'var(--accent-pale)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>
                    Chi Nhánh {branch.label}
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 8 }}>{branchAddr}</div>
                  <a href={`tel:${branchPhone.replace(/\s/g, '')}`} style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{branchPhone}</a>
                </div>

                {/* Map */}
                <div className="vd-map-box" style={{ marginTop: 16 }}>
                  {settings.map_embed ? (
                    <iframe
                      src={settings.map_embed}
                      width="100%" height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Google Map"
                    />
                  ) : (
                    <div className="vd-map-placeholder">
                      <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      Bản đồ sẽ hiển thị ở đây
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="col-lg-7" data-reveal="true" data-delay="1">
              {status === 'ok' ? (
                <div style={{ textAlign: 'center', padding: '60px 32px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
                  <h2 className="vd-h2">Cảm ơn đã liên hệ!</h2>
                  <p className="vd-lead center" style={{ marginTop: 12 }}>Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="vd-h2" style={{ marginBottom: 8 }}>Gửi Tin Nhắn</h2>
                  <p className="vd-lead" style={{ marginBottom: 32, fontSize: 14 }}>Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.</p>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="ct-name">Họ và tên *</label>
                        <input id="ct-name" className="vd-form-input" placeholder="Nguyễn Văn A" value={form.name} onChange={e => set('name', e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="ct-phone">Số điện thoại</label>
                        <input id="ct-phone" className="vd-form-input" placeholder="0901 234 567" value={form.phone} onChange={e => set('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="ct-email">Email</label>
                        <input id="ct-email" type="email" className="vd-form-input" placeholder="example@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="ct-subject">Chủ đề</label>
                        <input id="ct-subject" className="vd-form-input" placeholder="Hỏi về dịch vụ Implant..." value={form.subject} onChange={e => set('subject', e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="vd-form-group">
                        <label className="vd-form-label" htmlFor="ct-msg">Nội dung *</label>
                        <textarea id="ct-msg" className="vd-form-textarea" rows={6} placeholder="Nội dung cần tư vấn, câu hỏi hoặc yêu cầu..." value={form.message} onChange={e => set('message', e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  {status === 'err' && (
                    <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>Có lỗi xảy ra. Vui lòng thử lại.</p>
                  )}

                  <button type="submit" className="vd-btn vd-btn-primary vd-btn-block vd-btn-lg" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                  </button>
                  <p className="vd-form-note">Chúng tôi đọc và trả lời mọi tin nhắn trong 24 giờ</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
