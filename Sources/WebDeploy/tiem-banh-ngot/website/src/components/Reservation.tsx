import { useState } from 'react'
import { api } from '../api/client'

const CAKE_TYPES = ['Bánh kem sinh nhật', 'Bánh kem cưới', 'Bánh macaron', 'Croissant & Pastry', 'Tart & Muffin', 'Bánh kem theo yêu cầu']
const CAKE_SIZES = ['15cm (4–6 người)', '18cm (6–8 người)', '20cm (8–12 người)', '25cm (12–18 người)', '30cm (18–30 người)']
const DECORATION_STYLES = ['Minimalist & Elegant', 'Floral (Hoa tươi/Hoa đường)', 'Cartoon/Hoạt hình', 'Vintage/Rustic', 'Hiện đại & Geometric', 'Theo yêu cầu riêng']
const FLAVOR_LIST = ['Dâu tây tươi', 'Socola Bỉ', 'Matcha Nhật Bản', 'Vanilla Madagascar', 'Caramel Muối', 'Chanh Yuzu', 'Tiramisu', 'Bánh mứt']

const PRICE_GUIDE = [
  { cat: 'Bánh kem 15cm (4–6 người)', price: 'từ 450.000đ' },
  { cat: 'Bánh kem 18cm (6–8 người)', price: 'từ 600.000đ' },
  { cat: 'Bánh kem 20cm (8–12 người)', price: 'từ 750.000đ' },
  { cat: 'Macaron (hộp 12 viên)', price: 'từ 280.000đ' },
  { cat: 'Tart & Muffin (hộp 6)', price: 'từ 180.000đ' },
  { cat: 'Bánh cưới nhiều tầng', price: 'Liên hệ báo giá' },
]

interface FormData {
  name: string
  phone: string
  email: string
  cake_type: string
  cake_size: string
  flavors: string[]
  decoration_style: string
  color_theme: string
  cake_message: string
  special_request: string
  pickup_date: string
  delivery_type: string
  delivery_address: string
  note: string
}

