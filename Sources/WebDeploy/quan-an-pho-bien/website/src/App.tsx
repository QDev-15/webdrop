import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { api } from './api/client'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import Menu from './components/Menu'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import { useDocumentMeta } from './hooks/useDocumentMeta'

// ── Site Context ──────────────────────────────────────────────────────────────

export interface Settings { [key: string]: string }

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

interface SiteContextType {
  settings: Settings
  slides: HeroSlide[]
  loaded: boolean
}

const SiteContext = createContext<SiteContextType>({ settings: {}, slides: [], loaded: false })
export const useSite = () => useContext(SiteContext)

// ── Pages ─────────────────────────────────────────────────────────────────────

function HomePage() {
  const { settings, slides } = useSite()

  useDocumentMeta({
    title: settings.meta_title || 'Quán Ăn Phở Bình Dân — Ngon, Rẻ, Nhanh',
    description: settings.meta_description || 'Phở, cơm tấm, bún bò, bánh mì và nhiều món Việt ngon từ 20.000đ. Mở cửa 6:00 – 22:00 hàng ngày.',
  })

  return (
    <>
      <HeroSlider slides={slides} settings={settings} />

      {/* Daily specials */}
      <section className="daily-section">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-end mb-4 reveal">
            <div>
              <div className="eyebrow">Đặc biệt hôm nay</div>
              <h2 className="sec-title mb-0">Món ngon <em>mỗi ngày</em></h2>
            </div>
            <a href="/thuc-don" className="btn-ghost d-none d-md-inline-block">Xem tất cả →</a>
          </div>
          <Menu mode="daily" />
          <div className="text-center mt-4 d-md-none reveal">
            <a href="/thuc-don" className="btn-ghost">Xem toàn bộ thực đơn →</a>
          </div>
        </div>
      </section>

      {/* Quick Menu Preview */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <Menu mode="preview" />
        </div>
      </section>

      {/* Story */}
      <section className="story-sec">
        <div className="wd-container">
          <About />
        </div>
      </section>

      {/* 4 Reasons */}
      <section className="reasons-sec">
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Tại sao khách yêu</div>
            <h2 className="sec-title">4 lý do khách <em>quay lại hoài</em></h2>
          </div>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="reason-item reveal reveal-d1">
                <div className="ri-icon">😋</div>
                <div className="ri-title">Ngon thật sự</div>
                <div className="ri-text">Nước dùng ninh tươi mỗi ngày, không bột ngọt, không đường phụ. Vị thật của nguyên liệu.</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="reason-item reveal reveal-d2">
                <div className="ri-icon">💰</div>
                <div className="ri-title">Giá thật rẻ</div>
                <div className="ri-text">Từ 20.000đ đã no căng. Sinh viên, công nhân, dân văn phòng — ai cũng ăn được.</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="reason-item reveal reveal-d3">
                <div className="ri-icon">✨</div>
                <div className="ri-title">Sạch tuyệt đối</div>
                <div className="ri-text">Bếp ăn dọn sạch 3 lần/ngày. Rau củ rửa kỹ nhiều lần. Dụng cụ tiệt trùng hàng ngày.</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="reason-item reveal" style={{ transitionDelay: '.32s' }}>
                <div className="ri-icon">⚡</div>
                <div className="ri-title">Nhanh khỏi nói</div>
                <div className="ri-text">Order xong 5 phút là có tô. Không để khách đợi — đặc biệt giờ cao điểm.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Đánh giá Google Maps</div>
            <h2 className="sec-title">Khách nói <em>gì về quán</em></h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Location strip */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(48px,6vw,72px) 0' }}>
        <div className="wd-container">
          <div className="row g-4 reveal">
            <div className="col-6 col-md-3">
              <div className="loc-item" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📍</div>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Địa chỉ</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>{settings.site_address || '123 Đường Nguyễn Trãi, Q.5, TP.HCM'}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="loc-item" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🕐</div>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Giờ mở cửa</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>6:00 – 22:00<br />Tất cả các ngày</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="loc-item" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📞</div>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Điện thoại</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>{settings.site_phone || '0901 234 567'}<br />Gọi / nhắn Zalo</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="loc-item" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🛵</div>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Giao hàng</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>Trong bán kính {settings.delivery_radius || '3km'}<br />Phí {settings.delivery_fee || 'từ 10.000đ'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">Bụng đói chưa? 🍜</h2>
          <p className="cta-sub">Ghé quán hoặc gọi ship về nhà — nhanh gọn, ngon đảm bảo.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <a href="/lien-he" className="btn-white">Gọi đặt món ngay →</a>
            <a href="/thuc-don" style={{ fontSize: 14, background: 'transparent', color: 'rgba(255,255,255,.7)', padding: '12px 26px', borderRadius: 9, border: '1px solid rgba(255,255,255,.3)', textDecoration: 'none', display: 'inline-block' }}>Xem thực đơn</a>
          </div>
        </div>
      </section>
    </>
  )
}

function MenuPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Thực đơn — ${settings.site_name || 'Quán Ăn Phở Bình Dân'}`,
    description: 'Thực đơn đầy đủ: phở, cơm tấm, bún bò Huế, bún riêu cua, bánh mì thịt — nấu tươi mỗi ngày, giá từ 20.000đ.',
  })

  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Menu · Thực đơn</div>
          <h1 className="ph-title">Thực đơn <em>hôm nay</em></h1>
          <p className="ph-sub">Nấu tươi mỗi ngày — nguyên liệu sạch, giá thật rẻ, phục vụ nhanh.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Menu mode="full" />
        </div>
      </section>
      <section style={{ background: 'var(--dark2)', padding: 'clamp(48px,7vw,80px) 0', textAlign: 'center' }}>
        <div className="wd-container reveal">
          <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>Gọi ngay để đặt món 🍜</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,.45)', marginBottom: 24 }}>Hoặc ghé trực tiếp — quán mở từ 6:00 sáng đến 22:00 tối</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a href="/lien-he" className="btn-accent">Gọi đặt món →</a>
            <a href="/cua-hang" className="btn-white">Xem địa chỉ quán</a>
          </div>
        </div>
      </section>
    </>
  )
}

function CuaHangPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Cửa hàng — ${settings.site_name || 'Quán Ăn Phở Bình Dân'}`,
    description: `Địa chỉ, giờ mở cửa và hình ảnh quán tại ${settings.site_address || '123 Đường Nguyễn Trãi, Q.5, TP.HCM'}.`,
  })

  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Cửa hàng</div>
          <h1 className="ph-title">Tìm đường <em>đến quán</em></h1>
          <p className="ph-sub">Mở cửa mỗi ngày từ 6 giờ sáng — ghé sớm để có chỗ ngồi đẹp nhất.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-4">
            <div className="col-lg-4 reveal">
              <div className="info-block mb-3">
                <div className="ib-label">Địa chỉ</div>
                <div className="ib-val" style={{ fontSize: 16 }}>{settings.site_address || '123 Đường Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh'}</div>
              </div>
              <div className="info-block mb-3">
                <div className="ib-label">Giờ mở cửa</div>
                <div style={{ marginTop: 4, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {(settings.working_hours || 'Thứ Hai – Thứ Sáu: 6:00 – 22:00 | Thứ Bảy: 6:00 – 22:30 | Chủ Nhật: 6:00 – 21:00')
                    .split('|').map((h, i) => <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>{h.trim()}</div>)}
                </div>
              </div>
              <div className="info-block mb-3">
                <div className="ib-label">Liên hệ</div>
                <div className="ib-val">
                  <a href={`tel:${settings.site_phone?.replace(/\s/g, '') || '0901234567'}`} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 18, display: 'block', marginBottom: 4 }}>{settings.site_phone || '0901 234 567'}</a>
                  <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 300 }}>Gọi hoặc nhắn Zalo cùng số</span>
                </div>
              </div>
              <div className="info-block">
                <div className="ib-label">Giao hàng</div>
                <div className="ib-val" style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.6 }}>
                  Giao trong bán kính <strong style={{ color: 'var(--text)' }}>{settings.delivery_radius || '3km'}</strong><br />
                  Phí giao từ <strong style={{ color: 'var(--accent)' }}>{settings.delivery_fee || '10.000đ'}</strong><br />
                  Đặt qua điện thoại hoặc Zalo
                </div>
              </div>
            </div>
            <div className="col-lg-8 reveal reveal-d1">
              {settings.google_map_embed ? (
                <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}
                  dangerouslySetInnerHTML={{ __html: settings.google_map_embed }} />
              ) : (
                <div style={{ background: 'var(--warm2)', border: '1px solid var(--border)', borderRadius: 14, height: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>📍</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{settings.site_name || 'Quán Ăn Phở Bình Dân'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>{settings.site_address || '123 Đường Nguyễn Trãi, Q.5, TP.HCM'}</div>
                  <a href={settings.google_map_link || 'https://maps.google.com'} target="_blank" rel="noopener noreferrer" className="btn-accent" style={{ fontSize: 13, padding: '10px 22px' }}>Mở Google Maps →</a>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 reveal">
            <h3 style={{ fontSize: 'clamp(18px,2vw,22px)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.4px', marginBottom: 20 }}>Hình ảnh quán</h3>
            <Gallery />
          </div>
        </div>
      </section>
    </>
  )
}

function LienHePage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Quán Ăn Phở Bình Dân'}`,
    description: `Gọi điện hoặc nhắn Zalo để đặt món tại ${settings.site_name || 'Quán Ăn Phở Bình Dân'} — phục vụ nhanh, giao hàng tận nơi.`,
  })

  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ</div>
          <h1 className="ph-title">Gọi ngay — <em>phục vụ liền</em></h1>
          <p className="ph-sub">Đặt món, hỏi giờ, hoặc chỉ muốn hỏi hôm nay có món gì — gọi cho chúng tôi nhé!</p>
        </div>
      </div>
      <section style={{ background: 'var(--accent-light)', padding: 'clamp(48px,7vw,80px) 0', textAlign: 'center', borderBottom: '1px solid rgba(217,119,6,.15)' }}>
        <div className="wd-container reveal">
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--accent)', marginBottom: 12 }}>Gọi điện trực tiếp</div>
          <a href={`tel:${settings.site_phone?.replace(/\s/g, '') || '0901234567'}`} className="big-phone">{settings.site_phone || '0901 234 567'}</a>
          <div style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', marginTop: 12 }}>Hoặc nhắn Zalo cùng số — trả lời ngay trong giờ mở cửa</div>
        </div>
      </section>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-3 mb-5">
            <div className="col-md-3 col-6"><div className="contact-card reveal">
              <div className="cc-icon">📞</div>
              <div className="cc-label">Điện thoại</div>
              <div className="cc-val"><a href={`tel:${settings.site_phone?.replace(/\s/g, '') || '0901234567'}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{settings.site_phone || '0901 234 567'}</a></div>
              <div className="cc-sub">Gọi từ 6:00 – 22:00</div>
            </div></div>
            <div className="col-md-3 col-6"><div className="contact-card reveal reveal-d1">
              <div className="cc-icon">💬</div>
              <div className="cc-label">Zalo</div>
              <div className="cc-val" style={{ fontSize: 15 }}>{settings.social_zalo || settings.site_phone || '0901 234 567'}</div>
              <div className="cc-sub">Nhắn tin đặt món</div>
            </div></div>
            <div className="col-md-3 col-6"><div className="contact-card reveal reveal-d2">
              <div className="cc-icon">📍</div>
              <div className="cc-label">Địa chỉ</div>
              <div className="cc-val" style={{ fontSize: 14, lineHeight: 1.4 }}>{settings.site_address || '123 Đường Nguyễn Trãi'}</div>
              <div className="cc-sub">Bãi xe miễn phí</div>
            </div></div>
            <div className="col-md-3 col-6"><div className="contact-card reveal reveal-d3">
              <div className="cc-icon">🕐</div>
              <div className="cc-label">Giờ mở cửa</div>
              <div className="cc-val" style={{ fontSize: 15 }}>6:00 – 22:00</div>
              <div className="cc-sub">Tất cả các ngày</div>
            </div></div>
          </div>
          <div className="row g-4">
            <div className="col-lg-6 reveal">
              <Contact />
            </div>
            <div className="col-lg-6 reveal reveal-d1">
              {settings.google_map_embed ? (
                <div style={{ borderRadius: 14, overflow: 'hidden', height: 400 }}
                  dangerouslySetInnerHTML={{ __html: settings.google_map_embed }} />
              ) : (
                <div style={{ background: 'var(--warm2)', border: '1px solid var(--border)', borderRadius: 14, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>🗺</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{settings.site_name || 'Quán Ăn Phở Bình Dân'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, marginBottom: 18, lineHeight: 1.6, textAlign: 'center', padding: '0 20px' }}>{settings.site_address || '123 Đường Nguyễn Trãi, Q.5, TP.HCM'}</div>
                  <a href={settings.google_map_link || 'https://maps.google.com'} target="_blank" rel="noopener noreferrer" className="btn-accent" style={{ fontSize: 13, padding: '10px 22px' }}>Mở Google Maps →</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<never[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    }).finally(() => setLoaded(true))
  }, [])

  // Reveal observer — MutationObserver catches async-rendered elements (Menu, Gallery, Testimonials)
  useEffect(() => {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })

    const observeEl = (el: Element) => {
      if (!el.classList.contains('visible')) ro.observe(el)
    }

    document.querySelectorAll<Element>('.reveal:not(.visible)').forEach(observeEl)

    const mo = new MutationObserver(mutations => {
      for (const mut of mutations) {
        mut.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.classList.contains('reveal')) observeEl(node)
          node.querySelectorAll<Element>('.reveal:not(.visible)').forEach(observeEl)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { ro.disconnect(); mo.disconnect() }
  }, [])

  // Nav scroll
  useEffect(() => {
    const nav = document.getElementById('nav')
    if (!nav || !nav.classList.contains('transparent')) return
    const handler = () => nav.classList.toggle('transparent', window.scrollY < 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [loaded])

  const zaloNum = settings.social_zalo || settings.site_phone || ''

  return (
    <SiteContext.Provider value={{ settings, slides, loaded }}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thuc-don" element={<MenuPage />} />
        <Route path="/cua-hang" element={<CuaHangPage />} />
        <Route path="/lien-he" element={<LienHePage />} />
      </Routes>
      <Footer />
      {zaloNum && (
        <div className="zf">
          <div className="zf-tip">Đặt món qua Zalo</div>
          <a href={`https://zalo.me/${zaloNum.replace(/\s/g, '')}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
        </div>
      )}
    </SiteContext.Provider>
  )
}
