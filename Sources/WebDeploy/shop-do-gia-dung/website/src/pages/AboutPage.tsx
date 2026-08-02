import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const STORY_IMG = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&auto=format&fit=crop&q=80'
const CRAFT_IMG = 'https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=700&auto=format&fit=crop&q=80'

export default function AboutPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Về chúng tôi – ${String(settings.site_name || 'Shop Đồ Gia Dụng')}`,
    description: 'Tìm hiểu câu chuyện của chúng tôi — đội ngũ đam mê chọn lọc đồ gia dụng chất lượng cao mang lại sự tiện nghi và thẩm mỹ cho mọi gia đình Việt.',
  })

  return (
    <>
      {/* About hero */}
      <section className="dg-about-hero">
        <div className="dg-about-hero__bg">
          <img src={STORY_IMG} alt="Cửa hàng đồ gia dụng" />
        </div>
        <div className="dg-container">
          <div className="dg-about-hero__content">
            <p className="dg-about-hero__eyebrow">Câu chuyện của chúng tôi</p>
            <h1 className="dg-about-hero__h1">Đồ Gia Dụng — Hơn Cả Một Sản Phẩm</h1>
            <p className="dg-about-hero__sub">
              Chúng tôi tin rằng mỗi vật dụng trong nhà đều có thể vừa đẹp vừa tiện dụng — và sứ mệnh của chúng tôi là mang điều đó đến mọi gia đình.
            </p>
          </div>
        </div>
      </section>

      {/* Story 1 */}
      <section className="dg-section">
        <div className="dg-container">
          <div className="dg-story">
            <div className="dg-story__img" data-reveal>
              <img src={STORY_IMG} alt="Chúng tôi" loading="lazy" />
            </div>
            <div className="dg-story__text" data-reveal data-delay="1">
              <p className="dg-story__eyebrow">Bắt đầu từ tình yêu</p>
              <h2 className="dg-story__title">Chúng tôi bắt đầu từ gian bếp nhỏ</h2>
              <div className="dg-story__text-body">
                <p>
                  Thành lập từ năm 2018 bởi một nhóm những người yêu thích thiết kế nội thất và đồ gia dụng, chúng tôi bắt đầu với một ý tưởng đơn giản: mang những sản phẩm gia dụng chất lượng cao, thiết kế đẹp và bền bỉ đến tay người tiêu dùng Việt Nam với mức giá hợp lý.
                </p>
                <p style={{ marginTop: 12 }}>
                  Từ một cửa hàng nhỏ với vài chục sản phẩm, ngày nay chúng tôi tự hào phục vụ hàng nghìn gia đình với catalog hơn 500 sản phẩm được chọn lọc kỹ càng từ các thương hiệu uy tín trong và ngoài nước.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat bar */}
      <div className="dg-stat-bar">
        <div className="dg-container">
          <div className="dg-stat-bar__grid">
            {[
              { num: '500+', label: 'Sản phẩm' },
              { num: '15.000+', label: 'Khách hàng hài lòng' },
              { num: '5+', label: 'Năm kinh nghiệm' },
              { num: '4.8★', label: 'Đánh giá trung bình' },
            ].map((s, i) => (
              <div key={i} data-reveal data-delay={`${i + 1}`}>
                <span className="dg-stat-bar__num">{s.num}</span>
                <span className="dg-stat-bar__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story 2 */}
      <section className="dg-section">
        <div className="dg-container">
          <div className="dg-story dg-story--reverse">
            <div className="dg-story__img" data-reveal>
              <img src={CRAFT_IMG} alt="Chất lượng sản phẩm" loading="lazy" />
            </div>
            <div className="dg-story__text" data-reveal data-delay="1">
              <p className="dg-story__eyebrow">Chất lượng trên hết</p>
              <h2 className="dg-story__title">Mỗi sản phẩm đều qua kiểm định nghiêm ngặt</h2>
              <div className="dg-story__text-body">
                <p>
                  Trước khi một sản phẩm xuất hiện trên kệ của chúng tôi, nó phải vượt qua quá trình kiểm định nghiêm ngặt về chất liệu, độ bền, tính thẩm mỹ và giá trị sử dụng thực tế. Chúng tôi chỉ bán những gì chúng tôi sẵn sàng dùng trong chính ngôi nhà của mình.
                </p>
                <p style={{ marginTop: 12 }}>
                  Các sản phẩm được chọn lọc từ những nhà sản xuất uy tín, ưu tiên vật liệu thân thiện môi trường và sản xuất bền vững — vì một ngôi nhà đẹp không nên đánh đổi bằng sức khỏe của người dùng hay môi trường sống.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="dg-section dg-section--alt">
        <div className="dg-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="dg-section__label">Giá trị cốt lõi</p>
            <h2 className="dg-section__title">Những điều chúng tôi tin tưởng</h2>
          </div>
          <div className="dg-values">
            {[
              { icon: '🏆', title: 'Chất lượng hàng đầu', desc: 'Mỗi sản phẩm đều được kiểm tra kỹ trước khi đến tay khách hàng.' },
              { icon: '🌱', title: 'Bền vững & xanh', desc: 'Ưu tiên sản phẩm từ vật liệu tự nhiên, thân thiện với môi trường.' },
              { icon: '💡', title: 'Thiết kế thông minh', desc: 'Kết hợp giữa tính thẩm mỹ và công năng sử dụng thực tế hàng ngày.' },
              { icon: '❤️', title: 'Khách hàng là trọng tâm', desc: 'Mọi quyết định của chúng tôi đều đặt trải nghiệm khách hàng lên hàng đầu.' },
            ].map((v, i) => (
              <div className="dg-value-card" key={i} data-reveal data-delay={`${i + 1}`}>
                <div className="dg-value-icon">{v.icon}</div>
                <h3 className="dg-value-title">{v.title}</h3>
                <p className="dg-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="dg-section">
        <div className="dg-container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p className="dg-section__label">Khách hàng nói gì</p>
            <h2 className="dg-section__title">Đánh giá từ khách hàng thực tế</h2>
          </div>
          <div className="dg-testimonials">
            {[
              { name: 'Nguyễn Thị Lan', role: 'Nội trợ, Hà Nội', stars: 5, text: 'Tôi đã mua bộ nồi inox từ cửa hàng. Chất lượng tuyệt vời, đun nấu đều nhiệt và rất dễ vệ sinh. Đặc biệt giao hàng rất nhanh, đóng gói cẩn thận.' },
              { name: 'Trần Văn Minh', role: 'Kiến trúc sư, TP.HCM', stars: 5, text: 'Mình thích nhất là cách họ chọn sản phẩm — không chỉ đẹp mà còn thực sự tiện dụng. Kệ đựng gia vị mình mua vẫn dùng tốt sau 2 năm.' },
              { name: 'Phạm Thu Hương', role: 'Giáo viên, Đà Nẵng', stars: 5, text: 'Lần đầu order online mà hàng vượt quá mong đợi. Đèn ngủ gỗ rất xinh và ánh sáng nhẹ nhàng, phù hợp phòng trẻ em. Sẽ ủng hộ dài dài!' },
            ].map((t, i) => (
              <div className="dg-testimonial" key={i} data-reveal data-delay={`${i + 1}`}>
                <p className="dg-testimonial__stars">{'★'.repeat(t.stars)}</p>
                <p className="dg-testimonial__text">"{t.text}"</p>
                <div className="dg-testimonial__author">
                  <div className="dg-testimonial__avatar">
                    <div style={{ width: '100%', height: '100%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {t.name[0]}
                    </div>
                  </div>
                  <div>
                    <p className="dg-testimonial__name">{t.name}</p>
                    <p className="dg-testimonial__role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy row */}
      <section className="dg-section dg-section--alt" style={{ padding: 'clamp(32px,5vw,52px) 0' }}>
        <div className="dg-container">
          <div className="dg-policy-row" data-reveal>
            {[
              { icon: '🚚', title: 'Giao hàng miễn phí', desc: 'Đơn từ 500.000đ trở lên được miễn phí vận chuyển toàn quốc' },
              { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Không hài lòng? Chúng tôi sẽ đổi hoặc hoàn tiền trong 30 ngày' },
              { icon: '✅', title: 'Hàng chính hãng', desc: 'Cam kết 100% sản phẩm chính hãng, có chứng nhận xuất xứ rõ ràng' },
              { icon: '🛡️', title: 'Bảo hành chính sách', desc: 'Bảo hành theo tiêu chuẩn nhà sản xuất, hỗ trợ kỹ thuật miễn phí' },
            ].map((p, i) => (
              <div className="dg-policy-item" key={i}>
                <div className="dg-policy-icon" style={{ fontSize: 22 }}>{p.icon}</div>
                <div>
                  <p className="dg-policy-title">{p.title}</p>
                  <p className="dg-policy-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dg-about-cta">
        <div className="dg-container">
          <h2 className="dg-about-cta__title">Sẵn sàng nâng tầm không gian sống?</h2>
          <p className="dg-about-cta__sub">Khám phá hơn 500 sản phẩm đồ gia dụng chất lượng cao của chúng tôi</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/san-pham" className="dg-btn dg-btn--primary dg-btn--lg">
              Mua sắm ngay
            </Link>
            <Link to="/lien-he" className="dg-btn dg-btn--outline dg-btn--lg" style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}>
              Liên hệ chúng tôi
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
