const reviews = [
  {
    text: 'Mẫu rất đẹp và chuyên nghiệp. Anh bên này cài đặt nhanh, chỉ 3 ngày là có website hoàn chỉnh. Khách hàng tôi ai cũng khen.',
    name: 'Trần Hoàng Minh',
    role: 'Công ty tư vấn · TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face',
  },
  {
    text: 'Tôi không biết gì về web nhưng mọi thứ được lo hết rồi. Form brief rõ ràng, chỉ cần điền thông tin là xong. Rất hài lòng.',
    name: 'Nguyễn Lan Anh',
    role: 'Spa & Beauty · Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
  },
  {
    text: 'Source code sạch, cấu trúc rõ ràng, tùy chỉnh dễ. Tôi mua để dùng lại cho khách hàng của mình — đáng đồng tiền.',
    name: 'Phạm Đức Toàn',
    role: 'Freelancer · Đà Nẵng',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Khách hàng nói gì</div>
          <h2 className="sec-title">127 khách hàng <em>đã tin tưởng</em></h2>
          <p className="sec-sub">Không phải lời quảng cáo — đây là trải nghiệm thật từ khách hàng thật.</p>
        </div>
        <div className="row g-3 align-items-stretch">
          {reviews.map((rv, i) => (
            <div key={rv.name} className="col-md-4 d-flex">
              <div className={`rv reveal reveal-d${i + 1} d-flex flex-column w-100`}>
                <div className="rv-stars">★★★★★</div>
                <div className="rv-text flex-grow-1"><span className="rv-quote">&ldquo;</span>{rv.text}</div>
                <div className="rv-foot mt-auto">
                  <img src={rv.avatar} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt={rv.name} loading="lazy" />
                  <div>
                    <div className="rv-name">{rv.name}</div>
                    <div className="rv-role">{rv.role}</div>
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
