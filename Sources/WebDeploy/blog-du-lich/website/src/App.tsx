import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation, useSearchParams } from 'react-router-dom'
import { SiteProvider, useSite } from './contexts/SiteContext'
import { api } from './api/client'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import PostList, { type PostCardData } from './components/PostList'
import NewsletterForm from './components/NewsletterForm'
import About from './components/About'
import Contact from './components/Contact'
import PostDetail from './components/PostDetail'

export interface Faq { id: number; question: string; answer: string }
export interface Destination { id: number; name: string; category_label: string; image: string }
interface HomePost extends PostCardData { featured?: number }

// Trả về props data-reveal[+delay] cho phần tử thứ i trong 1 nhóm (khớp pattern PostList).
function revealAt(i: number): Record<string, string> {
  const p: Record<string, string> = { 'data-reveal': '' }
  if (i > 0 && i < 4) p[`data-reveal-d${i}`] = ''
  return p
}

// Tiêu đề có cú pháp *chữ* -> <strong> (in đậm không nghiêng) — khớp bản template gốc.
function renderTitle(text: string) {
  return (text || '').split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*')
      ? <strong key={i}>{part.slice(1, -1)}</strong>
      : <span key={i}>{part}</span>
  )
}

function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null
  return (
    <div className="bdl-faq-list" data-reveal data-reveal-d1>
      {faqs.map((f, i) => (
        <details key={f.id} className="bdl-faq-item" open={i === 0}>
          <summary>{f.question}<span className="bdl-faq-icon">+</span></summary>
          <p className="bdl-faq-a">{f.answer}</p>
        </details>
      ))}
    </div>
  )
}

