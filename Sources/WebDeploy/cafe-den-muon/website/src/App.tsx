import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteProvider, useSite } from './contexts/SiteContext'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import Stats from './components/Stats'
import FeatureCards from './components/FeatureCards'
import FeaturedDrinks from './components/FeaturedDrinks'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import About from './components/About'
import Contact from './components/Contact'

// ─── Trang chủ ──────────────────────────────────────────────────────────────
function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'NOX Coffee — Cà Phê Đêm Muộn',
    description: settings.meta_description || settings.site_description,
  })
  return (
    <>
      <HeroSlider />

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Vì sao chọn NOX</div>
            <h2 className="sec-title">Được thiết kế cho <em>ca đêm</em></h2>
            <p className="sec-sub mx-auto">Không phải quán cà phê nào cũng hiểu người làm việc ban đêm cần gì — NOX thì có.</p>
          </div>
          <Stats raw={settings.home_stats} />
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Thức uống nổi bật</div>
            <h2 className="sec-title">Caffeine cho <em>ca đêm dài</em></h2>
            <p className="sec-sub mx-auto">Menu đêm được pha đậm hơn, ngọt hậu hơn — để bạn tỉnh táo mà không gắt bụng.</p>
          </div>
          <FeaturedDrinks />
          <div className="text-center mt-5 reveal">
            <a href="/thuc-don" className="btn-outline-accent">Xem toàn bộ thực đơn →</a>
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <div className="row align-items-center g-5 mb-5">
            <div className="col-lg-5 reveal">
              <div className="eyebrow">Dành riêng cho dân đêm</div>
              <h2 className="sec-title">Ai hay ghé <em>NOX</em>?</h2>
              <p className="sec-sub">Chúng tôi thiết kế không gian và menu xoay quanh 3 nhóm khách chính — không phải quán cà phê "chung chung" nào cũng làm vậy.</p>
            </div>
          </div>
          <FeatureCards raw={settings.home_features} />
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Không gian quán</div>
            <h2 className="sec-title">Ánh đèn <em>neon dịu</em>, giữ nhịp làm việc</h2>
            <p className="sec-sub mx-auto">Ba khu vực, một tông màu tối ấm — dễ tập trung, dễ thư giãn.</p>
          </div>
          <Gallery mode="preview" />
          <div className="text-center mt-5 reveal">
            <a href="/khong-gian" className="btn-accent">Khám phá toàn bộ không gian →</a>
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Khách nói gì</div>
            <h2 className="sec-title">Được tin tưởng bởi <em>dân cú đêm</em></h2>
          </div>
          <Testimonials />
        </div>
      </section>

      <section className="cta-sec reveal">
        <div className="cdm-container">
          <h2 className="cta-title">Giữ bàn cho <em>ca đêm</em> của bạn</h2>
          <p className="cta-sub">Đặt trước để chắc chắn có chỗ — đặc biệt vào mùa thi và cuối tuần.</p>
          <a href="/lien-he" className="btn-accent">Đặt bàn ngay →</a>
        </div>
      </section>
    </>
  )
}

// ─── Thực đơn ───────────────────────────────────────────────────────────────
function MenuPage() {
  useDocumentMeta({
    title: 'Thực đơn — NOX Cà Phê Đêm Muộn',
    description: 'Thực đơn NOX — espresso rang đậm, cold brew, trà đá xay và đồ ăn nhẹ đêm. Menu dành riêng cho ca làm việc và học tập muộn.',
  })
  return (
    <>
      <section className="page-hero">
        <div className="cdm-container">
          <div className="ph-eyebrow reveal">Thực đơn NOX</div>
          <h1 className="ph-title reveal reveal-d1">Menu cho <em>ca đêm dài</em></h1>
          <p className="ph-sub reveal reveal-d2">Cập nhật theo mùa, luôn rang đậm và pha đúng liều caffeine cho khung giờ khuya.</p>
        </div>
      </section>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <Menu />
        </div>
      </section>
    </>
  )
}

