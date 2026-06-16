import { useEffect } from 'react'
import { useSite } from '../App'

const strips = [
  {
    num: '01',
    title: 'Không gian sang trọng',
    desc: 'Mỗi góc nhỏ trong nhà hàng được thiết kế tỉ mỉ, pha trộn giữa kiến trúc cổ điển Pháp và hơi thở Đông Dương — tạo nên không gian độc đáo, ấm cúng và tinh tế.',
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80',
    reverse: false,
  },
  {
    num: '02',
    title: 'Nguyên liệu thượng hạng',
    desc: 'Từ cá hồi Na Uy tươi sống đến truffle đen Périgord, từ bơ Normandie đến saffron Iran — chúng tôi chỉ chọn những nguyên liệu tốt nhất thế giới cho từng món ăn.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    reverse: true,
  },
  {
    num: '03',
    title: 'Nghệ nhân bếp chuyên nghiệp',
    desc: 'Đội ngũ bếp với 15 năm kinh nghiệm tại các nhà hàng Michelin — mỗi món ăn là tác phẩm nghệ thuật, được hoàn thiện với kỹ thuật tinh tế và tâm huyết không ngừng.',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80',
    reverse: false,
  },
]

export default function About() {
  const { settings } = useSite()

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
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

  const aboutTitle = settings.about_title || 'Câu chuyện của <em>La Maison</em>'
  const aboutContent = settings.about_content || 'Được thành lập năm 2008, La Maison là điểm hẹn của những tâm hồn yêu ẩm thực tinh tế. Chúng tôi tin rằng một bữa ăn ngon là sự kết hợp hoàn hảo giữa nguyên liệu, kỹ thuật và tình cảm người đầu bếp gửi gắm.'

  return (
    <section id="gioi-thieu">
      {/* Intro header */}
      <div className="sec-pad" style={{ textAlign: 'center', background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="eyebrow" data-reveal>Về chúng tôi</div>
          <h2
            className="sec-title"
            style={{ maxWidth: 600, margin: '0 auto 14px' }}
            dangerouslySetInnerHTML={{ __html: aboutTitle }}
            data-reveal
          />
          <p className="sec-sub" style={{ margin: '0 auto' }} data-reveal>
            {aboutContent}
          </p>
        </div>
      </div>

      {/* Experience strips */}
      {strips.map((strip) => (
        <div
          key={strip.num}
          className={`exp-strip${strip.reverse ? ' reverse' : ''}`}
          style={strip.reverse ? { direction: 'rtl' } : {}}
        >
          <div className="es-img" style={strip.reverse ? { direction: 'ltr' } : {}}>
            <img src={strip.image} alt={strip.title} />
          </div>
          <div className="es-content" style={strip.reverse ? { direction: 'ltr' } : {}}>
            <div className="es-num" data-reveal>{strip.num}</div>
            <h3 className="es-title" data-reveal>{strip.title}</h3>
            <p className="es-desc" data-reveal>{strip.desc}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
