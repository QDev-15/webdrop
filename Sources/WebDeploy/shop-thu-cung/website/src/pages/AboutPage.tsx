import { useEffect, useState } from 'react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TIMELINE = [
  { year: '2021', title: 'Cửa hàng đầu tiên', desc: 'Pet Haus mở cửa hàng vật lý đầu tiên tại TP.HCM với 15 dòng sản phẩm cơ bản.' },
  { year: '2022', title: 'Mở rộng danh mục', desc: 'Bổ sung nhóm sản phẩm Chuồng & Nhà ở, hợp tác thêm 3 thương hiệu quốc tế.' },
  { year: '2024', title: 'Bán hàng toàn quốc', desc: 'Ra mắt kênh bán online, giao hàng toàn quốc trong 1-4 ngày làm việc.' },
  { year: '2026', title: '8.500+ khách hàng tin tưởng', desc: 'Pet Haus tiếp tục mở rộng danh mục và đội ngũ tư vấn thú cưng chuyên sâu.' },
]

const TEAM = [
  { name: 'Thảo Vy', role: 'Nhà sáng lập', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80' },
  { name: 'Đức Anh', role: 'Chuyên viên tư vấn dinh dưỡng', image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Kim Ngân', role: 'Kiểm soát chất lượng', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&auto=format&fit=crop&q=80' },
  { name: 'Hoàng Long', role: 'Chăm sóc khách hàng', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
]

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const step = Math.ceil(target / 60) || 1
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setValue(cur)
      if (cur >= target) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [target])
  return <>{value}{suffix}</>
}

