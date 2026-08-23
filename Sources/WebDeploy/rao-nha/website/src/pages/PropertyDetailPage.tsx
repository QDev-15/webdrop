import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import PropertyCard from '../components/PropertyCard'
import {
  Listing, DIRECTION_LABELS, LEGAL_LABELS, FURNISHING_LABELS, ROLE_LABELS,
  formatPrice, formatFullVND, formatDateVN, calcMonthlyPayment,
} from '../lib/listings'

function expiryInfo(expiresAt: string) {
  const daysLeft = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
  return { daysLeft, expired: daysLeft < 0 }
}

export default function PropertyDetailPage() {
  const [params] = useSearchParams()
  const slug = params.get('slug') || ''
  const [data, setData] = useState<{ listing: Listing; related: Listing[] } | null>(null)
  const [error, setError] = useState('')
  const [curIdx, setCurIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [bookingSent, setBookingSent] = useState(false)

  const [calcPrice, setCalcPrice] = useState(0)
  const [calcPercent, setCalcPercent] = useState(70)
  const [calcRate, setCalcRate] = useState(8.5)
  const [calcYears, setCalcYears] = useState(20)

  useEffect(() => {
    if (!slug) return
    setData(null); setError(''); setCurIdx(0)
    api.get<{ listing: Listing; related: Listing[] }>(`/public/listings/${encodeURIComponent(slug)}`)
      .then(d => { setData(d); setCalcPrice(Math.round(d.listing.price / 1e6)) })
      .catch(() => setError('Không tìm thấy tin đăng hoặc tin đã hết hạn hiển thị.'))
  }, [slug])

  useDocumentMeta({
    title: data ? `${data.listing.title} | RaoNhà` : 'Chi tiết bất động sản | RaoNhà',
    description: data?.listing.description?.slice(0, 155),
  })

  if (error) {
    return (
      <section className="sec-pad" style={{ paddingTop: 140, textAlign: 'center' }}>
        <div className="rn-container">
          <h1 className="sec-title">Không tìm thấy tin đăng</h1>
          <p className="sec-sub" style={{ margin: '0 auto 20px' }}>{error}</p>
          <Link to="/bat-dong-san" className="btn-rn btn-rn-primary">Xem tin đăng khác</Link>
        </div>
      </section>
    )
  }
  if (!data) return <div style={{ padding: '160px 0', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>

  const p = data.listing
  const exp = expiryInfo(p.expires_at)

  function submitBooking(e: React.FormEvent) {
    e.preventDefault()
    setBookingSent(true)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div>
      <section className="rn-detail-hero">
        <div className="rn-container">
          <div className="rn-breadcrumb"><Link to="/">Trang chủ</Link> / <Link to="/bat-dong-san">Nhà đất</Link> / <span>{p.title}</span></div>
          <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', marginBottom: 18 }}>{p.title}</h1>

          <div className="rn-gallery">
            <div className="rn-gallery-main">
              <img src={p.images[curIdx]} alt={p.title} onClick={() => setLightbox(true)} style={{ cursor: 'zoom-in' }} />
              <span className="rn-gallery-status">{p.listing_type === 'ban' ? 'Đang bán' : 'Đang cho thuê'}</span>
            </div>
            <div className="rn-thumbs-row">
              {p.images.map((img, i) => (
                <button key={i} type="button" className={'rn-thumb' + (i === curIdx ? ' active' : '')} onClick={() => setCurIdx(i)}>
                  <img src={img} alt={`Ảnh ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="rn-quickfacts">
            <div className="rn-qf-item"><div className="rn-qf-icon">💰</div><div className="rn-qf-val">{formatPrice(p.price, p.listing_type)}</div><div className="rn-qf-label">Giá</div></div>
            <div className="rn-qf-item"><div className="rn-qf-icon">📐</div><div className="rn-qf-val">{p.area}m²</div><div className="rn-qf-label">Diện tích</div></div>
            <div className="rn-qf-item"><div className="rn-qf-icon">🛏️</div><div className="rn-qf-val">{p.bedrooms > 0 ? p.bedrooms : '—'}</div><div className="rn-qf-label">Phòng ngủ</div></div>
            <div className="rn-qf-item"><div className="rn-qf-icon">🛁</div><div className="rn-qf-val">{p.bathrooms > 0 ? p.bathrooms : '—'}</div><div className="rn-qf-label">Phòng tắm</div></div>
            <div className="rn-qf-item"><div className="rn-qf-icon">🧭</div><div className="rn-qf-val">{DIRECTION_LABELS[p.direction]}</div><div className="rn-qf-label">Hướng nhà</div></div>
            <div className="rn-qf-item"><div className="rn-qf-icon">📜</div><div className="rn-qf-val">{LEGAL_LABELS[p.legal_status]}</div><div className="rn-qf-label">Pháp lý</div></div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="rn-detail-section">
                <h2>Mô tả chi tiết</h2>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>{p.description}</p>
                <p style={{ marginTop: 10, fontSize: 14, color: 'var(--text-3)' }}>📍 Địa chỉ: {p.address}</p>
                <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-3)' }}>
                  🗓️ Đăng ngày {formatDateVN(p.posted_at)} ·{' '}
                  {exp.expired
                    ? <span className="rn-expiry-pill rn-expiry-over">Tin đã hết hạn hiển thị</span>
                    : exp.daysLeft <= 5
                      ? <span className="rn-expiry-pill rn-expiry-soon">Còn {exp.daysLeft} ngày hiển thị (đến {formatDateVN(p.expires_at)})</span>
                      : <span className="rn-expiry-pill rn-expiry-ok">Còn hiệu lực đến {formatDateVN(p.expires_at)}</span>}
                </p>
              </div>

              <div className="rn-detail-section">
                <h2>Đặc điểm nổi bật</h2>
                <p style={{ marginBottom: 12, fontSize: 14, color: 'var(--text-2)' }}>Tình trạng nội thất: <strong>{FURNISHING_LABELS[p.furnishing]}</strong></p>
                <ul className="rn-feature-chips">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
              </div>

              <div className="rn-detail-section">
                <h2>Vị trí &amp; tiện ích xung quanh</h2>
                <iframe className="rn-map-frame" src={`https://maps.google.com/maps?q=${p.lat},${p.lng}&hl=vi&z=15&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ vị trí bất động sản"></iframe>
                <ul className="rn-nearby-list">
                  <li>🏫 Gần trường học trong bán kính 1km tại {p.district}, {p.city}</li>
                  <li>🛒 Cách chợ/siêu thị dân sinh khoảng 500m</li>
                  <li>🏥 Cách bệnh viện/phòng khám khoảng 2km</li>
                  <li>🚌 Kết nối tuyến đường chính trong 5 phút di chuyển</li>
                </ul>
              </div>

              {p.listing_type === 'ban' ? (
                <div className="rn-detail-section">
                  <h2>Công cụ tính vay / trả góp</h2>
                  <div className="rn-calc-box">
                    <div className="rn-calc-row">
                      <div><label htmlFor="calc-price">Giá trị BĐS (triệu đồng)</label><input id="calc-price" type="number" value={calcPrice} onChange={e => setCalcPrice(+e.target.value)} /></div>
                      <div><label htmlFor="calc-percent">Tỷ lệ vay (%)</label><input id="calc-percent" type="number" value={calcPercent} onChange={e => setCalcPercent(+e.target.value)} /></div>
                    </div>
                    <div className="rn-calc-row">
                      <div><label htmlFor="calc-rate">Lãi suất (%/năm)</label><input id="calc-rate" type="number" step={0.1} value={calcRate} onChange={e => setCalcRate(+e.target.value)} /></div>
                      <div><label htmlFor="calc-years">Thời hạn vay (năm)</label><input id="calc-years" type="number" value={calcYears} onChange={e => setCalcYears(+e.target.value)} /></div>
                    </div>
                    <div className="rn-calc-result">Trả góp hàng tháng ước tính<br />
                      <span className="val">{formatFullVND(calcMonthlyPayment(calcPrice * 1e6 * (calcPercent / 100), calcRate, calcYears || 1))}/tháng</span>
                    </div>
                    <p className="rn-calc-note">* Lãi suất chỉ mang tính tham khảo, vui lòng liên hệ ngân hàng để biết mức lãi suất chính xác.</p>
                  </div>
                </div>
              ) : (
                <div className="rn-detail-section">
                  <h2>Ước tính chi phí thuê</h2>
                  <div className="rn-calc-box">
                    <div className="rn-calc-row">
                      <div><label>Tiền thuê / tháng</label><div className="rn-calc-result" style={{ marginTop: 0 }}>{formatFullVND(p.price)}</div></div>
                      <div><label>Tiền cọc thường yêu cầu (2 tháng)</label><div className="rn-calc-result" style={{ marginTop: 0 }}>{formatFullVND(p.price * 2)}</div></div>
                    </div>
                    <p className="rn-calc-note">Tổng chi phí lần đầu tham khảo (cọc 2 tháng + thanh toán tháng đầu): <strong>{formatFullVND(p.price * 3)}</strong></p>
                  </div>
                </div>
              )}

              <div className="rn-detail-section" style={{ borderBottom: 'none' }}>
                <h2>Đặt lịch xem nhà</h2>
                {bookingSent ? (
                  <div className="rn-form-success">✓ Đã gửi yêu cầu! Người đăng tin sẽ liên hệ lại với bạn sớm nhất.</div>
                ) : (
                  <form className="rn-booking-form" onSubmit={submitBooking}>
                    <div className="row g-3">
                      <div className="col-md-6 rn-form-group"><label htmlFor="booking-name">Họ và tên</label><input id="booking-name" type="text" required placeholder="Nguyễn Văn A" /></div>
                      <div className="col-md-6 rn-form-group"><label htmlFor="booking-phone">Số điện thoại</label><input id="booking-phone" type="tel" required placeholder="09xx xxx xxx" /></div>
                      <div className="col-md-6 rn-form-group"><label htmlFor="booking-date">Ngày mong muốn xem nhà</label><input id="booking-date" type="date" /></div>
                      <div className="col-md-6 rn-form-group"><label htmlFor="booking-timeslot">Khung giờ</label>
                        <select id="booking-timeslot"><option>Sáng (8h - 11h)</option><option>Chiều (13h - 17h)</option><option>Tối (17h - 19h)</option></select>
                      </div>
                      <div className="col-12 rn-form-group"><label htmlFor="booking-note">Ghi chú</label><textarea id="booking-note" rows={3} placeholder="Câu hỏi thêm về bất động sản..."></textarea></div>
                    </div>
                    <button type="submit" className="btn-rn btn-rn-primary btn-rn-block mt-2">Gửi yêu cầu đặt lịch</button>
                  </form>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <h2 style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-3)', marginBottom: 14 }}>Người đăng tin</h2>
              <div className="rn-poster-card mb-4">
                <img src={p.poster.avatar} alt={p.poster.name} className="rn-poster-avatar" />
                <div className="rn-poster-role">{ROLE_LABELS[p.poster.role] || p.poster.role}</div>
                <div className="rn-poster-name">{p.poster.name}</div>
                <div className="rn-poster-phone">{p.poster.phone}</div>
                <div className="rn-poster-actions">
                  <a href={`tel:${p.poster.phone.replace(/\s/g, '')}`} className="btn-rn btn-rn-primary btn-rn-block">📞 Gọi ngay</a>
                  <a href={`https://zalo.me/${p.poster.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-rn rn-poster-zalo btn-rn-block">Chat Zalo</a>
                </div>
                <Link to={`/bat-dong-san?nguoiDang=${p.poster.slug}`} style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Xem tất cả tin của người này →</Link>
              </div>
            </div>
          </div>

          {data.related.length > 0 && (
            <div className="sec-pad" style={{ paddingBottom: 0 }}>
              <div className="eyebrow">Có thể bạn quan tâm</div>
              <h2 className="sec-title" style={{ marginBottom: 24 }}>Bất động sản <em>tương tự</em></h2>
              <div className="rn-grid">{data.related.map(r => <PropertyCard key={r.id} p={r} />)}</div>
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="rn-lightbox open" onClick={() => setLightbox(false)}>
          <button className="rn-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <button className="rn-lightbox-prev" onClick={e => { e.stopPropagation(); setCurIdx(i => (i - 1 + p.images.length) % p.images.length) }}>‹</button>
          <img src={p.images[curIdx]} alt="Ảnh phóng to" onClick={e => e.stopPropagation()} />
          <button className="rn-lightbox-next" onClick={e => { e.stopPropagation(); setCurIdx(i => (i + 1) % p.images.length) }}>›</button>
        </div>
      )}
    </div>
  )
}
