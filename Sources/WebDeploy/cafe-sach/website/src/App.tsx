import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { api } from './api/client'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { useScrollToTop } from './hooks/useScrollToTop'
import './styles/template.css'

import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import Contact from './components/Contact'

// ── Site Context ──────────────────────────────────────────────────────────────
type Settings = Record<string, string>
interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  button_text: string
  button_link: string
}
interface SiteCtx {
  settings: Settings
  slides: Slide[]
  loading: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], loading: true })
export const useSite = () => useContext(SiteContext)

function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    }).catch(() => {/* dùng giá trị mặc định */}).finally(() => setLoading(false))
  }, [])

  return <SiteContext.Provider value={{ settings, slides, loading }}>{children}</SiteContext.Provider>
}

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
        <Route path="/menu" element={<MenuPage />} />
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

// ── Pages ─────────────────────────────────────────────────────────────────────
function HomePage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: settings['meta_title'] || 'Lặng Trang — Cà Phê Sách Yên Tĩnh',
    description: settings['meta_description'] || 'Lặng Trang — quán cà phê sách yên tĩnh, không gian đọc sách và làm việc tập trung giữa lòng thành phố.',
  })

  const pillars = [
    { num: '01', title: 'Mượn sách miễn phí', desc: 'Hơn 1.500 đầu sách đọc tại chỗ, không tính phí thuê — chỉ cần trả đúng vị trí trên kệ sau khi đọc xong.' },
    { num: '02', title: 'Không gian giữ yên lặng', desc: 'Âm lượng trò chuyện ở mức thì thầm, điện thoại để chế độ rung — một quy ước nhỏ để ai cũng được tập trung.' },
    { num: '03', title: 'Đủ điện, đủ wifi', desc: 'Ổ cắm điện tại mọi bàn, wifi tốc độ cao miễn phí — phù hợp cho cả đọc sách lẫn làm việc tập trung dài giờ.' },
  ]

  return (
    <>
      <HeroSlider />

      {/* TRIẾT LÝ NGẮN */}
      <section className="sec-pad sec-bg">
        <div className="csa-container">
          <div className="csa-sec-head center" data-reveal>
            <div className="csa-eyebrow center">Vì sao chọn Lặng Trang</div>
            <h2 className="csa-sec-title">Ba điều <em>chúng tôi giữ đúng</em></h2>
            <p className="csa-sec-sub">Không nhạc xập xình, không tiếng gọi món ồn ào — chỉ có bạn, một cuốn sách và một tách đồ uống ấm.</p>
          </div>
          <div className="row g-4">
            {pillars.map((p, i) => {
              const delayAttr = i === 0 ? { 'data-reveal-d1': '' } : i === 1 ? { 'data-reveal-d2': '' } : { 'data-reveal-d3': '' }
              return (
                <div className="col-md-4" key={p.num} data-reveal {...delayAttr}>
                  <div className="csa-eyebrow" style={{ marginBottom: 10 }}>{p.num}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 400, marginBottom: 10 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* THỨC UỐNG NỔI BẬT */}
      <Menu preview />

      {/* GÓC ĐỌC NỔI BẬT */}
      <Gallery preview />

      {/* TRIẾT LÝ — DARK QUOTE */}
      <section className="sec-pad sec-dark">
        <div className="csa-container">
          <div className="csa-quote" data-reveal>
            <div className="csa-eyebrow center on-dark">Triết lý của chúng tôi</div>
            <blockquote>"{settings['quote_content'] || 'Tri thức cần một không gian đủ tĩnh để lắng nghe chính nó — Lặng Trang được dựng lên để giữ cho sự tĩnh lặng ấy không bị đánh mất giữa phố xá.'}"</blockquote>
            <div className="csa-quote-name" style={{ color: '#fff' }}>{settings['quote_author'] || 'Người sáng lập Lặng Trang'}</div>
            <div className="csa-quote-role">{settings['quote_role'] || '2019 — nay'}</div>
          </div>
          <div className="csa-stats-grid mt-5" data-reveal data-reveal-d1>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_books_count'] || '1500'}</span>+</div>
              <div className="csa-stat-label">Đầu sách</div>
            </div>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_years_active'] || '6'}</span></div>
              <div className="csa-stat-label">Năm hoạt động</div>
            </div>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_hours_per_day'] || '12'}</span></div>
              <div className="csa-stat-label">Giờ mở cửa/ngày</div>
            </div>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_seats_count'] || '40'}</span></div>
              <div className="csa-stat-label">Chỗ ngồi yên tĩnh</div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <Faq />

      {/* CTA BAND */}
      <section className="csa-cta-band sec-surface">
        <div className="csa-container">
          <div data-reveal>
            <div className="csa-eyebrow center">Ghé thăm</div>
            <h2>Tìm một góc nhỏ <em>và một cuốn sách</em> của riêng bạn</h2>
            <a href="/lien-he" className="csa-btn csa-btn-accent">Đặt chỗ ngay</a>
          </div>
        </div>
      </section>
    </>
  )
}

function MenuPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Thực đơn — ${settings['site_name'] || 'Lặng Trang'}`,
    description: 'Thực đơn Lặng Trang — trà, cà phê nhẹ, đồ uống không caffeine buổi tối và bánh nhẹ, được chọn lọc để đồng hành cùng những buổi đọc sách dài.',
  })

  return (
    <>
      <section className="csa-page-hero sec-bg">
        <div className="csa-container">
          <div className="csa-eyebrow center" data-reveal>Thực đơn</div>
          <h1 data-reveal>Vị nhẹ nhàng <em>cho những trang sách</em></h1>
          <p data-reveal data-reveal-d1>Chúng tôi hạn chế caffeine mạnh và vị quá ngọt — để bạn đọc trọn một buổi chiều mà không thấy bồn chồn hay mất ngủ.</p>
        </div>
      </section>
      <Menu />
    </>
  )
}

function KhongGianPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Không gian — ${settings['site_name'] || 'Lặng Trang'}`,
    description: 'Khám phá không gian đọc sách yên tĩnh tại Lặng Trang — thư viện mini, góc cửa sổ, bàn làm việc chung và góc đọc riêng tư.',
  })

  return (
    <>
      <section className="csa-page-hero sec-bg">
        <div className="csa-container">
          <div className="csa-eyebrow center" data-reveal>Không gian</div>
          <h1 data-reveal>Nơi mỗi góc nhỏ <em>đều dành cho sự tĩnh lặng</em></h1>
          <p data-reveal data-reveal-d1>Ánh sáng tự nhiên, kệ sách chạm trần và những chiếc ghế được chọn để bạn ngồi được lâu — mỗi khu vực phục vụ một cách đọc khác nhau.</p>
        </div>
      </section>
      <Gallery full />
      <section className="sec-pad-sm sec-surface">
        <div className="csa-container-narrow text-center" data-reveal>
          <div className="csa-eyebrow center">Trước khi bạn ngồi xuống</div>
          <h2 className="csa-sec-title" style={{ fontSize: 'clamp(24px,3.4vw,34px)' }}>Một không gian <em>giữ chung sự yên tĩnh</em></h2>
          <p className="csa-sec-sub" style={{ margin: '0 auto 22px' }}>Âm lượng thì thầm, điện thoại để chế độ rung, và giữ gìn sách mượn — những quy tắc nhỏ để ai cũng được tập trung.</p>
          <a href="/gioi-thieu" className="csa-btn csa-btn-accent">Xem đầy đủ quy định</a>
        </div>
      </section>
    </>
  )
}

function GioiThieuPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Giới thiệu — ${settings['site_name'] || 'Lặng Trang'}`,
    description: 'Câu chuyện và triết lý của Lặng Trang — không gian cà phê sách yên tĩnh, cùng quy định giữ trật tự để mọi người đều được tập trung đọc và làm việc.',
  })

  const rules = [
    { title: 'Giữ âm lượng ở mức thì thầm', desc: 'Trò chuyện với âm lượng vừa đủ nghe trong nhóm — tránh nói to hoặc cười lớn làm ảnh hưởng đến bàn xung quanh.' },
    { title: 'Điện thoại để chế độ rung', desc: 'Vui lòng tắt âm thanh chuông và thông báo. Nếu cần nghe điện thoại lâu, xin di chuyển ra khu vực sảnh hoặc sân trong.' },
    { title: 'Không gọi video call trong khu đọc chính', desc: 'Các cuộc gọi video vui lòng thực hiện ở khu vực sân trong để không làm phiền người đang đọc hoặc làm việc.' },
    { title: 'Hạn chế mang đồ ăn có mùi mạnh', desc: 'Để giữ không gian dễ chịu cho việc đọc lâu, chúng tôi không khuyến khích mang đồ ăn từ bên ngoài có mùi nồng vào quán.' },
    { title: 'Giữ gìn sách mượn', desc: 'Sách mượn đọc tại chỗ xin được giữ gìn cẩn thận và trả đúng vị trí trên kệ sau khi đọc xong, để người khác dễ tìm lại.' },
    { title: 'Trẻ em cần có người lớn đi kèm', desc: 'Trẻ em dưới 8 tuổi vui lòng có người lớn đi cùng và giữ trật tự chung trong suốt thời gian ở quán.' },
  ]

  return (
    <>
      <section className="csa-page-hero sec-bg">
        <div className="csa-container">
          <div className="csa-eyebrow center" data-reveal>Giới thiệu</div>
          <h1 data-reveal>Một không gian <em>để chậm lại và đọc</em></h1>
          <p data-reveal data-reveal-d1>Lặng Trang không cố gắng trở thành nơi ồn ào nhất phố — chúng tôi chọn làm điều ngược lại.</p>
        </div>
      </section>

      <About />

      {/* STATS */}
      <section className="sec-pad sec-dark">
        <div className="csa-container">
          <div className="csa-stats-grid" data-reveal>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_founded_year'] || '2019'}</span></div>
              <div className="csa-stat-label">Năm thành lập</div>
            </div>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_books_count'] || '1500'}</span>+</div>
              <div className="csa-stat-label">Đầu sách</div>
            </div>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_seats_count'] || '40'}</span></div>
              <div className="csa-stat-label">Chỗ ngồi yên tĩnh</div>
            </div>
            <div>
              <div className="csa-stat-num"><span className="u">{settings['stat_club_sessions_per_year'] || '12'}</span></div>
              <div className="csa-stat-label">Buổi CLB đọc sách/năm</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUY ĐỊNH GIỮ YÊN LẶNG */}
      <section className="sec-pad sec-surface">
        <div className="csa-container-narrow">
          <div className="csa-sec-head center" data-reveal>
            <div className="csa-eyebrow center">Quy định chung</div>
            <h2 className="csa-sec-title">Giữ yên lặng <em>là giữ cho nhau</em></h2>
            <p className="csa-sec-sub">Một vài quy tắc nhỏ để không gian luôn phù hợp cho việc đọc và làm việc tập trung.</p>
          </div>
          <ul className="csa-rule-list" data-reveal data-reveal-d1>
            {rules.map(r => (
              <li key={r.title}>
                <div className="csa-rule-body">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="csa-cta-band sec-bg">
        <div className="csa-container">
          <div data-reveal>
            <div className="csa-eyebrow center">Ghé thăm</div>
            <h2>Đến và tìm <em>góc yên tĩnh của riêng bạn</em></h2>
            <a href="/lien-he" className="csa-btn csa-btn-accent">Đặt chỗ ngay</a>
          </div>
        </div>
      </section>
    </>
  )
}

function LienHePage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên hệ — ${settings['site_name'] || 'Lặng Trang'}`,
    description: 'Liên hệ Lặng Trang để đặt chỗ đọc yên tĩnh, hỏi về mượn sách, hoặc góp ý cho không gian cà phê sách của chúng tôi.',
  })

  return (
    <>
      <section className="csa-page-hero sec-bg">
        <div className="csa-container">
          <div className="csa-eyebrow center" data-reveal>Liên hệ</div>
          <h1 data-reveal>Đặt chỗ đọc <em>yên tĩnh của riêng bạn</em></h1>
          <p data-reveal data-reveal-d1>Đặt trước để đảm bảo có chỗ ngồi — đặc biệt vào cuối tuần và cho góc đọc riêng tư.</p>
        </div>
      </section>
      <Contact />
    </>
  )
}

