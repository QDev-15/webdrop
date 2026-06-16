import { useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Contact from '../components/Contact'

export default function ContactPage() {
  const { settings } = useSite()

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [settings])

  const mapEmbed = settings.google_map_embed || ''

  return (
    <>
      <Header />

      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ</div>
          <h1 className="ph-title">Tìm chúng tôi <em>ở đây</em></h1>
          <p className="ph-sub">Đặt bàn, hỏi về tiệc nhóm, hoặc chỉ muốn biết hôm nay có món gì mới — chúng tôi luôn sẵn lòng.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Contact />

          {mapEmbed && (
            <div className="mt-5 reveal">
              <div style={{ borderRadius: 16, overflow: 'hidden', height: 280, border: '1px solid var(--border)' }}>
                <iframe
                  src={mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
