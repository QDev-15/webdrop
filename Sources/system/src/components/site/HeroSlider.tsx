'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

const TOTAL = 5
const AUTO_MS = 5000

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const slides = [
  {
    bg: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1400&q=60&auto=format&fit=crop',
    badge: 'Website chuyên nghiệp · Triển khai trọn gói',
    content: (
      <>
        <h1 className="sl-title">Chọn mẫu đẹp,<br />tôi <em>cài đặt</em><span className="muted">cho bạn.</span></h1>
        <p className="sl-sub">Hơn 30 mẫu thiết kế hiện đại cho mọi ngành nghề. Thanh toán xong — website hoàn chỉnh trong 3–5 ngày làm việc, không cần biết kỹ thuật.</p>
        <div className="sl-actions">
          <button className="btn-sl-p" onClick={() => scrollTo('templates')}>Xem mẫu thiết kế →</button>
          <button className="btn-sl-o" onClick={() => scrollTo('how')}>Cách hoạt động</button>
        </div>
        <div className="sl-stats">
          <div><div className="sl-stat-num">127+</div><div className="sl-stat-label">Khách hàng</div></div>
          <div><div className="sl-stat-num">30+</div><div className="sl-stat-label">Mẫu thiết kế</div></div>
          <div><div className="sl-stat-num">3–5</div><div className="sl-stat-label">Ngày bàn giao</div></div>
          <div><div className="sl-stat-num">4.9 ★</div><div className="sl-stat-label">Đánh giá trung bình</div></div>
        </div>
      </>
    ),
  },
  {
    bg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=60&auto=format&fit=crop',
    badge: 'Tại sao chọn webdrop.vn',
    content: (
      <>
        <h1 className="sl-title">Không chỉ là<br /><em>template</em><span className="muted">— là dịch vụ.</span></h1>
        <div className="sl-features">
          {[
            ['⚡', <>Bàn giao trong <strong style={{color:'rgba(255,255,255,.8)',fontWeight:500}}>3–5 ngày làm việc</strong>, không kéo dài hàng tháng</>],
            ['🎨', <>Hơn 30 mẫu thiết kế hiện đại, <strong style={{color:'rgba(255,255,255,.8)',fontWeight:500}}>responsive</strong> hoàn toàn trên mọi thiết bị</>],
            ['🔧', <>Cài đặt, setup hosting, domain, SSL — <strong style={{color:'rgba(255,255,255,.8)',fontWeight:500}}>tất cả trong một gói</strong></>],
            ['🛡️', 'Hoàn tiền 100% trong 7 ngày nếu không hài lòng'],
          ].map(([icon, text], i) => (
            <div key={i} className="sl-feat"><div className="sl-feat-icon">{icon as string}</div>{text as React.ReactNode}</div>
          ))}
        </div>
        <div className="sl-actions">
          <button className="btn-sl-p" onClick={() => scrollTo('how')}>Xem quy trình →</button>
          <button className="btn-sl-o" onClick={() => scrollTo('pricing')}>Xem bảng giá</button>
        </div>
        <div className="sl-tags">
          {['SEO chuẩn','PageSpeed 90+','Hỗ trợ tiếng Việt','Gói duy trì hàng tháng'].map(t => <span key={t} className="sl-tag">{t}</span>)}
        </div>
      </>
    ),
  },
  {
    bg: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=60&auto=format&fit=crop',
    badge: '30+ mẫu thiết kế sẵn có',
    content: (
      <>
        <h1 className="sl-title">Mẫu cho<br /><em>mọi ngành</em><span className="muted">nghề.</span></h1>
        <div className="sl-cards">
          {[['🏢','Giới thiệu công ty','Chuyên nghiệp, tối ưu chuyển đổi'],['💼','Portfolio cá nhân','Showcase công việc ấn tượng'],['🍜','Nhà hàng & F&B','Menu, đặt bàn, địa chỉ'],['✍️','Blog cá nhân','Viết bài, phân loại, SEO'],['💆','Spa & Làm đẹp','Dịch vụ, đặt lịch, đội ngũ'],['💬','Forum & Community','Q&A, thảo luận, thành viên']].map(([icon,title,desc]) => (
            <div key={title} className="sl-card"><div className="sl-card-icon">{icon}</div><div className="sl-card-title">{title}</div><div className="sl-card-desc">{desc}</div></div>
          ))}
        </div>
        <div className="sl-actions">
          <button className="btn-sl-p" onClick={() => scrollTo('templates')}>Xem tất cả mẫu →</button>
        </div>
      </>
    ),
  },
  {
    bg: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1400&q=60&auto=format&fit=crop',
    badge: 'Giá minh bạch, không phát sinh',
    content: (
      <>
        <h1 className="sl-title">Phù hợp với<br /><em>mọi ngân sách</em><span className="muted">.</span></h1>
        <div className="sl-pricing">
          <div className="sl-pkg"><div className="sl-pkg-name">Starter</div><div className="sl-pkg-price">1.200.000đ</div><div className="sl-pkg-desc">Mẫu + source code, tự cài đặt theo hướng dẫn</div></div>
          <div className="sl-pkg hot"><div className="sl-pkg-badge">PHỔ BIẾN NHẤT</div><div className="sl-pkg-name">Standard</div><div className="sl-pkg-price">2.500.000đ</div><div className="sl-pkg-desc">Cài đặt trọn gói · Hosting · Domain · Nội dung</div></div>
          <div className="sl-pkg"><div className="sl-pkg-name">Premium</div><div className="sl-pkg-price">12.000.000đ</div><div className="sl-pkg-desc">Thiết kế custom độc quyền theo yêu cầu</div></div>
        </div>
        <div className="sl-actions">
          <button className="btn-sl-p" onClick={() => scrollTo('pricing')}>Xem chi tiết bảng giá →</button>
          <button className="btn-sl-o" onClick={() => scrollTo('templates')}>Xem mẫu trước</button>
        </div>
        <div className="sl-tags">
          {['Hosting 1 năm included','Hoàn tiền 7 ngày','Hỗ trợ 30 ngày'].map(t => <span key={t} className="sl-tag">{t}</span>)}
        </div>
      </>
    ),
  },
  {
    bg: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=60&auto=format&fit=crop',
    badge: '127 khách hàng đã tin tưởng',
    content: (
      <>
        <h1 className="sl-title" style={{visibility:'hidden',height:0,margin:0}}>Testimonial</h1>
        <span className="sl-quote-mark">&ldquo;</span>
        <p className="sl-quote">Tôi không biết gì về website nhưng chỉ cần điền form brief là xong. 4 ngày sau có website đẹp hơn tôi tưởng tượng. Khách hàng hỏi &ldquo;ai làm web cho bạn vậy?&rdquo;</p>
        <div className="sl-author">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop&crop=face"
            style={{width:44,height:44,borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'1px solid rgba(74,222,128,.25)'}} alt="Nguyễn Lan Anh" />
          <div><div className="sl-author-name">Nguyễn Lan Anh</div><div className="sl-author-role">Chủ Spa Lavender · Hà Nội · Gói Standard</div></div>
        </div>
        <div style={{marginTop:24}}>
          <div className="sl-actions">
            <button className="btn-sl-p" onClick={() => scrollTo('templates')}>Đặt hàng ngay →</button>
            <button className="btn-sl-o" onClick={() => scrollTo('reviews')}>Xem thêm đánh giá</button>
          </div>
        </div>
      </>
    ),
  },
]

