import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSlider from '../components/HeroSlider'
import Menu from '../components/Menu'
import About from '../components/About'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function useRevealObserver(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = ref.current?.querySelectorAll<Element>('[data-reveal]:not(.visible)') ?? []
      const ro = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach((el: Element) => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [ref])
}

function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  useRevealObserver(ref)

  const features = [
    { icon: '🌾', title: 'Nguyên liệu sạch 100%', desc: 'Tuyển chọn từ 5h sáng, trực tiếp từ nông trại và chợ đầu mối uy tín. Không đông lạnh.' },
    { icon: '📜', title: 'Công thức gia truyền', desc: 'Mỗi món được nấu theo công thức lưu truyền qua 3 thế hệ. Không bột ngọt, không chất bảo quản.' },
    { icon: '🏡', title: 'Không gian ấm cúng', desc: 'Thiết kế theo phong cách nhà cổ Việt Nam. Phòng riêng cho gia đình, tiệc sinh nhật, họp mặt.' },
    { icon: '⭐', title: 'Dịch vụ chu đáo', desc: 'Nhân viên được đào tạo bài bản. Đặt bàn dễ dàng, không chờ đợi lâu, phục vụ tận tâm.' },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }} ref={ref}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s, transform .7s' }}>
          <div className="eyebrow">Lý do lựa chọn</div>
          <h2 className="sec-title">Tại sao khách hàng <em>yêu chúng tôi</em></h2>
        </div>
        <div className="row g-3">
          {features.map((f, i) => (
            <div key={i} className="col-md-3 col-sm-6">
              <div className="feature-box" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: `opacity .7s ${i * 0.08}s, transform .7s ${i * 0.08}s` }}>
                <div className="fb-icon">{f.icon}</div>
                <div className="fb-title">{f.title}</div>
                <div className="fb-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  useRevealObserver(ref)

  return (
    <section className="cta-sec" ref={ref}>
      <div className="wd-container" data-reveal style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity .7s, transform .7s' }}>
        <h2 className="cta-title">Đặt bàn hôm nay,<br />thưởng thức hương vị gia truyền</h2>
        <p className="cta-sub">Đặt trước để có bàn đẹp nhất — đặc biệt vào cuối tuần và dịp lễ Tết.</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
          <Link to="/dat-ban" className="btn-white">Đặt bàn ngay →</Link>
          <Link to="/thuc-don" style={{ fontSize: 14, background: 'transparent', color: 'rgba(255,255,255,.7)', padding: '12px 26px', borderRadius: 9, border: '1px solid rgba(255,255,255,.3)', display: 'inline-block' }}>
            Xem thực đơn
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Nhà Hàng Ẩm Thực Truyền Thống — Hương Vị Gia Truyền',
    description: settings.meta_description || 'Nhà hàng ẩm thực Việt Nam truyền thống. Hương vị gia truyền, nguyên liệu tươi sạch, không gian ấm cúng. Đặt bàn ngay hôm nay.',
  })

  return (
    <>
      <Header />
      <HeroSlider />
      <Menu featured />
      <About />
      <Gallery />
      <FeaturesSection />
      <Testimonials />
      <CtaSection />
      <Footer />
    </>
  )
}