/* ─────────────────────────  TRANG CHỦ  ───────────────────────── */
function HomePage() {
  const { settings } = useSite()
  const [posts, setPosts] = useState<HomePost[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    api.get<HomePost[]>('/public/posts?limit=100').then(setPosts).catch(() => null)
    api.get<Faq[]>('/public/faqs').then(setFaqs).catch(() => null)
    api.get<Destination[]>('/public/destinations').then(setDestinations).catch(() => null)
  }, [])

  useDocumentMeta({
    title: settings.meta_title || 'Xê Dịch — Travel Journal | Blog Du Lịch Kinh Nghiệm Thực Tế',
    description: settings.meta_description || settings.site_description,
  })

  const featured = posts.find(p => p.featured) || posts[0]
  const latest = posts.filter(p => p.id !== featured?.id).slice(0, 6)

  const guides = [1, 2, 3, 4, 5]
    .map(n => ({
      title: settings[`home_guide${n}_title`],
      desc: settings[`home_guide${n}_desc`],
      time: settings[`home_guide${n}_time`],
    }))
    .filter(g => g.title)

  const stats = [1, 2, 3, 4]
    .map(n => ({
      num: settings[`home_stat${n}_number`],
      suffix: settings[`home_stat${n}_suffix`] || '',
      label: settings[`home_stat${n}_label`],
    }))
    .filter(s => s.num)

  return (
    <>
      <HeroSlider />

      {featured && (
        <section className="bdl-sec-pad">
          <div className="bdl-container">
            <div className="bdl-eyebrow" data-reveal>Bài viết nổi bật tuần này</div>
            <Link to={`/bai-viet/${featured.slug}`} className="bdl-cover" data-reveal data-reveal-d1>
              {featured.thumbnail && <img src={featured.thumbnail} alt={featured.title} loading="lazy" />}
              <div className="bdl-cover-overlay" />
              <div className="bdl-cover-body">
                {featured.category_name && <span className={`bdl-stamp-tag ${featured.tag_class || ''}`}>{featured.category_name}</span>}
                <h2 className="bdl-cover-title">{featured.title}</h2>
                <p className="bdl-cover-excerpt">{featured.excerpt}</p>
                <div className="bdl-cover-meta">
                  <span>{settings.author_name || 'Lam Trang'}</span><span>·</span>
                  <span>{featured.published_date}</span><span>·</span>
                  <span>{featured.read_time} phút đọc</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="bdl-sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="bdl-container">
            <div className="bdl-sec-head-row" data-reveal>
              <div>
                <div className="bdl-eyebrow">Mới cập nhật</div>
                <h2 className="bdl-sec-title">Bài viết <strong>mới nhất</strong></h2>
              </div>
              <Link to="/chuyen-muc" className="bdl-sec-more">Xem tất cả bài viết →</Link>
            </div>
            <PostList posts={latest} />
          </div>
        </section>
      )}

      {destinations.length > 0 && (
        <section className="bdl-sec-pad">
          <div className="bdl-container">
            <div className="bdl-sec-head" data-reveal>
              <div className="bdl-eyebrow">{settings.home_bento_label || 'Được độc giả yêu thích nhất'}</div>
              <h2 className="bdl-sec-title">{renderTitle(settings.home_bento_title || 'Điểm đến *đáng ghi vào sổ tay*')}</h2>
              {settings.home_bento_sub && <p className="bdl-sec-sub">{settings.home_bento_sub}</p>}
            </div>
            <div className="bdl-bento" data-reveal data-reveal-d1>
              {destinations.map(d => (
                <Link key={d.id} to="/chuyen-muc" className="bdl-bento-item">
                  {d.image && <img src={d.image} alt={d.name} loading="lazy" />}
                  <div className="bdl-bento-overlay" />
                  <div className="bdl-bento-cap">
                    <div className="bdl-bento-name">{d.name}</div>
                    <div className="bdl-bento-sub">{d.category_label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section className="bdl-stat-bar">
          <div className="bdl-container">
            <div className="bdl-stats-grid">
              {stats.map((s, i) => (
                <div key={i} {...revealAt(i)}>
                  <div className="bdl-stat-num">{s.num}{s.suffix}</div>
                  <div className="bdl-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="bdl-sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="bdl-container">
            <div className="bdl-sec-head-row" data-reveal>
              <div>
                <div className="bdl-eyebrow">{settings.home_guide_label || 'Cẩm nang du lịch'}</div>
                <h2 className="bdl-sec-title">{renderTitle(settings.home_guide_title || 'Đọc trước khi *xách balo lên đường*')}</h2>
              </div>
              <Link to="/cam-nang-du-lich" className="bdl-sec-more">Xem toàn bộ cẩm nang →</Link>
            </div>
            <div className="bdl-list-elegant" data-reveal data-reveal-d1>
              {guides.map((g, i) => (
                <div className="bdl-list-row" key={i}>
                  <span className="bdl-list-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="bdl-list-main">
                    <Link to="/cam-nang-du-lich" className="bdl-list-name">{g.title}</Link>
                    <div className="bdl-list-desc">{g.desc}</div>
                  </div>
                  <span className="bdl-list-meta">{g.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bdl-sec-pad">
        <div className="bdl-container">
          <div className="bdl-sec-head bdl-center bdl-mx-auto" style={{ maxWidth: 640 }} data-reveal>
            <div className="bdl-eyebrow" style={{ justifyContent: 'center' }}>Hỏi đáp</div>
            <h2 className="bdl-sec-title">Câu hỏi <strong>thường gặp</strong></h2>
            <p className="bdl-sec-sub bdl-mx-auto" style={{ textAlign: 'center' }}>
              Những thắc mắc độc giả hay gửi về cho {settings.site_name || 'Xê Dịch'} — nếu câu hỏi của bạn chưa có ở đây, cứ nhắn qua trang Liên hệ nhé.
            </p>
          </div>
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="bdl-full-bleed" data-reveal>
        <div className="bdl-container">
          <h2 className="bdl-fb-title">{renderTitle(settings.home_newsletter_title || 'Đừng bỏ lỡ *hành trình tiếp theo*')}</h2>
          <p className="bdl-fb-sub">{settings.home_newsletter_sub || 'Đăng ký nhận bản tin để cập nhật bài viết mới, mẹo du lịch độc quyền và ưu đãi từ các đối tác lữ hành của Xê Dịch.'}</p>
          <NewsletterForm variant="hero" />
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────  CHUYÊN MỤC  ───────────────────────── */
function CategoryPage() {
  const { categories, settings } = useSite()
  const [posts, setPosts] = useState<PostCardData[]>([])
  const [params, setParams] = useSearchParams()
  const active = params.get('cat') || 'all'
  const q = params.get('q') || ''

  useEffect(() => {
    api.get<PostCardData[]>('/public/posts?limit=100').then(setPosts).catch(() => null)
  }, [])

  useDocumentMeta({
    title: `Chuyên mục — ${settings.site_name || 'Xê Dịch'}`,
    description: settings.categories_hero_sub || 'Duyệt bài viết theo từng chủ đề trên Xê Dịch.',
  })

  const filtered = useMemo(() => {
    let list = posts
    if (active !== 'all') list = list.filter(p => p.category_slug === active)
    if (q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(needle) ||
        p.excerpt.toLowerCase().includes(needle) ||
        (p.tag_class || '').toLowerCase().includes(needle)
      )
    }
    return list
  }, [posts, active, q])

  function selectCat(slug: string) {
    const next = new URLSearchParams(params)
    if (slug === 'all') next.delete('cat'); else next.set('cat', slug)
    setParams(next)
  }

  return (
    <>
      <header className="bdl-page-hero">
        <div className="bdl-container">
          <div className="bdl-eyebrow" style={{ color: '#e0b568' }}>Toàn bộ nội dung blog</div>
          <h1 className="bdl-ph-title">Chuyên mục</h1>
          <p className="bdl-ph-sub">{settings.categories_hero_sub || 'Duyệt bài viết theo từng chủ đề — điểm đến trong nước, quốc tế, mẹo du lịch, review lưu trú và ẩm thực vùng miền.'}</p>
        </div>
      </header>

      <section className="bdl-sec-pad">
        <div className="bdl-container">
          <div className="bdl-cat-tabs" data-reveal>
            <button className={`bdl-cat-tab${active === 'all' ? ' active' : ''}`} onClick={() => selectCat('all')}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} className={`bdl-cat-tab${active === c.slug ? ' active' : ''}`} onClick={() => selectCat(c.slug)}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          <div className="bdl-cat-panel active" data-reveal data-reveal-d1>
            {filtered.length > 0
              ? <PostList posts={filtered} />
              : <p style={{ color: 'var(--text-2)', padding: '32px 0' }}>Chưa có bài viết nào trong chuyên mục này.</p>}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────  CẨM NANG DU LỊCH  ───────────────────────── */
function GuidePage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Cẩm nang du lịch — ${settings.site_name || 'Xê Dịch'}`,
    description: settings.guide_hero_sub || 'Toàn bộ kinh nghiệm du lịch được đúc kết từ hàng trăm chuyến đi thực tế.',
  })

  const features = [1, 2, 3, 4]
    .map(n => ({ icon: settings[`guide_feature${n}_icon`], title: settings[`guide_feature${n}_title`], text: settings[`guide_feature${n}_text`] }))
    .filter(f => f.title)

  const strips = [1, 2, 3]
    .map(n => ({
      label: settings[`guide_strip${n}_label`],
      title: settings[`guide_strip${n}_title`],
      text1: settings[`guide_strip${n}_text1`],
      text2: settings[`guide_strip${n}_text2`],
      image: settings[`guide_strip${n}_image`],
    }))
    .filter(s => s.title)

  const timeline = [1, 2, 3, 4, 5, 6]
    .map(n => ({ label: settings[`guide_timeline${n}_label`], title: settings[`guide_timeline${n}_title`], text: settings[`guide_timeline${n}_text`] }))
    .filter(t => t.title)

  return (
    <>
      <header className="bdl-page-hero">
        <div className="bdl-container">
          <div className="bdl-eyebrow" style={{ color: '#e0b568' }}>Đọc trước khi lên đường</div>
          <h1 className="bdl-ph-title">Cẩm nang du lịch</h1>
          <p className="bdl-ph-sub">{settings.guide_hero_sub || 'Toàn bộ kinh nghiệm được đúc kết từ hàng trăm chuyến đi thực tế — từ chuẩn bị giấy tờ, đóng gói hành lý đến cách tiết kiệm chi phí và giữ an toàn cho bản thân.'}</p>
        </div>
      </header>

      {features.length > 0 && (
        <section className="bdl-sec-pad">
          <div className="bdl-container">
            <div className="bdl-sec-head" data-reveal>
              <div className="bdl-eyebrow">Bước chuẩn bị</div>
              <h2 className="bdl-sec-title">Trước khi <strong>xách balo lên đường</strong></h2>
              <p className="bdl-sec-sub">4 việc cần làm sớm nhất, càng chuẩn bị kỹ càng đỡ phát sinh vấn đề giữa chuyến đi.</p>
            </div>
            <div className="bdl-feature-row" data-reveal data-reveal-d1>
              {features.map((f, i) => (
                <div className="bdl-feature-item" key={i}>
                  <div className="bdl-feature-icon">{f.icon}</div>
                  <h3 className="bdl-feature-title">{f.title}</h3>
                  <p className="bdl-feature-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {strips.map((s, i) => (
        <section className="bdl-sec-pad" style={i % 2 === 0 ? { background: 'var(--surface)' } : undefined} key={i}>
          <div className="bdl-container">
            <div className="bdl-strip" data-reveal>
              <div className="bdl-strip-media">
                <span className="bdl-strip-num">{i + 1}</span>
                {s.image && <img src={s.image} alt={s.title} loading="lazy" />}
              </div>
              <div>
                <div className="bdl-strip-label">{s.label}</div>
                <h3 className="bdl-strip-title">{s.title}</h3>
                {s.text1 && <p className="bdl-strip-text">{s.text1}</p>}
                {s.text2 && <p className="bdl-strip-text">{s.text2}</p>}
              </div>
            </div>
          </div>
        </section>
      ))}

      {timeline.length > 0 && (
        <section className="bdl-sec-pad">
          <div className="bdl-container">
            <div className="bdl-sec-head" data-reveal>
              <div className="bdl-eyebrow">Lộ trình chuẩn bị</div>
              <h2 className="bdl-sec-title">Các bước lên kế hoạch cho <strong>một chuyến đi</strong></h2>
            </div>
            <div className="bdl-timeline" data-reveal data-reveal-d1>
              {timeline.map((t, i) => (
                <div className="bdl-tl-item" key={i}>
                  <div className="bdl-tl-dot">{i + 1}</div>
                  <div className="bdl-tl-year">{t.label}</div>
                  <div className="bdl-tl-title">{t.title}</div>
                  <p className="bdl-tl-text">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bdl-full-bleed" data-reveal>
        <div className="bdl-container">
          <h2 className="bdl-fb-title">{renderTitle(settings.guide_cta_title || 'Nhận cẩm nang du lịch *mới mỗi tuần*')}</h2>
          <p className="bdl-fb-sub">{settings.guide_cta_text || 'Đăng ký để nhận thêm những mẹo du lịch chuyên sâu không đăng công khai trên blog, gửi thẳng vào email của bạn.'}</p>
          <NewsletterForm variant="hero" />
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────  TRANG PHÁP LÝ  ───────────────────────── */
function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Chính sách bảo mật — ${settings.site_name || 'Xê Dịch'}`, description: 'Chính sách bảo mật của Xê Dịch Travel Journal.' })
  return (
    <>
      <header className="bdl-page-hero">
        <div className="bdl-container">
          <h1 className="bdl-ph-title">Chính sách bảo mật</h1>
          <p className="bdl-ph-sub">Áp dụng cho toàn bộ website {settings.site_name || 'Xê Dịch Travel Journal'}.</p>
        </div>
      </header>
      <section className="bdl-sec-pad">
        <div className="bdl-container" style={{ maxWidth: 780 }}>
          <p className="bdl-updated">Cập nhật lần cuối: 20/08/2026</p>
          <div className="bdl-legal-body" data-reveal>
            <h2>1. Thông tin chúng tôi thu thập</h2>
            <p>Khi bạn đăng ký nhận bản tin, để lại bình luận hoặc gửi tin nhắn qua form liên hệ, chúng tôi thu thập các thông tin bạn chủ động cung cấp: họ tên, địa chỉ email, nội dung tin nhắn. Chúng tôi cũng thu thập dữ liệu truy cập ẩn danh (trang được xem, thời gian truy cập, trình duyệt) thông qua công cụ phân tích website để cải thiện trải nghiệm đọc.</p>
            <h2>2. Mục đích sử dụng thông tin</h2>
            <ul>
              <li>Gửi bản tin email theo đúng tần suất đã thông báo (tối đa 1 email/tuần).</li>
              <li>Phản hồi câu hỏi, góp ý hoặc đề xuất hợp tác gửi qua form liên hệ.</li>
              <li>Phân tích lượng truy cập để cải thiện nội dung và trải nghiệm đọc bài.</li>
            </ul>
            <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
            <p>Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân của độc giả cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được chia sẻ với đối tác kỹ thuật (nền tảng gửi email, lưu trữ website) ở mức cần thiết để vận hành dịch vụ, và các đối tác này đều có cam kết bảo mật riêng.</p>
            <h2>4. Cookie</h2>
            <p>Website sử dụng cookie cơ bản để ghi nhớ trạng thái đăng ký bản tin và thống kê lượt truy cập ẩn danh. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng của trang có thể không hoạt động đầy đủ.</p>
            <h2>5. Quyền của độc giả</h2>
            <p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân của mình bất kỳ lúc nào bằng cách gửi yêu cầu qua trang <Link to="/lien-he">Liên hệ</Link>. Với bản tin email, bạn có thể huỷ đăng ký ngay trong email nhận được chỉ với 1 cú click, không cần liên hệ thêm.</p>
            <h2>6. Bảo mật dữ liệu</h2>
            <p>Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để bảo vệ thông tin của bạn khỏi truy cập trái phép. Tuy nhiên, không có phương thức truyền tải dữ liệu qua Internet nào an toàn tuyệt đối — bạn cung cấp thông tin trên tinh thần tự nguyện và hiểu rõ rủi ro này.</p>
            <h2>7. Liên hệ</h2>
            <p>Mọi câu hỏi về chính sách bảo mật, vui lòng liên hệ qua trang <Link to="/lien-he">Liên hệ</Link>.</p>
          </div>
        </div>
      </section>
    </>
  )
}

function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Điều khoản sử dụng — ${settings.site_name || 'Xê Dịch'}`, description: 'Điều khoản sử dụng website Xê Dịch Travel Journal.' })
  return (
    <>
      <header className="bdl-page-hero">
        <div className="bdl-container">
          <h1 className="bdl-ph-title">Điều khoản sử dụng</h1>
          <p className="bdl-ph-sub">Vui lòng đọc kỹ trước khi sử dụng website {settings.site_name || 'Xê Dịch Travel Journal'}.</p>
        </div>
      </header>
      <section className="bdl-sec-pad">
        <div className="bdl-container" style={{ maxWidth: 780 }}>
          <p className="bdl-updated">Cập nhật lần cuối: 20/08/2026</p>
          <div className="bdl-legal-body" data-reveal>
            <h2>1. Quyền sở hữu nội dung</h2>
            <p>Toàn bộ bài viết, hình ảnh và video trên Xê Dịch (trừ khi có ghi chú khác) là sản phẩm gốc của blog, được bảo vệ bởi luật sở hữu trí tuệ hiện hành.</p>
            <h2>2. Quyền sử dụng lại nội dung</h2>
            <ul>
              <li>Bạn có thể trích dẫn một phần nội dung cho mục đích phi thương mại kèm liên kết dẫn nguồn về bài viết gốc.</li>
              <li>Không được sao chép nguyên văn bài viết, hình ảnh gốc để đăng lại trên kênh khác nhằm mục đích thương mại mà không có sự đồng ý bằng văn bản.</li>
            </ul>
            <h2>3. Nội dung do người dùng đóng góp</h2>
            <p>Khi bạn để lại bình luận hoặc gửi bài viết đóng góp, bạn xác nhận nội dung đó là của bạn hoặc bạn có quyền chia sẻ, và đồng ý cho Xê Dịch sử dụng, biên tập để đăng tải (có ghi tên bạn) nếu phù hợp.</p>
            <h2>4. Nội dung tài trợ / hợp tác</h2>
            <p>Mọi bài viết có yếu tố hợp tác trả phí đều được gắn nhãn rõ ràng ("Nội dung hợp tác"). Các bài review khác là trải nghiệm và chi phí tự chi trả.</p>
            <h2>5. Giới hạn trách nhiệm</h2>
            <ul>
              <li>Thông tin về giá vé, giá phòng, lịch trình có thể thay đổi theo thời gian và mùa vụ — vui lòng xác nhận lại với nhà cung cấp dịch vụ trước khi đặt.</li>
              <li>Xê Dịch không chịu trách nhiệm về các quyết định du lịch của bạn dựa trên nội dung blog — mọi thông tin chỉ mang tính tham khảo từ trải nghiệm cá nhân.</li>
            </ul>
            <h2>6. Liên kết ngoài</h2>
            <p>Website có thể chứa liên kết đến các trang bên thứ ba. Xê Dịch không chịu trách nhiệm về nội dung hoặc chính sách của các trang này.</p>
            <h2>7. Thay đổi điều khoản</h2>
            <p>Xê Dịch có thể cập nhật điều khoản sử dụng theo thời gian. Phiên bản mới nhất luôn được đăng tại trang này kèm ngày cập nhật.</p>
            <h2>8. Liên hệ</h2>
            <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua trang <Link to="/lien-he">Liên hệ</Link>.</p>
          </div>
        </div>
      </section>
    </>
  )
}

function NotFoundPage() {
  useDocumentMeta({ title: 'Không tìm thấy trang — Xê Dịch' })
  return (
    <div className="bdl-container" style={{ padding: '160px 0 100px', textAlign: 'center' }}>
      <h1 className="bdl-ph-title">Không tìm thấy trang</h1>
      <p className="bdl-ph-sub" style={{ margin: '12px auto 24px' }}>Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>
      <Link to="/" className="bdl-btn bdl-btn-accent">Về trang chủ</Link>
    </div>
  )
}

/* ─────────────────────────  APP SHELL  ───────────────────────── */
function AppShell() {
  const location = useLocation()
  const { loaded } = useSite()

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  // Quan sát [data-reveal] và thêm .visible khi phần tử lọt vào viewport.
  // Đặt ở AppShell (bọc <Routes>) — không lặp trong từng page. MutationObserver
  // bắt cả nội dung render bất đồng bộ sau khi fetch xong.
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const scan = (root: ParentNode = document) =>
      root.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    const t = setTimeout(() => scan(), 0)
    const mo = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return
      if (node.matches('[data-reveal]') && !node.classList.contains('visible')) io.observe(node)
      scan(node)
    })))
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname, loaded])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chuyen-muc" element={<CategoryPage />} />
        <Route path="/cam-nang-du-lich" element={<GuidePage />} />
        <Route path="/bai-viet/:slug" element={<PostDetail />} />
        <Route path="/ve-toi" element={<About />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <AppShell />
    </SiteProvider>
  )
}
