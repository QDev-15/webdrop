import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',      label: '🏠 Thông tin chung' },
  { id: 'about',        label: '🌊 Giới thiệu' },
  { id: 'reservation',  label: '📅 Đặt bàn' },
  { id: 'seo',          label: '🔍 SEO' },
  { id: 'social',       label: '📱 Mạng xã hội' },
  { id: 'footer',       label: '📄 Footer' },
  { id: 'contact',      label: '📍 Liên hệ' },
  { id: 'smtp',         label: '📧 SMTP' },
  { id: 'system',       label: '🛠 Hệ thống' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const F = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" value={settings[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
    </div>
  )

  const TA = ({ label, k, rows = 3, placeholder = '' }: { label: string; k: string; rows?: number; placeholder?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-control" rows={rows} value={settings[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
    </div>
  )

  const Toggle = ({ label, k, help }: { label: string; k: string; help?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-control" value={settings[k] ?? '0'} onChange={e => set(k, e.target.value)} style={{ maxWidth: 160 }}>
        <option value="1">Bật</option>
        <option value="0">Tắt</option>
      </select>
      {help && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{help}</div>}
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý toàn bộ nội dung và cấu hình website</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Tab nav */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: 'left',
                  padding: '9px 14px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: 'var(--sans)',
                  background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <form onSubmit={handleSave} style={{ flex: 1 }}>
          <div className="card">
            {saved && (
              <div className="alert" style={{ marginBottom: 20, background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-light)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                Đã lưu cài đặt thành công!
              </div>
            )}

            {activeTab === 'general' && (
              <div>
                <div className="section-header-sm" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Thông tin chung</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="Tên website" k="site_name" placeholder="Vị Biển Hải Sản" />
                  <F label="Email" k="site_email" type="email" placeholder="contact@vibienhaiSAN.vn" />
                  <F label="Số điện thoại" k="site_phone" placeholder="0901 234 567" />
                  <F label="Số điện thoại phụ" k="site_phone_2" placeholder="0901 234 568" />
                </div>
                <F label="Địa chỉ" k="site_address" placeholder="123 Đường, Phường, Quận, TP.HCM" />
                <F label="Giờ làm việc" k="working_hours" placeholder="10:00 – 22:00 hàng ngày" />
                <TA label="Mô tả website" k="site_description" placeholder="Nhà hàng hải sản tươi sống..." />
                <div className="form-group">
                  <ImageField label="Logo website" value={settings['site_logo'] ?? ''} onChange={v => set('site_logo', v)} />
                </div>
                <div className="form-group">
                  <ImageField label="Favicon" value={settings['site_favicon'] ?? ''} onChange={v => set('site_favicon', v)} />
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Nội dung giới thiệu</div>
                <F label="Tiêu đề phần giới thiệu" k="about_title" placeholder="Câu chuyện tươi sống" />
                <F label="Tagline" k="about_tagline" placeholder="Từ biển đến bàn — không ướp lạnh lâu" />
                <TA label="Nội dung" k="about_content" rows={5} placeholder="Hành trình từ biển đến bàn ăn của bạn..." />
                <div className="form-group">
                  <ImageField label="Ảnh giới thiệu" value={settings['about_image'] ?? ''} onChange={v => set('about_image', v)} />
                </div>
              </div>
            )}

            {activeTab === 'reservation' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Cài đặt đặt bàn</div>
                <Toggle label="Cho phép đặt bàn online" k="reservation_enabled" help="Khi tắt, form đặt bàn sẽ bị ẩn trên trang web." />
                <F label="Giờ mở cửa (hiển thị)" k="open_hours_text" placeholder="10:00 – 22:00 hàng ngày" />
                <TA label="Ghi chú cho khách đặt bàn" k="reservation_note" rows={3} placeholder="Đặt trước 2 tiếng để nhận ưu đãi..." />
              </div>
            )}

            {activeTab === 'seo' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>SEO & Meta</div>
                <F label="Meta title" k="meta_title" placeholder="Vị Biển Hải Sản — Tươi Sống Nhập Mỗi Ngày" />
                <TA label="Meta description" k="meta_description" rows={3} placeholder="Nhà hàng hải sản tươi sống..." />
                <F label="Meta keywords" k="meta_keywords" placeholder="nhà hàng hải sản, hải sản tươi sống, tôm cua ghẹ" />
                <F label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
                <div className="form-group">
                  <ImageField label="OG Image (chia sẻ mạng xã hội)" value={settings['og_image'] ?? ''} onChange={v => set('og_image', v)} />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Mạng xã hội</div>
                <F label="Facebook" k="social_facebook" placeholder="https://facebook.com/vibienhaiSAN" />
                <F label="Instagram" k="social_instagram" placeholder="https://instagram.com/vibienhaiSAN" />
                <F label="YouTube" k="social_youtube" placeholder="https://youtube.com/@vibienhaiSAN" />
                <F label="TikTok" k="social_tiktok" placeholder="https://tiktok.com/@vibienhaiSAN" />
                <F label="Zalo (số điện thoại)" k="social_zalo" placeholder="0901234567" />
              </div>
            )}

            {activeTab === 'footer' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Footer</div>
                <F label="Copyright" k="footer_copyright" placeholder="© 2025 Vị Biển Hải Sản · Made in Vietnam 🇻🇳" />
                <TA label="Mô tả footer" k="footer_description" rows={3} placeholder="Hải sản tươi sống nhập mỗi ngày..." />
                <Toggle label="Hiển thị mạng xã hội" k="footer_show_social" />
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Liên hệ</div>
                <Toggle label="Bật form liên hệ" k="contact_form_enabled" />
                <F label="Email nhận liên hệ" k="contact_email_receiver" type="email" placeholder="contact@vibienhaiSAN.vn" />
                <TA label="Google Maps Embed (iframe)" k="google_map_embed" rows={4} placeholder={'<iframe src="https://www.google.com/maps/embed?...">'} />
              </div>
            )}

            {activeTab === 'smtp' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Cấu hình Email (SMTP)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
                  <F label="SMTP Port" k="smtp_port" placeholder="587" />
                  <F label="SMTP User" k="smtp_user" placeholder="your@gmail.com" />
                  <F label="SMTP Password" k="smtp_password" type="password" placeholder="App password" />
                  <F label="Tên người gửi" k="smtp_from_name" placeholder="Vị Biển Hải Sản" />
                  <F label="Email người gửi" k="smtp_from_email" type="email" placeholder="no-reply@vibienhaiSAN.vn" />
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Hệ thống</div>
                <Toggle label="Chế độ bảo trì" k="maintenance_mode" help="Khi bật, website sẽ hiển thị trang bảo trì thay vì nội dung." />
                <TA label="Nội dung trang bảo trì" k="maintenance_message" rows={3} placeholder="Website đang bảo trì. Vui lòng quay lại sau." />
              </div>
            )}

            {activeTab === 'cloudinary' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Cloudinary — Lưu trữ ảnh đám mây</div>
                <div style={{ padding: '12px 16px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
                  Đăng ký miễn phí tại <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>cloudinary.com</a>. Gói miễn phí cho 25GB lưu trữ.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="Cloud Name" k="cloudinary_cloud_name" placeholder="your-cloud-name" />
                  <F label="Upload Folder" k="cloudinary_folder" placeholder="nha-hang-hai-san" />
                  <F label="API Key" k="cloudinary_api_key" placeholder="123456789012345" />
                  <F label="API Secret" k="cloudinary_api_secret" type="password" placeholder="xxxxxxxxxxxxxxxxxxx" />
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Tích hợp bên thứ ba</div>
                <div style={{ padding: '12px 16px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
                  Đăng ký API key miễn phí tại <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a> để dùng bộ ảnh miễn phí.
                </div>
                <F label="Unsplash Access Key" k="unsplash_access_key" placeholder="Dán Access Key tại đây" />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
              <button type="submit" className="btn-accent" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
