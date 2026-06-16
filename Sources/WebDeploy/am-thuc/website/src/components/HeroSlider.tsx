import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { slides, settings } = useSite()

  const activeSlides = slides.filter(s => s.status === 'published')
  const slide = activeSlides[0] || {
    title: 'Hương vị đích thực Việt Nam',
    subtitle: 'Mỗi món ăn là một câu chuyện — được nấu từ nguyên liệu tươi sạch, công thức gia truyền và tấm lòng người đầu bếp.',
    button_text: 'Đặt bàn ngay',
    button_link: '/dat-ban',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60&auto=format&fit=crop',
  }

  const phone = settings.site_phone || '0901 234 567'
  const workingHours = settings.working_hours || 'Mở cửa 10:00 – 22:00'
  const firstHours = workingHours.split('|')[0]?.trim() || '10:00 – 22:00'

  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: slide.image ? `url('${slide.image}')` : undefined }}
      />
      <div className="hero-overlay" />
      <div className="wd-container w-100 position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-md-6">
            <div className="hero-badge">✦ Nhà hàng ẩm thực truyền thống</div>
            <h1 className="hero-title">
              {slide.title.includes('\n')
                ? slide.title.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)
                : slide.title
              }
            </h1>
            <p className="hero-sub">{slide.subtitle}</p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/thuc-don" className="btn-white">Xem thực đơn →</Link>
              <Link to="/dat-ban" className="btn-accent">Đặt bàn ngay</Link>
            </div>
            <div className="hero-meta">
              <div className="hm-item"><span className="hm-dot" />{firstHours}</div>
              <div className="hm-item"><span className="hm-dot" />150 chỗ ngồi</div>
              <div className="hm-item"><span className="hm-dot" />4.9 ★ 380+ đánh giá</div>
              {phone && <div className="hm-item"><span className="hm-dot" />{phone}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
