import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { useScrollToTop } from './hooks/useScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import About from './components/About'
import Contact from './components/Contact'

function fmtVND(n: number): string {
  if (!Number.isFinite(n)) return '0 đ'
  return Math.round(n).toLocaleString('vi-VN') + ' đ'
}

type Tab = 'compound' | 'budget' | 'emergency'

// Công cụ tính toán tài chính — port 1:1 công thức từ bản tĩnh (assets/js/main.js),
// tính toán hoàn toàn phía client, không gửi số liệu về server (đúng cam kết trong
// Chính sách bảo mật mục 1: "chỉ được xử lý tại trình duyệt của bạn").
function ToolPage() {
  useDocumentMeta({
    title: 'Công cụ tính toán tài chính cá nhân — La Bàn Tài Chính',
    description: '3 công cụ miễn phí: tính lãi kép, lập ngân sách theo quy tắc 50/30/20, và tính quỹ khẩn cấp phù hợp với chi phí sinh hoạt của bạn.',
  })

  const [tab, setTab] = useState<Tab>('compound')

  // --- Máy tính lãi kép ---
  const [principal, setPrincipal] = useState(50000000)
  const [rate, setRate] = useState(9)
  const [years, setYears] = useState(20)
  const [monthly, setMonthly] = useState(2000000)
  const [freq, setFreq] = useState<'yearly' | 'quarterly' | 'monthly'>('monthly')

  const compound = useMemo(() => {
    const n = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1
    const ratePerPeriod = (rate / 100) / n
    const monthlyPerPeriod = monthly * (12 / n)
    let balance = principal
    let totalContrib = principal
    for (let i = 0; i < years * n; i++) {
      balance = balance * (1 + ratePerPeriod) + monthlyPerPeriod
      totalContrib += monthlyPerPeriod
    }
    const interest = Math.max(balance - totalContrib, 0)
    const pctContrib = balance > 0 ? Math.max(totalContrib / balance * 100, 0) : 0
    const pctInterest = Math.max(100 - pctContrib, 0)
    return { balance, totalContrib, interest, pctContrib, pctInterest }
  }, [principal, rate, years, monthly, freq])

  // --- Ngân sách 50/30/20 ---
  const [income, setIncome] = useState(15000000)
  const budget = useMemo(() => ({
    needs: income * 0.5,
    wants: income * 0.3,
    save: income * 0.2,
  }), [income])

  // --- Quỹ khẩn cấp ---
  const [monthlyCost, setMonthlyCost] = useState(10000000)
  const [monthsTarget, setMonthsTarget] = useState(6)
  const emergencyTotal = monthlyCost * monthsTarget

  return (
    <>
      <header className="btc-page-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=1600&auto=format&fit=crop&q=60')" }}>
        <div className="wd-container btc-page-header-in">
          <div className="btc-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Công cụ tính toán</span></div>
          <div className="btc-tag">3 công cụ miễn phí</div>
          <h1>Công cụ tính toán <em style={{ color: 'var(--accent-mid)', fontStyle: 'normal' }}>tài chính</em></h1>
          <p>Không cần công thức phức tạp — nhập số liệu của bạn, kết quả hiển thị ngay lập tức, tính toán hoàn toàn trên trình duyệt của bạn.</p>
        </div>
      </header>

      <section className="btc-sec">
        <div className="wd-container">
          <div className="btc-tabs" data-reveal>
            <button className={`btc-tab-btn${tab === 'compound' ? ' active' : ''}`} onClick={() => setTab('compound')}>Máy tính lãi kép</button>
            <button className={`btc-tab-btn${tab === 'budget' ? ' active' : ''}`} onClick={() => setTab('budget')}>Ngân sách 50/30/20</button>
            <button className={`btc-tab-btn${tab === 'emergency' ? ' active' : ''}`} onClick={() => setTab('emergency')}>Quỹ khẩn cấp</button>
          </div>

          {/* TAB 1: Lãi kép */}
          <div className={`btc-tab-panel${tab === 'compound' ? ' active' : ''}`}>
            <div className="btc-calc-wrap" data-reveal data-delay="1">
              <form className="btc-calc-form" onSubmit={e => e.preventDefault()}>
                <h3 style={{ marginBottom: 20 }}>Nhập thông tin đầu tư</h3>
                <div className="btc-field">
                  <label htmlFor="btcPrincipal">Số tiền gốc ban đầu (đ)</label>
                  <input type="number" id="btcPrincipal" value={principal} min={0} step={1000000} onChange={e => setPrincipal(+e.target.value || 0)} />
                </div>
                <div className="btc-field-row">
                  <div className="btc-field">
                    <label htmlFor="btcRate">Lãi suất kỳ vọng / năm (%)</label>
                    <input type="number" id="btcRate" value={rate} min={0} max={50} step={0.1} onChange={e => setRate(+e.target.value || 0)} />
                  </div>
                  <div className="btc-field">
                    <label htmlFor="btcYears">Số năm đầu tư</label>
                    <input type="number" id="btcYears" value={years} min={1} max={60} step={1} onChange={e => setYears(+e.target.value || 1)} />
                  </div>
                </div>
                <div className="btc-field-row">
                  <div className="btc-field">
                    <label htmlFor="btcMonthly">Đóng góp thêm / tháng (đ)</label>
                    <input type="number" id="btcMonthly" value={monthly} min={0} step={100000} onChange={e => setMonthly(+e.target.value || 0)} />
                  </div>
                  <div className="btc-field">
                    <label htmlFor="btcFreq">Tần suất ghép lãi</label>
                    <select id="btcFreq" value={freq} onChange={e => setFreq(e.target.value as typeof freq)}>
                      <option value="yearly">Hàng năm</option>
                      <option value="quarterly">Hàng quý</option>
                      <option value="monthly">Hàng tháng</option>
                    </select>
                  </div>
                </div>
              </form>
              <div className="btc-calc-result">
                <div className="btc-result-main">
                  <div className="btc-result-label">Tổng tài sản sau kỳ đầu tư</div>
                  <div className="btc-result-value">{fmtVND(compound.balance)}</div>
                </div>
                <div className="btc-result-row"><span>Tổng tiền đã đóng góp</span><strong>{fmtVND(compound.totalContrib)}</strong></div>
                <div className="btc-result-row"><span>Tổng lãi kiếm được</span><strong style={{ color: 'var(--accent-mid)' }}>{fmtVND(compound.interest)}</strong></div>
                <div className="btc-result-bar-wrap">
                  <div className="btc-result-bar">
                    <div className="btc-result-bar-seg" style={{ background: 'rgba(255,255,255,.28)', width: `${compound.pctContrib}%` }} />
                    <div className="btc-result-bar-seg" style={{ background: 'var(--accent-mid)', width: `${compound.pctInterest}%` }} />
                  </div>
                  <div className="btc-result-bar-legend">
                    <span><span className="btc-legend-dot" style={{ background: 'rgba(255,255,255,.28)' }} />Đã đóng góp</span>
                    <span><span className="btc-legend-dot" style={{ background: 'var(--accent-mid)' }} />Tiền lãi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 2: Ngân sách 50/30/20 */}
          <div className={`btc-tab-panel${tab === 'budget' ? ' active' : ''}`}>
            <div className="btc-calc-wrap" data-reveal>
              <form className="btc-calc-form" onSubmit={e => e.preventDefault()}>
                <h3 style={{ marginBottom: 20 }}>Nhập thu nhập hàng tháng</h3>
                <div className="btc-field">
                  <label htmlFor="btcIncome">Thu nhập ròng hàng tháng (đ)</label>
                  <input type="number" id="btcIncome" value={income} min={0} step={500000} onChange={e => setIncome(+e.target.value || 0)} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, marginTop: 10 }}>
                  Quy tắc 50/30/20 chia thu nhập của bạn thành 3 nhóm: 50% cho nhu cầu thiết yếu (nhà ở, ăn uống, điện nước, đi lại), 30% cho mong muốn cá nhân (giải trí, mua sắm, du lịch), và 20% cho tiết kiệm hoặc trả nợ.
                </p>
              </form>
              <div className="btc-calc-result">
                <div className="btc-result-row"><span>50% — Nhu cầu thiết yếu</span><strong style={{ color: '#fff' }}>{fmtVND(budget.needs)}</strong></div>
                <div className="btc-result-row"><span>30% — Mong muốn cá nhân</span><strong style={{ color: '#fff' }}>{fmtVND(budget.wants)}</strong></div>
                <div className="btc-result-row"><span>20% — Tiết kiệm / trả nợ</span><strong style={{ color: 'var(--accent-mid)' }}>{fmtVND(budget.save)}</strong></div>
                <div className="btc-result-bar-wrap">
                  <div className="btc-result-bar">
                    <div className="btc-result-bar-seg" style={{ background: 'rgba(255,255,255,.65)', width: '50%' }} />
                    <div className="btc-result-bar-seg" style={{ background: 'rgba(255,255,255,.32)', width: '30%' }} />
                    <div className="btc-result-bar-seg" style={{ background: 'var(--accent-mid)', width: '20%' }} />
                  </div>
                  <div className="btc-result-bar-legend"><span>Thiết yếu</span><span>Mong muốn</span><span>Tiết kiệm</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 3: Quỹ khẩn cấp */}
          <div className={`btc-tab-panel${tab === 'emergency' ? ' active' : ''}`}>
            <div className="btc-calc-wrap" data-reveal>
              <form className="btc-calc-form" onSubmit={e => e.preventDefault()}>
                <h3 style={{ marginBottom: 20 }}>Nhập chi phí sinh hoạt</h3>
                <div className="btc-field">
                  <label htmlFor="btcMonthlyCost">Chi phí sinh hoạt hàng tháng (đ)</label>
                  <input type="number" id="btcMonthlyCost" value={monthlyCost} min={0} step={500000} onChange={e => setMonthlyCost(+e.target.value || 0)} />
                </div>
                <div className="btc-field">
                  <label htmlFor="btcMonthsTarget">Số tháng dự phòng mong muốn</label>
                  <select id="btcMonthsTarget" value={monthsTarget} onChange={e => setMonthsTarget(+e.target.value)}>
                    <option value={3}>3 tháng — công việc ổn định</option>
                    <option value={6}>6 tháng — khuyến nghị phổ biến</option>
                    <option value={9}>9 tháng — thu nhập không ổn định</option>
                    <option value={12}>12 tháng — freelancer / kinh doanh riêng</option>
                  </select>
                </div>
              </form>
              <div className="btc-calc-result">
                <div className="btc-result-main">
                  <div className="btc-result-label">Tổng quỹ khẩn cấp cần có</div>
                  <div className="btc-result-value">{fmtVND(emergencyTotal)}</div>
                </div>
                <div className="btc-result-row"><span>Chi phí sinh hoạt / tháng</span><strong>{fmtVND(monthlyCost)}</strong></div>
                <div className="btc-result-row"><span>Số tháng dự phòng</span><strong>{monthsTarget} tháng</strong></div>
              </div>
            </div>
          </div>

          <div className="btc-disclaimer" style={{ marginTop: 48 }} data-reveal>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
            <div>Các công cụ trên chỉ mang tính ước lượng tham khảo dựa trên số liệu bạn nhập vào, không tính đến thuế, phí giao dịch hay biến động lãi suất thực tế. Đây không phải lời khuyên đầu tư — vui lòng cân nhắc kỹ hoặc tham khảo chuyên gia tài chính trước khi ra quyết định.</div>
          </div>
        </div>
      </section>
    </>
  )
}

function PrivacyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật — La Bàn Tài Chính', description: 'Chính sách bảo mật thông tin của La Bàn Tài Chính — cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu độc giả.' })
  return (
    <>
      <header className="btc-page-header">
        <div className="wd-container btc-page-header-in">
          <div className="btc-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Chính sách bảo mật</span></div>
          <div className="btc-tag">Cập nhật lần cuối: 08/09/2026</div>
          <h1>Chính sách <em style={{ color: 'var(--accent-mid)', fontStyle: 'normal' }}>bảo mật</em></h1>
        </div>
      </header>
      <section className="btc-sec">
        <div className="wd-container btc-legal-body">
          <p>La Bàn Tài Chính ("chúng tôi") tôn trọng quyền riêng tư của độc giả. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn truy cập và sử dụng website.</p>

          <h2>1. Thông tin chúng tôi thu thập</h2>
          <ul>
            <li>Thông tin bạn chủ động cung cấp: họ tên, email, nội dung tin nhắn khi điền form Liên hệ hoặc đăng ký nhận bản tin.</li>
            <li>Thông tin sử dụng công cụ tính toán: các số liệu bạn nhập (số tiền, lãi suất...) chỉ được xử lý tại trình duyệt của bạn, KHÔNG được gửi về hay lưu trữ trên máy chủ của chúng tôi.</li>
            <li>Thông tin truy cập tự động: loại trình duyệt, thiết bị, trang đã xem, thời gian truy cập — phục vụ mục đích thống kê lượng truy cập ẩn danh.</li>
          </ul>

          <h2>2. Mục đích sử dụng thông tin</h2>
          <ul>
            <li>Phản hồi câu hỏi, yêu cầu hỗ trợ của độc giả.</li>
            <li>Gửi bản tin định kỳ nếu bạn đã đăng ký (bạn có thể hủy đăng ký bất kỳ lúc nào).</li>
            <li>Cải thiện chất lượng nội dung và trải nghiệm sử dụng website dựa trên số liệu thống kê ẩn danh.</li>
          </ul>

          <h2>3. Chia sẻ thông tin với bên thứ ba</h2>
          <p>Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân của độc giả cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được chia sẻ khi pháp luật yêu cầu hoặc để bảo vệ quyền lợi hợp pháp của La Bàn Tài Chính.</p>

          <h2>4. Cookie</h2>
          <p>Website có thể sử dụng cookie để ghi nhớ tùy chọn hiển thị và phục vụ thống kê truy cập ẩn danh. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể hoạt động không như mong đợi.</p>

          <h2>5. Bảo mật dữ liệu</h2>
          <p>Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để bảo vệ thông tin bạn cung cấp khỏi truy cập trái phép. Tuy nhiên, không có phương thức truyền tải dữ liệu nào qua Internet là an toàn tuyệt đối 100%.</p>

          <h2>6. Quyền của bạn</h2>
          <p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân mà chúng tôi đang lưu trữ (ví dụ: yêu cầu hủy đăng ký bản tin, xóa lịch sử liên hệ). Vui lòng gửi yêu cầu qua trang <Link to="/lien-he">Liên hệ</Link>.</p>

          <h2>7. Thay đổi chính sách</h2>
          <p>Chính sách này có thể được cập nhật theo thời gian. Phiên bản mới nhất sẽ luôn được đăng tại trang này kèm ngày cập nhật.</p>

          <h2>8. Liên hệ</h2>
          <p>Nếu có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ qua trang <Link to="/lien-he">Liên hệ</Link>.</p>
        </div>
      </section>
    </>
  )
}