// ─── Không gian ─────────────────────────────────────────────────────────────
function KhongGianPage() {
  useDocumentMeta({
    title: 'Không gian — NOX Cà Phê Đêm Muộn',
    description: 'Khám phá không gian NOX về đêm — ánh đèn neon dịu, khu làm việc riêng, phòng học nhóm và quầy bar espresso mở đến 2 giờ sáng.',
  })
  return (
    <>
      <section className="page-hero">
        <div className="cdm-container">
          <div className="ph-eyebrow reveal">Không gian NOX</div>
          <h1 className="ph-title reveal reveal-d1">Ánh đèn <em>neon dịu</em>, giữ nhịp tập trung</h1>
          <p className="ph-sub reveal reveal-d2">Ba khu vực, một tông màu tối ấm — thiết kế riêng cho những giờ làm việc và học tập muộn.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Bốn khu vực chính</div>
            <h2 className="sec-title">Chọn góc <em>phù hợp với bạn</em></h2>
            <p className="sec-sub mx-auto">Mỗi khu vực một mục đích — làm việc cá nhân, học nhóm, gặp gỡ hay chỉ đơn giản là ngồi một mình với ly cà phê.</p>
          </div>
          <Gallery mode="areas" />
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Thư viện ảnh</div>
            <h2 className="sec-title">NOX vào <em>ban đêm</em></h2>
            <p className="sec-sub mx-auto">Một vài khoảnh khắc từ quán — ánh đèn ấm, ly cà phê nghi ngút khói, và những giờ tập trung.</p>
          </div>
          <Gallery mode="photos" />
        </div>
      </section>

      <section className="cta-sec reveal">
        <div className="cdm-container">
          <h2 className="cta-title">Đến thử <em>một đêm</em> ở NOX</h2>
          <p className="cta-sub">Ghé bất kỳ lúc nào từ 18:00 đến 2:00 sáng — không cần đặt trước cho khách lẻ.</p>
          <a href="/lien-he" className="btn-accent">Xem đường đi →</a>
        </div>
      </section>
    </>
  )
}

// ─── Giới thiệu ─────────────────────────────────────────────────────────────
function GioiThieuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Giới thiệu — NOX Cà Phê Đêm Muộn',
    description: 'Câu chuyện thương hiệu NOX — quán cà phê mở đến 2 giờ sáng, giờ giấc, đối tượng khách hàng và các câu hỏi thường gặp.',
  })
  return (
    <>
      <section className="page-hero">
        <div className="cdm-container">
          <div className="ph-eyebrow reveal">Câu chuyện NOX</div>
          <h1 className="ph-title reveal reveal-d1">Sinh ra cho <em>những giờ muộn</em></h1>
          <p className="ph-sub reveal reveal-d2">Từ một góc quán nhỏ mở khuya cho bạn bè làm freelance, đến một không gian dành riêng cho ai chưa muốn tắt đèn.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <About />
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Giờ mở cửa</div>
            <h2 className="sec-title">Sáng đèn khi <em>bạn cần nhất</em></h2>
            <p className="sec-sub mx-auto">Khác với đa số quán cà phê đóng cửa lúc 21–22h, NOX chọn khung giờ ngược lại — bắt đầu đông khách khi thành phố đã vắng.</p>
          </div>
          <Stats raw={settings.hours_stats} />
          {settings.hours_note && (
            <p className="text-center reveal mt-4" style={{ fontSize: 13, color: 'var(--text-3)' }}>{settings.hours_note}</p>
          )}
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <div className="text-center reveal mb-5 mx-auto" style={{ maxWidth: 640 }}>
            <div className="eyebrow">Bạn có phải khách của NOX?</div>
            <h2 className="sec-title">Ba kiểu người <em>hay ghé đây</em></h2>
          </div>
          <FeatureCards raw={settings.audience_features} />
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cdm-container">
          <div className="row g-5">
            <div className="col-lg-4 reveal">
              <div className="eyebrow">Câu hỏi thường gặp</div>
              <h2 className="sec-title">Cần biết gì trước <em>khi ghé NOX</em>?</h2>
              <p className="sec-sub">Nếu không tìm thấy câu trả lời bạn cần, cứ nhắn Zalo cho chúng tôi — phản hồi trong vài phút, kể cả sau nửa đêm.</p>
            </div>
            <div className="col-lg-8 reveal reveal-d1">
              <Faq />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-sec reveal">
        <div className="cdm-container">
          <h2 className="cta-title">Sẵn sàng cho <em>ca đêm</em> tiếp theo?</h2>
          <p className="cta-sub">Ghé NOX hoặc đặt bàn trước để chắc chắn có chỗ ngồi ưng ý.</p>
          <a href="/lien-he" className="btn-accent">Liên hệ đặt bàn →</a>
        </div>
      </section>
    </>
  )
}

