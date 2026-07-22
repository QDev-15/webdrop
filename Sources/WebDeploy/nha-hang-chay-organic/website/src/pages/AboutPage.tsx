import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function AboutPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Câu Chuyện Thuần Chay — ${settings.site_name || 'Lá Xanh Chay Organic'}`,
    description: 'Hành trình xây dựng nhà hàng chay organic — từ niềm tin vào lối sống lành mạnh đến hợp tác cùng các nông trại hữu cơ tại Đà Lạt và Lâm Đồng.',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [settings])

  const aboutContent = (settings.about_content) || 'Lá Xanh ra đời từ niềm tin rằng ăn chay không có nghĩa là từ bỏ hương vị. Ngược lại, ẩm thực thuần chay khi được làm đúng cách — sẽ phong phú, đa dạng và mãn nguyện hơn bất kỳ thứ gì. Chúng tôi làm việc trực tiếp với các nông trại hữu cơ địa phương, đảm bảo mỗi nguyên liệu đều sạch, tươi và được trồng theo tiêu chuẩn organic.'
  const aboutImage = (settings.about_image) || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80&auto=format&fit=crop'

  return (
    <main>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Câu chuyện</div>
          <h1 className="ph-title">Hành trình <em>thuần chay</em></h1>
          <p className="ph-sub">Từ một niềm tin nhỏ bé về lối sống lành mạnh — chúng tôi đã xây dựng nên một không gian ẩm thực chay đầy yêu thương.</p>
        </div>
      </div>

      {/* Sứ mệnh */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 reveal">
              <div className="eyebrow">Sứ mệnh</div>
              <h2 className="sec-title">Ẩm thực chay — <em>không chỉ là thức ăn</em></h2>
              <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '16px' }}>
                {aboutContent}
              </p>
              <div className="d-flex gap-4 flex-wrap">
                {[
                  { stat: '5+', label: 'Năm hoạt động' },
                  { stat: '15+', label: 'Nông trại đối tác' },
                  { stat: '100%', label: 'Thuần chay' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '-1px' }}>{s.stat}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 reveal reveal-d1">
              <img src={aboutImage} alt="Ẩm thực chay" style={{ width: '100%', borderRadius: '20px', aspectRatio: '4/3', objectFit: 'cover' }} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Hành trình</div>
            <h2 className="sec-title">Từng bước <em>phát triển</em></h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-7 reveal">
              {[
                { year: '2020', title: 'Mở cửa lần đầu', desc: 'Bắt đầu với menu 20 món chay đơn giản tại một căn nhà nhỏ — và ngay lập tức nhận được tình yêu của cộng đồng.' },
                { year: '2021', title: 'Kết nối nông trại organic đầu tiên', desc: 'Bắt đầu hợp tác với các nông trại hữu cơ tại Đà Lạt và Lâm Đồng — cam kết 100% nguyên liệu sạch không thuốc trừ sâu.' },
                { year: '2022', title: 'Nhận chứng nhận organic quốc tế', desc: 'Được cấp chứng nhận organic từ tổ chức PGS Việt Nam — xác nhận tiêu chuẩn nguyên liệu sạch từ farm đến bàn ăn.' },
                { year: 'Hôm nay', title: 'Hơn 2.000 thực khách mỗi tháng', desc: 'Chúng tôi phục vụ hàng nghìn thực khách mỗi tháng — cả người ăn chay lẫn những ai chỉ đơn giản yêu thích ẩm thực lành mạnh.' },
              ].map(tl => (
                <div key={tl.year} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div>
                    <div className="tl-year">{tl.year}</div>
                    <div className="tl-title">{tl.title}</div>
                    <div className="tl-desc">{tl.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Đội ngũ</div>
            <h2 className="sec-title">Những người <em>làm nên hương vị</em></h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: 'Nguyễn Thị Lan Anh', role: 'Bếp trưởng & Founder', bio: 'Hơn 10 năm kinh nghiệm ẩm thực chay. Học làm bếp tại Học viện Ẩm thực Bangkok. Đam mê biến nguyên liệu thuần thực vật thành những tác phẩm đầy màu sắc và hương vị.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80&auto=format&fit=crop&crop=face' },
              { name: 'TS. Trần Minh Phúc', role: 'Chuyên gia dinh dưỡng', bio: 'Cố vấn dinh dưỡng tại Viện Dinh dưỡng Quốc gia. Đảm bảo mỗi món ăn không chỉ ngon mà còn cân bằng dinh dưỡng đầy đủ cho sức khỏe toàn diện.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80&auto=format&fit=crop&crop=face' },
              { name: 'Lê Thị Hương Giang', role: 'Quản lý chuỗi cung ứng', bio: 'Kết nối và kiểm soát chất lượng nguyên liệu từ 15+ nông trại đối tác. Đảm bảo tiêu chuẩn organic từ farm đến nhà bếp mỗi ngày.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80&auto=format&fit=crop&crop=face' },
            ].map((member, i) => (
              <div key={member.name} className={`col-md-4 col-sm-6 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <div className="team-card">
                  <img className="tc-avatar" src={member.avatar} alt={member.name} loading="lazy" />
                  <div className="tc-name">{member.name}</div>
                  <div className="tc-role">{member.role}</div>
                  <div className="tc-bio">{member.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="text-center sec-dark reveal mb-5">
            <div className="eyebrow">Chứng nhận</div>
            <h2 className="sec-title">Cam kết <em>được chứng minh</em></h2>
          </div>
          <div className="row g-3 justify-content-center">
            {[
              { icon: '🌿', name: 'Organic Certified', body: 'PGS Hữu cơ Việt Nam' },
              { icon: '🥗', name: '100% Vegan', body: 'Không chứa bất kỳ sản phẩm động vật' },
              { icon: '🏥', name: 'Chứng nhận ATTP', body: 'An toàn thực phẩm theo tiêu chuẩn Bộ Y tế' },
            ].map((cert, i) => (
              <div key={cert.name} className={`col-md-4 col-sm-6 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <div className="cert-badge w-100">
                  <div className="cert-icon">{cert.icon}</div>
                  <div>
                    <div className="cert-name" style={{ color: '#fff' }}>{cert.name}</div>
                    <div className="cert-body" style={{ color: 'rgba(255,255,255,.4)' }}>{cert.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">Hãy đến và trải nghiệm</h2>
          <p className="cta-sub">Một bữa ăn chay ngon — có thể thay đổi cách bạn nhìn về ẩm thực mãi mãi.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="btn-white">Đặt bàn ngay →</Link>
            <Link to="/thuc-don" style={{ fontSize: '14px', background: 'transparent', color: 'rgba(255,255,255,.75)', padding: '12px 26px', borderRadius: '9px', border: '1px solid rgba(255,255,255,.3)', textDecoration: 'none', display: 'inline-block' }}>Xem thực đơn</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
