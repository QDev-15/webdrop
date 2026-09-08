import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation, useSearchParams, Link } from 'react-router-dom'
import { SiteProvider, useSite, Post } from './contexts/SiteContext'
import { api } from './api/client'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import PostGrid, { PostCard, RecipeCard, postLink } from './components/PostList'
import PostDetail from './components/PostDetail'
import RecipeDetail from './components/RecipeDetail'
import About from './components/About'
import Contact from './components/Contact'

// Nguyên tắc "Vì sao đọc Bếp Xanh" — nội dung tĩnh lấy đúng từ bản template gốc (index.html),
// không có bảng riêng trong DB vì đây là nội dung thương hiệu cố định, không cần chỉnh sửa qua admin.
const FEATURES = [
  { icon: 'bi-clipboard-check', title: 'Công thức đã test kỹ', desc: 'Mỗi công thức được nấu thử tối thiểu 3 lần, đo lường chính xác từng gram trước khi đăng.' },
  { icon: 'bi-cash-coin', title: 'Review tự trả tiền', desc: 'Không nhận bài PR — mọi bài review đều là trải nghiệm và hóa đơn thật của Bếp Xanh.' },
  { icon: 'bi-camera', title: 'Hình ảnh từng bước', desc: 'Ảnh minh họa rõ ràng cho từng bước quan trọng, không cần đoán "vừa đủ" là bao nhiêu.' },
  { icon: 'bi-people', title: 'Cộng đồng phản hồi', desc: 'Hàng nghìn bình luận góp ý, chỉnh sửa công thức phù hợp hơn với khẩu vị số đông.' },
]

// Bento chuyên mục nổi bật — 6 ô cố định theo đúng layout .bam-bento (a-f) của template gốc,
// ghép với category thật lấy từ DB theo đúng thứ tự sort_order (rơi vào a→f, thiếu thì bỏ ô đó).
const BENTO_CLASS = ['a', 'b', 'c', 'd', 'e', 'f']

interface Faq { id: number; question: string; answer: string }

function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(faqs[0]?.id ?? null)
  if (faqs.length === 0) return null
  return (
    <div className="bam-faq-list" data-reveal data-reveal-d1>
      {faqs.map(f => (
        <div key={f.id} className={'bam-faq-item' + (open === f.id ? ' open' : '')}>
          <div className="bam-faq-q" onClick={() => setOpen(o => (o === f.id ? null : f.id))} style={{ cursor: 'pointer' }}>
            <span>{f.question}</span>
            <span className="bam-faq-icon"><i className={`bi ${open === f.id ? 'bi-dash' : 'bi-plus'}`} /></span>
          </div>
          {open === f.id && <div className="bam-faq-a"><p>{f.answer}</p></div>}
        </div>
      ))}
    </div>
  )
}

