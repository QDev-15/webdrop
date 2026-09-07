import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Review {
  id: number
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  review_score: number | null
  review_score_label: string
  review_category: string
}

export default function ReviewsPage() {
  useDocumentMeta({
    title: 'Đánh giá sản phẩm — PIXEL. Blog Công Nghệ',
    description: 'Đánh giá công tâm smartphone, laptop và thiết bị đeo thông minh — thử nghiệm thực tế, chấm điểm rõ ràng theo từng tiêu chí.',
  })

  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    api.get<Review[]>('/public/posts?type=review&limit=100').then(setReviews).catch(() => {})
  }, [])

  return (
    <>
      <header className="bcn-page-hero">
        <div className="bcn-page-hero-grid" aria-hidden="true"></div>
        <div className="bcn-container bcn-page-hero-inner">
          <div className="bcn-hero-label" style={{ marginBottom: 18 }}>Review</div>
          <h1>Đánh giá sản phẩm</h1>
          <p>Chúng tôi mua và mượn thiết bị để dùng thật trong ít nhất 1-2 tuần trước khi lên bài — không đánh giá dựa trên thông số nhà sản xuất cung cấp.</p>
        </div>
      </header>

      {/* ============ Phương pháp đánh giá ============ */}
      <section className="bcn-sec" style={{ paddingBottom: 48 }}>
        <div className="bcn-container">
          <div className="bcn-sec-header bcn-center" data-reveal>
            <div className="bcn-eyebrow">Phương pháp</div>
            <h2 className="bcn-sec-title">Chúng tôi đánh giá dựa trên 4 tiêu chí</h2>
          </div>
          <div className="bcn-cat-row" style={{ marginTop: 32 }} data-reveal>
            <div className="bcn-cat-item" style={{ cursor: 'default' }}>
              <span className="bcn-cat-icon"><i className="bi bi-speedometer2"></i></span>
              <span className="bcn-cat-name">Hiệu năng thực tế</span>
            </div>
            <div className="bcn-cat-item" style={{ cursor: 'default' }}>
              <span className="bcn-cat-icon"><i className="bi bi-battery-charging"></i></span>
              <span className="bcn-cat-name">Thời lượng pin</span>
            </div>
            <div className="bcn-cat-item" style={{ cursor: 'default' }}>
              <span className="bcn-cat-icon"><i className="bi bi-gem"></i></span>
              <span className="bcn-cat-name">Thiết kế &amp; hoàn thiện</span>
            </div>
            <div className="bcn-cat-item" style={{ cursor: 'default' }}>
              <span className="bcn-cat-icon"><i className="bi bi-cash-coin"></i></span>
              <span className="bcn-cat-name">Giá trị / giá tiền</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Danh sách đánh giá ============ */}
      <section className="bcn-sec bcn-sec-alt">
        <div className="bcn-container">
          <div className="bcn-sec-header" data-reveal>
            <div className="bcn-eyebrow">Mới nhất</div>
            <h2 className="bcn-sec-title">Tất cả bài đánh giá</h2>
          </div>
          <div style={{ marginTop: 16 }} data-reveal>
            {reviews.map(r => (
              <Link key={r.id} to={`/bai-viet/${r.slug}`} className="bcn-review-list-item" style={{ textDecoration: 'none' }}>
                <div className="bcn-review-list-thumb"><img src={r.thumbnail} alt={r.title} /></div>
                <div>
                  <div className="bcn-review-list-cat">{r.review_category}</div>
                  <h3 className="bcn-review-list-title">{r.title}</h3>
                  <p className="bcn-review-list-desc">{r.excerpt}</p>
                </div>
                <div className="bcn-review-score-big">
                  <div className="bcn-review-score-num">{r.review_score}<span>/10</span></div>
                  <div className="bcn-review-score-label">{r.review_score_label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Bảng so sánh ============ */}
      <section className="bcn-sec" id="bcn-compare">
        <div className="bcn-container">
          <div className="bcn-sec-header bcn-center" data-reveal>
            <div className="bcn-eyebrow">So sánh nhanh</div>
            <h2 className="bcn-sec-title">3 laptop mỏng nhẹ tầm giá 20 triệu</h2>
            <p className="bcn-sec-sub">Cùng phân khúc giá nhưng lựa chọn phù hợp phụ thuộc vào nhu cầu sử dụng của từng người.</p>
          </div>
          <div className="bcn-table-scroll" style={{ marginTop: 32 }} data-reveal>
            <table className="bcn-compare-table">
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  <th>UltraBook 14</th>
                  <th>RivalBook Air</th>
                  <th>WorkPro X1</th>
                </tr>
              </thead>
              <tbody>
                <tr><th>Giá tham khảo</th><td>20.990.000đ</td><td>19.490.000đ</td><td>21.500.000đ</td></tr>
                <tr><th>CPU</th><td className="bcn-best">Core Ultra 7 (thế hệ mới)</td><td>Core Ultra 5</td><td>Ryzen AI 9</td></tr>
                <tr><th>RAM</th><td>16GB LPDDR5X</td><td>16GB LPDDR5</td><td className="bcn-best">32GB LPDDR5X</td></tr>
                <tr><th>Thời lượng pin (thực tế)</th><td className="bcn-best">~13 giờ</td><td>~10 giờ</td><td>~11 giờ</td></tr>
                <tr><th>Trọng lượng</th><td className="bcn-best">1.28kg</td><td>1.32kg</td><td>1.45kg</td></tr>
                <tr><th>Điểm PIXEL.</th><td className="bcn-best">9.0/10</td><td>8.4/10</td><td>8.7/10</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
