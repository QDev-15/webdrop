import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface TimelineItem { id: number; year: string; title: string; description: string }
interface Testimonial { id: number; author_name: string; author_role: string; author_avatar: string; content: string; rating: number }

const PRINCIPLES = [
  { icon: 'bi-check2-circle', title: 'Nấu trước khi đăng', desc: 'Mọi công thức đều được tôi nấu thử ít nhất 3 lần trước khi chia sẻ, để đảm bảo ai làm theo cũng thành công.' },
  { icon: 'bi-eye', title: 'Minh bạch với độc giả', desc: 'Bài review luôn ghi rõ nếu là hợp tác trả phí — độc giả có quyền biết điều đó trước khi đọc.' },
  { icon: 'bi-heart', title: 'Ẩm thực Việt là trọng tâm', desc: 'Dù có thử nhiều món quốc tế, tôi luôn dành phần lớn nội dung cho món ăn Việt và nguyên liệu quen thuộc.' },
  { icon: 'bi-chat-dots', title: 'Lắng nghe bình luận', desc: 'Rất nhiều công thức trên Bếp Xanh đã được điều chỉnh nhờ góp ý thật lòng của độc giả sau khi làm thử.' },
]

export default function About() {
  const { settings, posts } = useSite()
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<TimelineItem[]>('/public/timeline').then(setTimeline).catch(() => null)
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => null)
  }, [])

  useDocumentMeta({
    title: `Về tôi — ${settings.about_founder_name || 'Bếp Xanh'}`,
    description: 'Câu chuyện đằng sau Bếp Xanh — hành trình từ một căn bếp nhỏ đến blog ẩm thực được hàng trăm nghìn độc giả theo dõi mỗi tháng.',
  })

  const gallery = posts.filter(p => p.image).slice(0, 6)

  return (
    <>
      <section className="bam-sec" style={{ paddingTop: 150 }}>
        <div className="bam-container">
          <div className="bam-strip" data-reveal>
            <div>
              <div className="bam-eyebrow">Xin chào, tôi là {settings.about_founder_name?.split(' ').pop() || 'Minh Anh'}</div>
              <h1 className="bam-sec-title" style={{ marginBottom: 20 }}>Người đứng sau <em>{settings.site_name || 'Bếp Xanh'}</em></h1>
              <p style={{ fontSize: 15.5, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: 18 }}>{settings.about_intro_p1}</p>
              <p style={{ fontSize: 15.5, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: 28 }}>{settings.about_intro_p2}</p>
              <div className="bam-recipe-author">
                {settings.about_founder_avatar && <img src={settings.about_founder_avatar} alt={`Ảnh đại diện ${settings.about_founder_name}`} />}
                <div>
                  <div className="bam-recipe-author-name">{settings.about_founder_name}</div>
                  <div className="bam-recipe-author-date">{settings.about_founder_role}</div>
                </div>
              </div>
            </div>
            {settings.about_founder_image && (
              <div className="bam-strip-img">
                <img src={settings.about_founder_image} alt="Hình ảnh minh họa Bếp Xanh" loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </section>

      {timeline.length > 0 && (
        <section className="bam-sec" style={{ background: 'var(--bg)' }}>
          <div className="bam-container">
            <div className="bam-sec-head center" data-reveal>
              <div className="bam-eyebrow">Hành trình</div>
              <h2 className="bam-sec-title">{settings.stat_years || '8'} năm cùng <em>{settings.site_name || 'Bếp Xanh'}</em></h2>
            </div>
            <div className="bam-timeline" data-reveal data-reveal-d1>
              {timeline.map(item => (
                <div key={item.id} className="bam-tl-item">
                  <div className="bam-tl-content"><div className="bam-tl-year">{item.year}</div><div className="bam-tl-title">{item.title}</div><p className="bam-tl-desc">{item.description}</p></div>
                  <div className="bam-tl-dot" />
                  <div className="bam-tl-spacer" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bam-sec">
        <div className="bam-container">
          <div className="bam-sec-head center" data-reveal>
            <div className="bam-eyebrow">Nguyên tắc làm nghề</div>
            <h2 className="bam-sec-title">Điều tôi <em>tin tưởng</em></h2>
          </div>
          <div className="bam-feature-row" data-reveal data-reveal-d1>
            {PRINCIPLES.map(p => (
              <div key={p.title} className="bam-feature-item">
                <div className="bam-feature-icon"><i className={`bi ${p.icon}`} /></div>
                <div className="bam-feature-title">{p.title}</div>
                <div className="bam-feature-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="bam-sec" style={{ background: 'var(--bg)' }}>
          <div className="bam-container">
            <div className="bam-sec-head" data-reveal>
              <div className="bam-eyebrow">Hậu trường</div>
              <h2 className="bam-sec-title">Một vài khoảnh khắc <em>trong bếp</em></h2>
            </div>
            <div className="bam-masonry" data-reveal data-reveal-d1>
              {gallery.map(p => <img key={p.id} src={p.image} alt={p.title} loading="lazy" />)}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bam-sec">
          <div className="bam-container">
            <div className="bam-sec-head center" data-reveal>
              <div className="bam-eyebrow">Độc giả nói gì</div>
              <h2 className="bam-sec-title">Câu chuyện từ <em>người đọc</em></h2>
            </div>
            <div className="row g-4" data-reveal data-reveal-d1>
              {testimonials.map(t => (
                <div key={t.id} className="col-md-4">
                  <div className="bam-testi-card">
                    <div className="bam-testi-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                    <p className="bam-testi-text">"{t.content}"</p>
                    <div className="bam-testi-person">
                      {t.author_avatar && <img src={t.author_avatar} alt={`Ảnh đại diện độc giả ${t.author_name}`} />}
                      <div><div className="bam-testi-name">{t.author_name}</div><div className="bam-testi-role">{t.author_role}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bam-sec-sm">
        <div className="bam-container">
          <div className="bam-newsletter" data-reveal>
            <div>
              <div className="bam-newsletter-title">Muốn hợp tác hoặc chỉ đơn giản là chào tôi?</div>
              <p className="bam-newsletter-desc">Tôi luôn đọc và trả lời mọi email — kể cả những email chỉ để góp ý một công thức chưa ổn.</p>
            </div>
            <Link to="/lien-he" className="bam-btn bam-btn-primary">Gửi lời chào <i className="bi bi-arrow-right" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
