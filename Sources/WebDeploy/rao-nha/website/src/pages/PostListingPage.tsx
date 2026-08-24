import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useAccount } from '../contexts/AccountContext'
import { api } from '../api/client'
import { AREAS } from '../lib/listings'

interface Pkg { tier: string; label: string; price: number; duration_days: number; benefits: string[] }

const TOTAL_STEPS = 4

export default function PostListingPage() {
  useDocumentMeta({ title: 'Đăng tin bất động sản | RaoNhà', description: 'Đăng tin bán/cho thuê bất động sản miễn phí trên RaoNhà. So sánh 4 gói tin Thường, VIP Bạc, VIP Vàng, VIP Kim Cương để chọn gói phù hợp.' })
  const { account, loading } = useAccount()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [packages, setPackages] = useState<Pkg[]>([])
  const [need, setNeed] = useState<'ban' | 'cho-thue'>('ban')
  const [propertyType, setPropertyType] = useState('chung-cu')
  const [areaSlug, setAreaSlug] = useState(AREAS[0].slug)
  const [address, setAddress] = useState('')
  const [area, setArea] = useState('')
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [direction, setDirection] = useState('dong')
  const [legalStatus, setLegalStatus] = useState('so-do')
  const [furnishing, setFurnishing] = useState('day-du')
  const [description, setDescription] = useState('')
  const [tier, setTier] = useState('thuong')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => { api.get<Pkg[]>('/public/listing-packages').then(setPackages).catch(() => {}) }, [])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files).slice(0, 10 - images.length)) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await api.upload<{ url: string }>('/public/upload', fd)
        uploaded.push(res.url)
      }
      setImages(prev => [...prev, ...uploaded])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload ảnh thất bại.')
    } finally { setUploading(false) }
  }

  function removeImage(i: number) { setImages(prev => prev.filter((_, idx) => idx !== i)) }

  async function handleSubmit() {
    setError('')
    const areaObj = AREAS.find(a => a.slug === areaSlug)!
    if (!address.trim()) { setError('Vui lòng nhập địa chỉ cụ thể.'); setStep(1); return }
    if (!area || +area <= 0) { setError('Vui lòng nhập diện tích hợp lệ.'); setStep(2); return }
    if (!price || +price <= 0) { setError('Vui lòng nhập mức giá hợp lệ.'); setStep(2); return }
    if (!description.trim()) { setError('Vui lòng nhập mô tả chi tiết.'); setStep(2); return }

    setSubmitting(true)
    try {
      await api.post('/public/my-listings', {
        listing_type: need, property_type: propertyType,
        district: areaObj.label, city: areaObj.city, address,
        area: +area, price: +price, bedrooms: +bedrooms || 0, bathrooms: +bathrooms || 0,
        direction, legal_status: legalStatus, furnishing, description, images, tier,
      })
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đăng tin thất bại.')
    } finally { setSubmitting(false) }
  }

  if (loading) return <div style={{ padding: '160px 0', textAlign: 'center' }}>Đang tải...</div>

  if (!account) {
    return (
      <section className="sec-pad" style={{ paddingTop: 140 }}>
        <div className="rn-container" style={{ maxWidth: 560, textAlign: 'center' }}>
          <h1 className="sec-title">Đăng tin <em>bất động sản</em></h1>
          <p className="sec-sub" style={{ margin: '16px auto 24px' }}>Bạn cần đăng nhập hoặc tạo tài khoản RaoNhà miễn phí để đăng tin và quản lý tin đăng của mình.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dang-nhap" className="btn-rn btn-rn-primary">Đăng nhập</Link>
            <Link to="/dang-ky" className="btn-rn btn-rn-ghost">Tạo tài khoản mới</Link>
          </div>
        </div>
      </section>
    )
  }

  if (success) {
    return (
      <section className="sec-pad" style={{ paddingTop: 140 }}>
        <div className="rn-container">
          <div className="rn-form-success" style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
            <h3 style={{ marginBottom: 10 }}>🎉 Cảm ơn bạn!</h3>
            <p>Tin đăng của bạn đã được ghi nhận và sẽ được RaoNhà kiểm duyệt trong vòng 24 giờ trước khi hiển thị công khai.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <Link to="/tai-khoan" className="btn-rn btn-rn-primary">Xem tin đăng của tôi</Link>
              <button className="btn-rn btn-rn-ghost" onClick={() => navigate('/bat-dong-san')}>Xem tin đăng khác</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Đăng tin miễn phí</div>
          <h1 className="sec-title">Đăng tin <em>bất động sản</em></h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Chỉ mất vài phút để tin đăng của bạn tiếp cận hàng nghìn người mua/thuê trên RaoNhà.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ paddingTop: 40 }}>
        <div className="rn-container">
          <div className="rn-stepper-nav">
            {['1. Nhu cầu', '2. Chi tiết', '3. Hình ảnh', '4. Chọn gói tin'].map((label, i) => (
              <div key={label} className={'rn-step-dot' + (step === i + 1 ? ' active' : step > i + 1 ? ' done' : '')}>{label}</div>
            ))}
          </div>
          <p className="rn-step-label">Bước {step}/{TOTAL_STEPS}</p>

          {error && <div className="alert-danger" style={{ maxWidth: 780, margin: '0 auto 16px' }}>{error}</div>}

          {step === 1 && (
            <div className="rn-step-panel">
              <div className="rn-need-radio">
                <label className={need === 'ban' ? 'checked' : ''}><input type="radio" checked={need === 'ban'} onChange={() => setNeed('ban')} /><span>🏠 Tôi muốn Bán</span></label>
                <label className={need === 'cho-thue' ? 'checked' : ''}><input type="radio" checked={need === 'cho-thue'} onChange={() => setNeed('cho-thue')} /><span>🔑 Tôi muốn Cho thuê</span></label>
              </div>
              <div className="row g-3">
                <div className="col-md-6 rn-form-group"><label htmlFor="post-property-type">Loại hình bất động sản</label>
                  <select id="post-property-type" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                    <option value="chung-cu">Chung cư</option><option value="nha-pho">Nhà phố</option><option value="dat-nen">Đất nền</option>
                    <option value="biet-thu">Biệt thự</option><option value="shophouse">Shophouse</option><option value="can-ho-dich-vu">Căn hộ dịch vụ</option>
                  </select>
                </div>
                <div className="col-md-6 rn-form-group"><label htmlFor="post-area-slug">Khu vực</label>
                  <select id="post-area-slug" value={areaSlug} onChange={e => setAreaSlug(e.target.value)}>
                    <optgroup label="Hà Nội">{AREAS.filter(a => a.city === 'Hà Nội').map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}</optgroup>
                    <optgroup label="TP.HCM">{AREAS.filter(a => a.city === 'TP.HCM').map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}</optgroup>
                    <optgroup label="Đà Nẵng">{AREAS.filter(a => a.city === 'Đà Nẵng').map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}</optgroup>
                  </select>
                </div>
                <div className="col-12 rn-form-group"><label htmlFor="post-address">Địa chỉ cụ thể</label><input id="post-address" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Số nhà, tên đường, phường/xã..." /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rn-step-panel">
              <div className="row g-3">
                <div className="col-md-4 rn-form-group"><label htmlFor="post-area">Diện tích (m²)</label><input id="post-area" type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Vd: 75" /></div>
                <div className="col-md-4 rn-form-group"><label htmlFor="post-price">Mức giá (VNĐ)</label><input id="post-price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Vd: 3200000000" /></div>
                <div className="col-md-4 rn-form-group"><label htmlFor="post-bedrooms">Số phòng ngủ</label><input id="post-bedrooms" type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder="Vd: 2" /></div>
                <div className="col-md-4 rn-form-group"><label htmlFor="post-bathrooms">Số phòng tắm</label><input id="post-bathrooms" type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} placeholder="Vd: 2" /></div>
                <div className="col-md-4 rn-form-group"><label htmlFor="post-direction">Hướng nhà</label>
                  <select id="post-direction" value={direction} onChange={e => setDirection(e.target.value)}>
                    <option value="dong">Đông</option><option value="tay">Tây</option><option value="nam">Nam</option><option value="bac">Bắc</option>
                    <option value="dong-nam">Đông Nam</option><option value="dong-bac">Đông Bắc</option><option value="tay-nam">Tây Nam</option><option value="tay-bac">Tây Bắc</option>
                  </select>
                </div>
                <div className="col-md-4 rn-form-group"><label htmlFor="post-legal-status">Tình trạng pháp lý</label>
                  <select id="post-legal-status" value={legalStatus} onChange={e => setLegalStatus(e.target.value)}>
                    <option value="so-do">Sổ đỏ</option><option value="so-hong">Sổ hồng</option><option value="hop-dong-mua-ban">Hợp đồng mua bán</option><option value="dang-cho-so">Đang chờ sổ</option>
                  </select>
                </div>
                <div className="col-md-6 rn-form-group"><label htmlFor="post-furnishing">Tình trạng nội thất</label>
                  <select id="post-furnishing" value={furnishing} onChange={e => setFurnishing(e.target.value)}>
                    <option value="day-du">Đầy đủ nội thất</option><option value="co-ban">Nội thất cơ bản</option><option value="tho">Nhà thô</option>
                  </select>
                </div>
                <div className="col-md-6 rn-form-group"><label htmlFor="post-contact-phone">Số điện thoại liên hệ</label><input id="post-contact-phone" type="tel" defaultValue={account.phone} placeholder="09xx xxx xxx" /></div>
                <div className="col-12 rn-form-group"><label htmlFor="post-description">Mô tả chi tiết</label><textarea id="post-description" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả về bất động sản, tiện ích xung quanh, lý do bán/cho thuê..."></textarea></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rn-step-panel">
              <div className="rn-dropzone" onClick={() => fileInputRef.current?.click()}>
                <div className="rn-dropzone-icon">📷</div>
                <p style={{ fontWeight: 700, marginBottom: 6 }}>{uploading ? 'Đang tải ảnh lên...' : 'Bấm để chọn ảnh từ máy tính'}</p>
                <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Hỗ trợ JPG, PNG — tối đa 10 ảnh, nên có ảnh mặt tiền, phòng khách, phòng ngủ</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" hidden onChange={e => handleFiles(e.target.files)} />
              </div>
              <ul>
                {images.length === 0 && <li className="text-muted">Chưa chọn ảnh nào</li>}
                {images.map((url, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={url} alt={`Ảnh ${i + 1}`} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                    📷 Ảnh {i + 1}
                    <button type="button" onClick={() => removeImage(i)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Xóa</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 4 && (
            <div className="rn-step-panel">
              <div className="rn-tier-grid">
                {packages.map(pkg => (
                  <label key={pkg.tier} className={'rn-tier-card' + (tier === pkg.tier ? ' selected' : '') + (pkg.tier === 'vip-vang' ? ' featured' : '')} onClick={() => setTier(pkg.tier)}>
                    <input type="radio" name="tier" checked={tier === pkg.tier} onChange={() => setTier(pkg.tier)} hidden />
                    <h4>{pkg.label}</h4>
                    <div className="rn-tier-price">{pkg.price === 0 ? 'Miễn phí' : `${pkg.price.toLocaleString('vi-VN')}đ`} <small>/ {pkg.duration_days} ngày</small></div>
                    <ul>{pkg.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
                  </label>
                ))}
              </div>
              {(() => {
                const selected = packages.find(pk => pk.tier === tier)
                return selected && selected.price > 0 && account.credit_balance < selected.price ? (
                  <div className="alert-danger" style={{ marginTop: 16 }}>
                    Số dư ví của bạn ({account.credit_balance.toLocaleString('vi-VN')}đ) không đủ để đăng gói {selected.label} ({selected.price.toLocaleString('vi-VN')}đ).{' '}
                    <Link to="/nap-tien" style={{ fontWeight: 700 }}>Nạp thêm credit →</Link>
                  </div>
                ) : null
              })()}
            </div>
          )}

          <div className="rn-step-actions">
            <button type="button" className="btn-rn btn-rn-ghost" style={{ visibility: step === 1 ? 'hidden' : 'visible' }} onClick={() => setStep(s => Math.max(1, s - 1))}>← Quay lại</button>
            {step < TOTAL_STEPS ? (
              <button type="button" className="btn-rn btn-rn-primary" onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}>Tiếp tục →</button>
            ) : (
              <button type="button" className="btn-rn btn-rn-primary" disabled={submitting} onClick={handleSubmit}>{submitting ? 'Đang đăng...' : '✓ Đăng tin ngay'}</button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
