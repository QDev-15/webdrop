import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Reservation from '../components/Reservation'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ReservationPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Đặt bàn — ${settings.site_name || 'Nhà Hàng Ẩm Thực'}`,
    description: 'Đặt bàn trước để có vị trí đẹp nhất — đặc biệt vào cuối tuần và ngày lễ. Xác nhận nhanh trong 30 phút.',
  })

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
  }, [])

  return (
    <>
      <Header />

      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Đặt bàn</div>
          <h1 className="ph-title">Chọn bàn <em>lý tưởng</em></h1>
          <p className="ph-sub">Đặt trước để có bàn tốt nhất — đặc biệt cuối tuần và ngày lễ luôn full.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Reservation />
        </div>
      </section>

      <Footer />
    </>
  )
}
