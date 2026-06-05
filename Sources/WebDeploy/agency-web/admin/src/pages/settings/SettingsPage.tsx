import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingMap = Record<string, { value: string; group: string }>

const TABS = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'about',   label: 'Giới thiệu' },
  { key: 'seo',     label: 'SEO' },
  { key: 'social',  label: 'Mạng xã hội' },
  { key: 'footer',  label: 'Footer' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'smtp',    label: 'SMTP' },
  { key: 'system',  label: 'Hệ thống' },
  { key: 'cloudinary', label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingMap>({})
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<SettingMap>('/settings').then(setSettings).catch(console.error)
  }, [])

  const get = (key: string) => settings[key]?.value ?? ''
  const set = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], value } }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg(null)
    const payload: Record<string, string> = {}
    Object.entries(settings).forEach(([k, v]) => { payload[k] = v.value })
    try {
      await api.post('/settings/update', payload)
      setMsg({ type: 'success', text: 'Đã lưu thành công!' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Lỗi.' })
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="form-control" value={get(k)} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="form-control" type={type} value={get(k)} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )

  const Toggle = ({ label, k }: { label: string; k: string }) => (
    <div className="form-group">
      <label className="toggle">
        <input type="checkbox" checked={get(k) === '1'} onChange={e => set(k, e.target.checked ? '1' : '0')} />
        <span className="toggle-slider" />
        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{label}</span>
      </label>
    </div>
  )

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Cài đặt</div><div className="page-subtitle">Cấu hình website</div></div>
        <button onClick={handleSave} className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu tất cả'}</button>
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="settings-tabs">
        {TABS.map(tab => (
          <button key={tab.key} className={`settings-tab${activeTab === tab.key ? ' active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ maxWidth: '680px' }}>
        {activeTab === 'general' && (
          <>
            <div className="section-divider">Thông tin website</div>
            <Field label="Tên website" k="site_name" />
            <Field label="Mô tả website" k="site_description" type="textarea" />
            <div className="form-row">
              <Field label="URL Logo" k="site_logo" placeholder="https://..." />
              <Field label="URL Favicon" k="site_favicon" placeholder="https://..." />
            </div>
            <div className="section-divider" style={{ marginTop: '16px' }}>Liên hệ</div>
            <div className="form-row">
              <Field label="Email" k="site_email" type="email" />
              <Field label="Điện thoại" k="site_phone" />
            </div>
            <Field label="Điện thoại 2" k="site_phone_2" />
            <Field label="Địa chỉ" k="site_address" />
            <Field label="Giờ làm việc" k="working_hours" placeholder="Thứ 2 – Thứ 7, 8:00 – 18:00" />
          </>
        )}

        {activeTab === 'about' && (
          <>
            <div className="section-divider">Trang Về chúng tôi</div>
            <Field label="Tagline (badge hero)" k="about_tagline" placeholder="Đối tác chiến lược của doanh nghiệp" />
            <Field label="Tiêu đề section About" k="about_title" />
            <Field label="Nội dung giới thiệu" k="about_content" type="textarea" />
            <Field label="Ảnh giới thiệu (URL)" k="about_image" placeholder="https://..." />
            <div className="section-divider" style={{ marginTop: '16px' }}>Số liệu thống kê</div>
            <div className="form-row">
              <Field label="Số dự án (ví dụ: 120+)" k="stat_projects" />
              <Field label="Số năm (ví dụ: 8 năm)" k="stat_years" />
            </div>
            <div className="form-row">
              <Field label="Tỷ lệ hài lòng (ví dụ: 98%)" k="stat_satisfaction" />
              <Field label="Số khách hàng (ví dụ: 50+)" k="stat_clients" />
            </div>
          </>
        )}

        {activeTab === 'seo' && (
          <>
            <div className="section-divider">SEO cơ bản</div>
            <Field label="Meta Title" k="meta_title" />
            <Field label="Meta Description" k="meta_description" type="textarea" />
            <Field label="Meta Keywords" k="meta_keywords" />
            <Field label="OG Image (URL)" k="og_image" placeholder="https://..." />
            <Field label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
          </>
        )}

        {activeTab === 'social' && (
          <>
            <div className="section-divider">Mạng xã hội</div>
            <Field label="Facebook URL" k="social_facebook" placeholder="https://facebook.com/..." />
            <Field label="YouTube URL" k="social_youtube" placeholder="https://youtube.com/..." />
            <Field label="Instagram URL" k="social_instagram" placeholder="https://instagram.com/..." />
            <Field label="TikTok URL" k="social_tiktok" placeholder="https://tiktok.com/..." />
            <Field label="Zalo (số hoặc URL)" k="social_zalo" placeholder="0901234567" />
          </>
        )}

        {activeTab === 'footer' && (
          <>
            <div className="section-divider">Footer</div>
            <Field label="Copyright" k="footer_copyright" placeholder="© 2026 Agency Web" />
            <Field label="Mô tả footer" k="footer_description" type="textarea" />
            <Toggle label="Hiển thị mạng xã hội trong footer" k="footer_show_social" />
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <div className="section-divider">Form liên hệ</div>
            <Toggle label="Bật form liên hệ" k="contact_form_enabled" />
            <Field label="Email nhận liên hệ" k="contact_email_receiver" type="email" />
            <Field label="Google Maps Embed URL" k="google_map_embed" type="textarea" placeholder="https://www.google.com/maps/embed?pb=..." />
          </>
        )}

        {activeTab === 'smtp' && (
          <>
            <div className="section-divider">Cấu hình SMTP (gửi email)</div>
            <div className="form-row">
              <Field label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
              <Field label="SMTP Port" k="smtp_port" placeholder="587" />
            </div>
            <div className="form-row">
              <Field label="SMTP Username" k="smtp_user" />
              <Field label="SMTP Password" k="smtp_password" type="password" />
            </div>
            <div className="form-row">
              <Field label="Tên người gửi" k="smtp_from_name" />
              <Field label="Email người gửi" k="smtp_from_email" type="email" />
            </div>
          </>
        )}

        {activeTab === 'system' && (
          <>
            <div className="section-divider">Hệ thống</div>
            <Toggle label="Bật chế độ bảo trì" k="maintenance_mode" />
            <Field label="Thông báo bảo trì" k="maintenance_message" type="textarea" />
          </>
        )}

        {activeTab === 'cloudinary' && (
          <>
            <div className="row g-3">
              <div className="col-12"><h6 className="fw-semibold mb-3">☁️ Cloudinary — Lưu trữ ảnh</h6></div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Cloud Name</label>
                <Field label="" k="cloudinary_cloud_name" placeholder="your-cloud-name" />
                <div className="form-text">Lấy tại cloudinary.com → Dashboard → Cloud Name</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">API Key</label>
                <Field label="" k="cloudinary_api_key" placeholder="123456789012345" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">API Secret</label>
                <Field label="" k="cloudinary_api_secret" placeholder="••••••••••••••••••••••••" />
                <div className="form-text">Dashboard → Settings → Access Keys → API Secret</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Upload Folder (tuỳ chọn)</label>
                <Field label="" k="cloudinary_folder" placeholder="webdrop" />
                <div className="form-text">Thư mục lưu ảnh trên Cloudinary. Mặc định: webdrop</div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'integrations' && (
          <>
            <div className="row g-3">
              <div className="col-12"><h6 className="fw-semibold mb-3">🔌 Tích hợp bên ngoài</h6></div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Unsplash Access Key</label>
                <Field label="" k="unsplash_access_key" placeholder="Dán Access Key từ unsplash.com/developers" />
                <div className="form-text">Đăng ký miễn phí tại unsplash.com/developers → New Application → copy Access Key. Dùng để tìm kiếm ảnh trong admin.</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
