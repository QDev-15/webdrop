import { useEffect, useState, FormEvent } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'about',        label: 'Giới thiệu' },
  { id: 'reservation',  label: 'Đặt bàn' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'smtp',         label: 'SMTP Email' },
  { id: 'system',       label: 'Nâng cao' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [tab, setTab]         = useState('general')
  const [data, setData]       = useState<SettingsMap>({})
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<SettingsMap>('/settings').then(setData).catch(console.error)
  }, [])

  function set(key: string, val: string) {
    setData(prev => ({ ...prev, [key]: val }))
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      await api.post('/settings/update', data)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công!' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Lưu thất bại.' })
    } finally {
      setSaving(false)
    }
  }

  function Field({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <input type={type} className="form-control" value={data[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      </div>
    )
  }

  function TextArea({ label, k, rows = 3, placeholder = '' }: { label: string; k: string; rows?: number; placeholder?: string }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <textarea className="form-control" rows={rows} value={data[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      </div>
    )
  }

  function Toggle({ label, k }: { label: string; k: string }) {
    const checked = data[k] === '1'
    return (
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ margin: 0 }}>{label}</label>
        <button
          type="button"
          onClick={() => set(k, checked ? '0' : '1')}
          style={{
            width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: checked ? 'var(--accent)' : 'var(--border)',
            position: 'relative', transition: 'background .2s',
          }}
        >
          <span style={{
            position: 'absolute', top: '3px',
            left: checked ? '22px' : '3px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: '#fff', transition: 'left .2s',
          }} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý nội dung và cấu hình website</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 14px', border: 'none', cursor: 'pointer',
              background: 'transparent', fontFamily: 'var(--sans)',
              fontSize: '13px', fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--accent)' : 'var(--text-2)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: '0', marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '20px' }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={save}>
        <div className="card" style={{ maxWidth: '680px' }}>

          {/* Thông tin chung */}
          {tab === 'general' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Thông tin chung</div>
              <Field label="Tên website" k="site_name" placeholder="Lá Xanh Chay Organic" />
              <TextArea label="Mô tả website" k="site_description" placeholder="Mô tả ngắn gọn..." />
              <ImageField label="Logo" value={data['site_logo'] || ''} onChange={v => set('site_logo', v)} />
              <Field label="Email" k="site_email" type="email" placeholder="info@laxanhchay.vn" />
              <Field label="Số điện thoại chính" k="site_phone" placeholder="0901 234 567" />
              <Field label="Số điện thoại phụ" k="site_phone_2" placeholder="" />
              <Field label="Địa chỉ" k="site_address" placeholder="123 Đường Lá Xanh, Quận 3, TP.HCM" />
              <TextArea label="Giờ hoạt động" k="working_hours" placeholder="Thứ 2–6: 07:00–21:00 | Thứ 7: 07:00–22:00" rows={2} />
            </div>
          )}

          {/* Giới thiệu */}
          {tab === 'about' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Trang giới thiệu</div>
              <Field label="Tiêu đề section" k="about_title" placeholder="Ẩm thực chay — không chỉ là thức ăn" />
              <Field label="Tagline phụ" k="about_tagline" placeholder="Từ nông trại organic thẳng đến bàn ăn" />
              <TextArea label="Nội dung giới thiệu" k="about_content" rows={6} placeholder="Giới thiệu về nhà hàng..." />
              <ImageField label="Ảnh giới thiệu" value={data['about_image'] || ''} onChange={v => set('about_image', v)} />
            </div>
          )}

          {/* Đặt bàn */}
          {tab === 'reservation' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Cài đặt đặt bàn</div>
              <Toggle label="Bật tính năng đặt bàn" k="reservation_enabled" />
              <TextArea label="Ghi chú đặt bàn" k="reservation_note" rows={3} placeholder="Vui lòng thông báo dị ứng thực phẩm..." />
            </div>
          )}

          {/* SEO */}
          {tab === 'seo' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>SEO & Meta</div>
              <Field label="Meta title" k="meta_title" placeholder="Lá Xanh Chay Organic — Ẩm Thực Thuần Chay" />
              <TextArea label="Meta description" k="meta_description" rows={3} placeholder="Mô tả SEO..." />
              <Field label="Meta keywords" k="meta_keywords" placeholder="nhà hàng chay, ăn chay organic, vegan" />
              <ImageField label="OG Image (1200×630)" value={data['og_image'] || ''} onChange={v => set('og_image', v)} />
              <Field label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
            </div>
          )}

          {/* Mạng xã hội */}
          {tab === 'social' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Mạng xã hội</div>
              <Field label="Facebook" k="social_facebook" placeholder="https://facebook.com/page" />
              <Field label="Instagram" k="social_instagram" placeholder="https://instagram.com/user" />
              <Field label="YouTube" k="social_youtube" placeholder="https://youtube.com/@channel" />
              <Field label="TikTok" k="social_tiktok" placeholder="https://tiktok.com/@user" />
              <Field label="Zalo (số điện thoại)" k="social_zalo" placeholder="0901234567" />
            </div>
          )}

          {/* Footer */}
          {tab === 'footer' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Footer</div>
              <Field label="Bản quyền" k="footer_copyright" placeholder="© 2026 Lá Xanh Chay Organic" />
              <TextArea label="Mô tả footer" k="footer_description" rows={2} placeholder="Slogan ngắn..." />
              <Toggle label="Hiển thị mạng xã hội" k="footer_show_social" />
            </div>
          )}

          {/* Liên hệ */}
          {tab === 'contact' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Liên hệ</div>
              <Toggle label="Bật form liên hệ" k="contact_form_enabled" />
              <Field label="Email nhận liên hệ" k="contact_email_receiver" type="email" placeholder="info@laxanhchay.vn" />
              <TextArea label="Embed Google Map (iframe src)" k="google_map_embed" rows={3} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          )}

          {/* SMTP */}
          {tab === 'smtp' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>SMTP Email</div>
              <Field label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
              <Field label="SMTP Port" k="smtp_port" placeholder="587" />
              <Field label="SMTP User" k="smtp_user" type="email" placeholder="your@gmail.com" />
              <Field label="SMTP Password" k="smtp_password" type="password" placeholder="App password" />
              <Field label="Tên người gửi" k="smtp_from_name" placeholder="Lá Xanh Chay Organic" />
              <Field label="Email người gửi" k="smtp_from_email" type="email" placeholder="noreply@laxanhchay.vn" />
            </div>
          )}

          {/* Nâng cao */}
          {tab === 'system' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Cài đặt nâng cao</div>
              <Toggle label="Chế độ bảo trì" k="maintenance_mode" />
              <TextArea label="Thông báo bảo trì" k="maintenance_message" rows={2} placeholder="Website đang bảo trì..." />
            </div>
          )}

          {/* Cloudinary */}
          {tab === 'cloudinary' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Cloudinary — Lưu trữ ảnh trên Cloud</div>
              <div className="alert alert-info" style={{ marginBottom: '16px' }}>
                Điền thông tin Cloudinary để upload ảnh lên cloud thay vì lưu trên server hosting.
              </div>
              <Field label="Cloud Name" k="cloudinary_cloud_name" placeholder="your-cloud-name" />
              <Field label="API Key" k="cloudinary_api_key" placeholder="123456789012345" />
              <Field label="API Secret" k="cloudinary_api_secret" type="password" placeholder="your-api-secret" />
              <Field label="Upload Folder" k="cloudinary_upload_folder" placeholder="nha-hang-chay-organic" />
            </div>
          )}

          {/* Tích hợp */}
          {tab === 'integrations' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Tích hợp dịch vụ bên thứ ba</div>
              <div className="form-group">
                <label className="form-label">Unsplash Access Key</label>
                <Field label="" k="unsplash_access_key" placeholder="Nhập Unsplash Access Key để tìm ảnh miễn phí" />
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>
                  Lấy key tại: <a href="https://unsplash.com/developers" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a>
                </div>
              </div>
            </div>
          )}

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