export default function Reservation() {
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '',
    cake_type: '', cake_size: '', flavors: [],
    decoration_style: '', color_theme: '', cake_message: '', special_request: '',
    pickup_date: '', delivery_type: 'pickup', delivery_address: '', note: '',
  })
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function set(key: keyof FormData, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleFlavor(flavor: string) {
    setForm(f => ({
      ...f,
      flavors: f.flavors.includes(flavor)
        ? f.flavors.filter(v => v !== flavor)
        : [...f.flavors, flavor],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true); setMsg(null)
    try {
      const payload = { ...form, flavors: form.flavors.join(', ') }
      await api.post('/public/order', payload)
      setMsg({ type: 'success', text: '🎂 Đặt bánh thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 2 giờ làm việc.' })
      setForm({
        name: '', phone: '', email: '', cake_type: '', cake_size: '', flavors: [],
        decoration_style: '', color_theme: '', cake_message: '', special_request: '',
        pickup_date: '', delivery_type: 'pickup', delivery_address: '', note: '',
      })
    } catch {
      setMsg({ type: 'error', text: 'Gửi đơn thất bại. Vui lòng thử lại hoặc gọi điện trực tiếp.' })
    } finally { setSending(false) }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 3)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Đặt bánh theo yêu cầu</div>
          <h1 className="ph-title">Bánh <em>của riêng bạn</em></h1>
          <p className="ph-sub">Điền form bên dưới để đặt bánh theo yêu cầu. Chúng tôi sẽ liên hệ xác nhận và tư vấn chi tiết.</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-8">
              {msg && (
                <div style={{
                  padding: '16px 20px', borderRadius: 12, fontSize: 15, marginBottom: 24,
                  background: msg.type === 'success' ? 'var(--accent-light)' : '#fff0f0',
                  color: msg.type === 'success' ? 'var(--accent)' : 'var(--danger)',
                  border: `1px solid ${msg.type === 'success' ? 'var(--border)' : '#fdd'}`,
                }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="order-form">
                {/* Section 1: Contact */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div className="step-badge">1</div>
                  <div className="form-section-title" style={{ margin: 0, padding: 0, border: 'none' }}>Thông tin liên hệ</div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <label className="form-label">Họ tên *</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Số điện thoại *</label>
                    <input type="tel" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="0901 234 567" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                  </div>
                </div>

                {/* Section 2: Cake info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div className="step-badge">2</div>
                  <div className="form-section-title" style={{ margin: 0, padding: 0, border: 'none' }}>Thông tin bánh</div>
                </div>
                <div className="row g-3 mb-2">
                  <div className="col-sm-6">
                    <label className="form-label">Loại bánh *</label>
                    <select className="form-control" value={form.cake_type} onChange={e => set('cake_type', e.target.value)} required>
                      <option value="">Chọn loại bánh</option>
                      {CAKE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Kích thước</label>
                    <select className="form-control" value={form.cake_size} onChange={e => set('cake_size', e.target.value)}>
                      <option value="">Chọn kích thước</option>
                      {CAKE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label mb-2">Hương vị kem (chọn tối đa 3)</label>
                  <div className="row g-2">
                    {FLAVOR_LIST.map(f => (
                      <div key={f} className="col-6 col-sm-4 col-md-3">
                        <label className="flavor-option">
                          <input
                            type="checkbox"
                            checked={form.flavors.includes(f)}
                            onChange={() => toggleFlavor(f)}
                            disabled={!form.flavors.includes(f) && form.flavors.length >= 3}
                          />
                          <span style={{ fontSize: 13 }}>{f}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Decoration */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div className="step-badge">3</div>
                  <div className="form-section-title" style={{ margin: 0, padding: 0, border: 'none' }}>Trang trí bánh</div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <label className="form-label">Phong cách trang trí</label>
                    <select className="form-control" value={form.decoration_style} onChange={e => set('decoration_style', e.target.value)}>
                      <option value="">Chọn phong cách</option>
                      {DECORATION_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Màu chủ đạo</label>
                    <input type="text" className="form-control" value={form.color_theme} onChange={e => set('color_theme', e.target.value)} placeholder="Hồng nhạt, trắng ngọc..." />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Thông điệp trên bánh</label>
                    <input type="text" className="form-control" value={form.cake_message} onChange={e => set('cake_message', e.target.value)} placeholder="Happy Birthday Lan! ❤️" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Yêu cầu đặc biệt khác</label>
                    <textarea className="form-control" rows={3} value={form.special_request} onChange={e => set('special_request', e.target.value)} placeholder="Không dùng kem động vật, bánh không quá ngọt..." />
                  </div>
                </div>

                {/* Section 4: Pickup */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div className="step-badge">4</div>
                  <div className="form-section-title" style={{ margin: 0, padding: 0, border: 'none' }}>Ngày nhận & Giao hàng</div>
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Ngày nhận bánh *</label>
                    <input type="date" className="form-control" value={form.pickup_date} onChange={e => set('pickup_date', e.target.value)} min={minDate} required />
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Đặt trước tối thiểu 3 ngày</div>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Hình thức nhận</label>
                    <select className="form-control" value={form.delivery_type} onChange={e => set('delivery_type', e.target.value)}>
                      <option value="pickup">Nhận tại tiệm</option>
                      <option value="delivery">Giao tận nơi</option>
                    </select>
                  </div>
                  {form.delivery_type === 'delivery' && (
                    <div className="col-12">
                      <label className="form-label">Địa chỉ giao hàng</label>
                      <input type="text" className="form-control" value={form.delivery_address} onChange={e => set('delivery_address', e.target.value)} placeholder="Số nhà, đường, quận, TP.HCM" required={form.delivery_type === 'delivery'} />
                    </div>
                  )}
                  <div className="col-12">
                    <label className="form-label">Ghi chú thêm</label>
                    <textarea className="form-control" rows={2} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Thông tin thêm nếu có..." />
                  </div>
                </div>

                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <button type="submit" className="btn-accent" disabled={sending} style={{ fontSize: 15, padding: '13px 32px' }}>
                    {sending ? '🎂 Đang gửi...' : '🎂 Xác nhận đặt bánh'}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 12, lineHeight: 1.6 }}>
                    Sau khi gửi form, chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc để xác nhận đơn và tư vấn chi tiết.
                  </p>
                </div>
              </form>
            </div>

            {/* Price guide */}
            <div className="col-lg-4">
              <div className="price-guide" style={{ position: 'sticky', top: 80 }}>
                <div className="pg-title">💰 Bảng giá tham khảo</div>
                {PRICE_GUIDE.map(r => (
                  <div key={r.cat} className="pg-row">
                    <span className="pg-cat">{r.cat}</span>
                    <span className="pg-price">{r.price}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '14px', background: 'var(--accent-light)', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 6 }}>📝 Lưu ý khi đặt bánh</div>
                  <ul style={{ fontSize: 12, color: 'var(--text-2)', paddingLeft: 16, lineHeight: 1.8, margin: 0 }}>
                    <li>Đặt trước tối thiểu 3–5 ngày</li>
                    <li>Đặt cọc 50% khi xác nhận</li>
                    <li>Phí ship nội thành 30.000–50.000đ</li>
                    <li>Bánh cưới cần đặt trước 1–2 tuần</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
