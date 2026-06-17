import { useEffect, useRef } from 'react'

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
}

interface Props {
  settings: Record<string, string>
  slides: Slide[]
}

export default function HeroSlider({ settings, slides }: Props) {
  const slide = slides[0]
  const bgRef = useRef<HTMLDivElement>(null)
  const title = slide?.title || 'Vị <em>biển</em><br>trên<br>bàn ăn.'
  const subtitle = slide?.subtitle || 'Mỗi con tôm, mỗi con cua — đều được đưa thẳng từ biển về bàn của bạn trong ngày. Không qua cấp đông, không ướp lạnh lâu.'
  const btnText = slide?.button_text || 'Đặt bàn ngay'
  const btnLink = slide?.button_link || '/dat-ban'
  const bgImage = slide?.image || 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=1400&q=60&auto=format&fit=crop'

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.backgroundImage = `url('${bgImage}')`
    }
  }, [bgImage])

  return (
    <section className="hero">
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-overlay" />
      <div className="wd-container w-100 position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-6">
            <div className="hero-badge">🌊 Hải Sản Tươi Sống Mỗi Ngày</div>
            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="hero-sub">{subtitle}</p>
            <div className="d-flex gap-3 flex-wrap">
              <a href="/thuc-don" className="btn-white">Xem thực đơn →</a>
              <a href={btnLink} className="btn-accent">{btnText}</a>
            </div>
            <div className="hero-meta">
              <div className="hm-item"><span className="hm-dot" />Nhập hải sản mỗi sáng</div>
              <div className="hm-item"><span className="hm-dot" />Bể sống tại nhà hàng</div>
              <div className="hm-item"><span className="hm-dot" />4.9 ★ 640+ đánh giá</div>
              <div className="hm-item"><span className="hm-dot" />{settings.working_hours || '10:00 – 22:00 hàng ngày'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
