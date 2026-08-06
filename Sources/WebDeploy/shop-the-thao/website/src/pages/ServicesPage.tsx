import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ServicesPage() {
  const { settings } = useSite()
  const [stats, setStats] = useState({ customers: 12000, products: 40, years: 7, provinces: 63 })

  useDocumentMeta({
    title: 'Dịch vụ & Giới thiệu — Shop Thể Thao',
    description: 'Dịch vụ hỗ trợ khách hàng và giới thiệu thương hiệu Shop Thể Thao'
  })

  useEffect(() => {
    // Counter animation
    const animate = (target: number, key: keyof typeof stats, duration: number) => {
      let current = 0
      const step = target / (duration / 16)
      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          setStats(s => ({ ...s, [key]: target }))
          clearInterval(timer)
        } else {
          setStats(s => ({ ...s, [key]: Math.floor(current) }))
        }
      }, 16)
    }
    const timer = setTimeout(() => {
      animate(12000, 'customers', 1200)
      animate(40, 'products', 1200)
      animate(7, 'years', 1200)
      animate(63, 'provinces', 1200)
    }, 200)
    return () => { clearTimeout(timer) }
  }, [])

  return (
    <div className="tt-page-wrap">
      {/* Hero Section */}
      <div className="tt-dv-hero" style={{ background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))', backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', minHeight: '500px', display: 'flex', alignItems: 'center', color: 'white', padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-dv-hero-content" style={{ maxWidth: '600px' }}>
            <div className="tt-eyebrow" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Kể từ năm 2018</div>
            <h1 className="tt-dv-hero-title" style={{ fontSize: 42, fontWeight: 600, marginBottom: 16, lineHeight: 1.3 }}>
              Chúng tôi không chỉ bán đồ thể thao — <br /><span style={{ color: 'var(--accent)' }}>chúng tôi trang bị cho bạn chiến thắng</span>
            </h1>
            <p className="tt-dv-hero-sub" style={{ fontSize: 16, opacity: 0.9, marginBottom: 28, lineHeight: 1.6 }}>
              Hơn 7 năm đồng hành cùng hàng nghìn vận động viên Việt Nam. Từ người mới bắt đầu chạy bộ đến vận động viên marathon chuyên nghiệp — chúng tôi hiểu bạn cần gì.
            </p>
            <div className="tt-dv-hero-ctas" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'var(--accent)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, transition: 'all .2s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                Xem sản phẩm →
              </Link>
              <Link to="/lien-he" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'transparent', border: '2px solid white', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, transition: 'all .2s', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Story Section */}
      <section className="tt-sec" style={{ background: 'var(--surface)', padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div className="tt-story-img" data-reveal style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80" alt="Cửa hàng thể thao" style={{ width: '100%', borderRadius: 12, aspectRatio: '4/3', objectFit: 'cover' }} />
              <div className="tt-story-img-badge" style={{ position: 'absolute', bottom: 24, left: 24, background: 'var(--accent)', color: 'white', padding: '20px', borderRadius: 12, textAlign: 'center' }}>
                <div className="tt-story-year" style={{ fontSize: 32, fontWeight: 600 }}>2018</div>
                <div className="tt-story-year-label" style={{ fontSize: 13, opacity: 0.9 }}>Thành lập</div>
              </div>
            </div>

            <div className="tt-story-content" data-reveal>
              <div className="tt-eyebrow" style={{ marginBottom: 12 }}>Câu chuyện của chúng tôi</div>
              <h2 className="tt-sec-title" style={{ marginBottom: 20 }}>
                Từ đam mê thể thao<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>đến thương hiệu uy tín</em>
              </h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>
                Chúng tôi bắt đầu từ một cửa hàng nhỏ ở quận 3 năm 2018 — khi người sáng lập vừa hoàn thành marathon đầu tiên của mình và nhận ra thị trường thiếu trầm trọng những sản phẩm thể thao vừa chất lượng vừa dễ tiếp cận với người Việt.
              </p>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 28 }}>
                Không tiếp thị hào nhoáng, không giá trên trời. Chỉ là đồ thể thao tốt, đúng giá, và dịch vụ thật lòng.
              </p>

              <div className="tt-story-values" style={{ display: 'grid', gap: 16 }}>
                {[
                  { title: 'Trung thực', desc: 'Không bao giờ bán hàng nhái. Mọi sản phẩm đều có tem nguồn gốc rõ ràng.' },
                  { title: 'Chuyên môn', desc: 'Đội ngũ tư vấn đều là người tập thể thao thật — hiểu từng nhu cầu cụ thể.' },
                  { title: 'Cộng đồng', desc: 'Chúng tôi tin vào phong trào sống khỏe tại Việt Nam — mỗi sản phẩm là một bước tiến.' },
                ].map((val, i) => (
                  <div key={i} className="tt-story-value">
                    <strong style={{ display: 'block', marginBottom: 4 }}>{val.title}</strong>
                    <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat Bar */}
      <div className="tt-stat-bar" style={{ background: 'var(--accent)', color: 'white', padding: '60px 0' }}>
        <div className="tt-container">
          <div className="tt-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}>
            {[
              { num: 'customers', label: 'Khách hàng hài lòng' },
              { num: 'products', label: 'Sản phẩm chính hãng' },
              { num: 'years', label: 'Năm kinh nghiệm' },
              { num: 'provinces', label: 'Tỉnh thành giao hàng' },
            ].map((stat, i) => (
              <div key={i} className="tt-stat-item" data-reveal>
                <div className="tt-stat-num" style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                  {stats[stat.num as keyof typeof stats]}{stat.num === 'customers' ? '+' : ''}
                </div>
                <div className="tt-stat-label" style={{ fontSize: 14, opacity: 0.9 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="tt-sec" style={{ padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-sec-header" style={{ textAlign: 'center', marginBottom: 48 }} data-reveal>
            <div className="tt-eyebrow" style={{ marginBottom: 12 }}>Dịch vụ của chúng tôi</div>
            <h2 className="tt-sec-title" style={{ marginBottom: 12 }}>Nhiều hơn một cửa hàng thể thao</h2>
            <p style={{ color: 'var(--text-2)', maxWidth: 560, margin: '12px auto 0' }}>Chúng tôi cung cấp trải nghiệm mua sắm toàn diện — từ tư vấn chọn sản phẩm đến hậu mãi sau bán hàng.</p>
          </div>

          <div className="tt-service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { icon: '💬', title: 'Tư vấn chọn size', desc: 'Đội ngũ tư vấn viên sẽ giúp bạn chọn đúng size dựa trên số đo thực tế và mục tiêu tập luyện.', link: '/lien-he' },
              { icon: '🔄', title: 'Đổi size miễn phí', desc: 'Mua về không vừa? Gửi lại trong 30 ngày, chúng tôi đổi size mới miễn phí.', link: '/lien-he' },
              { icon: '🛡️', title: 'Bảo hành 12 tháng', desc: 'Toàn bộ sản phẩm được bảo hành chính hãng 12 tháng cho lỗi nhà sản xuất.', link: '/lien-he' },
              { icon: '🚚', title: 'Giao hàng toàn quốc', desc: 'Miễn phí ship đơn từ 500K. Giao nhanh 2–4 giờ nội thành TP.HCM và Hà Nội.', link: '/lien-he' },
              { icon: '🎁', title: 'Hàng chính hãng 100%', desc: 'Nhập khẩu trực tiếp từ nhà phân phối chính thức. Mỗi sản phẩm có tem chống hàng giả.', link: '/' },
              { icon: '☀️', title: 'Tư vấn dinh dưỡng & luyện tập', desc: 'Không chỉ bán đồ — chúng tôi còn tư vấn lịch tập và bổ sung dinh dưỡng phù hợp mục tiêu.', link: '/lien-he' },
            ].map((svc, i) => (
              <div key={i} className="tt-service-card" data-reveal style={{ padding: 24, background: 'white', border: '1px solid var(--border)', borderRadius: 12, transition: 'all .2s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)', e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,.07)')} onMouseLeave={e => (e.currentTarget.style.transform = 'none', e.currentTarget.style.boxShadow = 'none')}>
                <div className="tt-service-icon" style={{ fontSize: 36, marginBottom: 12 }}>{svc.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{svc.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12 }}>{svc.desc}</p>
                <Link to={svc.link} className="tt-service-link" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                  {svc.link === '/lien-he' ? 'Chat với tư vấn →' : 'Khám phá sản phẩm →'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="tt-sec-sm" style={{ background: 'var(--surface-2)', padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-sec-header" style={{ textAlign: 'center', marginBottom: 48 }} data-reveal>
            <div className="tt-eyebrow" style={{ marginBottom: 12 }}>Lý do chọn chúng tôi</div>
            <h2 className="tt-sec-title" style={{ marginBottom: 16 }}>Tại sao hơn 12.000 khách hàng<br />tin tưởng <span style={{ color: 'var(--accent)' }}>Shop Thể Thao?</span></h2>
          </div>

          <div className="tt-why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            {[
              { num: '01', title: 'Không bán hàng nhái, không thỏa hiệp', desc: 'Chúng tôi đã từ chối nhiều đề nghị nhập hàng không rõ nguồn gốc. Chính sách "hàng thật hoặc không bán" là nguyên tắc không thể thương lượng.' },
              { num: '02', title: 'Tư vấn bởi người thật sự tập thể thao', desc: '100% nhân viên tư vấn của chúng tôi tự tập gym hoặc chạy bộ. Không cần hỏi sách — họ biết cảm giác thật của mỗi sản phẩm.' },
              { num: '03', title: 'Giá minh bạch, không phí ẩn', desc: 'Giá niêm yết = giá bán. Không sale ảo, không tăng giá rồi giảm. Khuyến mãi nào cũng có thời hạn rõ ràng.' },
              { num: '04', title: 'Dịch vụ hậu mãi dài hạn', desc: 'Mua xong không là hết. Chúng tôi theo dõi từng đơn hàng, chủ động liên hệ sau 1 tuần để hỏi thăm.' },
            ].map((item, i) => (
              <div key={i} className="tt-why-item" data-reveal style={{ paddingLeft: 32 }}>
                <div className="tt-why-num" style={{ position: 'absolute', left: 0, fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{item.num}</div>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="tt-sec" style={{ padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-sec-header" style={{ textAlign: 'center', marginBottom: 48 }} data-reveal>
            <div className="tt-eyebrow" style={{ marginBottom: 12 }}>Khách hàng nói gì</div>
            <h2 className="tt-sec-title">Không phải chúng tôi tự khen</h2>
          </div>

          <div className="tt-testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { stars: 5, text: 'Đây là lần thứ 5 mình mua ở đây. Giày luôn đúng size, giao nhanh, và khi đôi trước bị lỗi đế sau 8 tháng tập, họ đổi mới ngay không cần biên lai.', author: 'Minh Châu', title: 'Runner, TP.HCM · mua lần thứ 5' },
              { stars: 5, text: 'Mình nhờ shop tư vấn mua bộ dụng cụ gym cho nhà. Nhân viên hỏi diện tích phòng, mục tiêu tập, ngân sách rồi mới gợi ý — chứ không đẩy hàng đắt nhất.', author: 'Hoàng Tuấn', title: 'Gym tại nhà, Hà Nội' },
              { stars: 5, text: 'Mua thảm yoga cho cả nhà. Shop tặng thêm dây buộc thảm và khăn lau không thông báo — khi mở hộp ra mới thấy. Những chi tiết nhỏ như vậy tạo ra khách hàng trung thành.', author: 'Lan Phương', title: 'Yoga teacher, Đà Nẵng' },
            ].map((test, i) => (
              <div key={i} className="tt-testimonial" data-reveal style={{ padding: 24, background: 'white', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div className="tt-testimonial-stars" style={{ fontSize: 16, marginBottom: 12, color: 'var(--accent)' }}>{'★'.repeat(test.stars)}</div>
                <p className="tt-testimonial-text" style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{test.text}</p>
                <div className="tt-testimonial-author" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                    {test.author[0]}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 14 }}>{test.author}</strong>
                    <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{test.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section className="tt-sec-sm" style={{ background: 'var(--surface)', padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-sec-header" style={{ textAlign: 'center', marginBottom: 40 }} data-reveal>
            <div className="tt-eyebrow" style={{ marginBottom: 12 }}>Chính sách mua hàng</div>
            <h2 className="tt-sec-title">Cam kết rõ ràng, không điều khoản mơ hồ</h2>
          </div>

          <div className="tt-policy-full-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { icon: '🚚', title: 'Giao hàng nhanh', content: '**Nội thành TP.HCM / Hà Nội:** 2–4 giờ sau khi đặt (8:00–20:00)\n**Tỉnh thành khác:** 1–3 ngày qua GHTK / J&T\n**Miễn phí ship** cho đơn từ 500.000đ' },
              { icon: '🔄', title: 'Đổi trả & hoàn tiền', content: '**Đổi size:** Miễn phí trong 30 ngày, sản phẩm còn nguyên tem nhãn\n**Lỗi nhà sản xuất:** Hoàn tiền 100% hoặc đổi mới trong 60 ngày\n**Sai hàng:** Shop chịu toàn bộ phí vận chuyển' },
              { icon: '🛡️', title: 'Bảo hành sản phẩm', content: '**Thời hạn:** 12 tháng kể từ ngày mua\n**Phạm vi:** Lỗi vật liệu, gia công, đế giày, đường may\n**Không bảo hành:** Hư do sử dụng sai, ngấm nước nặng, tác động vật lý' },
              { icon: '💳', title: 'Thanh toán an toàn', content: '**Hình thức:** COD (trả khi nhận), chuyển khoản QR, thẻ nội địa\n**Bảo mật:** Thông tin thanh toán được mã hóa SSL 256-bit\n**Hóa đơn:** Xuất VAT theo yêu cầu cho doanh nghiệp' },
            ].map((policy, i) => (
              <div key={i} className="tt-policy-full-item" data-reveal style={{ padding: 24, background: 'white', borderRadius: 12 }}>
                <div className="tt-pf-icon" style={{ fontSize: 32, marginBottom: 12 }}>{policy.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{policy.title}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{policy.content.replace(/\*\*(.+?)\*\*/g, '$1')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="tt-dv-cta" style={{ background: 'var(--dark2)', color: 'white', padding: '100px 0' }}>
        <div className="tt-container">
          <div className="tt-dv-cta-inner" data-reveal style={{ textAlign: 'center' }}>
            <div className="tt-eyebrow" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Bắt đầu ngay hôm nay</div>
            <h2 className="tt-dv-cta-title" style={{ fontSize: 36, fontWeight: 600, marginBottom: 12, lineHeight: 1.3 }}>
              Sẵn sàng trang bị<br />cho hành trình thể thao của bạn?
            </h2>
            <p className="tt-dv-cta-sub" style={{ fontSize: 16, opacity: 0.8, marginBottom: 32 }}>40 sản phẩm chính hãng · Giao hàng nhanh · Đổi size miễn phí · Bảo hành 12 tháng</p>
            <div className="tt-dv-cta-btns" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'white', color: 'var(--accent)', textDecoration: 'none', borderRadius: 8, fontWeight: 600, transition: 'all .2s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                Khám phá 40 sản phẩm →
              </Link>
              <Link to="/khuyen-mai" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'transparent', border: '2px solid white', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, transition: 'all .2s', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                Xem khuyến mãi hôm nay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
