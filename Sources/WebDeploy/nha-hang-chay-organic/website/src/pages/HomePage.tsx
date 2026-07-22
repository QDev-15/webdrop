import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'
import FeaturedMenu from '../components/Menu'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Gallery from '../components/Gallery'

export default function HomePage() {
  const { settings, slides, featuredItems, testimonials, gallery } = useSite()

  useDocumentMeta({
    title: settings.meta_title || 'Lá Xanh Chay Organic — Ẩm Thực Thuần Chay Tươi Lành',
    description: settings.meta_description || 'Nhà hàng chay organic tại TP.HCM. Hơn 50 món chay từ nguyên liệu organic Đà Lạt, không chất bảo quản, không phụ gia.',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible), .reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            ro.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [slides, featuredItems, testimonials, gallery])

  return (
    <main>
      {/* HERO */}
      <HeroSlider />

      {/* TRIẾT LÝ — 3 giá trị cốt lõi */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Triết lý</div>
            <h2 className="sec-title">Ba giá trị <em>chúng tôi tin</em></h2>
            <p className="sec-sub">Không chỉ là ẩm thực — đây là triết lý sống mà chúng tôi muốn lan tỏa đến từng thực khách.</p>
          </div>
          <div className="row g-4">
            {[
              { icon: '🌱', title: 'Thuần Chay Tuyệt Đối', desc: 'Không một nguyên liệu động vật nào trong bếp của chúng tôi — từ nước dùng, sốt, đến từng lọ gia vị. Cam kết 100%.' },
              { icon: '🌿', title: 'Organic Có Chứng Nhận', desc: 'Mọi nguyên liệu đều có nguồn gốc rõ ràng, được chứng nhận hữu cơ. Chúng tôi hợp tác trực tiếp với nông trại organic tại Đà Lạt.' },
              { icon: '✨', title: 'Không Chất Bảo Quản', desc: 'Chế biến mỗi ngày, không tích trữ, không chất phụ gia nhân tạo. Những gì bạn ăn là những gì thiên nhiên ban tặng nguyên vẹn.' },
            ].map((v, i) => (
              <div key={v.title} className={`col-md-4 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <div className="value-pillar">
                  <div className="vp-icon">{v.icon}</div>
                  <div className="vp-title">{v.title}</div>
                  <div className="vp-desc">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MENU */}
      <FeaturedMenu />

      {/* ABOUT */}
      <About />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* GALLERY */}
      <Gallery />

      {/* CTA ĐẶTBÀN */}
      <section className="sec-pad" style={{ background: 'var(--accent)', color: '#fff' }}>
        <div className="wd-container text-center">
          <div className="reveal">
            <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', opacity: 0.75 }}>Đặt bàn ngay hôm nay</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, letterSpacing: '-1.5px', lineHeight: 1.12, marginBottom: '16px' }}>
              Bắt đầu hành trình<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>ăn sạch sống khỏe</em>
            </h2>
            <p style={{ fontSize: '15px', fontWeight: 300, opacity: 0.8, maxWidth: '440px', margin: '0 auto 32px', lineHeight: 1.8 }}>
              Đặt bàn trước để chúng tôi chuẩn bị tốt nhất cho bạn. Hỗ trợ thực đơn theo nhu cầu dinh dưỡng cá nhân.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/lien-he" style={{ background: '#fff', color: 'var(--accent)', padding: '12px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
                🌿 Đặt bàn ngay
              </Link>
              <Link to="/thuc-don" style={{ background: 'transparent', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontWeight: 500, fontSize: '14px', textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,.35)' }}>
                Xem thực đơn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
