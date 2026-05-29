import { pricingPlans } from '../../data/pricing'

export default function PricingSection() {
  return (
    <section id="pricing" className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Bảng giá</div>
          <h2 className="sec-title">Minh bạch, <em>không phát sinh</em></h2>
          <p className="sec-sub">Giá cố định, bao gồm tất cả. Không phí ẩn, không thêm chi phí sau khi ký.</p>
        </div>
        <div className="row g-3">
          {pricingPlans.map((plan, i) => (
            <div key={plan.tier} className="col-md-4">
              <div className={`pc reveal reveal-d${i + 1}${plan.hot ? ' hot' : ''}`}>
                {plan.hot && <div className="pc-hot-label">✦ Phổ biến nhất</div>}
                <div className="pc-tier">{plan.tier}</div>
                <div className="pc-price">{plan.price} <sub>đ</sub></div>
                <div className="pc-desc">{plan.desc}</div>
                <hr style={{ borderColor: 'var(--border-light)' }} />
                <ul className="pc-list">
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className="pc-btn">{plan.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
