import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ContactPage() {
  usePageTitle('Liên hệ')
  const { settings } = useSite()

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => ro.observe(el))
    return () => ro.disconnect()
  }, [])

  const phone   = settings.site_phone || '028 3823 4567'
  const email   = settings.site_email || 'info@vietfinance.vn'
  const address = settings.site_address || '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'
  const mapEmbed = settings.google_map_embed || ''

  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '',
    preferred_date: '', preferred_time: '', asset_range: '', consult_format: 'Gặp trực tiếp tại văn phòng', note: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.service) return
    setLoading(true)
    try {
      await fetch((import.meta.env.DEV ? '/api' : window.location.origin + '/api') + '/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email,
          subject: 'Đặt lịch tư vấn',
          message: form.note || 'Khách hàng muốn đặt lịch tư vấn',
          service: form.service,
          preferred_date: form.preferred_date,
          preferred_time: form.preferred_time,
          asset_range: form.asset_range,
          consult_format: form.consult_format,
        }),
        credentials: 'include',
      })
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="tc-page-hero">
        <div className="wd-container">
          <p className="tc-ph-label">Liên hệ</p>
          <h1 className="tc-ph-title">Bắt đầu hành trình<br />tài chính của bạn</h1>
          <p className="tc-ph-sub">Buổi tư vấn đầu tiên hoàn toàn miễn phí và không ràng buộc. Chỉ cần 30 phút để có lộ trình tài chính rõ ràng.</p>
        </div>
      </section>

      <div className="tc-breadcrumb">
        <div className="wd-container">
          <Link to="/">Trang chủ</Link><span className="sep">/</span><span className="current">Liên hệ</span>
        </div>
      </div>

      {/* CHANNELS */}
      <section className="tc-sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row g-4 mb-5">
            {[
              { icon: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', name: 'Đặt lịch Online', info: 'Điền form bên dưới — nhận xác nhận tức thì' },
              { icon: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z', name: 'Gọi điện', info: `${phone}\nT2–T6 · 8:00–17:30` },
              { icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', name: 'Email', info: `${email}\nPhản hồi trong 4 giờ` },
              { icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', name: 'Văn phòng', info: address },
            ].map((ch, i) => (
              <div key={i} className="col-md-3 col-sm-6" data-reveal="" data-delay={i > 0 ? String(i) : undefined}>
                <div className="tc-channel-card">
                  <div className="tc-channel-icon">
                    <svg viewBox="0 0 24 24"><path d={ch.icon}/></svg>
                  </div>
                  <div className="tc-channel-name">{ch.name}</div>
                  <div className="tc-channel-info" style={{ whiteSpace: 'pre-line' }}>{ch.info}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="tc-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-7" data-reveal="">
              <div className="tc-label">Đặt lịch tư vấn</div>
              <h2 className="tc-title mb-4">Tư vấn <span>miễn phí</span> · Không ràng buộc</h2>
              {success ? (
                <div className="alert-success">
                  Yêu cầu đặt lịch đã được ghi nhận! Chuyên gia sẽ liên hệ xác nhận trong vòng 2 giờ làm việc.
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="tc-form-label">Họ và tên *</label>
                      <input type="text" className="tc-form-input" placeholder="Họ và tên" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label className="tc-form-label">Số điện thoại *</label>
                      <input type="tel" className="tc-form-input" placeholder="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label className="tc-form-label">Email</label>
                      <input type="email" className="tc-form-input" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="tc-form-label">Dịch vụ quan tâm *</label>
                      <select className="tc-form-select" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required>
                        <option value="">Chọn dịch vụ</option>
                        <option>Quản lý Đầu tư</option>
                        <option>Tư vấn Thuế</option>
                        <option>Hoạch định Tài chính Cá nhân</option>
                        <option>Hoạch định Hưu trí</option>
                        <option>Quản lý Rủi ro</option>
                        <option>Tư vấn Doanh nghiệp</option>
                        <option>Chưa rõ — cần tư vấn chung</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="tc-form-label">Ngày muốn tư vấn</label>
                      <input type="date" className="tc-form-input" min={today} value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="tc-form-label">Khung giờ ưa thích</label>
                      <select className="tc-form-select" value={form.preferred_time} onChange={e => setForm(f => ({ ...f, preferred_time: e.target.value }))}>
                        <option value="">Chọn khung giờ</option>
                        <option>Buổi sáng (8:00 – 11:30)</option>
                        <option>Buổi trưa (12:00 – 13:30)</option>
                        <option>Buổi chiều (14:00 – 17:00)</option>
                        <option>Linh hoạt theo lịch chuyên gia</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="tc-form-label">Quy mô tài sản ước tính</label>
                      <select className="tc-form-select" value={form.asset_range} onChange={e => setForm(f => ({ ...f, asset_range: e.target.value }))}>
                        <option value="">Chọn mức</option>
                        <option>Dưới 500 triệu</option>
                        <option>500 triệu – 2 tỷ</option>
                        <option>2 – 5 tỷ</option>
                        <option>5 – 20 tỷ</option>
                        <option>Trên 20 tỷ</option>
                        <option>Tôi muốn bắt đầu tích lũy từ đầu</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="tc-form-label">Hình thức tư vấn</label>
                      <select className="tc-form-select" value={form.consult_format} onChange={e => setForm(f => ({ ...f, consult_format: e.target.value }))}>
                        <option>Gặp trực tiếp tại văn phòng</option>
                        <option>Tư vấn qua video call</option>
                        <option>Tư vấn qua điện thoại</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="tc-form-label">Câu hỏi hoặc mối quan tâm cụ thể</label>
                      <textarea className="tc-form-textarea" rows={3} placeholder="Chia sẻ thêm để chuyên gia chuẩn bị tốt nhất cho buổi tư vấn..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="tc-btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }} disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Đặt lịch tư vấn miễn phí →'}
                      </button>
                      <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', marginTop: '10px' }}>
                        Thông tin được bảo mật tuyệt đối theo Luật BVDL cá nhân
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="col-lg-5" data-reveal="" data-delay="1">
              {/* Benefits */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px', marginBottom: '20px' }}>
                <div className="tc-label" style={{ marginBottom: '16px' }}>Buổi tư vấn miễn phí gồm</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { title: 'Đánh giá sức khỏe tài chính', desc: 'Phân tích toàn diện tài sản, nợ, dòng tiền hiện tại' },
                    { title: 'Xác định mục tiêu tài chính', desc: 'Hưu trí, giáo dục con cái, mua nhà, tăng tài sản' },
                    { title: 'Định hướng giải pháp sơ bộ', desc: 'Gợi ý danh mục đầu tư phù hợp khẩu vị rủi ro' },
                    { title: 'Tài liệu tóm tắt miễn phí', desc: 'PDF checklist & lộ trình sau buổi tư vấn' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{item.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: '300' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              {mapEmbed ? (
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--border)' }}>
                  <div dangerouslySetInnerHTML={{ __html: mapEmbed }} />
                </div>
              ) : (
                <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                  <div style={{ height: '200px', background: '#cdd8eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--text-3)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center' }}>Bản đồ sẽ hiển thị tại đây</span>
                  </div>
                  <div style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '3px' }}>VietFinance</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{address}</div>
                  </div>
                </div>
              )}

              {/* Hours */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Giờ làm việc</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                  {[
                    { day: 'Thứ 2 – Thứ 6', time: '8:00 – 17:30' },
                    { day: 'Thứ 7', time: '8:00 – 12:00' },
                    { day: 'Chủ nhật', time: 'Nghỉ', muted: true },
                  ].map(({ day, time, muted }, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: i < arr.length - 1 ? '8px' : 0, borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                      <span style={{ color: 'var(--text-2)' }}>{day}</span>
                      <span style={muted ? { color: 'var(--text-3)', fontStyle: 'italic' } : { fontWeight: '600', color: 'var(--text)' }}>{time}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', fontSize: '12px', color: 'var(--text-3)' }}>
                  * Có thể tư vấn ngoài giờ theo lịch hẹn riêng
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
