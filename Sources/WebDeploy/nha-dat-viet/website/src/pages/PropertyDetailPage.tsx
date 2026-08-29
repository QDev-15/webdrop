import { useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useProperties } from '../hooks/useProperties'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import PropertyCard from '../components/PropertyCard'
import { api } from '../api/client'
import {
  DIRECTION_LABELS, LEGAL_LABELS, FURNISHING_LABELS,
  districtLabel, formatPrice, formatVND, nearbyAmenities, calcMonthlyPayment,
} from '../data/propertyMeta'
import { IconPin, IconArea, IconBed, IconBath, IconCompass, IconShield, IconCheck, IconClose } from '../components/icons'

function MortgageCalculator({ price }: { price: number }) {
  const [percent, setPercent] = useState(70)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)
  const [customPrice, setCustomPrice] = useState(price)

  const loanAmount = customPrice * (percent / 100)
  const monthly = calcMonthlyPayment(loanAmount, rate, years)

  return (
    <>
      <div className="ndv-calc-row">
        <div className="ndv-calc-field">
          <label>Giá trị bất động sản <b>{formatPrice(customPrice, customPrice >= 1e9 ? 'tỷ' : 'triệu')}</b></label>
          <input type="number" value={customPrice} step={10000000} onChange={e => setCustomPrice(Number(e.target.value) || 0)} />
        </div>
        <div className="ndv-calc-field">
          <label>Tỷ lệ vay <b>{percent}%</b></label>
          <input type="range" min={10} max={90} step={5} value={percent} onChange={e => setPercent(Number(e.target.value))} />
        </div>
      </div>
      <div className="ndv-calc-row">
        <div className="ndv-calc-field">
          <label>Lãi suất vay / năm <b>{rate}%</b></label>
          <input type="range" min={4} max={15} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} />
        </div>
        <div className="ndv-calc-field">
          <label>Thời hạn vay <b>{years} năm</b></label>
          <input type="range" min={5} max={25} step={1} value={years} onChange={e => setYears(Number(e.target.value))} />
        </div>
      </div>
      <div className="ndv-calc-result">
        <div className="ndv-calc-result-label">Số tiền trả góp ước tính mỗi tháng</div>
        <div className="ndv-calc-result-val">{formatVND(monthly)} <span>đ/tháng</span></div>
      </div>
      <p className="ndv-calc-note">* Đây là số liệu ước tính tham khảo dựa trên phương pháp trả góp đều hàng tháng, chưa bao gồm phí bảo hiểm khoản vay. Lãi suất thực tế tùy thuộc chính sách từng ngân hàng tại thời điểm vay — vui lòng liên hệ môi giới hoặc ngân hàng để được tư vấn chính xác.</p>
    </>
  )
}

function RentEstimator({ price }: { price: number }) {
  const [months, setMonths] = useState(2)
  const total = price * (1 + months)
  return (
    <>
      <div className="ndv-calc-row">
        <div className="ndv-calc-field">
          <label>Giá thuê / tháng <b>{formatPrice(price, 'triệu/tháng')}</b></label>
        </div>
        <div className="ndv-calc-field">
          <label>Số tháng đặt cọc <b>{months} tháng</b></label>
          <input type="range" min={1} max={6} step={1} value={months} onChange={e => setMonths(Number(e.target.value))} />
        </div>
      </div>
      <div className="ndv-calc-result">
        <div className="ndv-calc-result-label">Tổng chi phí thanh toán lần đầu (tiền thuê tháng đầu + cọc)</div>
        <div className="ndv-calc-result-val">{formatVND(total)} <span>đ</span></div>
      </div>
      <p className="ndv-calc-note">* Số liệu ước tính tham khảo, không bao gồm phí quản lý/dịch vụ (nếu có). Vui lòng liên hệ môi giới phụ trách để biết chi tiết chính xác trước khi đặt cọc.</p>
    </>
  )
}

