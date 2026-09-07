import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { api } from './api/client'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { useScrollToTop } from './hooks/useScrollToTop'
import { SiteProvider, useSite, type HeroSlide } from './contexts/SiteContext'

import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'

// ── AppShell — reveal observer toàn cục + scroll-to-top khi đổi route ──────────
function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

  useScrollToTop()

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const observeNew = (root: ParentNode = document) => {
      root.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    }

    const t = setTimeout(() => observeNew(), 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.hasAttribute('data-reveal') && !node.classList.contains('visible')) {
            io.observe(node)
          }
          node.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thuc-don" element={<MenuPage />} />
        <Route path="/khong-gian" element={<KhongGianPage />} />
        <Route path="/gioi-thieu" element={<GioiThieuPage />} />
        <Route path="/lien-he" element={<LienHePage />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  )
}

// ── FAQ — mục H, ≥6 câu qua <details>/<summary> (không phụ thuộc JS ngoài) ─────
const FAQS = [
  { q: 'Giá cà phê hạt tại xưởng tính như thế nào?', a: 'Giá theo trọng lượng (200g hoặc 500g) và vùng nguyên liệu — dao động từ 150.000đ đến 320.000đ cho gói 500g. Hạt càng hiếm (như Ethiopia nhập khẩu) giá càng cao. Xem đầy đủ tại trang Thực đơn, mục "Hạt Rang Mang Về".' },
  { q: 'Cà phê tại xưởng có nguồn gốc từ đâu?', a: 'Chủ yếu từ ba vùng: Cầu Đất (Đà Lạt), Khe Sanh (Quảng Trị) và Sơn La — thu mua trực tiếp từ nông trại. Ngoài ra có thêm một số lô hạt nhập khẩu theo mùa như Ethiopia Yirgacheffe.' },
  { q: 'Cách bảo quản cà phê hạt/bột sau khi mua?', a: 'Giữ trong túi zip kín có van khí, để nơi khô ráo, tránh ánh nắng trực tiếp và nhiệt độ cao. Nên dùng hết trong 2–4 tuần kể từ ngày rang (ghi trên bao bì) để giữ trọn hương vị. Không nên để trong tủ lạnh vì hơi ẩm sẽ ảnh hưởng đến hạt.' },
  { q: 'Có nhận đặt sỉ / bán buôn cho quán khác không?', a: 'Có. Chúng tôi hiện đang cung cấp hạt rang định kỳ cho hơn 15 quán cà phê đối tác. Số lượng từ 5kg/tháng trở lên sẽ có mức giá sỉ riêng — liên hệ trực tiếp qua trang Liên hệ để được tư vấn profile rang phù hợp với concept quán.' },
  { q: 'Có giao hàng tận nơi không? Phí giao ra sao?', a: 'Nội thành giao trong ngày, miễn phí cho đơn từ 300.000đ trở lên (dưới mức này phụ thu 20.000đ). Khu vực ngoại thành và tỉnh khác giao qua đối tác vận chuyển GHN/GHTK, phí tính theo khoảng cách thực tế.' },
  { q: 'Chính sách đổi trả nếu cà phê không đúng khẩu vị?', a: 'Đổi trong vòng 3 ngày kể từ ngày nhận hàng nếu túi chưa mở hoặc phát hiện lỗi từ phía xưởng (rang không đều, đóng gói hở van...). Trường hợp không hợp khẩu vị cá nhân, chúng tôi tư vấn đổi sang loại hạt/mức rang khác phù hợp hơn.' },
  { q: 'Có thể đặt lịch tham quan xưởng rang không?', a: 'Có. Khách lẻ có thể ghé tham quan khu rang bất cứ giờ mở cửa nào. Với nhóm từ 10 người trở lên hoặc muốn trải nghiệm cupping cùng barista, vui lòng đặt lịch trước ít nhất 1 ngày qua trang Liên hệ.' },
]

