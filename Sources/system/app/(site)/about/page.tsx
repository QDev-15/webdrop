import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import Link from 'next/link'

export const metadata = {
  title:      'Về chúng tôi — webdrop.vn',
  description: 'Tìm hiểu về webdrop.vn — đội ngũ chuyên cung cấp mẫu website đẹp và dịch vụ triển khai website trọn gói cho doanh nghiệp Việt Nam.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_URL || 'https://webdrop.vn'}/about` },
}

const team = [
  { name: 'Nguyễn Hữu Quỳnh', role: 'Founder & Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&crop=face' },
  { name: 'Trần Minh Anh', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&fit=crop&crop=face' },
  { name: 'Lê Văn Đức', role: 'Frontend Developer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop&crop=face' },
]

const values = [
  { icon: '⚡', title: 'Nhanh chóng', desc: 'Từ lúc đặt hàng đến khi có website chạy được, chỉ 3–5 ngày làm việc.' },
  { icon: '🎯', title: 'Chất lượng', desc: 'Mọi template đều đạt PageSpeed 90+, responsive hoàn hảo từ mobile đến 4K.' },
  { icon: '🤝', title: 'Hỗ trợ tận tâm', desc: 'Hỗ trợ miễn phí 30 ngày sau bàn giao, không bỏ rơi khách.' },
  { icon: '💰', title: 'Giá hợp lý', desc: 'Mức giá phù hợp mọi ngân sách từ startup nhỏ đến doanh nghiệp lớn.' },
]

const stats = [
  { num: '127+', label: 'Khách hàng hài lòng' },
  { num: '30+', label: 'Mẫu website' },
  { num: '4.9★', label: 'Đánh giá trung bình' },
  { num: '3 ngày', label: 'Thời gian bàn giao TB' },
]

export default function AboutPage() {
  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        {/* Hero */}
        <section style={{ background: 'var(--dark2)', padding: 'clamp(64px,10vw,100px) 0 clamp(48px,7vw,72px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div className="reveal" style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Về chúng tôi</div>
            <h1 className="reveal" style={{ fontSize: 'clamp(30px,4.5vw,56px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 18 }}>
              Chúng tôi xây website <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>đẹp</em>,<br />bạn tập trung vào kinh doanh
            </h1>
            <p className="reveal reveal-d1" style={{ fontSize: 'clamp(14px,1.5vw,18px)', fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: 560, margin: '0 auto 36px' }}>
              webdrop.vn ra đời từ 2024 với sứ mệnh giúp doanh nghiệp Việt Nam có website chuyên nghiệp với chi phí và thời gian tối thiểu.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: 'var(--dark)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div className="wd-container">
            <div className="row g-0">
              {stats.map((s, i) => (
                <div key={s.label} className="col-6 col-md-3 reveal" style={{ padding: 'clamp(24px,4vw,40px)', borderRight: i < 3 ? '1px solid rgba(255,255,255,.06)' : 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-.5px', marginBottom: 6 }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 300 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="sec-pad">
          <div className="wd-container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5 reveal">
                <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80&auto=format&fit=crop" alt="Team webdrop" style={{ width: '100%', borderRadius: 16, objectFit: 'cover', aspectRatio: '4/3' }} loading="lazy" />
              </div>
              <div className="col-lg-7">
                <div className="eyebrow reveal">Câu chuyện của chúng tôi</div>
                <h2 className="sec-title reveal reveal-d1">Từ <em>frustration</em> đến giải pháp</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    'webdrop.vn được thành lập khi chúng tôi nhận ra rằng hầu hết doanh nghiệp Việt Nam phải chờ đợi 2–3 tháng và trả hàng chục triệu cho một website cơ bản.',
                    'Chúng tôi quyết định thay đổi điều đó: xây dựng thư viện template chất lượng cao, có thể deploy ngay trong vài ngày với chi phí hợp lý.',
                    'Đến nay, chúng tôi đã giúp hơn 127 doanh nghiệp từ nhà hàng, spa, agency đến công ty luật có được website đẹp và chuyên nghiệp.',
                  ].map((text, i) => (
                    <p key={i} className={`reveal reveal-d${i + 1}`} style={{ fontSize: 15, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.8 }}>{text}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="sec-pad" style={{ background: 'var(--warm)' }}>
          <div className="wd-container">
            <div className="text-center reveal mb-5">
              <div className="eyebrow">Giá trị cốt lõi</div>
              <h2 className="sec-title">Những điều chúng tôi <em>cam kết</em></h2>
            </div>
            <div className="row g-3">
              {values.map((v, i) => (
                <div key={v.title} className="col-md-6 col-lg-3">
                  <div className={`reveal reveal-d${i + 1}`} style={{ background: 'var(--surface)', borderRadius: 14, padding: '28px 24px', border: '1px solid var(--border)', height: '100%' }}>
                    <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{v.title}</div>
                    <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="sec-pad">
          <div className="wd-container">
            <div className="text-center reveal mb-5">
              <div className="eyebrow">Đội ngũ</div>
              <h2 className="sec-title">Những người <em>tạo nên</em> webdrop</h2>
            </div>
            <div className="row g-4 justify-content-center">
              {team.map((m, i) => (
                <div key={m.name} className="col-md-4">
                  <div className={`reveal reveal-d${i + 1} text-center`}>
                    <img src={m.avatar} alt={m.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-light)', marginBottom: 14 }} />
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 400 }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sec-pad" style={{ background: 'var(--dark2)', textAlign: 'center' }}>
          <div className="wd-container">
            <h2 className="reveal" style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 600, color: '#fff', marginBottom: 16 }}>Sẵn sàng bắt đầu?</h2>
            <p className="reveal reveal-d1" style={{ color: 'rgba(255,255,255,.45)', fontWeight: 300, marginBottom: 28 }}>Liên hệ để được tư vấn miễn phí về giải pháp phù hợp</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap reveal reveal-d2">
              <Link href="/templates" style={{ padding: '13px 28px', background: '#fff', color: 'var(--dark)', borderRadius: 9, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Xem mẫu thiết kế</Link>
              <Link href="/contact" style={{ padding: '13px 28px', background: 'transparent', color: 'rgba(255,255,255,.65)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 9, fontSize: 14, textDecoration: 'none' }}>Liên hệ tư vấn</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
