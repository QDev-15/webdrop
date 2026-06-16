import { useSite } from '../contexts/SiteContext'

export default function Testimonials() {
  const { testimonials } = useSite()

  const list = testimonials.length > 0 ? testimonials : [
    { id: 1, author_name: 'Nguyễn Thanh Tùng', author_title: 'Lần đầu ăn chay · Hà Nội', author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Tôi không hay ăn chay nhưng người bạn rủ đến đây và tôi hoàn toàn bị thuyết phục. Món Buddha Bowl ngon đến mức khó tin là không có thịt!', rating: 5 },
    { id: 2, author_name: 'Phạm Bích Hà', author_title: 'Thực dưỡng · TP.HCM', author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Không gian trong lành, nhẹ nhàng như thế này rất hiếm ở thành phố. Nguyên liệu organic thực sự tươi và khác biệt.', rating: 5 },
    { id: 3, author_name: 'Lê Minh Trí', author_title: 'Phụ huynh · Đà Nẵng', author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face', content: 'Mang con nhỏ 3 tuổi đến ăn, con ăn rất ngon miệng. Đây là nhà hàng chay duy nhất tôi giới thiệu cho mọi người không ngại ngần.', rating: 5 },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Đánh giá</div>
          <h2 className="sec-title">Thực khách <em>chia sẻ</em></h2>
        </div>
        <div className="row g-3">
          {list.map((t, i) => (
            <div className={`col-md-4 reveal${i > 0 ? ` reveal-d${i}` : ''}`} key={t.id}>
              <div className="rv">
                <div className="rv-stars">{'★'.repeat(t.rating || 5)}</div>
                <div className="rv-text">"{t.content}"</div>
                <div className="rv-foot">
                  <img
                    className="rv-av"
                    src={t.author_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face'}
                    alt={t.author_name}
                    loading="lazy"
                  />
                  <div>
                    <div className="rv-name">{t.author_name}</div>
                    <div className="rv-role">{t.author_title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
