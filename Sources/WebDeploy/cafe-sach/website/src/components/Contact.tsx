import { useState } from 'react'
import { api } from '../api/client'
import { useSite } from '../App'

const TIME_SLOTS = ['7:30 – 10:00', '10:00 – 13:00', '13:00 – 16:00', '16:00 – 19:00', '19:00 – 21:30']
const AREAS = ['Góc cửa sổ', 'Thư viện mini', 'Bàn dài chung', 'Góc đọc riêng tư', 'Sân trong nhỏ']
const GROUP_SIZES = ['1 người', '2 người', '3 – 4 người', 'Nhóm đọc sách (5+)']

export default function Contact() {
  const { settings } = useSite()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [area, setArea] = useState(AREAS[0])
  const [guests, setGuests] = useState(GROUP_SIZES[0])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const phoneRaw = settings['site_phone'] || '0912 345 678'
  const email    = settings['site_email'] || 'hello@langtrang.cafe'
  const address  = settings['contact_address'] || settings['site_address'] || 'Số nhà, Ngõ nhỏ, Quận Hoàn Kiếm, Hà Nội'
  const hours    = settings['working_hours'] || '7:30 – 21:30 hàng ngày'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setResult({ type: 'error', text: 'Vui lòng nhập họ tên và số điện thoại.' })
      return
    }
    setSubmitting(true); setResult(null)
    const messageParts = [
      date ? `Ngày muốn ghé: ${date}` : '',
      time ? `Khung giờ: ${time}` : '',
      area ? `Khu vực muốn ngồi: ${area}` : '',
      guests ? `Số người: ${guests}` : '',
      note ? `Ghi chú: ${note}` : '',
    ].filter(Boolean)
    try {
      await api.post<{ message: string }>('/public/contact', {
        name,
        phone,
        subject: 'Đặt chỗ đọc',
        message: messageParts.join(' · '),
      })
      setResult({ type: 'success', text: 'Đã gửi — chúng tôi sẽ phản hồi trong 24h.' })
      setName(''); setPhone(''); setDate(''); setTime(''); setArea(AREAS[0]); setGuests(GROUP_SIZES[0]); setNote('')
    } catch (err: unknown) {
      setResult({ type: 'error', text: err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="sec-pad sec-surface" style={{ paddingTop: 0 }}>
      <div className="csa-container">
        <div className="row g-5">
          <div className="col-lg-5" data-reveal>
            <div className="csa-eyebrow">Thông tin liên hệ</div>
            <h2 className="csa-sec-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>Lặng Trang <em>Cà Phê Sách</em></h2>
            <ul className="csa-info-list mt-4">
              <li>
                <div className="csa-info-label">Điện thoại</div>
                <div className="csa-info-value"><a href={`tel:${phoneRaw.replace(/\s/g, '')}`}>{phoneRaw}</a></div>
              </li>
              <li>
                <div className="csa-info-label">Email</div>
                <div className="csa-info-value"><a href={`mailto:${email}`}>{email}</a></div>
              </li>
              <li>
                <div className="csa-info-label">Địa chỉ</div>
                <div className="csa-info-value">{address}</div>
              </li>
              <li>
                <div className="csa-info-label">Giờ mở cửa</div>
                <div className="csa-info-value">{hours}</div>
              </li>
            </ul>
          </div>
          <div className="col-lg-7" data-reveal data-reveal-d1>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6 csa-form-group">
                  <label className="csa-form-label">Họ và tên</label>
                  <input type="text" className="csa-form-control" placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="col-md-6 csa-form-group">
                  <label className="csa-form-label">Số điện thoại</label>
                  <input type="tel" className="csa-form-control" placeholder="09xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="col-md-6 csa-form-group">
                  <label className="csa-form-label">Ngày muốn ghé</label>
                  <input type="date" className="csa-form-control" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="col-md-6 csa-form-group">
                  <label className="csa-form-label">Khung giờ</label>
                  <select className="csa-form-control" value={time} onChange={e => setTime(e.target.value)}>
                    <option value="">-- Chọn khung giờ --</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-md-6 csa-form-group">
                  <label className="csa-form-label">Khu vực muốn ngồi</label>
                  <select className="csa-form-control" value={area} onChange={e => setArea(e.target.value)}>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="col-md-6 csa-form-group">
                  <label className="csa-form-label">Số người</label>
                  <select className="csa-form-control" value={guests} onChange={e => setGuests(e.target.value)}>
                    {GROUP_SIZES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-12 csa-form-group">
                  <label className="csa-form-label">Ghi chú thêm</label>
                  <textarea className="csa-form-control" placeholder="Ví dụ: cần chỗ có ổ điện để làm việc, muốn mượn sách trước..." value={note} onChange={e => setNote(e.target.value)} />
                </div>
              </div>
              {result && (
                <p style={{ marginTop: 16, fontSize: 13.5, color: result.type === 'success' ? 'var(--accent)' : 'var(--danger)' }}>{result.text}</p>
              )}
              <button type="submit" className="csa-btn csa-btn-accent mt-2" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt chỗ'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