function HomePage() {
  const { categories, posts } = useSite()
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [hot, setHot] = useState<Post[]>([])

  useEffect(() => {
    api.get<Faq[]>('/public/faqs').then(setFaqs).catch(() => null)
    api.get<Post[]>('/public/posts?type=recipe&sort=saved&limit=5').then(setHot).catch(() => null)
  }, [])

  useDocumentMeta({
    title: 'Bếp Xanh — Blog Ẩm Thực: Công Thức Nấu Ăn, Review Quán Ngon & Mẹo Bếp',
    description: 'Bếp Xanh — blog ẩm thực chia sẻ công thức nấu ăn chuẩn vị, review quán ăn ngon thật, và mẹo bếp núc giúp bạn nấu ngon tại nhà mỗi ngày.',
  })

  const featured = posts.find(p => p.featured) || posts[0]
  const latest = posts.filter(p => p.id !== featured?.id).slice(0, 6)

  return (
    <>
      <HeroSlider />

      {categories.length > 0 && (
        <section className="bam-sec">
          <div className="bam-container">
            <div className="bam-sec-head" data-reveal>
              <div className="bam-eyebrow">Khám phá</div>
              <h2 className="bam-sec-title">Chuyên mục <em>nổi bật</em></h2>
              <p className="bam-sec-sub">Chọn đúng chủ đề bạn quan tâm — từ món ăn hằng ngày đến review quán ăn khắp phố phường.</p>
            </div>
            <div className="bam-bento" data-reveal data-reveal-d1>
              {categories.slice(0, 6).map((c, i) => {
                const cp = posts.find(p => p.category_slug === c.slug)
                return (
                  <Link key={c.id} to={`/chuyen-muc?tab=${c.slug}`} className={`bam-bento-item ${BENTO_CLASS[i]}`}>
                    {cp?.image && <img src={cp.image} alt={c.name} loading="lazy" />}
                    <div className="bam-bento-body">
                      <div className="bam-bento-count">{c.post_count} bài viết</div>
                      <div className="bam-bento-name">{c.name}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {featured && (
        <section className="bam-sec-sm">
          <div className="bam-container">
            <div className="bam-featured" data-reveal style={{ position: 'relative' }}>
              <div className="bam-featured-img">
                <img src={featured.image} alt={featured.title} loading="lazy" />
              </div>
              <div className="bam-featured-body">
                <div className="bam-featured-tag">Bài viết nổi bật</div>
                <h3 className="bam-featured-title">{featured.title}</h3>
                <p className="bam-featured-desc">{featured.excerpt}</p>
                <div className="bam-featured-meta">
                  {featured.author_avatar && <img className="bam-featured-av" src={featured.author_avatar} alt={`Ảnh đại diện tác giả ${featured.author_name}`} />}
                  <span>{featured.author_name} · {featured.read_minutes} phút đọc</span>
                </div>
              </div>
              <Link to={postLink(featured)} style={{ position: 'absolute', inset: 0 }} aria-label={`Đọc bài viết ${featured.title}`} />
            </div>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="bam-sec">
          <div className="bam-container">
            <div className="bam-sec-head-row" data-reveal>
              <div>
                <div className="bam-eyebrow">Cập nhật liên tục</div>
                <h2 className="bam-sec-title">Bài viết <em>mới nhất</em></h2>
              </div>
              <Link to="/chuyen-muc" className="bam-btn bam-btn-outline bam-btn-sm">Xem tất cả <i className="bi bi-arrow-right" /></Link>
            </div>
            <div data-reveal data-reveal-d1>
              <PostGrid posts={latest} />
            </div>
          </div>
        </section>
      )}

      {hot.length > 0 && (
        <section className="bam-sec" style={{ background: 'var(--accent-light)' }}>
          <div className="bam-container">
            <div className="bam-sec-head" data-reveal>
              <div className="bam-eyebrow">Được lưu nhiều nhất tuần này</div>
              <h2 className="bam-sec-title">Công thức đang <em>hot</em></h2>
            </div>
            <div className="bam-hscroll" data-reveal data-reveal-d1>
              {hot.map(r => <RecipeCard key={r.id} post={r} />)}
            </div>
          </div>
        </section>
      )}

      <section className="bam-sec-sm">
        <div className="bam-container">
          <div className="bam-stat-bar" data-reveal>
            <div className="bam-stats-grid">
              <div><div className="bam-stat-num">{posts.filter(p => p.type === 'recipe').length || 0}+</div><div className="bam-stat-label">Công thức đã đăng</div></div>
              <div><div className="bam-stat-num">{posts.filter(p => p.category_slug === 'review').length || 0}+</div><div className="bam-stat-label">Quán ăn đã review</div></div>
              <div><div className="bam-stat-num">180k</div><div className="bam-stat-label">Độc giả mỗi tháng</div></div>
              <div><div className="bam-stat-num">8</div><div className="bam-stat-label">Năm chia sẻ bếp núc</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bam-sec">
        <div className="bam-container">
          <div className="bam-sec-head center" data-reveal>
            <div className="bam-eyebrow">Vì sao đọc Bếp Xanh</div>
            <h2 className="bam-sec-title">Nội dung được <em>làm thật</em>, không sao chép</h2>
          </div>
          <div className="bam-feature-row" data-reveal data-reveal-d1>
            {FEATURES.map(f => (
              <div key={f.title} className="bam-feature-item">
                <div className="bam-feature-icon"><i className={`bi ${f.icon}`} /></div>
                <div className="bam-feature-title">{f.title}</div>
                <div className="bam-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bam-sec" id="faq" style={{ background: 'var(--bg)' }}>
        <div className="bam-container-sm">
          <div className="bam-sec-head center" data-reveal>
            <div className="bam-eyebrow">Giải đáp</div>
            <h2 className="bam-sec-title">Câu hỏi <em>thường gặp</em></h2>
            <p className="bam-sec-sub">Những thắc mắc độc giả hay hỏi nhất về Bếp Xanh.</p>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <section className="bam-sec-sm">
        <div className="bam-container">
          <div className="bam-newsletter" data-reveal>
            <div>
              <div className="bam-newsletter-title">Đăng ký nhận bản tin ẩm thực</div>
              <p className="bam-newsletter-desc">Mỗi tuần 1 email — tổng hợp công thức mới, quán ăn đáng thử và mẹo bếp hay nhất.</p>
            </div>
            <form className="bam-newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="email@domain.com" required />
              <button type="submit" className="bam-btn bam-btn-primary">Đăng ký ngay</button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

function CategoryPage() {
  const { categories, posts } = useSite()
  const [params, setParams] = useSearchParams()
  const [popular, setPopular] = useState<Post[]>([])
  const tab = params.get('tab') || 'all'
  const q = params.get('q') || ''

  useEffect(() => {
    api.get<Post[]>('/public/popular-posts?limit=4').then(setPopular).catch(() => null)
  }, [])

  useDocumentMeta({
    title: 'Chuyên mục — Bếp Xanh | Món chính, Tráng miệng, Đồ uống, Review quán ăn',
    description: 'Duyệt bài viết theo chuyên mục: Món chính, Tráng miệng, Đồ uống, Review quán ăn, Mẹo bếp, Ăn lành — tất cả trên Bếp Xanh.',
  })

  const filtered = useMemo(() => {
    let list = posts
    if (tab !== 'all') list = list.filter(p => p.category_slug === tab)
    if (q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(needle) ||
        p.excerpt.toLowerCase().includes(needle) ||
        (p.tags || '').toLowerCase().includes(needle)
      )
    }
    return list
  }, [posts, tab, q])

  function selectTab(slug: string) {
    const next = new URLSearchParams(params)
    if (slug === 'all') next.delete('tab'); else next.set('tab', slug)
    setParams(next)
  }

  return (
    <>
      <header className="bam-page-header">
        <div className="bam-container">
          <div className="bam-breadcrumb"><Link to="/">Trang chủ</Link> / Chuyên mục</div>
          <h1 className="bam-page-title">Chuyên mục</h1>
          <p className="bam-page-sub">Chọn chủ đề bạn quan tâm — bộ lọc hoạt động ngay tức thì, không cần tải lại trang.</p>
        </div>
      </header>

      <section className="bam-sec">
        <div className="bam-container">
          <div className="bam-tabs" data-reveal>
            <button className={'bam-tab' + (tab === 'all' ? ' active' : '')} onClick={() => selectTab('all')}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} className={'bam-tab' + (tab === c.slug ? ' active' : '')} onClick={() => selectTab(c.slug)}>{c.name}</button>
            ))}
          </div>

          <div className="bam-cat-layout">
            <div className="bam-post-grid" data-reveal data-reveal-d1>
              {filtered.length > 0
                ? filtered.map(p => <PostCard key={p.id} post={p} />)
                : <p style={{ color: 'var(--text-2)' }}>Không tìm thấy bài viết phù hợp.</p>}
            </div>

            <aside>
              {popular.length > 0 && (
                <div className="bam-sidebar-widget">
                  <div className="bam-sw-title">Bài viết phổ biến</div>
                  <div className="bam-list-elegant">
                    {popular.map((p, i) => (
                      <Link key={p.id} to={postLink(p)} className="bam-le-item">
                        <span className="bam-le-num">{String(i + 1).padStart(2, '0')}</span>
                        {p.image && <img className="bam-le-thumb" src={p.image} alt={p.title} loading="lazy" />}
                        <div><div className="bam-le-title">{p.title}</div></div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="bam-sidebar-widget">
                <div className="bam-sw-title">Chuyên mục</div>
                <div className="bam-tag-cloud">
                  {categories.map(c => (
                    <button key={c.id} className="bam-tag" style={{ border: 'none', cursor: 'pointer' }} onClick={() => selectTab(c.slug)}>{c.name}</button>
                  ))}
                </div>
              </div>
              <div className="bam-sidebar-widget" style={{ background: 'var(--accent-light)', borderColor: 'transparent' }}>
                <div className="bam-sw-title" style={{ color: 'var(--accent-h)' }}>Bản tin Bếp Xanh</div>
                <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', marginBottom: 16 }}>Nhận công thức mới mỗi tuần qua email.</p>
                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input type="email" placeholder="email@domain.com" style={{ padding: '11px 14px', borderRadius: 9999, border: '1px solid var(--border)', fontSize: 13, outline: 'none' }} required />
                  <button type="submit" className="bam-btn bam-btn-primary bam-btn-sm">Đăng ký</button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

function PrivacyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật — Bếp Xanh', description: 'Chính sách bảo mật của Bếp Xanh — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của độc giả.' })
  return (
    <>
      <header className="bam-page-header">
        <div className="bam-container">
          <div className="bam-breadcrumb"><Link to="/">Trang chủ</Link> / Chính sách bảo mật</div>
          <h1 className="bam-page-title">Chính sách bảo mật</h1>
          <p className="bam-page-sub">Cập nhật lần cuối: 08/09/2026</p>
        </div>
      </header>
      <section className="bam-sec">
        <div className="bam-container-sm bam-legal-body" data-reveal>
          <p>Bếp Xanh (sau đây gọi là "chúng tôi") tôn trọng quyền riêng tư của độc giả. Chính sách này giải thích chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân như thế nào khi bạn truy cập và sử dụng website.</p>

          <h2>1. Thông tin chúng tôi thu thập</h2>
          <ul>
            <li>Họ tên, email, số điện thoại (nếu có) khi bạn điền form liên hệ hoặc đăng ký nhận bản tin.</li>
            <li>Nội dung bình luận bạn để lại dưới bài viết, kèm tên hiển thị và email (không công khai email).</li>
            <li>Dữ liệu truy cập ẩn danh: trang đã xem, thời gian truy cập, loại thiết bị — phục vụ mục đích thống kê.</li>
          </ul>

          <h2>2. Mục đích sử dụng thông tin</h2>
          <ul>
            <li>Phản hồi các câu hỏi, góp ý bạn gửi qua form liên hệ.</li>
            <li>Gửi bản tin định kỳ nếu bạn đã đăng ký — bạn có thể hủy đăng ký bất kỳ lúc nào.</li>
            <li>Cải thiện chất lượng nội dung dựa trên hành vi đọc và phản hồi thực tế.</li>
          </ul>

          <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
          <p>Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân của độc giả cho bên thứ ba vì mục đích thương mại. Thông tin chỉ được chia sẻ trong trường hợp pháp luật yêu cầu hoặc với đơn vị gửi email bản tin (dưới hình thức xử lý dữ liệu thay mặt chúng tôi).</p>

          <h2>4. Cookie và công cụ phân tích</h2>
          <p>Website có thể sử dụng cookie và công cụ phân tích lưu lượng truy cập (ví dụ Google Analytics) để hiểu độc giả đọc nội dung nào nhiều nhất. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể hoạt động không như mong đợi.</p>

          <h2>5. Thời gian lưu trữ dữ liệu</h2>
          <p>Thông tin liên hệ được lưu trữ tối đa 24 tháng kể từ lần tương tác gần nhất, trừ khi bạn yêu cầu xóa sớm hơn.</p>

          <h2>6. Quyền của bạn</h2>
          <ul>
            <li>Yêu cầu xem lại thông tin cá nhân chúng tôi đang lưu trữ về bạn.</li>
            <li>Yêu cầu chỉnh sửa hoặc xóa thông tin không còn chính xác.</li>
            <li>Hủy đăng ký nhận bản tin bất kỳ lúc nào qua liên kết trong email hoặc email trực tiếp cho chúng tôi.</li>
          </ul>

          <h2>7. Liên hệ về quyền riêng tư</h2>
          <p>Nếu có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ qua trang <Link to="/lien-he">Liên hệ</Link>.</p>
        </div>
      </section>
    </>
  )
}

function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng — Bếp Xanh', description: 'Điều khoản sử dụng website Bếp Xanh — quyền sử dụng lại nội dung, chính sách bình luận, nội dung tài trợ và giới hạn trách nhiệm.' })
  return (
    <>
      <header className="bam-page-header">
        <div className="bam-container">
          <div className="bam-breadcrumb"><Link to="/">Trang chủ</Link> / Điều khoản sử dụng</div>
          <h1 className="bam-page-title">Điều khoản sử dụng</h1>
          <p className="bam-page-sub">Cập nhật lần cuối: 08/09/2026</p>
        </div>
      </header>
      <section className="bam-sec">
        <div className="bam-container-sm bam-legal-body" data-reveal>
          <p>Khi truy cập và sử dụng website Bếp Xanh, bạn đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.</p>

          <h2>1. Quyền sở hữu nội dung</h2>
          <p>Toàn bộ công thức, bài viết, hình ảnh và video trên Bếp Xanh (trừ khi có ghi chú khác) là sản phẩm gốc của Bếp Xanh, được bảo vệ bởi luật sở hữu trí tuệ hiện hành.</p>

          <h2>2. Quyền sử dụng lại nội dung</h2>
          <ul>
            <li>Bạn có thể nấu theo công thức và chia sẻ trải nghiệm cá nhân (kèm ảnh món ăn của chính bạn) trên mạng xã hội, có ghi nguồn về Bếp Xanh.</li>
            <li>Không được sao chép nguyên văn bài viết, hình ảnh gốc để đăng lại trên website/kênh khác nhằm mục đích thương mại mà không có sự đồng ý bằng văn bản.</li>
            <li>Trích dẫn một phần nội dung cho mục đích phi thương mại (báo chí, nghiên cứu) cần ghi rõ nguồn kèm liên kết về bài viết gốc.</li>
          </ul>

          <h2>3. Nội dung do người dùng đóng góp (bình luận, công thức gửi về)</h2>
          <p>Khi bạn để lại bình luận hoặc gửi công thức đóng góp, bạn xác nhận nội dung đó là của bạn hoặc bạn có quyền chia sẻ, và đồng ý cho Bếp Xanh sử dụng, chỉnh sửa để đăng tải (có ghi tên bạn) nếu phù hợp.</p>

          <h2>4. Nội dung tài trợ / hợp tác</h2>
          <p>Mọi bài viết có yếu tố hợp tác trả phí đều được gắn nhãn rõ ràng (ví dụ: "Bài viết được tài trợ"). Các bài review khác trên Bếp Xanh là trải nghiệm và chi phí tự chi trả, không nhận thù lao từ đơn vị được nhắc đến.</p>

          <h2>5. Giới hạn trách nhiệm</h2>
          <ul>
            <li>Công thức nấu ăn được chia sẻ dựa trên kinh nghiệm và khẩu vị cá nhân — kết quả thực tế có thể khác nhau tùy nguyên liệu, dụng cụ và tay nghề của mỗi người.</li>
            <li>Bếp Xanh không chịu trách nhiệm về các vấn đề sức khỏe phát sinh do dị ứng thực phẩm — vui lòng kiểm tra thành phần nguyên liệu trước khi chế biến nếu bạn có tiền sử dị ứng.</li>
            <li>Thông tin về quán ăn (địa chỉ, giá cả, giờ mở cửa) có thể thay đổi theo thời gian — vui lòng xác nhận lại trước khi ghé thăm.</li>
          </ul>

          <h2>6. Liên kết ngoài</h2>
          <p>Website có thể chứa liên kết đến các trang bên thứ ba (mạng xã hội, quán ăn được nhắc đến...). Bếp Xanh không chịu trách nhiệm về nội dung hoặc chính sách của các trang này.</p>

          <h2>7. Thay đổi điều khoản</h2>
          <p>Bếp Xanh có thể cập nhật điều khoản sử dụng theo thời gian. Phiên bản mới nhất sẽ luôn được đăng tại trang này kèm ngày cập nhật.</p>

          <h2>8. Liên hệ</h2>
          <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua trang <Link to="/lien-he">Liên hệ</Link>.</p>
        </div>
      </section>
    </>
  )
}

function AppShell() {
  const location = useLocation()
  const { settings } = useSite()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    )

    const observeNew = (root: ParentNode = document) => {
      root.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    }
    const t = setTimeout(() => observeNew(), 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.hasAttribute('data-reveal') && !node.classList.contains('visible')) io.observe(node)
          node.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chuyen-muc" element={<CategoryPage />} />
        <Route path="/cong-thuc-nau-an" element={<RecipeDetail />} />
        <Route path="/cong-thuc-nau-an/:slug" element={<RecipeDetail />} />
        <Route path="/bai-viet/:slug" element={<PostDetail />} />
        <Route path="/ve-toi" element={<About />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
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
