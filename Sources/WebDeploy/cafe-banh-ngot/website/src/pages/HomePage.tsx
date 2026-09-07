import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderTitle } from '../utils/text'
import { api } from '../api/client'
import HeroSlider from '../components/HeroSlider'
import Menu, { type MenuItemData } from '../components/Menu'
import Testimonials from '../components/Testimonials'

interface BookingForm {
  name: string
  phone: string
  date: string
  subject: string
  message: string
}

const emptyBooking: BookingForm = { name: '', phone: '', date: '', subject: '', message: '' }

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Rosette Bakery & Cafe — Bánh Ngọt Thủ Công & Cà Phê Specialty',
    description: settings.meta_description,
  })

  const [featured, setFeatured] = useState<MenuItemData[]>([])
  const [booking, setBooking] = useState<BookingForm>(emptyBooking)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    api.get<MenuItemData[]>('/public/menu-items?featured=1').then(items => setFeatured(items.slice(0, 4))).catch(() => {})
  }, [])

  function setB<K extends keyof BookingForm>(k: K, v: BookingForm[K]) {
    setBooking(f => ({ ...f, [k]: v }))
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!booking.name.trim() || !booking.phone.trim()) return
    setSending(true)
    try {
      await api.post('/public/contact', booking)
      setSent(true)
      setBooking(emptyBooking)
      setTimeout(() => setSent(false), 6000)
    } catch { /* ignore */ }
    finally { setSending(false) }
  }

  const feat = [1, 2, 3].map(i => ({
    icon: settings[`home_feat${i}_icon`],
    title: settings[`home_feat${i}_title`],
    desc: settings[`home_feat${i}_desc`],
  }))

  const areas = [1, 2, 3].map(i => ({
    name: settings[`area${i}_name`],
    caption: settings[`area${i}_caption`],
    image: settings[`area${i}_image`],
  }))

  const faqs = [1, 2, 3, 4, 5, 6, 7].map(i => ({
    q: settings[`faq${i}_q`],
    a: settings[`faq${i}_a`],
  })).filter(f => f.q)

  return (
    <>
      <HeroSlider />

      {/* INTRO — FEATURE ROW */}
      <section className="cbn-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.home_feat_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.home_feat_title)}</h2>
            <p className="cbn-sec-sub mx-auto">{settings.home_feat_desc}</p>
          </div>
          <div className="row g-4">
            {feat.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className={`cbn-feature cbn-reveal cbn-reveal-d${i + 1}`}>
                  <div className="cbn-feature-icon">{f.icon}</div>
                  <div className="cbn-feature-title">{f.title}</div>
                  <div className="cbn-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÁNH & ĐỒ UỐNG NỔI BẬT */}
      <section className="cbn-sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.home_product_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.home_product_title)}</h2>
            <p className="cbn-sec-sub mx-auto">{settings.home_product_desc}</p>
          </div>
          <div className="row g-4">
            {featured.map((item, i) => (
              <div className="col-6 col-md-3" key={item.id}>
                <div className={`cbn-product-card cbn-reveal cbn-reveal-d${Math.min(i + 1, 3)}`}>
                  {item.image && <div className="cbn-pc-img"><img src={item.image} alt={item.name} loading="lazy" /></div>}
                  <div className="cbn-pc-body">
                    {item.badge && <span className="cbn-pc-tag">{item.badge}</span>}
                    <div className="cbn-pc-name">{item.name}</div>
                    <div className="cbn-pc-desc">{item.description}</div>
                    <div className="cbn-pc-price">{item.price != null ? item.price.toLocaleString('vi-VN') + 'đ' : ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5 cbn-reveal">
            <Link to="/menu" className="cbn-btn-ghost">Xem toàn bộ thực đơn →</Link>
          </div>
        </div>
      </section>

      {/* CÂU CHUYỆN THƯƠNG HIỆU */}
      <section className="cbn-sec-pad cbn-sec-dark cbn-story-sec">
        <div className="cbn-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 cbn-reveal">
              <div className="cbn-eyebrow">{settings.home_story_eyebrow}</div>
              <h2 className="cbn-sec-title">{renderTitle(settings.home_story_title)}</h2>
              <p className="cbn-story-text mb-4">{settings.home_story_text}</p>
              <div className="row g-4 mt-2">
                {[1, 2, 3].map(i => (
                  <div className="col-4 text-center" key={i}>
                    <div className="cbn-stat-num">{settings[`home_story_stat${i}_num`]}</div>
                    <div className="cbn-stat-label">{settings[`home_story_stat${i}_label`]}</div>
                  </div>
                ))}
              </div>
              <Link to="/gioi-thieu" className="cbn-btn-white mt-4 d-inline-block">Đọc câu chuyện đầy đủ →</Link>
            </div>
            <div className="col-lg-7 cbn-reveal cbn-reveal-d1">
              <div className="row g-3">
                <div className="col-6">
                  {settings.home_story_img1 && (
                    <img src={settings.home_story_img1} alt="Bếp trưởng bánh đang trang trí bánh kem" loading="lazy"
                      style={{ borderRadius: 20, width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
                  )}
                </div>
                <div className="col-6 d-flex flex-column gap-3">
                  {settings.home_story_img2 && (
                    <img src={settings.home_story_img2} alt="Nguyên liệu làm bánh tươi" loading="lazy"
                      style={{ borderRadius: 20, width: '100%', flex: 1, objectFit: 'cover', minHeight: 0 }} />
                  )}
                  {settings.home_story_img3 && (
                    <img src={settings.home_story_img3} alt="Kệ trưng bày bánh ngọt" loading="lazy"
                      style={{ borderRadius: 20, width: '100%', flex: 1, objectFit: 'cover', minHeight: 0 }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KHÔNG GIAN QUÁN — preview */}
      <section className="cbn-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.home_space_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.home_space_title)}</h2>
            <p className="cbn-sec-sub mx-auto">{settings.home_space_desc}</p>
          </div>
          <div className="row g-3">
            {areas.map((a, i) => (
              <div className="col-md-4" key={i}>
                <div className={`cbn-space-card cbn-reveal cbn-reveal-d${i + 1}`}>
                  {a.image && <img src={a.image} alt={a.name} loading="lazy" />}
                  <div className="cbn-sc-caption">
                    <div className="cbn-sc-name">{a.name}</div>
                    <div className="cbn-sc-sub">{a.caption}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5 cbn-reveal">
            <Link to="/khong-gian" className="cbn-btn-accent">Khám phá không gian →</Link>
          </div>
        </div>
      </section>

      {/* MENU NHANH */}
      <section className="cbn-sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cbn-container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-4 cbn-reveal">
              <div className="cbn-eyebrow">{settings.home_menu_eyebrow}</div>
              <h2 className="cbn-sec-title">{renderTitle(settings.home_menu_title)}</h2>
              <p className="cbn-sec-sub mb-4">{settings.home_menu_desc}</p>
              <Link to="/menu" className="cbn-btn-accent">Xem menu đầy đủ</Link>
            </div>
            <div className="col-lg-8 cbn-reveal cbn-reveal-d1">
              <Menu variant="home" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cbn-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.home_faq_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.home_faq_title)}</h2>
            <p className="cbn-sec-sub mx-auto">{settings.home_faq_desc}</p>
          </div>
          <div className="cbn-faq cbn-reveal">
            {faqs.map((f, i) => (
              <details className="cbn-faq-item" key={i} open={i === 0}>
                <summary>{f.q}</summary>
                <div className="cbn-faq-answer">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ĐÁNH GIÁ */}
      <section className="cbn-sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.home_testi_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.home_testi_title)}</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="cbn-cta-sec">
        <div className="cbn-container">
          <div className="cbn-eyebrow" style={{ color: 'rgba(255,255,255,.85)' }}>Đặt bánh & đặt chỗ</div>
          <h2 className="cbn-cta-title">{renderTitle(settings.home_cta_title)}</h2>
          <p className="cbn-cta-sub">{settings.home_cta_desc}</p>
          <Link to="/lien-he" className="cbn-btn-white">Đặt ngay hôm nay →</Link>
        </div>
      </section>

      {/* ĐẶT CHỖ / ĐẶT BÁNH NHANH */}
      <section className="cbn-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cbn-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 cbn-reveal">
              <div className="cbn-eyebrow">{settings.home_booking_eyebrow}</div>
              <h2 className="cbn-sec-title">{renderTitle(settings.home_booking_title)}</h2>
              <p className="cbn-sec-sub">{settings.home_booking_desc}</p>
              <ul className="mt-4" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(i => (
                  <li key={i} style={{ fontSize: 13.5, color: 'var(--text-2)', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16 }}>✓</span>{settings[`home_booking_feat${i}`]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-7 cbn-reveal cbn-reveal-d1">
              <div className="cbn-inline-form">
                <h3>Điền thông tin đặt chỗ / đặt bánh</h3>
                {sent && <div className="alert alert-success" style={{ marginBottom: 16 }}>Cảm ơn bạn! Rosette sẽ liên hệ xác nhận trong vòng 15 phút.</div>}
                <form onSubmit={handleBooking}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="cbn-form-label">Họ và tên</label>
                      <input type="text" className="cbn-form-control" placeholder="Nguyễn Văn A" value={booking.name} onChange={e => setB('name', e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="cbn-form-label">Số điện thoại</label>
                      <input type="tel" className="cbn-form-control" placeholder="0901 234 567" value={booking.phone} onChange={e => setB('phone', e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="cbn-form-label">Ngày đến</label>
                      <input type="date" className="cbn-form-control" value={booking.date} onChange={e => setB('date', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="cbn-form-label">Nhu cầu</label>
                      <select className="cbn-form-select" value={booking.subject} onChange={e => setB('subject', e.target.value)}>
                        <option value="">-- Chọn nhu cầu --</option>
                        <option>Đặt chỗ ngồi</option>
                        <option>Đặt bánh sinh nhật</option>
                        <option>Đặt tiệc trà nhóm</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="cbn-form-label">Ghi chú thêm</label>
                      <textarea className="cbn-form-control" rows={3} placeholder="Số người, loại bánh mong muốn, ngân sách..." value={booking.message} onChange={e => setB('message', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="cbn-btn-accent w-100" style={{ padding: 14, fontSize: 14 }} disabled={sending}>
                        {sending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
