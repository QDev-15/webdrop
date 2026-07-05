import { useState } from 'react'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ cname: '', cphone: '', csubject: '', cmessage: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.cname || !form.cphone || !form.cmessage) {
      setErrMsg('Vui lòng điền họ tên, số điện thoại và nội dung.')
      return
    }
    setStatus('loading')
    setErrMsg('')
    try {
      await api.post('/public/contact', {
        name: form.cname,
        phone: form.cphone,
        subject: form.csubject,
        message: form.cmessage,
      })
      setStatus('success')
      setForm({ cname: '', cphone: '', csubject: '', cmessage: '' })
    } catch {
      setStatus('error')
      setErrMsg('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  const phone = settings.site_phone || '028 3800 5566'
  const email = settings.site_email || 'contact@futuredental.vn'
  const address = settings.site_address || '258 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM'
  const hours = settings.working_hours || 'T2–T7: 8:00–20:00 | CN: 9:00–17:00'
  const mapEmbed = settings.map_embed || ''

  return (
    <div className="ft-contact-wrap">
      <div className="row g-5">
        <div className="col-lg-5" data-reveal>
          <div className="ft-contact-info">
            <h3 className="ft-contact-info-title">Thông tin liên hệ</h3>

            <div className="ft-ci-item">
              <div className="ft-ci-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <div className="ft-ci-label">Địa chỉ phòng khám</div>
                <div className="ft-ci-value">{address}</div>
              </div>
            </div>

            <div className="ft-ci-item">
              <div className="ft-ci-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <div className="ft-ci-label">Điện thoại đặt lịch</div>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="ft-ci-value ft-ci-link">{phone}</a>
              </div>
            </div>

            <div className="ft-ci-item">
              <div className="ft-ci-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <div className="ft-ci-label">Email</div>
                <a href={`mailto:${email}`} className="ft-ci-value ft-ci-link">{email}</a>
              </div>
            </div>

            <div className="ft-ci-item">
              <div className="ft-ci-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <div className="ft-ci-label">Giờ làm việc</div>
                <div className="ft-ci-value">{hours}</div>
              </div>
            </div>

            <div className="ft-map-placeholder">
              {mapEmbed ? (
                <iframe src={mapEmbed} title="Bản đồ Future Dental" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              ) : (
                <div className="ft-map-placeholder-inner">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="1.5"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>Bản đồ Google Maps</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7" data-reveal>
          <div className="ft-contact-form-wrap">
            <h3 className="ft-contact-form-title">Gửi tin nhắn cho chúng tôi</h3>

            {status === 'success' ? (
              <div className="ft-alert ft-alert-success">
                <p>Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
                <button className="ft-btn ft-btn-outline mt-3" onClick={() => setStatus('idle')}>Gửi tin nhắn khác</button>
              </div>
            ) : (
              <form className="ft-contact-form" onSubmit={handleSubmit} noValidate>
                {(status === 'error' || (errMsg && status === 'idle')) && (
                  <div className="ft-alert ft-alert-error">{errMsg}</div>
                )}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="ft-form-group">
                      <label htmlFor="cname" className="ft-form-label">Họ và tên *</label>
                      <input id="cname" name="cname" type="text" className="ft-form-input" placeholder="Nguyễn Văn A" value={form.cname} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="ft-form-group">
                      <label htmlFor="cphone" className="ft-form-label">Số điện thoại *</label>
                      <input id="cphone" name="cphone" type="tel" className="ft-form-input" placeholder="0901 234 567" value={form.cphone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="ft-form-group">
                      <label htmlFor="csubject" className="ft-form-label">Chủ đề</label>
                      <input id="csubject" name="csubject" type="text" className="ft-form-input" placeholder="Tôi muốn hỏi về..." value={form.csubject} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="ft-form-group">
                      <label htmlFor="cmessage" className="ft-form-label">Nội dung *</label>
                      <textarea id="cmessage" name="cmessage" className="ft-form-input ft-form-textarea" placeholder="Mô tả tình trạng hoặc câu hỏi của bạn..." rows={5} value={form.cmessage} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="ft-btn ft-btn-neon w-100" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
