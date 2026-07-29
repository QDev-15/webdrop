import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useState } from 'react'

export default function ContactPage() {
  const { settings } = useSite()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useDocumentMeta({
    title: 'Liên hệ — ' + settings.site_name,
    description: 'Liên hệ với chúng tôi',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/public/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <h1 className="dg-page-hero__title">Liên hệ</h1>
          <p className="dg-page-hero__sub">Chúng tôi sẵn lòng lắng nghe từ bạn</p>
        </div>
      </div>

      <main className="dg-container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '60px', maxWidth: '960px' }}>
          <form onSubmit={handleSubmit}>
            {submitted && (<div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</div>)}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Họ tên *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Điện thoại</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Tiêu đề *</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="form-control" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nội dung *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={8} className="form-control" />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px 32px', backgroundColor: loading ? 'var(--text-3)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px' }}>
              {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>

          <aside style={{ backgroundColor: 'var(--warm)', borderRadius: '12px', padding: '24px', height: 'fit-content', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Thông tin liên hệ</h3>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Điện thoại</p>
              <p style={{ fontWeight: '600' }}>{settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'}</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Email</p>
              <p style={{ fontWeight: '600', wordBreak: 'break-word' }}>{settings.site_email || '[EMAIL]'}</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Địa chỉ</p>
              <p style={{ fontWeight: '600' }}>{settings.site_address || '[ĐỊA CHỈ]'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Giờ làm việc</p>
              <p style={{ fontWeight: '600' }}>{settings.working_hours || '[GIỜ LÀM VIỆC]'}</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
