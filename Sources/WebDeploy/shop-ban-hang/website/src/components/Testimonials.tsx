import { useSite } from '../contexts/SiteContext'

export default function Testimonials() {
  const { testimonials } = useSite()
  const stars = (n: number) => Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆').join('')

  return (
    <section className="sb-reviews-section sb-sec">
      <div className="sb-container">
        <div style={{ textAlign: 'center' }}>
          <div className="sb-eyebrow">Khách hàng nói gì</div>
          <h2 className="sb-sec-title">Đánh giá <em>thực tế</em></h2>
          <p className="sb-sec-sub" style={{ margin: '0 auto' }}>
            Hàng nghìn khách hàng tin tưởng và yêu thích sản phẩm của chúng tôi.
          </p>
        </div>
        <div className="sb-reviews-scroll">
          {testimonials.map(t => (
            <div key={t.id} className="sb-review-card">
              <div className="sb-review-stars">{stars(t.stars)}</div>
              <p className="sb-review-text">{t.content}</p>
              <div className="sb-review-author">
                {t.author_avatar ? (
                  <img src={t.author_avatar} alt={t.author_name} className="sb-review-avatar" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="sb-review-avatar">{t.author_name[0]}</div>
                )}
                <div>
                  <div className="sb-review-name">{t.author_name}</div>
                  {t.author_location && <div className="sb-review-sub">{t.author_location}</div>}
                </div>
              </div>
              {t.product_purchased && (
                <div className="sb-review-product">
                  <span>Đã mua:</span>
                  <strong>{t.product_purchased}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