function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings['site_name'] || 'Lặng Trang'}`,
    description: 'Chính sách bảo mật thông tin khách hàng của Lặng Trang Cà Phê Sách.',
  })
  return (
    <>
      <section className="csa-page-hero sec-bg">
        <div className="csa-container">
          <div className="csa-eyebrow center" data-reveal>Pháp lý</div>
          <h1 data-reveal>Chính sách <em>bảo mật</em></h1>
          <p data-reveal data-reveal-d1>Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>
      <section className="sec-pad sec-surface" style={{ paddingTop: 0 }}>
        <div className="csa-container-narrow" data-reveal style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>1. Thông tin chúng tôi thu thập</h4>
          <p>Khi bạn đặt chỗ qua form trên website, đăng ký mượn sách tại quầy, hoặc liên hệ qua Zalo, Lặng Trang thu thập các thông tin bạn chủ động cung cấp: họ tên, số điện thoại, email và ghi chú về nhu cầu chỗ ngồi.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>2. Mục đích sử dụng thông tin</h4>
          <p>Thông tin được sử dụng để xác nhận đặt chỗ, quản lý danh sách mượn sách và liên hệ khi cần thông báo thay đổi lịch. Chúng tôi không sử dụng thông tin khách hàng cho mục đích quảng cáo bên thứ ba.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>3. Bảo mật thông tin</h4>
          <p>Thông tin khách hàng được lưu trữ nội bộ, chỉ nhân viên trực tiếp phụ trách đặt chỗ và mượn sách mới có quyền truy cập. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba khi chưa có sự đồng ý.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>4. Hình ảnh không gian</h4>
          <p>Hình ảnh không gian, sự kiện câu lạc bộ đọc sách có thể được sử dụng cho mục đích giới thiệu trên website và mạng xã hội. Nếu khách hàng xuất hiện rõ trong ảnh và không muốn công khai, vui lòng liên hệ để chúng tôi gỡ bỏ.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>5. Cookie website</h4>
          <p>Website sử dụng cookie cơ bản để ghi nhớ tùy chọn hiển thị và cải thiện trải nghiệm duyệt web. Không có cookie nào được dùng để theo dõi hành vi cho mục đích quảng cáo bên ngoài.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>6. Quyền của khách hàng</h4>
          <p>Bạn có quyền yêu cầu chúng tôi cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email {settings['site_email'] || 'hello@langtrang.cafe'}.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>7. Liên hệ</h4>
          <p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ {settings['site_email'] || 'hello@langtrang.cafe'} hoặc {settings['site_phone'] || '0912 345 678'}.</p>
        </div>
      </section>
    </>
  )
}

function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings['site_name'] || 'Lặng Trang'}`,
    description: 'Điều khoản sử dụng dịch vụ đặt chỗ, mượn sách và quy định không gian tại Lặng Trang Cà Phê Sách.',
  })
  return (
    <>
      <section className="csa-page-hero sec-bg">
        <div className="csa-container">
          <div className="csa-eyebrow center" data-reveal>Pháp lý</div>
          <h1 data-reveal>Điều khoản <em>sử dụng</em></h1>
          <p data-reveal data-reveal-d1>Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>
      <section className="sec-pad sec-surface" style={{ paddingTop: 0 }}>
        <div className="csa-container-narrow" data-reveal style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>1. Đặt chỗ và hủy chỗ</h4>
          <p>Yêu cầu đặt chỗ qua website hoặc Zalo được xác nhận trong vòng 30 phút giờ hành chính. Chỗ đặt trước được giữ tối đa 15 phút kể từ giờ hẹn; sau thời gian này quán có quyền sắp xếp chỗ cho khách khác. Vui lòng báo hủy trước ít nhất 1 giờ nếu không thể đến.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>2. Mượn sách tại chỗ</h4>
          <p>Sách trong thư viện mini được mượn đọc tại chỗ miễn phí, không cần đặt cọc. Sách cần trả đúng vị trí trên kệ sau khi đọc xong. Trường hợp muốn mượn mang về, vui lòng đăng ký tại quầy và tuân theo thời hạn trả sách được thông báo.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>3. Quy định giữ trật tự không gian</h4>
          <p>Khách sử dụng dịch vụ đồng ý tuân thủ các quy định giữ yên lặng được niêm yết tại trang Giới thiệu: giữ âm lượng ở mức thì thầm, điện thoại chế độ rung, không gọi video call trong khu đọc chính. Quán có quyền nhắc nhở hoặc từ chối phục vụ nếu khách vi phạm nhiều lần và ảnh hưởng đến người khác.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>4. Trách nhiệm với tài sản chung</h4>
          <p>Khách hàng chịu trách nhiệm bồi thường nếu làm hư hỏng sách mượn, thiết bị hoặc nội thất của quán do lỗi cố ý hoặc bất cẩn nghiêm trọng. Quán không chịu trách nhiệm với tài sản cá nhân bị thất lạc trong khu vực chung.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>5. Sở hữu trí tuệ nội dung website</h4>
          <p>Toàn bộ nội dung, hình ảnh và thiết kế trên website thuộc quyền sở hữu của Lặng Trang. Không sao chép, sử dụng lại cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>6. Thay đổi điều khoản</h4>
          <p>Lặng Trang có thể cập nhật điều khoản sử dụng theo thời gian để phù hợp với vận hành thực tế. Phiên bản mới nhất luôn được đăng tải công khai tại trang này.</p>

          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>7. Liên hệ</h4>
          <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ {settings['site_email'] || 'hello@langtrang.cafe'} hoặc {settings['site_phone'] || '0912 345 678'}.</p>
        </div>
      </section>
    </>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell />
      </SiteProvider>
    </BrowserRouter>
  )
}