export default function PropertyDetailPage() {
  const { slug } = useParams()
  const { properties, loading } = useProperties()
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [bkName, setBkName] = useState('')
  const [bkPhone, setBkPhone] = useState('')
  const [bkDate, setBkDate] = useState('')
  const [bkTime, setBkTime] = useState('Sáng (8:00 - 11:00)')
  const [bkNote, setBkNote] = useState('')
  const [bkSuccess, setBkSuccess] = useState(false)
  const [bkError, setBkError] = useState('')

  const p = useMemo(() => properties.find(x => x.slug === slug), [properties, slug])

  useDocumentMeta({
    title: p ? `${p.title} | Nhà Đất Việt` : 'Chi tiết bất động sản | Nhà Đất Việt',
    description: p ? p.description.slice(0, 155) : 'Chi tiết bất động sản tại Nhà Đất Việt.',
  })

  const similar = useMemo(() => {
    if (!p) return []
    let list = properties.filter(x => x.id !== p.id && x.property_type === p.property_type)
    if (list.length < 4) list = list.concat(properties.filter(x => x.id !== p.id && x.district === p.district && !list.includes(x)))
    if (list.length < 4) list = list.concat(properties.filter(x => x.id !== p.id && !list.includes(x)))
    return list.slice(0, 4)
  }, [properties, p])

  if (loading) return <div className="ndv-container" style={{ paddingTop: 140, paddingBottom: 80 }}>Đang tải...</div>
  if (!p) return <Navigate to="/bat-dong-san" replace />

  const facts = [
    { icon: null, label: 'Giá', val: formatPrice(p.price, p.price_unit), isPrice: true },
    { icon: <IconArea />, label: 'Diện tích', val: `${p.area} m²` },
    { icon: <IconBed />, label: 'Phòng ngủ', val: p.bedrooms || '—' },
    { icon: <IconBath />, label: 'Phòng tắm', val: p.bathrooms || '—' },
    { icon: <IconCompass />, label: 'Hướng nhà', val: DIRECTION_LABELS[p.direction] },
    { icon: <IconShield />, label: 'Pháp lý', val: LEGAL_LABELS[p.legal_status] },
  ]

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    setBkError('')
    if (!bkName.trim() || !bkPhone.trim()) { setBkError('Họ tên và số điện thoại là bắt buộc.'); return }
    try {
      await api.post('/public/contact', {
        name: bkName, phone: bkPhone, subject: 'Đặt lịch xem nhà',
        property_title: p!.title, visit_date: bkDate, visit_time: bkTime, note: bkNote,
      })
      setBkSuccess(true)
      setBkName(''); setBkPhone(''); setBkDate(''); setBkNote('')
    } catch (err) {
      setBkError(err instanceof Error ? err.message : 'Gửi yêu cầu thất bại.')
    }
  }

  return (
    <main className="ndv-page-body">
      <div className="ndv-container" style={{ paddingTop: 26 }}>
        <div className="ndv-breadcrumb"><Link to="/">Trang chủ</Link> / <Link to="/bat-dong-san">Bất động sản</Link> / <span>{p.title}</span></div>
        <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', marginBottom: 8 }}>{p.title}</h1>
        <div className="ndv-prop-addr" style={{ fontSize: 14.5, marginBottom: 22 }}>
          <IconPin /><span>{p.street}, {districtLabel(p.district)}, TP.HCM</span>
        </div>

        {/* 1. Gallery */}
        <div className="ndv-gallery">
          <div className="ndv-gallery-main" onClick={() => setLightbox(p.images[activeImg])}>
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2, display: 'flex', gap: 6 }}>
              {p.badge && <span className={`ndv-badge ndv-badge-${p.badge}`}>{p.badge}</span>}
              <span className="ndv-prop-listing-tag" style={{ position: 'static' }}>{p.listing_type === 'ban' ? 'Đang bán' : 'Cho thuê'}</span>
            </div>
            <img src={p.images[activeImg]} alt={p.title} />
          </div>
          <div className="ndv-gallery-thumbs">
            {p.images.map((img, i) => (
              <button key={i} type="button" className={'ndv-gallery-thumb' + (i === activeImg ? ' active' : '')} onClick={() => setActiveImg(i)}>
                <img src={img} alt={`${p.title} ảnh ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* 2. Quick facts */}
        <div className="ndv-quickfacts">
          {facts.map(f => (
            <div className="ndv-qf-item" key={f.label}>
              {f.icon}
              <div className="ndv-qf-val" style={f.isPrice ? { color: 'var(--accent)' } : undefined}>{f.val}</div>
              <div className="ndv-qf-label">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="ndv-detail-grid">
          <div>
            {/* 3. Mô tả */}
            <div className="ndv-detail-block" data-reveal="">
              <h2>Mô tả chi tiết</h2>
              <p>{p.description}</p>
            </div>

            {/* 4. Đặc điểm nổi bật */}
            <div className="ndv-detail-block" data-reveal="">
              <h2>Đặc điểm nổi bật</h2>
              <div className="ndv-feature-chips">
                <span className="ndv-feature-chip"><IconCheck />{FURNISHING_LABELS[p.furnishing]}</span>
                {p.features.map(f => <span className="ndv-feature-chip" key={f}><IconCheck />{f}</span>)}
              </div>
            </div>

            {/* 5. Bản đồ + tiện ích */}
            <div className="ndv-detail-block" data-reveal="">
              <h2>Vị trí & tiện ích xung quanh</h2>
              <div className="ndv-map-embed">
                <iframe src={`https://maps.google.com/maps?q=${p.lat},${p.lng}&hl=vi&z=16&output=embed`} loading="lazy" title="Bản đồ vị trí bất động sản"></iframe>
              </div>
              <ul className="ndv-amenities">
                {nearbyAmenities(districtLabel(p.district)).map(a => <li key={a}><IconCheck />{a}</li>)}
              </ul>
            </div>

            {/* 6. Công cụ tính vay / chi phí thuê */}
            <div className="ndv-detail-block" data-reveal="">
              <h2>{p.listing_type === 'ban' ? 'Công cụ tính vay trả góp' : 'Ước tính chi phí thuê ban đầu'}</h2>
              {p.listing_type === 'ban' ? <MortgageCalculator price={p.price} /> : <RentEstimator price={p.price} />}
            </div>

            {/* 8. Đặt lịch xem nhà */}
            <div className="ndv-detail-block" data-reveal="">
              <h2>Đặt lịch xem nhà</h2>
              <form onSubmit={handleBooking}>
                {bkError && <div className="alert alert-error" style={{ marginBottom: 14 }}>{bkError}</div>}
                <div className="ndv-form-row2">
                  <div className="ndv-form-group">
                    <label htmlFor="bkName">Họ và tên *</label>
                    <input type="text" id="bkName" required placeholder="Nguyễn Văn A" value={bkName} onChange={e => setBkName(e.target.value)} />
                  </div>
                  <div className="ndv-form-group">
                    <label htmlFor="bkPhone">Số điện thoại *</label>
                    <input type="tel" id="bkPhone" required placeholder="09xx xxx xxx" value={bkPhone} onChange={e => setBkPhone(e.target.value)} />
                  </div>
                </div>
                <div className="ndv-form-row2">
                  <div className="ndv-form-group">
                    <label htmlFor="bkDate">Ngày mong muốn xem nhà</label>
                    <input type="date" id="bkDate" value={bkDate} onChange={e => setBkDate(e.target.value)} />
                  </div>
                  <div className="ndv-form-group">
                    <label htmlFor="bkTime">Khung giờ</label>
                    <select id="bkTime" value={bkTime} onChange={e => setBkTime(e.target.value)}>
                      <option>Sáng (8:00 - 11:00)</option>
                      <option>Chiều (13:00 - 17:00)</option>
                      <option>Tối (17:00 - 19:30)</option>
                    </select>
                  </div>
                </div>
                <div className="ndv-form-group">
                  <label htmlFor="bkNote">Ghi chú</label>
                  <textarea id="bkNote" rows={3} placeholder="Câu hỏi thêm về bất động sản (nếu có)" value={bkNote} onChange={e => setBkNote(e.target.value)} />
                </div>
                <button type="submit" className="ndv-btn ndv-btn-primary ndv-btn-block">Gửi yêu cầu đặt lịch</button>
                <p className="ndv-form-note">Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 30 phút trong giờ làm việc.</p>
                {bkSuccess && <div className="ndv-form-success show">Đã gửi yêu cầu thành công! Môi giới phụ trách sẽ liên hệ với bạn sớm nhất.</div>}
              </form>
            </div>
          </div>

          {/* 7. Môi giới phụ trách */}
          <div className="ndv-sidebar-sticky" data-reveal="">
            {p.agent && (
              <div className="ndv-agent-card">
                <div className="ndv-agent-avatar"><img src={p.agent.avatar} alt={p.agent.name} /></div>
                <div className="ndv-agent-name">{p.agent.name}</div>
                <div className="ndv-agent-title">{p.agent.title}</div>
                <div className="ndv-agent-actions">
                  <a href={`tel:${p.agent.phone.replace(/\s/g, '')}`} className="ndv-btn ndv-btn-primary">Gọi ngay: {p.agent.phone}</a>
                  <a href={`https://zalo.me/${p.agent.zalo}`} target="_blank" rel="noopener noreferrer" className="ndv-btn ndv-btn-ghost">Chat Zalo</a>
                  <Link to="/lien-he" className="ndv-btn ndv-btn-ghost">Gửi tin nhắn</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 9. BĐS tương tự */}
        <section className="ndv-sec">
          <div className="ndv-sec-head" data-reveal="">
            <div>
              <div className="ndv-eyebrow">Có thể bạn quan tâm</div>
              <h2 className="ndv-title">Bất động sản <em>tương tự</em></h2>
            </div>
          </div>
          <div className="ndv-prop-grid">
            {similar.map(sp => <PropertyCard key={sp.id} p={sp} />)}
          </div>
        </section>
      </div>

      {lightbox && (
        <div className="ndv-lightbox open" onClick={() => setLightbox(null)}>
          <button className="ndv-lightbox-close" aria-label="Đóng" onClick={() => setLightbox(null)}><IconClose /></button>
          <img src={lightbox} alt="Ảnh phóng to" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </main>
  )
}