// ─── Liên hệ ────────────────────────────────────────────────────────────────
function LienHePage() {
  useDocumentMeta({
    title: 'Liên hệ — NOX Cà Phê Đêm Muộn',
    description: 'Liên hệ NOX để đặt bàn, đặt phòng học nhóm, hoặc hỏi thông tin — mở cửa 18:00 đến 2 giờ sáng mỗi ngày.',
  })
  return (
    <>
      <section className="page-hero">
        <div className="cdm-container">
          <div className="ph-eyebrow reveal">Liên hệ NOX</div>
          <h1 className="ph-title reveal reveal-d1">Giữ bàn cho <em>đêm nay</em></h1>
          <p className="ph-sub reveal reveal-d2">Đặt trước qua form dưới đây hoặc nhắn Zalo — chúng tôi phản hồi trong vòng 15 phút, kể cả sau nửa đêm.</p>
        </div>
      </section>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container">
          <Contact />
        </div>
      </section>
    </>
  )
}

// ─── Pháp lý ────────────────────────────────────────────────────────────────
function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Chính sách bảo mật — NOX Cà Phê Đêm Muộn',
    description: 'Chính sách bảo mật thông tin khách hàng của NOX Coffee.',
  })
  return (
    <>
      <section className="page-hero">
        <div className="cdm-container">
          <div className="ph-eyebrow reveal">Pháp lý</div>
          <h1 className="ph-title reveal reveal-d1">Chính sách <em>bảo mật</em></h1>
          <p className="ph-sub reveal reveal-d2">Cập nhật lần cuối: {settings.legal_updated || '—'}</p>
        </div>
      </section>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container legal-content reveal" style={{ maxWidth: 820 }}
          dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }} />
      </section>
    </>
  )
}

function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Điều khoản sử dụng — NOX Cà Phê Đêm Muộn',
    description: 'Điều khoản sử dụng dịch vụ tại NOX Coffee.',
  })
  return (
    <>
      <section className="page-hero">
        <div className="cdm-container">
          <div className="ph-eyebrow reveal">Pháp lý</div>
          <h1 className="ph-title reveal reveal-d1">Điều khoản <em>sử dụng</em></h1>
          <p className="ph-sub reveal reveal-d2">Cập nhật lần cuối: {settings.legal_updated || '—'}</p>
        </div>
      </section>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cdm-container legal-content reveal" style={{ maxWidth: 820 }}
          dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }} />
      </section>
    </>
  )
}

// ─── Shell — reveal observer (IO+MO) + scroll-to-top khi đổi route ─────────
function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    )

    const observeNew = (root: ParentNode = document) => {
      root.querySelectorAll<Element>('.reveal:not(.visible)').forEach(el => io.observe(el))
    }

    const t = setTimeout(() => observeNew(), 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.classList.contains('reveal') && !node.classList.contains('visible')) {
            io.observe(node)
          }
          node.querySelectorAll<Element>('.reveal:not(.visible)').forEach(el => io.observe(el))
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
      <div className="zf">
        <div className="zf-tip">Liên hệ Zalo</div>
        <a href={`https://zalo.me/${settings.social_zalo || '0901234567'}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell />
      </SiteProvider>
    </BrowserRouter>
  )
}