export default function AboutPage() {
  useDocumentMeta({
    title: 'Giới thiệu — Pet Haus',
    description: 'Giới thiệu Pet Haus — câu chuyện thương hiệu, cam kết an toàn cho thú cưng, đội ngũ tư vấn.',
  })

  return (
    <>
      <section className="tc-page-header">
        <div className="tc-container tc-page-header-inner">
          <div className="tc-eyebrow">Câu chuyện của chúng tôi</div>
          <h1>Vì mỗi bé cưng<br />đều xứng đáng được chăm sóc tốt nhất</h1>
          <p>Pet Haus ra đời từ tình yêu dành cho thú cưng — chúng tôi chọn lọc từng sản phẩm như thể đang mua cho chính bé nhà mình.</p>
        </div>
      </section>

      <section className="tc-sec">
        <div className="tc-container">
          <div className="tc-strip" data-reveal>
            <div className="tc-strip-img"><img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80" alt="Chú chó vui vẻ trong cửa hàng thú cưng" loading="lazy" /></div>
            <div className="tc-strip-content">
              <div className="tc-eyebrow" style={{ color: 'var(--accent-h)' }}>Khởi đầu</div>
              <h3>Từ một cửa hàng nhỏ đến người bạn đồng hành</h3>
              <p>Pet Haus bắt đầu từ một cửa hàng nhỏ ở TP.HCM, nơi người sáng lập từng loay hoay tìm thức ăn phù hợp cho chú chó bị dị ứng của mình. Trải nghiệm đó thôi thúc chúng tôi xây dựng một nơi mà bất kỳ &quot;con sen&quot; nào cũng có thể tin tưởng chọn đúng sản phẩm cho bé cưng.</p>
              <p>Đến nay, Pet Haus đã phục vụ hàng nghìn khách hàng trên toàn quốc với hơn 40 dòng sản phẩm được tuyển chọn kỹ lưỡng.</p>
            </div>
          </div>
          <div className="tc-strip tc-rev" data-reveal>
            <div className="tc-strip-img"><img src="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&auto=format&fit=crop&q=80" alt="Chú mèo được chăm sóc kỹ lưỡng" loading="lazy" /></div>
            <div className="tc-strip-content">
              <div className="tc-eyebrow" style={{ color: 'var(--accent-h)' }}>Cam kết</div>
              <h3>An toàn là ưu tiên số một</h3>
              <p>Mọi sản phẩm trước khi lên kệ đều được kiểm tra nguồn gốc, hạn sử dụng và thành phần. Chúng tôi ưu tiên hợp tác với các thương hiệu được bác sĩ thú y khuyên dùng, đồng thời luôn sẵn sàng tư vấn để bạn chọn đúng sản phẩm theo thể trạng của bé cưng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tc-sec-sm tc-sec-alt">
        <div className="tc-container">
          <div className="tc-stat-bar" style={{ background: 'var(--dark)' }} data-reveal>
            <div className="tc-stats-grid">
              <div><div className="tc-stat-num"><Counter target={8500} suffix="+" /></div><div className="tc-stat-label">Khách hàng đã phục vụ</div></div>
              <div><div className="tc-stat-num"><Counter target={42} /></div><div className="tc-stat-label">Sản phẩm tuyển chọn</div></div>
              <div><div className="tc-stat-num"><Counter target={8} /></div><div className="tc-stat-label">Thương hiệu đối tác</div></div>
              <div><div className="tc-stat-num"><Counter target={98} suffix="%" /></div><div className="tc-stat-label">Khách hàng hài lòng</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="tc-sec">
        <div className="tc-container">
          <div className="tc-sec-header tc-center" data-reveal>
            <div className="tc-eyebrow">Hành trình phát triển</div>
            <h2 className="tc-sec-title">Những cột mốc <em>đáng nhớ</em></h2>
          </div>
          <div className="tc-timeline" style={{ maxWidth: 640, margin: '0 auto' }} data-reveal>
            {TIMELINE.map(item => (
              <div className="tc-timeline-item" key={item.year}>
                <div className="tc-timeline-dot"></div>
                <div className="tc-timeline-year">{item.year}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tc-sec tc-sec-alt">
        <div className="tc-container">
          <div className="tc-sec-header tc-center" data-reveal>
            <div className="tc-eyebrow" style={{ color: 'var(--accent-h)' }}>Đội ngũ</div>
            <h2 className="tc-sec-title">Những người <em>yêu thú cưng</em></h2>
            <p className="tc-sec-sub">Đội ngũ Pet Haus đều là người nuôi thú cưng thật — hiểu rõ nhu cầu để tư vấn chính xác nhất.</p>
          </div>
          <div className="row g-4">
            {TEAM.map((m, i) => (
              <div className="col-6 col-lg-3" data-reveal data-delay={String(i + 1)} key={m.name}>
                <div className="tc-prod-card" style={{ borderTopColor: 'var(--accent)' }}>
                  <div className="tc-prod-img-wrap" style={{ aspectRatio: '3/4' }}><img src={m.image} alt={`Chân dung ${m.name}`} loading="lazy" /></div>
                  <div className="tc-prod-body" style={{ textAlign: 'center' }}>
                    <h3 className="tc-prod-name" style={{ minHeight: 'auto' }}>{m.name}</h3>
                    <div className="tc-prod-cat">{m.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tc-sec">
        <div className="tc-container">
          <div className="tc-sec-header tc-center" data-reveal>
            <div className="tc-eyebrow">Cam kết của chúng tôi</div>
            <h2 className="tc-sec-title">Chăm sóc <em>đúng chuẩn</em></h2>
          </div>
          <div className="tc-feature-grid">
            <div className="tc-feature" data-reveal data-delay="1"><div className="tc-feature-icon">🔍</div><h3>Kiểm định trước khi bán</h3><p>Mỗi lô hàng đều được kiểm tra hạn dùng, tem nhãn trước khi lên kệ.</p></div>
            <div className="tc-feature" data-reveal data-delay="2"><div className="tc-feature-icon">🤝</div><h3>Đối tác uy tín</h3><p>Chỉ hợp tác với nhà phân phối chính hãng, có hóa đơn chứng từ rõ ràng.</p></div>
            <div className="tc-feature" data-reveal data-delay="3"><div className="tc-feature-icon">📚</div><h3>Tư vấn dựa trên kiến thức</h3><p>Đội ngũ được đào tạo về dinh dưỡng & chăm sóc thú cưng cơ bản.</p></div>
            <div className="tc-feature" data-reveal data-delay="4"><div className="tc-feature-icon">🌱</div><h3>Phát triển bền vững</h3><p>Ưu tiên bao bì thân thiện môi trường, giảm thiểu rác thải nhựa khi đóng gói.</p></div>
          </div>
        </div>
      </section>
    </>
  )
}