function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng — La Bàn Tài Chính', description: 'Điều khoản sử dụng website La Bàn Tài Chính — quyền và nghĩa vụ khi truy cập, đọc nội dung và sử dụng công cụ tính toán trên trang.' })
  return (
    <>
      <header className="btc-page-header">
        <div className="wd-container btc-page-header-in">
          <div className="btc-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Điều khoản sử dụng</span></div>
          <div className="btc-tag">Cập nhật lần cuối: 08/09/2026</div>
          <h1>Điều khoản <em style={{ color: 'var(--accent-mid)', fontStyle: 'normal' }}>sử dụng</em></h1>
        </div>
      </header>
      <section className="btc-sec">
        <div className="wd-container btc-legal-body">
          <p>Khi truy cập và sử dụng website La Bàn Tài Chính, bạn đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.</p>

          <h2>1. Nội dung mang tính tham khảo, không phải lời khuyên đầu tư</h2>
          <p>Toàn bộ bài viết, số liệu, ví dụ minh họa và kết quả từ các công cụ tính toán trên website chỉ mang mục đích giáo dục và tham khảo. Đây KHÔNG phải là lời khuyên đầu tư, tư vấn tài chính hay tư vấn pháp lý cá nhân hóa. Chúng tôi không chịu trách nhiệm với bất kỳ quyết định tài chính nào bạn đưa ra dựa trên nội dung của website.</p>

          <h2>2. Độ chính xác của công cụ tính toán</h2>
          <p>Các công cụ (tính lãi kép, lập ngân sách 50/30/20, tính quỹ khẩn cấp) sử dụng công thức tài chính tiêu chuẩn và số liệu do chính bạn nhập vào. Kết quả chỉ là ước lượng, không tính đến thuế, phí giao dịch, hoặc biến động thị trường thực tế. Chúng tôi không đảm bảo và không chịu trách nhiệm về tính chính xác tuyệt đối của kết quả.</p>

          <h2>3. Quyền sở hữu trí tuệ</h2>
          <p>Toàn bộ nội dung văn bản, hình ảnh, thiết kế và mã nguồn của website thuộc quyền sở hữu của La Bàn Tài Chính, trừ khi có ghi chú khác. Bạn có thể trích dẫn một phần nội dung kèm liên kết nguồn rõ ràng cho mục đích phi thương mại. Sao chép toàn bộ bài viết để đăng lại nơi khác mà không xin phép bằng văn bản là vi phạm điều khoản này.</p>

          <h2>4. Hành vi bị cấm</h2>
          <ul>
            <li>Sao chép, phân phối lại nội dung website với mục đích thương mại mà không được cho phép.</li>
            <li>Sử dụng công cụ tự động (bot, scraper) để thu thập dữ liệu hàng loạt từ website.</li>
            <li>Đăng bình luận chứa nội dung quảng cáo trá hình, spam, hoặc vi phạm pháp luật Việt Nam.</li>
            <li>Giả mạo danh tính đội ngũ La Bàn Tài Chính dưới bất kỳ hình thức nào.</li>
          </ul>

          <h2>5. Giới hạn trách nhiệm</h2>
          <p>Website được cung cấp trên cơ sở "nguyên trạng". Chúng tôi không đảm bảo website luôn hoạt động không gián đoạn, không có lỗi. Trong phạm vi pháp luật cho phép, La Bàn Tài Chính không chịu trách nhiệm với bất kỳ thiệt hại trực tiếp hay gián tiếp nào phát sinh từ việc sử dụng hoặc không thể sử dụng website.</p>

          <h2>6. Liên kết đến bên thứ ba</h2>
          <p>Website có thể chứa liên kết đến các trang bên ngoài (ứng dụng, sản phẩm tài chính được nhắc đến trong bài viết). Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung hoặc chính sách của các trang bên thứ ba này.</p>

          <h2>7. Thay đổi điều khoản</h2>
          <p>Điều khoản này có thể được cập nhật theo thời gian mà không cần báo trước. Việc bạn tiếp tục sử dụng website sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>

          <h2>8. Luật áp dụng</h2>
          <p>Điều khoản này được điều chỉnh theo pháp luật hiện hành của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.</p>
        </div>
      </section>
    </>
  )
}

function AppShell() {
  useScrollToTop()

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
  }, [])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chuyen-muc" element={<PostList />} />
        <Route path="/cong-cu-tinh-toan" element={<ToolPage />} />
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
