import { useState } from 'react'
import { calcMonthlyPayment, formatFullVND } from '../utils/format'

export default function MortgageCalculator({ initialPrice }: { initialPrice: number }) {
  const [priceBillion, setPriceBillion] = useState((initialPrice / 1e9).toFixed(2))
  const [loanPercent, setLoanPercent] = useState(70)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)

  const priceVND = (parseFloat(priceBillion) || 0) * 1e9
  const loanAmount = priceVND * (loanPercent / 100)
  const monthly = calcMonthlyPayment(loanAmount, rate, years)

  return (
    <div className="gvr-calc mb-4">
      <span className="blob blob-a"></span><span className="blob blob-b"></span>
      <div className="eyebrow eyebrow-light">Công cụ tài chính</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Tính vay &amp; trả góp</h3>

      <div className="gvr-calc-field">
        <div className="gvr-calc-label">Giá trị căn hộ <b>{(priceVND / 1e9).toFixed(2)} tỷ</b></div>
        <input type="number" step={0.05} min={1} value={priceBillion} onChange={e => setPriceBillion(e.target.value)} />
      </div>
      <div className="gvr-calc-field">
        <div className="gvr-calc-label">Tỷ lệ vay <b>{loanPercent}%</b></div>
        <input type="range" min={30} max={90} step={5} value={loanPercent} onChange={e => setLoanPercent(+e.target.value)} />
      </div>
      <div className="gvr-calc-field">
        <div className="gvr-calc-label">Lãi suất ưu đãi năm đầu <b>{rate.toFixed(1)}%/năm</b></div>
        <input type="range" min={5} max={14} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} />
      </div>
      <div className="gvr-calc-field">
        <div className="gvr-calc-label">Thời hạn vay <b>{years} năm</b></div>
        <input type="range" min={5} max={30} step={1} value={years} onChange={e => setYears(+e.target.value)} />
      </div>

      <div className="gvr-calc-result">
        <div className="gvr-calc-result-label">Trả góp hàng tháng ước tính</div>
        <div className="gvr-calc-result-value">{formatFullVND(monthly)}/tháng</div>
      </div>
      <p className="gvr-calc-note">* Lãi suất tham khảo tại thời điểm hiện tại, chỉ mang tính minh họa. Vui lòng liên hệ ngân hàng liên kết (Vietcombank / Techcombank / BIDV) để biết chính sách vay chính xác nhất.</p>
    </div>
  )
}
