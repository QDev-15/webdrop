import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { renderTitle } from '../utils/text'
import HeroSlider from '../components/HeroSlider'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'tiet-kiem': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9h-1V6a3 3 0 0 0-3-3H7a1 1 0 0 0-1 1v2H5a1 1 0 0 0-1 1v3a2 2 0 0 0 2 2h.28a5 5 0 0 0 1.72 2.24V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h2v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4.76A5 5 0 0 0 20 9.24V9z"/><circle cx="16" cy="8" r=".5" fill="currentColor"/></svg>,
  'dau-tu': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>,
  'quan-ly-no': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
  'ngan-sach': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  'bao-hiem': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'huu-tri': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="23" y2="18"/><line x1="23" y1="22" x2="1" y2="22"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/></svg>,
}

function fmtDate(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function HomePage() {
  const { settings, categories, posts, testimonials, faqs } = useSite()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [newsletterSent, setNewsletterSent] = useState(false)

  useDocumentMeta({
    title: settings.meta_title || 'La Bàn Tài Chính — Blog tài chính cá nhân',
    description: settings.meta_description,
  })

  useCounterAnimation([posts.length, categories.length, settings.stat_years_active])

  const bentoMain = posts.find(p => p.home_section === 'bento_main')
  const bentoSide = posts.filter(p => p.home_section === 'bento_side').sort((a, b) => a.home_order - b.home_order).slice(0, 3)
  const latest = posts.filter(p => p.home_section === 'latest').sort((a, b) => a.home_order - b.home_order).slice(0, 4)
  const homeCategories = categories.filter(c => c.show_on_home === 1)

  async function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setNewsletterSent(true)
    e.currentTarget.reset()
    setTimeout(() => setNewsletterSent(false), 2400)
  }

  return (
    <>
      <HeroSlider />

      {/* STAT-BAR */}
      <section className="btc-sec-dark">
        <div className="wd-container">
          <div className="btc-stats-grid">
            <div data-reveal><div className="btc-stat-num" data-counter={posts.length}>0</div><div className="btc-stat-label">Bài viết đã đăng</div></div>
            <div data-reveal data-delay="1"><div className="btc-stat-num" data-counter={settings.stat_monthly_readers_num || '42'} data-suffix={settings.stat_monthly_readers_suffix || 'k'}>0</div><div className="btc-stat-label">Độc giả mỗi tháng</div></div>
            <div data-reveal data-delay="2"><div className="btc-stat-num" data-counter={homeCategories.length}>0</div><div className="btc-stat-label">Chuyên mục kiến thức</div></div>
            <div data-reveal data-delay="3"><div className="btc-stat-num" data-counter={settings.stat_years_active || '5'}>0</div><div className="btc-stat-label">Năm hoạt động</div></div>
          </div>
        </div>
      </section>

      {/* BENTO-GRID — Bài viết nổi bật */}
      {bentoMain && (
        <section className="btc-sec">
          <div className="wd-container">
            <div className="btc-head-row" data-reveal>
              <div>
                <div className="btc-tag">{settings.home_bento_tag || 'Đang được đọc nhiều nhất'}</div>
                <h2 className="btc-h2">{renderTitle(settings.home_bento_title || 'Bài viết *nổi bật*')}</h2>
              </div>
              <Link to="/chuyen-muc" className="btc-head-link">
                Xem tất cả bài viết
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
            <div className="btc-bento" data-reveal data-delay="1">
              <Link to={`/bai-viet/${bentoMain.slug}`} className="btc-post-card btc-bento-main">
                <div className="btc-post-thumb">
                  {bentoMain.category_name && <span className="btc-post-cat">{bentoMain.category_name}</span>}
                  <img src={bentoMain.thumbnail} alt={bentoMain.title} />
                </div>
                <div className="btc-post-body">
                  <h3 className="btc-post-title">{bentoMain.title}</h3>
                  <p className="btc-post-excerpt">{bentoMain.excerpt}</p>
                  <div className="btc-post-meta">
                    {bentoMain.author_avatar && <img src={bentoMain.author_avatar} alt={bentoMain.author_name} />}
                    <span>{bentoMain.author_name}</span><span>·</span><span>{fmtDate(bentoMain.published_at)}</span><span>·</span><span>{bentoMain.read_time} phút đọc</span>
                  </div>
                </div>
              </Link>
              <div className="btc-bento-side">
                {bentoSide.map(p => (
                  <Link key={p.id} to={`/bai-viet/${p.slug}`} className="btc-post-card">
                    <div className="btc-post-thumb">
                      {p.category_name && <span className="btc-post-cat">{p.category_name}</span>}
                      <img src={p.thumbnail} alt={p.title} />
                    </div>
                    <div className="btc-post-body">
                      <h3 className="btc-post-title">{p.title}</h3>
                      <div className="btc-post-meta"><span>{fmtDate(p.published_at)}</span><span>·</span><span>{p.read_time} phút đọc</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURE-ICON-ROW — Chuyên mục */}
      <section className="btc-sec btc-sec-tint">
        <div className="wd-container">
          <div className="btc-center" data-reveal style={{ marginBottom: 40 }}>
            <div className="btc-tag" style={{ justifyContent: 'center' }}>{settings.home_category_tag || 'Khám phá theo chủ đề'}</div>
            <h2 className="btc-h2">{renderTitle(settings.home_category_title || `${homeCategories.length} *chuyên mục* kiến thức`)}</h2>
            <p className="btc-sub btc-mx-auto btc-center">{settings.home_category_sub}</p>
          </div>
          <div className="btc-cat-row" data-reveal data-delay="1">
            {homeCategories.map(c => (
              <Link key={c.id} to={`/chuyen-muc?cat=${c.slug}`} className="btc-cat-item">
                <span className="btc-cat-icon">{CATEGORY_ICONS[c.slug] ?? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/></svg>}</span>
                <span className="btc-cat-name">{c.name}</span>
                <span className="btc-cat-count">{c.post_count} bài viết</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GRID-CARDS — Bài viết mới nhất */}
      {latest.length > 0 && (
        <section className="btc-sec">
          <div className="wd-container">
            <div className="btc-head-row" data-reveal>
              <div>
                <div className="btc-tag">{settings.home_latest_tag || 'Cập nhật liên tục'}</div>
                <h2 className="btc-h2">{renderTitle(settings.home_latest_title || 'Bài viết *mới nhất*')}</h2>
              </div>
              <Link to="/chuyen-muc" className="btc-head-link">
                Xem tất cả
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
            <div className="btc-grid-cards" data-reveal data-delay="1">
              {latest.map(p => (
                <Link key={p.id} to={`/bai-viet/${p.slug}`} className="btc-post-card">
                  <div className="btc-post-thumb">
                    {p.category_name && <span className="btc-post-cat">{p.category_name}</span>}
                    <img src={p.thumbnail} alt={p.title} />
                  </div>
                  <div className="btc-post-body">
                    <h3 className="btc-post-title">{p.title}</h3>
                    <p className="btc-post-excerpt">{p.excerpt}</p>
                    <div className="btc-post-meta"><span>{fmtDate(p.published_at)}</span><span>·</span><span>{p.read_time} phút đọc</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ALTERNATING-STRIPS — Công cụ tính toán nổi bật */}
      <section className="btc-sec btc-sec-tint">
        <div className="wd-container">
          <div className="btc-strip" data-reveal>
            <div className="btc-strip-text">
              <div className="btc-tag">{settings.home_tool1_tag || 'Công cụ miễn phí'}</div>
              <h2 className="btc-h2">{renderTitle(settings.home_tool1_title || 'Tính *lãi kép* chỉ trong vài giây')}</h2>
              <p className="btc-sub">{settings.home_tool1_desc}</p>
              <div className="btc-strip-list">
                <div className="btc-strip-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Có thể thêm khoản đóng góp hàng tháng</div>
                <div className="btc-strip-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Tùy chỉnh tần suất ghép lãi</div>
                <div className="btc-strip-list-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Trực quan hóa gốc và lãi bằng biểu đồ</div>
              </div>
              <Link to="/cong-cu-tinh-toan" className="btc-btn btc-btn-primary" style={{ marginTop: 28 }}>Mở công cụ tính lãi kép</Link>
            </div>
            <div className="btc-strip-visual">
              <div className="btc-tool-mock">
                <div className="btc-tool-mock-row"><span>Số tiền gốc</span><strong>50.000.000 đ</strong></div>
                <div className="btc-tool-mock-row"><span>Đóng góp / tháng</span><strong>2.000.000 đ</strong></div>
                <div className="btc-tool-mock-row"><span>Lãi suất kỳ vọng</span><strong>9% / năm</strong></div>
                <div className="btc-tool-mock-row"><span>Sau 20 năm</span><strong>1.636.231.000 đ</strong></div>
              </div>
            </div>
          </div>
          <div className="btc-strip rev" data-reveal>
            <div className="btc-strip-text">
              <div className="btc-tag">{settings.home_tool2_tag || 'Quy tắc 50/30/20'}</div>
              <h2 className="btc-h2">{renderTitle(settings.home_tool2_title || 'Lập ngân sách *không đau đầu*')}</h2>
              <p className="btc-sub">{settings.home_tool2_desc}</p>
              <Link to="/cong-cu-tinh-toan" className="btc-btn btc-btn-ghost" style={{ marginTop: 28 }}>Mở công cụ lập ngân sách</Link>
            </div>
            <div className="btc-strip-visual">
              <div className="btc-tool-mock">
                <div className="btc-tool-mock-row"><span>50% Nhu cầu thiết yếu</span><strong>7.500.000 đ</strong></div>
                <div className="btc-tool-mock-row"><span>30% Mong muốn cá nhân</span><strong>4.500.000 đ</strong></div>
                <div className="btc-tool-mock-row"><span>20% Tiết kiệm / trả nợ</span><strong>3.000.000 đ</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIST-ELEGANT — Nhận xét độc giả */}
      {testimonials.length > 0 && (
        <section className="btc-sec">
          <div className="wd-container" style={{ maxWidth: 880 }}>
            <div className="btc-center" data-reveal style={{ marginBottom: 40 }}>
              <div className="btc-tag" style={{ justifyContent: 'center' }}>{settings.home_testi_tag || 'Độc giả nói gì'}</div>
              <h2 className="btc-h2">{renderTitle(settings.home_testi_title || 'Câu chuyện từ *người đọc*')}</h2>
            </div>
            <div className="btc-testi-list" data-reveal data-delay="1">
              {testimonials.map(t => (
                <div className="btc-testi-item" key={t.id}>
                  <div className="btc-testi-person">
                    {t.avatar && <img src={t.avatar} alt={t.name} />}
                    <div><div className="btc-testi-name">{t.name}</div><div className="btc-testi-role">{t.role}</div></div>
                  </div>
                  <div className="btc-testi-quote">&quot;{t.content}&quot;</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="btc-sec btc-sec-tint">
          <div className="wd-container">
            <div className="btc-center" data-reveal style={{ marginBottom: 36 }}>
              <div className="btc-tag" style={{ justifyContent: 'center' }}>{settings.home_faq_tag || 'Giải đáp thắc mắc'}</div>
              <h2 className="btc-h2">{renderTitle(settings.home_faq_title || 'Câu hỏi *thường gặp*')}</h2>
            </div>
            <div className="btc-faq-list" data-reveal data-delay="1">
              {faqs.map((f, i) => (
                <div className={`btc-faq-item${openFaq === i ? ' open' : ''}`} key={f.id}>
                  <button className="btc-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.question}</span>
                    <span className="btc-faq-q-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
                  </button>
                  <div className="btc-faq-a" style={openFaq === i ? { maxHeight: 400 } : undefined}>
                    <div className="btc-faq-a-in">{f.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band + Newsletter */}
      <section className="btc-sec-sm">
        <div className="wd-container">
          <div className="btc-cta-band" data-reveal>
            <div>
              <div className="btc-cta-title">{renderTitle(settings.home_cta_title || 'Nhận bài viết mới mỗi tuần *miễn phí*')}</div>
              <div className="btc-cta-sub">{settings.home_cta_sub}</div>
            </div>
            <form className="btc-cta-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder={newsletterSent ? 'Đã đăng ký!' : 'Email của bạn'} required />
              <button type="submit" className="btc-btn btc-btn-white">{newsletterSent ? 'Đã đăng ký!' : 'Đăng ký ngay'}</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
