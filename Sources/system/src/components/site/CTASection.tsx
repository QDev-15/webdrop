'use client'

export default function CTASection() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section id="cta" className="cta-section">
      <div className="wd-container reveal">
        <h2 className="cta-title">Sẵn sàng có website đẹp?</h2>
        <p className="cta-sub">Bắt đầu ngay hôm nay. Bàn giao trong 3–5 ngày làm việc.</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
          <button className="btn-cw" onClick={() => scrollTo('templates')}>Xem mẫu thiết kế →</button>
          <button className="btn-cg" onClick={() => scrollTo('pricing')}>Tư vấn miễn phí</button>
        </div>
      </div>
    </section>
  )
}
