'use client'

interface Props {
  title?: string; subtitle?: string
  btn1Label?: string; btn1Target?: string
  btn2Label?: string; btn2Target?: string
}

export default function CTASection({ title, subtitle, btn1Label, btn1Target, btn2Label, btn2Target }: Props) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <section id="cta" className="cta-section">
      <div className="wd-container reveal">
        <h2 className="cta-title">{title || 'Sẵn sàng có website đẹp?'}</h2>
        <p className="cta-sub">{subtitle || 'Bắt đầu ngay hôm nay. Bàn giao trong 3–5 ngày làm việc.'}</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
          <button className="btn-cw" onClick={() => scrollTo(btn1Target || 'templates')}>{btn1Label || 'Xem mẫu thiết kế →'}</button>
          <button className="btn-cg" onClick={() => scrollTo(btn2Target || 'pricing')}>{btn2Label || 'Tư vấn miễn phí'}</button>
        </div>
      </div>
    </section>
  )
}
