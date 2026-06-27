import { useEffect, useState, FormEvent } from 'react'
import { api } from '../api/client'

interface Settings {
  site_phone?: string
  site_name?: string
  [key: string]: string | undefined
}

interface Service {
  id: number
  name: string
  category_id: number | null
  price: number
  price_unit: string
}

interface BookingPayload {
  full_name: string
  phone: string
  email: string
  package_selected: string
  guests: number
  pref_date: string
  pref_time: string
  special_requests: string
}

interface FormErrors {
  full_name?: string
  phone?: string
  package_selected?: string
  pref_date?: string
  agree_policy?: string
}

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
]

const POPULAR_PACKAGES = [
  'Spa Day Retreat',
  'Royal Detox Ritual',
  'Couple Sanctuary',
  'Gold 24K Facial Treatment',
]

function validate(form: {
  full_name: string
  phone: string
  package_selected: string
  pref_date: string
  agree_policy: boolean
}): FormErrors {
  const errs: FormErrors = {}
  if (!form.full_name.trim()) errs.full_name = 'Vui lòng nhập họ và tên.'
  if (!form.phone.trim()) {
    errs.phone = 'Vui lòng nhập số điện thoại.'
  } else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ''))) {
    errs.phone = 'Số điện thoại không hợp lệ.'
  }
  if (!form.package_selected) errs.package_selected = 'Vui lòng chọn gói dịch vụ.'
  if (!form.pref_date) errs.pref_date = 'Vui lòng chọn ngày trải nghiệm.'
  if (!form.agree_policy) errs.agree_policy = 'Vui lòng đồng ý với chính sách.'
  return errs
}