function Faq() {
  return (
    <section className="crx-sec-pad" style={{ background: 'var(--roast-light)' }}>
      <div className="crx-container">
        <div className="crx-sec-head" data-reveal>
          <div className="crx-eyebrow">Câu hỏi thường gặp</div>
          <h2 className="crx-sec-title">Những điều <em>khách hay hỏi</em></h2>
          <p className="crx-sec-sub crx-mx-auto">Nếu câu hỏi của bạn chưa có ở đây, đừng ngại nhắn tin qua trang Liên hệ.</p>
        </div>
        <div className="crx-faq-list" data-reveal data-reveal-d1>
          {FAQS.map((f, i) => (
            <details className="crx-faq-item" key={f.q} open={i === 0}>
              <summary>{f.q} <span className="crx-faq-icon">+</span></summary>
              <div className="crx-faq-a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pages ─────────────────────────────────────────────────────────────────────
function HomePage() {
  const { settings } = useSite()
  const [slides, setSlides] = useState<HeroSlide[]>([])

  useEffect(() => {
    api.get<HeroSlide[]>('/public/hero-slides').then(setSlides).catch(() => {})
  }, [])

  useDocumentMeta({
    title: settings.meta_title || `${settings.site_name || 'Mộc Rang'} Roastery — Xưởng Rang Cà Phê Đặc Sản`,
    description: settings.meta_description || 'Xưởng rang cà phê đặc sản — chọn hạt, rang và pha chế ngay tại chỗ từ nguyên liệu Cầu Đất, Khe Sanh, Sơn La.',
  })

  const pillars = [
    { icon: '🌾', title: 'Thu mua trực tiếp nông trại', desc: 'Bỏ qua thương lái trung gian, kết nối trực tiếp với vùng nguyên liệu Cầu Đất, Khe Sanh, Sơn La.' },
    { icon: '🔥', title: 'Rang mẻ nhỏ, kiểm soát chất lượng', desc: 'Mỗi mẻ rang đều được cupping trước khi đóng gói — chỉ mẻ đạt chuẩn mới lên kệ.' },
    { icon: '📦', title: 'Đóng gói giữ trọn hương vị', desc: 'Túi zip có van khí một chiều, ghi rõ ngày rang và vùng trồng trên từng bao bì.' },
  ]

  return (
    <>
      <HeroSlider slides={slides} />

      {/* TRIẾT LÝ NGẮN */}
      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Vì sao chọn chúng tôi</div>
            <h2 className="crx-sec-title">Ba điều <em>chúng tôi giữ đúng</em></h2>
          </div>
          <div className="row g-4">
            {pillars.map((p, i) => (
              <div className="col-md-4" key={p.title} data-reveal data-reveal-d1={i === 1 ? '' : undefined} data-reveal-d2={i === 2 ? '' : undefined}>
                <div className="crx-roast-icon" style={{ marginBottom: 10 }}>{p.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 400, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, margin: 0, fontWeight: 300 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Menu />
      <Gallery />
      <Testimonials />
      <Faq />

      {/* CTA */}
      <section className="crx-full-bleed">
        <div className="crx-container">
          <h2 className="crx-fb-title">Muốn nếm thử<br /><em>trước khi đặt sỉ?</em></h2>
          <p className="crx-fb-sub">Ghé xưởng để cupping trực tiếp cùng barista trước khi quyết định đặt hàng số lượng lớn.</p>
          <Link to="/lien-he" className="crx-btn crx-btn-accent">Liên hệ ngay</Link>
        </div>
      </section>
    </>
  )
}

function MenuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Thực đơn — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Thực đơn cà phê rang xay tại xưởng — hạt rang mang về, cà phê pha tại chỗ theo nhiều phương pháp.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Thực đơn</div>
          <h1 className="crx-ph-title">Từ hạt xanh<br /><em>đến ly cà phê trong tay bạn</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Mọi món trong thực đơn đều pha từ hạt rang tại xưởng — bạn có thể mua nguyên hạt mang về hoặc thưởng thức tại chỗ.</p>
        </div>
      </section>
      <Menu />
    </>
  )
}

function KhongGianPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Không gian — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Xưởng rang mở — khách có thể quan sát toàn bộ quá trình rang, pha chế ngay tại quầy.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Không gian</div>
          <h1 className="crx-ph-title">Xưởng rang mở —<br /><em>nhìn thấy từng công đoạn</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Không có gì giấu sau cánh cửa — khách có thể quan sát toàn bộ quá trình rang, pha chế ngay tại quầy.</p>
        </div>
      </section>
      <Gallery />
      <section className="crx-sec-pad" style={{ background: 'var(--roast-light)' }}>
        <div className="crx-container crx-mx-auto text-center" data-reveal style={{ maxWidth: 640 }}>
          <div className="crx-eyebrow">Trước khi bạn ghé</div>
          <h2 className="crx-sec-title" style={{ fontSize: 'clamp(24px,3.4vw,34px)' }}>Một xưởng rang <em>luôn mở cửa để tham quan</em></h2>
          <p className="crx-sec-sub crx-mx-auto" style={{ margin: '0 auto 22px' }}>Ghé bất cứ giờ mở cửa nào để xem quy trình chọn hạt và rang trực tiếp — hoặc đặt lịch cupping cùng barista.</p>
          <Link to="/gioi-thieu" className="crx-btn crx-btn-accent">Tìm hiểu câu chuyện xưởng</Link>
        </div>
      </section>
    </>
  )
}

function GioiThieuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Giới thiệu — ${settings.site_name || 'Mộc Rang'} Roastery | Câu Chuyện Xưởng Rang`,
    description: 'Câu chuyện thương hiệu — hành trình từ chọn hạt đến rang xay, cùng câu hỏi thường gặp về giá cả, nguồn gốc, bảo quản và đặt sỉ.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Giới thiệu</div>
          <h1 className="crx-ph-title">Câu chuyện của<br /><em>một xưởng rang nhỏ</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Bắt đầu từ một chiếc máy rang mẫu 1kg, đến nay chúng tôi vẫn giữ nguyên triết lý: rang mẻ nhỏ, kiểm soát chất lượng từng lô hạt.</p>
        </div>
      </section>
      <About />
      <Faq />
      <section className="crx-full-bleed">
        <div className="crx-container">
          <h2 className="crx-fb-title">Muốn nếm thử<br /><em>trước khi đặt sỉ?</em></h2>
          <p className="crx-fb-sub">Ghé xưởng để cupping trực tiếp cùng barista trước khi quyết định đặt hàng số lượng lớn.</p>
          <Link to="/lien-he" className="crx-btn crx-btn-accent">Liên hệ ngay</Link>
        </div>
      </section>
    </>
  )
}

function LienHePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Liên hệ để đặt hạt rang, đặt sỉ, đặt lịch tham quan xưởng hoặc góp ý về sản phẩm.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Liên hệ</div>
          <h1 className="crx-ph-title">Đặt hạt rang, đặt sỉ<br />hoặc <em>ghé thăm xưởng</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Điền thông tin bên dưới hoặc liên hệ trực tiếp qua điện thoại / Zalo — chúng tôi phản hồi trong vòng 30 phút giờ hành chính.</p>
        </div>
      </section>
      <Contact />
    </>
  )
}

function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Chính sách bảo mật thông tin khách hàng.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Pháp lý</div>
          <h1 className="crx-ph-title">Chính sách <em>bảo mật</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>
      <section className="crx-sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
        <div className="crx-container crx-mx-auto" data-reveal style={{ maxWidth: 720, fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>1. Thông tin chúng tôi thu thập</h4>
          <p>Khi bạn gửi yêu cầu đặt hạt rang, đặt sỉ hoặc liên hệ qua form trên website hoặc Zalo, chúng tôi thu thập các thông tin bạn chủ động cung cấp: họ tên, số điện thoại, email và nội dung yêu cầu.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>2. Mục đích sử dụng thông tin</h4>
          <p>Thông tin được sử dụng để xác nhận đơn hàng, tư vấn profile rang phù hợp và liên hệ khi cần thông báo về đơn đặt hạt/đặt sỉ. Chúng tôi không sử dụng thông tin khách hàng cho mục đích quảng cáo bên thứ ba.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>3. Bảo mật thông tin</h4>
          <p>Thông tin khách hàng được lưu trữ nội bộ, chỉ nhân viên phụ trách đặt hàng và giao hàng mới có quyền truy cập. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba khi chưa có sự đồng ý.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>4. Hình ảnh xưởng rang</h4>
          <p>Hình ảnh quy trình rang, sản phẩm và không gian xưởng có thể được sử dụng cho mục đích giới thiệu trên website và mạng xã hội. Nếu khách hàng xuất hiện rõ trong ảnh và không muốn công khai, vui lòng liên hệ để chúng tôi gỡ bỏ.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>5. Cookie website</h4>
          <p>Website sử dụng cookie cơ bản để ghi nhớ tùy chọn hiển thị và cải thiện trải nghiệm duyệt web. Không có cookie nào được dùng để theo dõi hành vi cho mục đích quảng cáo bên ngoài.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>6. Quyền của khách hàng</h4>
          <p>Bạn có quyền yêu cầu chúng tôi cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email {settings.site_email || 'hello@mocrang.coffee'}.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>7. Liên hệ</h4>
          <p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ {settings.site_email || 'hello@mocrang.coffee'} hoặc {settings.site_phone || '0901 234 567'}.</p>
        </div>
      </section>
    </>
  )
}

function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Điều khoản sử dụng dịch vụ đặt hạt rang, đặt sỉ và tham quan xưởng.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Pháp lý</div>
          <h1 className="crx-ph-title">Điều khoản <em>sử dụng</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>
      <section className="crx-sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
        <div className="crx-container crx-mx-auto" data-reveal style={{ maxWidth: 720, fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>1. Đặt hàng và thanh toán</h4>
          <p>Yêu cầu đặt hạt rang/đặt sỉ qua website hoặc Zalo được xác nhận trong vòng 30 phút giờ hành chính. Đơn hàng được xử lý sau khi khách xác nhận số lượng và địa chỉ giao hàng.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>2. Giao hàng</h4>
          <p>Nội thành giao trong ngày, miễn phí cho đơn từ 300.000đ trở lên (dưới mức này phụ thu 20.000đ). Khu vực ngoại thành và tỉnh khác giao qua đối tác vận chuyển GHN/GHTK, phí tính theo khoảng cách thực tế.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>3. Chính sách đổi trả</h4>
          <p>Đổi trong vòng 3 ngày kể từ ngày nhận hàng nếu túi chưa mở hoặc phát hiện lỗi từ phía xưởng (rang không đều, đóng gói hở van...). Trường hợp không hợp khẩu vị cá nhân, chúng tôi tư vấn đổi sang loại hạt/mức rang khác phù hợp hơn.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>4. Đặt sỉ / bán buôn</h4>
          <p>Số lượng từ 5kg/tháng trở lên áp dụng mức giá sỉ riêng theo thỏa thuận. Đối tác đặt hàng định kỳ vui lòng liên hệ trực tiếp để được tư vấn profile rang phù hợp với concept quán.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>5. Trách nhiệm khi tham quan xưởng</h4>
          <p>Khách tham quan xưởng rang vui lòng tuân thủ hướng dẫn an toàn tại khu vực máy rang. Chúng tôi không chịu trách nhiệm với thiệt hại phát sinh do khách tự ý vào khu vực không được phép.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>6. Sở hữu trí tuệ nội dung website</h4>
          <p>Toàn bộ nội dung, hình ảnh và thiết kế trên website thuộc quyền sở hữu của chúng tôi. Không sao chép, sử dụng lại cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>7. Liên hệ</h4>
          <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ {settings.site_email || 'hello@mocrang.coffee'} hoặc {settings.site_phone || '0901 234 567'}.</p>
        </div>
      </section>
    </>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SiteProvider>
      <AppShell />
    </SiteProvider>
  )
}
