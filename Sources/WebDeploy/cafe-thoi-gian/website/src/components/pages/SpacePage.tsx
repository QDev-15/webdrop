import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useSite } from '../../contexts/SiteContext'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
}

export default function SpacePage() {
  const { settings } = useSite()
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then(setGallery).catch(console.error)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [gallery])

  const siteName = settings.site_name || 'Cà Phê Thời Gian'

  const galleryImages = gallery.length > 0 ? gallery : [
    { id: 1, title: 'Không gian chính', description: '', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop', category: '' },
    { id: 2, title: 'Latte Art', description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=80&auto=format&fit=crop', category: '' },
    { id: 3, title: 'Barista', description: '', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=700&q=80&auto=format&fit=crop', category: '' },
    { id: 4, title: 'Hạt Cà Phê', description: '', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&q=80&auto=format&fit=crop', category: '' },
    { id: 5, title: 'Góc Cafe', description: '', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=80&auto=format&fit=crop', category: '' },
    { id: 6, title: 'Sân Vườn', description: '', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop', category: '' },
  ]

  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Không gian</div>
          <h1 className="ph-title">Nơi thời gian <em>chậm lại</em></h1>
          <p className="ph-sub">Mỗi góc quán được thiết kế để bạn cảm thấy thoải mái — dù đến một mình, với bạn bè hay để làm việc.</p>
        </div>
      </div>

      {/* OVERVIEW */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center mb-5">
            <div className="col-lg-5 reveal">
              <div className="eyebrow">Tổng quan</div>
              <h2 className="sec-title">Ba khu vực,<br /><em>một không khí</em></h2>
              <p className="sec-sub mb-4">{siteName} có tổng sức chứa 80 chỗ ngồi chia thành 3 khu vực riêng biệt, mỗi khu mang một cảm giác khác nhau nhưng đều giữ được chất cozy ấm cúng đặc trưng.</p>
              <div className="row g-3">
                {[['3','Khu vực'],['80','Chỗ ngồi'],['Free','Wi-Fi']].map(([val, label]) => (
                  <div key={label} className="col-4 text-center" style={{ padding: '16px', background: 'var(--warm)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--accent)' }}>{val}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-7 reveal reveal-d1">
              <div className="gallery-masonry">
                {galleryImages.slice(0, 5).map(img => (
                  <img key={img.id} src={img.image} alt={img.title || 'Không gian cafe'} loading="lazy" />
                ))}
              </div>
            </div>
          </div>

          {/* 3 areas */}
          <div className="row g-4">
            {[
              { cap: 'Tầng 1 · 40 chỗ ngồi', name: 'Main Hall', desc: 'Khu vực chính thoáng đãng ngay quầy bar. Bàn đơn và bàn nhóm nhỏ, lý tưởng để làm việc, đọc sách hoặc gặp gỡ nhanh. Wi-Fi tốc độ cao, ổ cắm tại mỗi bàn.', tags: ['Wi-Fi nhanh','Ổ cắm điện','Quầy bar'], img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop', delay: 'd1' },
              { cap: 'Ngoài trời · 25 chỗ ngồi', name: 'Sân Vườn Xanh', desc: 'Cây xanh, ánh sáng tự nhiên, không khí trong lành. Lý tưởng để chụp ảnh, thư giãn buổi sáng sớm hoặc chiều mát. Có mái che và quạt phun sương.', tags: ['Cây xanh','Mái che','Quạt mát'], img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=80&auto=format&fit=crop', delay: 'd2' },
              { cap: 'Phòng riêng · Tối đa 8 người', name: 'Phòng Riêng', desc: 'Không gian kín, yên tĩnh, phù hợp họp nhóm, sinh nhật nhỏ hoặc workshop. Có tivi 55", bảng trắng, điều hòa riêng. Đặt trước tối thiểu 1 ngày.', tags: ['TV 55"','Điều hòa','Đặt trước'], img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=700&q=80&auto=format&fit=crop', delay: 'd3' },
            ].map(area => (
              <div className="col-md-4" key={area.name}>
                <div className={`area-card reveal ${area.delay}`}>
                  <img className="ac-img" src={area.img} alt={area.name} loading="lazy" />
                  <div className="ac-body">
                    <div className="ac-cap">{area.cap}</div>
                    <div className="ac-name">{area.name}</div>
                    <div className="ac-desc">{area.desc}</div>
                    <div className="mt-3 d-flex flex-wrap gap-2">
                      {area.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '11px', background: 'var(--accent-light)', color: 'var(--accent)', padding: '3px 10px', borderRadius: '20px', fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Bộ sưu tập</div>
            <h2 className="sec-title">Gallery <em>hình ảnh</em></h2>
            <p className="sec-sub">Một vài khoảnh khắc đẹp tại {siteName} — cảm nhận không khí trước khi ghé thăm.</p>
          </div>
          <div className="gallery-masonry reveal">
            {galleryImages.map(img => (
              <img key={img.id} src={img.image} alt={img.title || 'Không gian cafe'} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS — Dark */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container sec-dark">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 reveal">
              <div className="eyebrow">Sự kiện nhỏ</div>
              <h2 className="sec-title">Đặt quán cho <em>sự kiện của bạn</em></h2>
              <p className="sec-sub mb-4">{siteName} có thể hỗ trợ tổ chức cho nhóm từ 8–40 người.</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Set up bàn ghế theo yêu cầu','Menu đặc biệt cho sự kiện','Hỗ trợ âm thanh và trình chiếu','Decor nhẹ theo chủ đề'].map(item => (
                  <li key={item} style={{ fontSize: '13.5px', color: 'rgba(255,255,255,.55)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#d97706', fontSize: '16px', flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link to="/lien-he" className="btn-accent">Liên hệ đặt sự kiện</Link>
              </div>
            </div>
            <div className="col-lg-6 reveal reveal-d1">
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop" alt="Sự kiện tại quán" loading="lazy" style={{ borderRadius: '16px', width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container position-relative">
          <div className="cta-title">Hẹn gặp bạn tại {siteName}</div>
          <div className="cta-sub">Mỗi ngày 7:00 – 22:00 · {settings.site_address || 'Địa chỉ quán'}</div>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="btn-white">Đặt chỗ trước</Link>
            <Link to="/menu" className="btn-accent" style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', color: '#fff' }}>Xem thực đơn</Link>
          </div>
        </div>
      </section>
    </>
  )
}