export default function HeroSlider() {
  const [cur, setCur] = useState(0)
  const [anim, setAnim] = useState<{ [key: number]: string }>({ 0: 'active' })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goSlide = useCallback((next: number, dir?: 'next' | 'prev') => {
    setCur(prev => {
      if (next === prev) return prev
      const d = dir ?? (next > prev ? 'next' : 'prev')
      const leaveClass = d === 'next' ? 'leaving-left' : 'leaving-right'
      const enterClass = d === 'next' ? 'entering-right' : 'entering-left'
      setAnim({ [prev]: leaveClass, [next]: `active ${enterClass}` })
      setTimeout(() => setAnim({ [prev]: '', [next]: 'active' }), 750)
      return next
    })
  }, [])

  const resetAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCur(c => {
        const next = (c + 1) % TOTAL
        goSlide(next, 'next')
        return c
      })
    }, AUTO_MS)
  }, [goSlide])

  useEffect(() => { resetAuto(); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [resetAuto])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (window.scrollY > window.innerHeight * .6) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { goSlide((cur + 1) % TOTAL, 'next'); resetAuto() }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { goSlide((cur - 1 + TOTAL) % TOTAL, 'prev'); resetAuto() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [cur, goSlide, resetAuto])

  return (
    <div className="hero" id="hero">
      <div className="hero-grain" />
      <div className="hero-glow glow-1" />
      <div className="hero-glow glow-2" />
      <div className="hero-glow glow-3" />
      <div className="slides-wrap">
        {slides.map((s, i) => (
          <div key={i} className={`slide ${anim[i] ?? ''}`} data-idx={i}>
            <div style={{position:'absolute',inset:0,backgroundImage:`url('${s.bg}')`,backgroundSize:'cover',backgroundPosition:'center',opacity:.07,zIndex:0}} />
            <div className="wd-container w-100">
              <div className="slide-inner">
                <div className="sl-badge"><span className="sl-badge-dot" />{s.badge}</div>
                {s.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-bottom">
        <div className="slide-indicators">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} className={`si${cur === i ? ' active' : ''}`}
              onClick={() => { goSlide(i); resetAuto() }} />
          ))}
        </div>
      </div>
    </div>
  )
}