export default function Booking() {
  const [settings, setSettings] = useState<Settings>({})
  const [services, setServices] = useState<Service[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [packageSelected, setPackageSelected] = useState('')
  const [guests, setGuests] = useState(1)
  const [prefDate, setPrefDate] = useState('')
  const [prefTime, setPrefTime] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [agreePolicy, setAgreePolicy] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Service[]>('/public/services'),
    ]).then(([s, svcs]) => {
      setSettings(s)
      setServices(svcs)
    }).catch(() => {})
  }, [])

  // Build today date string for min date attribute
  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate({ full_name: fullName, phone, package_selected: packageSelected, pref_date: prefDate, agree_policy: agreePolicy })
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const payload: BookingPayload = {
        full_name:        fullName,
        phone,
        email,
        package_selected: packageSelected,
        guests,
        pref_date:        prefDate,
        pref_time:        prefTime,
        special_requests: specialRequests,
      }
      await api.post('/public/bookings', payload)
      setSubmitted(true)
    } catch (err) {
      setErrors({ full_name: 'Có lỗi xảy ra, vui lòng thử lại sau.' })
    } finally {
      setSubmitting(false)
    }
  }

  const phone0 = settings.site_phone || '0901 234 567'

  // Group services for select
  const categorized = services.filter(s => s.category_id !== null)
  const packages    = services.filter(s => s.category_id === null)

  return (
    <section className="sl-booking-bg sl-section">
      <div className="sl-container">
        <div className="sl-booking-layout">
          {/* ── Main form ── */}
          <div>
            {submitted ? (
              <div className="sl-success-msg" data-reveal>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                <h3>Đặt lịch thành công!</h3>
                <p>
                  Cảm ơn <strong>{fullName}</strong>! Chúng tôi đã nhận được yêu cầu của bạn.
                  Đội ngũ sẽ liên hệ xác nhận qua số <strong>{phone}</strong> trong vòng 2 giờ.
                </p>
                <button
                  className="sl-btn sl-btn-outline"
                  style={{ marginTop: 24 }}
                  onClick={() => {
                    setSubmitted(false)
                    setFullName(''); setPhone(''); setEmail('')
                    setPackageSelected(''); setGuests(1)
                    setPrefDate(''); setPrefTime(''); setSpecialRequests('')
                    setAgreePolicy(false)
                  }}
                >
                  Đặt lịch thêm
                </button>
              </div>
            ) : (
              <form className="sl-booking-form-wrap" onSubmit={handleSubmit} noValidate>
                <h2 className="sl-sec-title" style={{ marginBottom: 28, fontSize: 24 }}>
                  Thông tin đặt gói
                </h2>

                {/* Row 1: Name + Phone */}
                <div className="sl-form-row">
                  <div className="sl-field">
                    <label htmlFor="bk-name">Họ và tên *</label>
                    <input
                      id="bk-name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                    {errors.full_name && <span className="sl-field-error">{errors.full_name}</span>}
                  </div>
                  <div className="sl-field">
                    <label htmlFor="bk-phone">Số điện thoại *</label>
                    <input
                      id="bk-phone"
                      type="tel"
                      placeholder="0901 234 567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                    {errors.phone && <span className="sl-field-error">{errors.phone}</span>}
                  </div>
                </div>

                {/* Row 2: Email + Guests */}
                <div className="sl-form-row">
                  <div className="sl-field">
                    <label htmlFor="bk-email">Email</label>
                    <input
                      id="bk-email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="sl-field">
                    <label htmlFor="bk-guests">Số người</label>
                    <select
                      id="bk-guests"
                      value={guests}
                      onChange={e => setGuests(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} người</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Package select */}
                <div className="sl-field">
                  <label htmlFor="bk-package">Gói dịch vụ *</label>
                  <select
                    id="bk-package"
                    value={packageSelected}
                    onChange={e => setPackageSelected(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn gói dịch vụ --</option>
                    {packages.length > 0 && (
                      <optgroup label="── Gói nghỉ dưỡng ──">
                        {packages.map(p => (
                          <option key={p.id} value={p.name}>
                            {p.name}{p.price > 0 ? ` — ${p.price.toLocaleString('vi-VN')}đ/${p.price_unit}` : ''}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {categorized.length > 0 && (
                      <optgroup label="── Liệu trình lẻ ──">
                        {categorized.map(s => (
                          <option key={s.id} value={s.name}>
                            {s.name}{s.price > 0 ? ` — ${s.price.toLocaleString('vi-VN')}đ` : ''}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {errors.package_selected && <span className="sl-field-error">{errors.package_selected}</span>}
                </div>

                {/* Date + Time */}
                <div className="sl-form-row">
                  <div className="sl-field">
                    <label htmlFor="bk-date">Ngày trải nghiệm *</label>
                    <input
                      id="bk-date"
                      type="date"
                      min={today}
                      value={prefDate}
                      onChange={e => setPrefDate(e.target.value)}
                      required
                    />
                    {errors.pref_date && <span className="sl-field-error">{errors.pref_date}</span>}
                  </div>
                  <div className="sl-field">
                    <label htmlFor="bk-time">Giờ mong muốn</label>
                    <select
                      id="bk-time"
                      value={prefTime}
                      onChange={e => setPrefTime(e.target.value)}
                    >
                      <option value="">-- Chọn giờ --</option>
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special requests */}
                <div className="sl-field">
                  <label htmlFor="bk-notes">Yêu cầu đặc biệt</label>
                  <textarea
                    id="bk-notes"
                    rows={4}
                    placeholder="Dị ứng, sở thích, yêu cầu riêng..."
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                  />
                </div>

                {/* Policy agree */}
                <div className="sl-checkbox-row">
                  <input
                    id="bk-policy"
                    type="checkbox"
                    checked={agreePolicy}
                    onChange={e => setAgreePolicy(e.target.checked)}
                    required
                  />
                  <label htmlFor="bk-policy">
                    Tôi đồng ý với{' '}
                    <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>chính sách đặt lịch</span>
                    {' '}và xác nhận thông tin đã điền là chính xác.
                  </label>
                </div>
                {errors.agree_policy && (
                  <p className="sl-field-error" style={{ marginTop: -12, marginBottom: 16 }}>
                    {errors.agree_policy}
                  </p>
                )}

                <div className="sl-form-submit-row">
                  <button
                    type="submit"
                    className="sl-btn sl-btn-gold sl-btn-lg"
                    disabled={submitting}
                    style={{ opacity: submitting ? .7 : 1 }}
                  >
                    {submitting ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="sl-booking-sidebar">
            {/* Policy card */}
            <div className="sl-sidebar-card">
              <p className="sl-sidebar-card-title">
                <span>📋</span> Chính sách đặt lịch
              </p>
              <ul className="sl-sidebar-policy">
                <li>Xác nhận trong vòng 2 giờ làm việc</li>
                <li>Hủy miễn phí trước 24 giờ</li>
                <li>Đến sớm 10 phút để chuẩn bị</li>
                <li>Mặc trang phục thoải mái</li>
                <li>Thông báo nếu có dị ứng hoặc bệnh lý</li>
                <li>Trẻ em dưới 16 tuổi cần có người lớn đi kèm</li>
              </ul>
            </div>

            {/* VIP contact */}
            <div className="sl-sidebar-card sl-vip-card">
              <p className="sl-sidebar-card-title">
                <span>💎</span> Tư vấn VIP
              </p>
              <p className="sl-vip-note">
                Cần hỗ trợ ngay hoặc muốn đặt gói VIP cao cấp? Gọi hotline:
              </p>
              <p className="sl-vip-phone">
                <a href={`tel:${phone0.replace(/\s/g, '')}`}>{phone0}</a>
              </p>
              <p className="sl-vip-note">
                Phục vụ 7:00 – 22:00 mỗi ngày trong tuần.
              </p>
            </div>

            {/* Popular packages */}
            <div className="sl-sidebar-card">
              <p className="sl-sidebar-card-title">
                <span>⭐</span> Gói phổ biến nhất
              </p>
              <ul className="sl-sidebar-policy">
                {POPULAR_PACKAGES.map(name => (
                  <li
                    key={name}
                    style={{ cursor: 'pointer', transition: 'color .2s' }}
                    onClick={() => setPackageSelected(name)}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = ''}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
