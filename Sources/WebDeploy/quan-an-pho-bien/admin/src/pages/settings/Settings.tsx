import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',      label: '🏪 Thông tin chung' },
  { id: 'about',        label: '📖 Câu chuyện quán' },
  { id: 'seo',          label: '🔍 SEO' },
  { id: 'social',       label: '📱 Mạng xã hội' },
  { id: 'contact',      label: '📍 Liên hệ & Bản đồ' },
  { id: 'footer',       label: '📄 Footer' },
  { id: 'smtp',         label: '📧 Email SMTP' },
  { id: 'system',       label: '🔧 Hệ thống' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      await api.post('/settings/update', settings)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công!' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Lưu thất bại.' })
    } finally {
      setSaving(false)
    }
  }

  function field(key: string, label: string, type = 'text', placeholder = '') {
    return (
      <div className="form-group" key={key}>
        <label className="form-label">{label}</label>
        <input
          type={type}
          className="form-control"
          value={settings[key] ?? ''}
          onChange={e => set(key, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    )
  }

  function textareaField(key: string, label: string, rows = 3, placeholder = '') {
    return (
      <div className="form-group" key={key}>
        <label className="form-label">{label}</label>
        <textarea
          className="form-control"
          rows={rows}
          value={settings[key] ?? ''}
          onChange={e => set(key, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    )
  }

  function imageField(key: string, label: string) {
    return (
      <div className="form-group" key={key}>
        <ImageField label={label} value={settings[key] ?? ''} onChange={v => set(key, v)} />
      </div>
    )
  }

  function toggleField(key: string, label: string) {
    const val = settings[key] === '1'
    return (
      <div className="form-group" key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <label className="form-label" style={{ margin: 0 }}>{label}</label>
        <button
          type="button"
          onClick={() => set(key, val ? '0' : '1')}
          style={{
            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: val ? 'var(--accent)' : 'var(--border)',
            transition: 'background .2s', position: 'relative', flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', top: 2, left: val ? 22 : 2, width: 20, height: 20,
            borderRadius: '50%', background: '#fff', transition: 'left .2s',
            boxShadow: '0 1px 3px rgba(0,0,0,.2)',
          }} />
        </button>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{val ? 'Bật' : 'Tắt'}</span>
      </div>
    )
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt website</div>
          <div className="page-sub">Quản lý toàn bộ nội dung và cấu hình</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 200, flexShrink: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontFamily: 'var(--sans)',
                background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                marginBottom: 2,
                transition: 'all .15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <form onSubmit={handleSave}>
            {msg && (
              <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>
                {msg.text}
              </div>
            )}

            {activeTab === 'general' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Thông tin chung</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  {field('site_name', 'Tên quán ăn *', 'text', 'Quán Ăn Phở Bình Dân')}
                  {field('site_phone', 'Số điện thoại *', 'tel', '0901 234 567')}
                  {field('site_email', 'Email liên hệ', 'email', 'contact@quanan.vn')}
                  {field('site_phone_2', 'Số điện thoại 2', 'tel', '')}
                </div>
                {textareaField('site_description', 'Mô tả ngắn', 2, 'Quán ăn bình dân...')}
                {textareaField('site_address', 'Địa chỉ đầy đủ', 2, '123 Đường ABC, Phường XYZ...')}
                {textareaField('working_hours', 'Giờ mở cửa', 3, 'Thứ Hai – Thứ Sáu: 6:00 – 22:00 | Thứ Bảy: 6:00 – 22:30...')}
                {imageField('site_logo', 'Logo quán')}
                {imageField('site_favicon', 'Favicon')}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Câu chuyện quán</div>
                {field('about_tagline', 'Tagline (hero label)', 'text', 'Yêu thích của cả xóm từ năm 2001')}
                {field('about_title', 'Tiêu đề phần câu chuyện', 'text', 'Từ một gánh hàng đến quán quen cả xóm.')}
                {textareaField('about_content', 'Nội dung câu chuyện', 6, 'Kể câu chuyện của quán...')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px' }}>
                  {field('about_years', 'Số năm kinh nghiệm', 'text', '20+')}
                  {field('about_customers', 'Khách/ngày', 'text', '200+')}
                  {field('about_rating', 'Điểm đánh giá', 'text', '4.8')}
                </div>
                {imageField('about_image', 'Ảnh câu chuyện')}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Cài đặt SEO</div>
                {field('meta_title', 'Tiêu đề trang (Meta Title)', 'text', 'Quán Ăn Phở Bình Dân — Ngon, Rẻ, Nhanh')}
                {textareaField('meta_description', 'Mô tả trang (Meta Description)', 3, 'Phở, cơm tấm, bún bò...')}
                {field('meta_keywords', 'Từ khóa (Meta Keywords)', 'text', 'phở bình dân, cơm bụi...')}
                {imageField('og_image', 'Ảnh chia sẻ mạng xã hội (OG Image)')}
                {field('google_analytics_id', 'Google Analytics ID', 'text', 'G-XXXXXXXXXX')}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Mạng xã hội</div>
                {field('social_facebook', 'Facebook URL', 'url', 'https://facebook.com/quanan')}
                {field('social_instagram', 'Instagram URL', 'url', 'https://instagram.com/quanan')}
                {field('social_youtube', 'YouTube URL', 'url', 'https://youtube.com/quanan')}
                {field('social_tiktok', 'TikTok URL', 'url', 'https://tiktok.com/@quanan')}
                {field('social_zalo', 'Số Zalo', 'text', '0901234567')}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Liên hệ & Bản đồ</div>
                {toggleField('contact_form_enabled', 'Bật form liên hệ')}
                {field('contact_email_receiver', 'Email nhận tin nhắn', 'email', 'contact@quanan.vn')}
                {field('google_map_link', 'Link Google Maps', 'url', 'https://maps.google.com/?q=...')}
                {textareaField('google_map_embed', 'Google Maps Embed Code', 4, '<iframe src="https://www.google.com/maps/embed?...">')}
                {field('delivery_radius', 'Phạm vi giao hàng', 'text', '3km')}
                {field('delivery_fee', 'Phí giao hàng', 'text', 'từ 10.000đ')}
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Footer</div>
                {field('footer_copyright', 'Copyright', 'text', '© 2026 Quán Ăn Phở Bình Dân')}
                {textareaField('footer_description', 'Mô tả footer', 2, 'Ăn ngon, giá bình dân...')}
                {toggleField('footer_show_social', 'Hiện icon mạng xã hội')}
              </div>
            )}

            {activeTab === 'smtp' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Cài đặt Email SMTP</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  {field('smtp_host', 'SMTP Host', 'text', 'smtp.gmail.com')}
                  {field('smtp_port', 'SMTP Port', 'number', '587')}
                  {field('smtp_user', 'SMTP Username', 'email', 'your@gmail.com')}
                  {field('smtp_password', 'SMTP Password', 'password', '')}
                  {field('smtp_from_name', 'Tên người gửi', 'text', 'Quán Ăn Phở Bình Dân')}
                  {field('smtp_from_email', 'Email người gửi', 'email', 'noreply@quanan.vn')}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Cài đặt hệ thống</div>
                {toggleField('maintenance_mode', 'Bật chế độ bảo trì')}
                {textareaField('maintenance_message', 'Thông báo bảo trì', 2, 'Website đang bảo trì...')}
              </div>
            )}

            {activeTab === 'cloudinary' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Cấu hình Cloudinary</div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
                  Dùng để lưu ảnh trên cloud thay vì hosting. Tạo tài khoản tại{' '}
                  <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>cloudinary.com</a> (miễn phí).
                </p>
                {field('cloudinary_cloud_name', 'Cloud Name', 'text', 'my-cloud')}
                {field('cloudinary_api_key', 'API Key', 'text', '123456789')}
                {field('cloudinary_api_secret', 'API Secret', 'password', '')}
                {field('cloudinary_upload_folder', 'Upload Folder', 'text', 'quan-an-pho-bien')}
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="card">
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Tích hợp bên ngoài</div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
                  Cấu hình API keys cho các dịch vụ tích hợp.
                </p>
                {field('unsplash_access_key', 'Unsplash Access Key', 'text', 'Dùng tìm ảnh miễn phí từ Unsplash')}
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: -8, marginBottom: 16 }}>
                  Lấy key tại: <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a>
                </p>
              </div>
            )}

            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-accent" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
