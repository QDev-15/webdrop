import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function AboutPage() {
  const { settings } = useSite()
  const siteName = settings['site_name'] || 'Shop Hữu Cơ'
  useDocumentMeta({
    title: `Về chúng tôi | ${siteName}`,
    description: `Tìm hiểu câu chuyện, sứ mệnh và giá trị của ${siteName} — cửa hàng sản phẩm hữu cơ, thủ công và thân thiện với môi trường.`,
  })

  // Đếm số dần khi cuộn tới khối thống kê — port từ script gốc trong ve-chung-toi.html (data-counter/data-suffix)
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('[data-counter]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const target = Number(el.dataset.counter) || 0
        const suffix = el.dataset.suffix || ''
        let cur = 0
        const step = Math.ceil(target / 60) || 1
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target)
          el.textContent = cur + suffix
          if (cur >= target) clearInterval(timer)
        }, 25)
        observer.unobserve(el)
      })
    }, { threshold: 0.5 })
    counters.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="sb-page-header" style={{ paddingBottom: 56 }}>
        <div className="sb-container">
          <div className="sb-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span>Về chúng tôi</span>
          </div>
          <h1 className="sb-page-title">Về Chúng Tôi</h1>
          <p className="sb-page-count" style={{ fontSize: 16, color: 'var(--text-2)' }}>
            Hành trình xây dựng {siteName} từ tình yêu thiên nhiên và sự tận tâm với từng sản phẩm
          </p>
        </div>
      </div>

      <main>
        {/* BRAND STORY — ALTERNATING-STRIPS */}
        <section className="sb-story-section sb-sec" aria-labelledby="story-heading">
          <div className="sb-container">
            <div className="text-center mb-5 pb-2">
              <div className="sb-eyebrow justify-content-center" data-reveal>Câu chuyện</div>
              <h2 className="sb-sec-title" id="story-heading" data-reveal data-delay="1">
                Hành trình <em>của chúng tôi</em>
              </h2>
            </div>

            <div className="sb-story-row">
              <div className="sb-story-img" data-reveal>
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80"
                  alt="Khởi đầu của thương hiệu — không gian xưởng thủ công"
                  loading="lazy"
                />
              </div>
              <div data-reveal data-delay="2">
                <div className="sb-story-badge">Khởi nguồn</div>
                <h3 className="sb-story-title">
                  Sinh ra từ <em>tình yêu</em><br />với thiên nhiên
                </h3>
                <p className="sb-story-text">
                  {siteName} bắt đầu từ mong muốn giản dị: mang những sản phẩm gần gũi thiên nhiên, an toàn và
                  bền vững đến với mọi gia đình Việt. Từ một xưởng thủ công nhỏ, chúng tôi dần xây dựng nên một
                  cộng đồng những người tin vào lối sống xanh và tiêu dùng có trách nhiệm.
                </p>
                <div className="sb-story-features">
                  <div className="sb-story-feat">
                    <div className="sb-story-feat-icon"><i className="bi bi-calendar-heart" /></div>
                    Thành lập từ năm 2017, khởi nguồn tại Việt Nam
                  </div>
                  <div className="sb-story-feat">
                    <div className="sb-story-feat-icon"><i className="bi bi-people" /></div>
                    Đồng hành cùng hơn 50 nghệ nhân và xưởng sản xuất địa phương
                  </div>
                </div>
              </div>
            </div>

            <div className="sb-story-row reverse">
              <div data-reveal>
                <div className="sb-story-badge">Giá trị bền vững</div>
                <h3 className="sb-story-title">
                  Nguyên liệu <em>hữu cơ</em><br />
                  từ thiên nhiên
                </h3>
                <p className="sb-story-text">
                  Chúng tôi ưu tiên lựa chọn chất liệu và nguyên liệu có nguồn gốc tự nhiên, hạn chế tối đa hóa
                  chất và chất tạo màu tổng hợp trong mọi sản phẩm. Mỗi mắt xích trong chuỗi cung ứng đều được
                  kiểm soát để giảm thiểu tác động đến môi trường.
                </p>
                <div className="sb-story-features">
                  <div className="sb-story-feat">
                    <div className="sb-story-feat-icon"><i className="bi bi-leaf" /></div>
                    Nguyên liệu tự nhiên, có thể phân hủy sinh học
                  </div>
                  <div className="sb-story-feat">
                    <div className="sb-story-feat-icon"><i className="bi bi-recycle" /></div>
                    Bao bì đóng gói thân thiện môi trường, hạn chế nhựa dùng một lần
                  </div>
                </div>
              </div>
              <div className="sb-story-img" data-reveal data-delay="2">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80"
                  alt="Nguyên liệu hữu cơ và bao bì thân thiện môi trường"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="sb-story-row">
              <div className="sb-story-img" data-reveal>
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80"
                  alt="Quy trình chế tác thủ công tỉ mỉ từng sản phẩm"
                  loading="lazy"
                />
              </div>
              <div data-reveal data-delay="2">
                <div className="sb-story-badge">Sự tỉ mỉ</div>
                <h3 className="sb-story-title">
                  Mỗi sản phẩm là<br />
                  một <em>tác phẩm</em>
                </h3>
                <p className="sb-story-text">
                  Từ khâu chọn nguyên liệu, chế tác đến kiểm định trước khi đến tay khách hàng — mọi công đoạn
                  đều được thực hiện tỉ mỉ, đảm bảo chuẩn chất lượng và tính thẩm mỹ lâu dài cho từng sản phẩm.
                </p>
                <Link to="/san-pham" className="sb-btn sb-btn-primary">
                  Khám phá sản phẩm <i className="bi bi-arrow-right ms-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES — 3-CARD GRID */}
        <section className="sb-sec" style={{ background: 'var(--surface)' }} aria-labelledby="values-heading">
          <div className="sb-container">
            <div className="text-center mb-5 pb-2">
              <div className="sb-eyebrow justify-content-center" data-reveal>Giá trị cốt lõi</div>
              <h2 className="sb-sec-title" id="values-heading" data-reveal data-delay="1">
                Điều chúng tôi <em>theo đuổi</em>
              </h2>
            </div>
            <div className="row g-4">
              <div className="col-md-4" data-reveal>
                <div style={{ height: '100%', padding: '32px 28px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div className="sb-story-feat-icon" style={{ marginBottom: 16 }}><i className="bi bi-flower1" /></div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 10 }}>Tự nhiên</h3>
                  <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
                    Ưu tiên chất liệu và nguyên liệu có nguồn gốc tự nhiên, hạn chế tối đa hóa chất và chất tạo màu tổng hợp trong mọi sản phẩm.
                  </p>
                </div>
              </div>
              <div className="col-md-4" data-reveal data-delay="1">
                <div style={{ height: '100%', padding: '32px 28px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div className="sb-story-feat-icon" style={{ marginBottom: 16 }}><i className="bi bi-award" /></div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 10 }}>Chất lượng</h3>
                  <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
                    Mỗi sản phẩm đều trải qua quy trình kiểm định nghiêm ngặt trước khi đến tay khách hàng, đảm bảo độ bền và tính thẩm mỹ lâu dài.
                  </p>
                </div>
              </div>
              <div className="col-md-4" data-reveal data-delay="2">
                <div style={{ height: '100%', padding: '32px 28px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16 }}>
                  <div className="sb-story-feat-icon" style={{ marginBottom: 16 }}><i className="bi bi-heart" /></div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 10 }}>Tận tâm</h3>
                  <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
                    Đội ngũ tư vấn luôn đồng hành cùng khách hàng, lắng nghe và hỗ trợ tận tình từ lúc chọn sản phẩm đến khi nhận hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSHOP GALLERY */}
        <section className="sb-sec" aria-labelledby="gallery-heading">
          <div className="sb-container">
            <div className="row justify-content-between align-items-end g-0 mb-4">
              <div className="col-auto">
                <div className="sb-eyebrow" data-reveal>Hậu trường</div>
                <h2 className="sb-sec-title" id="gallery-heading" data-reveal data-delay="1" style={{ marginBottom: 0 }}>
                  Không gian <em>xưởng làm việc</em>
                </h2>
              </div>
            </div>
            <div className="row g-3 mt-3">
              {[
                { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&auto=format&fit=crop&q=80', alt: 'Nghệ nhân đang chế tác sản phẩm thủ công' },
                { src: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&auto=format&fit=crop&q=80', alt: 'Nguyên liệu tự nhiên được chọn lọc kỹ lưỡng' },
                { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80', alt: 'Góc trưng bày sản phẩm hoàn thiện tại xưởng' },
                { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', alt: 'Đội ngũ đóng gói đơn hàng cẩn thận trước khi giao' },
              ].map((img, i) => (
                <div className="col-6 col-md-3" key={img.src} data-reveal data-delay={i > 0 ? String(i) : undefined}>
                  <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1' }}>
                    <img src={img.src} alt={img.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="sb-stats" aria-label="Số liệu thành tựu">
          <div className="sb-container">
            <div className="sb-stats-grid">
              <div className="sb-stat" data-reveal>
                <div className="sb-stat-num">
                  <span data-counter="8" data-suffix=" năm">0 năm</span>
                </div>
                <div className="sb-stat-label">Hình thành và phát triển</div>
              </div>
              <div className="sb-stat" data-reveal data-delay="1">
                <div className="sb-stat-num">
                  <span data-counter="15000" data-suffix="+">0+</span>
                </div>
                <div className="sb-stat-label">Khách hàng tin tưởng</div>
              </div>
              <div className="sb-stat" data-reveal data-delay="2">
                <div className="sb-stat-num">
                  <span data-counter="50" data-suffix="+">0+</span>
                </div>
                <div className="sb-stat-label">Nghệ nhân hợp tác</div>
              </div>
              <div className="sb-stat" data-reveal data-delay="3">
                <div className="sb-stat-num">
                  <span data-counter="90" data-suffix="%">0%</span>
                </div>
                <div className="sb-stat-label">Nguyên liệu có nguồn gốc bền vững</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'var(--dark2)', padding: 'clamp(60px,7vw,96px) 0' }}>
          <div className="sb-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
              <div data-reveal>
                <div className="sb-eyebrow" style={{ color: 'var(--accent-mid)' }}>Bắt đầu ngay</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 500, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
                  Khám phá <em style={{ color: 'var(--accent-mid)', fontWeight: 300 }}>bộ sưu tập của chúng tôi</em>
                </h2>
                <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, marginBottom: 36 }}>
                  Hàng trăm sản phẩm được chọn lọc kỹ lưỡng từ chất liệu tự nhiên — mang đến trải nghiệm mua sắm gần gũi và bền vững.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link to="/san-pham" className="sb-btn sb-btn-primary">
                    <i className="bi bi-bag-heart" />
                    Khám phá sản phẩm
                  </Link>
                  <Link to="/lien-he" className="sb-btn" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)' }}>
                    Liên hệ với chúng tôi
                  </Link>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} data-reveal data-delay="2">
                <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1' }}>
                  <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&auto=format&fit=crop&q=80" alt="Sản phẩm chăm sóc tự nhiên" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .7 }} />
                </div>
                <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', marginTop: 20 }}>
                  <img src="https://images.unsplash.com/photo-1755051661952-00a7b396aaec?w=300&auto=format&fit=crop&q=80" alt="Phong cách sống tự nhiên" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .7 }} />
                </div>
                <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1', marginTop: -20 }}>
                  <img src="https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=300&auto=format&fit=crop&q=80" alt="Sản phẩm phụ kiện organic" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .7 }} />
                </div>
                <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1' }}>
                  <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&auto=format&fit=crop&q=80" alt="Không gian nội thất mộc mạc" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .7 }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
