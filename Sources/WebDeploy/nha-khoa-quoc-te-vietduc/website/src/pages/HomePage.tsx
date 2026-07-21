import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Service {
  id: number; name: string; description: string; tag: string; image: string; price: string; price_unit: string;
}
interface Testimonial {
  id: number; author_name: string; author_role: string; author_avatar: string; stars: number; content: string;
}

const HERO_IMGS = [
  'https://plus.unsplash.com/premium_photo-1674368232044-31d75efc09fa?w=800',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600',
  'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600',
  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200',
]

const USP = [
  { icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z', title: 'Chuẩn Quốc Tế', desc: 'Quy trình điều trị theo tiêu chuẩn JCI, trang thiết bị nhập khẩu từ châu Âu.' },
  { icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', title: 'Đội Ngũ Đa Quốc Gia', desc: '85+ bác sĩ trong nước và quốc tế, đào tạo tại Pháp, Mỹ, Hàn Quốc, Đức.' },
  { icon: 'M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 9-1 9-8 0 0 0 3-4 4 3-5 3.5-9.5-2-11.75.25.25.5.5.75.75C12 7 14 7 17 8z', title: 'Công Nghệ Hiện Đại', desc: 'CT Cone Beam 3D, iTero scan, Laser Biolase, robot Yomi — chính xác tuyệt đối.' },
  { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', title: 'Bảo Hành Uy Tín', desc: 'Implant bảo hành trọn đời, răng sứ bảo hành 10 năm — cam kết chất lượng tuyệt đối.' },
]

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({ title: settings.meta_title || settings.site_name || 'Nha khoa quốc tế', description: settings.meta_description })
  const [services, setServices]       = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(d => setServices(d.slice(0, 6))).catch(() => {})
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  const badge     = settings.hero_badge || 'Hệ Thống 12 Chi Nhánh'
  const title     = settings.hero_title || 'Nha Khoa Tiêu Chuẩn Quốc Tế'
  const subtitle  = settings.hero_subtitle || 'Đội Ngũ Bác Sĩ Đa Quốc Gia'
  const lead      = settings.hero_lead || 'Công nghệ hiện đại, đội ngũ bác sĩ đa quốc gia, chuẩn quốc tế trong từng chi tiết điều trị.'
  const ctaPri    = settings.hero_cta_primary || 'Đặt Lịch Khám Ngay'
  const ctaSec    = settings.hero_cta_secondary || 'Xem Dịch Vụ'
  const branches  = settings.stat_branches || '12'
  const doctors   = settings.stat_doctors || '85+'
  const patients  = settings.stat_patients || '120K+'
  const satisf    = settings.stat_satisfaction || '98%'

  return (
    <>
      {/* Hero */}
      <section className="vd-hero">
        <div className="wd-container">
          <div className="vd-hero-row">
            <div>
              <div className="vd-hero-badge" data-reveal="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {badge}
              </div>
              <h1 className="vd-hero-title" data-reveal="true" data-delay="1">
                {title} — <em>{subtitle}</em>
              </h1>
              <p className="vd-hero-sub" data-reveal="true" data-delay="2">{lead}</p>
              <div className="vd-hero-btns" data-reveal="true" data-delay="3">
                <Link to="/dat-lich" className="vd-btn vd-btn-primary vd-btn-lg">{ctaPri}</Link>
                <Link to="/dich-vu" className="vd-btn vd-btn-outline vd-btn-lg">{ctaSec}</Link>
              </div>
              <div className="vd-hero-trust" data-reveal="true" data-delay="4">
                <div className="vd-hero-trust-item">
                  <div className="vd-hero-trust-num">{branches}<span>+</span></div>
                  <div className="vd-hero-trust-label">Chi nhánh</div>
                </div>
                <div className="vd-hero-trust-item">
                  <div className="vd-hero-trust-num">{doctors}</div>
                  <div className="vd-hero-trust-label">Bác sĩ</div>
                </div>
                <div className="vd-hero-trust-item">
                  <div className="vd-hero-trust-num">{patients}</div>
                  <div className="vd-hero-trust-label">Bệnh nhân</div>
                </div>
                <div className="vd-hero-trust-item">
                  <div className="vd-hero-trust-num">{satisf}</div>
                  <div className="vd-hero-trust-label">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Magazine grid */}
            <div className="vd-hero-grid" data-reveal="true" data-delay="2">
              <img className="vd-hg-1" src={HERO_IMGS[0]} alt="Nha Khoa Việt Đức" loading="eager" />
              <img className="vd-hg-2" src={HERO_IMGS[1]} alt="Phòng khám" loading="lazy" />
              <img className="vd-hg-3" src={HERO_IMGS[2]} alt="Bác sĩ" loading="lazy" />
              <img className="vd-hg-4" src={HERO_IMGS[3]} alt="Trang thiết bị" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="vd-usp">
        <div className="wd-container">
          <div className="row g-0">
            {USP.map((u, i) => (
              <div className="col-lg-3 col-md-6 vd-usp-col" key={i}>
                <div className="vd-usp-item" data-reveal="true" data-delay={`${i + 1}`}>
                  <div className="vd-usp-icon">
                    <svg viewBox="0 0 24 24"><path d={u.icon} /></svg>
                  </div>
                  <div>
                    <div className="vd-usp-title">{u.title}</div>
                    <div className="vd-usp-desc">{u.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="vd-sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="vd-eyebrow center" data-reveal="true">Dịch Vụ</div>
            <h2 className="vd-h2" style={{ textAlign: 'center' }} data-reveal="true" data-delay="1">
              Giải Pháp Nha Khoa <em>Toàn Diện</em>
            </h2>
            <p className="vd-lead center" data-reveal="true" data-delay="2">
              Từ khám tổng quát, Implant, chỉnh nha đến răng sứ thẩm mỹ — tất cả trong một hệ thống.
            </p>
          </div>

          <div className="row g-4">
            {(services.length > 0 ? services : Array(6).fill(null)).map((s, i) => (
              <div className="col-lg-4 col-md-6" key={s?.id || i}>
                <div className="vd-svc-card" data-reveal="true" data-delay={`${(i % 3) + 1}`}>
                  <div className="vd-svc-thumb-wrap">
                    <img
                      className="vd-svc-thumb"
                      src={s?.image || `https://images.unsplash.com/photo-${1588776814546 + i}-1ffedbe47425?w=600`}
                      alt={s?.name || 'Dịch vụ'}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600' }}
                    />
                    {s?.tag && <span className="vd-svc-tag">{s.tag}</span>}
                  </div>
                  <div className="vd-svc-body">
                    <div className="vd-svc-name">{s?.name || 'Dịch vụ nha khoa'}</div>
                    <div className="vd-svc-desc">{s?.description || 'Dịch vụ chuyên nghiệp, công nghệ hiện đại.'}</div>
                    <Link to="/dich-vu" className="vd-svc-link">
                      Tìm hiểu thêm
                      <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }} data-reveal="true">
            <Link to="/dich-vu" className="vd-btn vd-btn-outline">Xem Tất Cả Dịch Vụ</Link>
          </div>
        </div>
      </section>

      {/* Stat bar */}
      <section className="vd-stat-bar">
        <div className="wd-container">
          <div className="row g-0">
            {[
              { num: branches, accent: '+', label: 'Chi Nhánh Toàn Quốc' },
              { num: doctors,  accent: '',  label: 'Bác Sĩ Chuyên Khoa' },
              { num: patients, accent: '',  label: 'Bệnh Nhân Tin Tưởng' },
              { num: satisf,   accent: '',  label: 'Hài Lòng Điều Trị' },
            ].map((s, i) => (
              <div className="col-md-3 col-6 vd-stat-divider" key={i}>
                <div className="vd-stat-item" data-reveal="true" data-delay={`${i + 1}`}>
                  <div className="vd-stat-num">{s.num}{s.accent && <span>{s.accent}</span>}</div>
                  <div className="vd-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="vd-sec-pad">
          <div className="wd-container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="vd-eyebrow center" data-reveal="true">Đánh Giá</div>
              <h2 className="vd-h2" style={{ textAlign: 'center' }} data-reveal="true" data-delay="1">
                Khách Hàng <em>Nói Gì</em>
              </h2>
            </div>
            <div className="row g-4">
              {testimonials.map((t, i) => (
                <div className="col-lg-4 col-md-6" key={t.id}>
                  <div className="vd-review-card" data-reveal="true" data-delay={`${i + 1}`}>
                    <div className="vd-review-stars">{'★'.repeat(t.stars)}</div>
                    <p className="vd-review-text">"{t.content}"</p>
                    <div className="vd-review-foot">
                      {t.author_avatar ? (
                        <img className="vd-review-av" src={t.author_avatar} alt={t.author_name} loading="lazy" />
                      ) : (
                        <div className="vd-review-av" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: 'var(--accent)' }}>
                          {t.author_name[0]}
                        </div>
                      )}
                      <div>
                        <div className="vd-review-name">{t.author_name}</div>
                        <div className="vd-review-role">{t.author_role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="vd-cta-section vd-sec-pad">
        <div className="wd-container">
          <div className="row align-items-center g-5" style={{ position: 'relative', zIndex: 1 }}>
            <div className="col-lg-6">
              <div className="vd-cta-inner">
                <div className="vd-eyebrow" style={{ color: 'rgba(255,255,255,.5)' }} data-reveal="true">Bắt Đầu Ngay Hôm Nay</div>
                <h2 className="vd-cta-title" data-reveal="true" data-delay="1">Đặt Lịch Khám — <br />Miễn Phí Tư Vấn</h2>
                <p className="vd-cta-sub" data-reveal="true" data-delay="2">
                  Đội ngũ chuyên gia sẵn sàng tư vấn và lập kế hoạch điều trị phù hợp với bạn.
                </p>
                <div className="vd-cta-contact" data-reveal="true" data-delay="3">
                  <div className="vd-cta-contact-item">
                    <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    {settings.site_phone || '1900 1234'}
                  </div>
                  <div className="vd-cta-contact-item">
                    <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
                    T2-T7: 8:00-20:00 | CN: 8:00-17:00
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-reveal="true" data-delay="2">
              <QuickBookingForm phone={settings.site_phone} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function QuickBookingForm({ phone }: { phone?: string }) {
  const [form, setForm] = useState({ fullname: '', phone: '', service: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullname || !form.phone) return
    setStatus('loading')
    try {
      await api.post('/public/bookings', form)
      setStatus('ok')
    } catch {
      setStatus('err')
    }
  }

  return (
    <div className="vd-form-card">
      {status === 'ok' ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <div className="vd-form-title">Đặt lịch thành công!</div>
          <p className="vd-form-sub">Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong thời gian sớm nhất.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="vd-form-title">Đặt Lịch Khám Miễn Phí</div>
          <p className="vd-form-sub">Điền thông tin — chúng tôi gọi lại xác nhận</p>
          <div className="vd-form-group">
            <label className="vd-form-label" htmlFor="qs-name">Họ và tên *</label>
            <input id="qs-name" className="vd-form-input" placeholder="Nguyễn Văn A" value={form.fullname} onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} required />
          </div>
          <div className="vd-form-group">
            <label className="vd-form-label" htmlFor="qs-phone">Số điện thoại *</label>
            <input id="qs-phone" className="vd-form-input" placeholder="0901 234 567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div className="vd-form-group">
            <label className="vd-form-label" htmlFor="qs-svc">Dịch vụ quan tâm</label>
            <select id="qs-svc" className="vd-form-select" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
              <option value="">-- Chọn dịch vụ --</option>
              <option>Khám tổng quát</option>
              <option>Implant nha khoa</option>
              <option>Chỉnh nha niềng răng</option>
              <option>Răng sứ thẩm mỹ</option>
              <option>Tẩy trắng răng</option>
              <option>Răng trẻ em</option>
            </select>
          </div>
          {status === 'err' && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>Có lỗi xảy ra. Vui lòng gọi {phone || '1900 1234'}.</p>}
          <button type="submit" className="vd-btn vd-btn-primary vd-btn-block" disabled={status === 'loading'}>
            {status === 'loading' ? 'Đang gửi...' : 'Đặt Lịch Ngay'}
          </button>
          <p className="vd-form-note">Miễn phí tư vấn — không ràng buộc</p>
        </form>
      )}
    </div>
  )
}
