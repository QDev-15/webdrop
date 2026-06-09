import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type Settings = Record<string, string>

const TABS = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'about',        label: 'Giới thiệu' },
  { id: 'smtp',         label: 'SMTP Email' },
  { id: 'system',       label: 'Hệ thống' },
  { id: 'cloudinary',   label: 'Cloudinary' },
  { id: 'integrations', label: 'Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({})
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<Settings>('/settings').then(setSettings).catch(() => {})
  }, [])

  function set(key: string, val: string) {
    setSettings(s => ({ ...s, [key]: val }))
  }

  async function handleSave() {
    setSaving(true); setMsg(null)
    try {
      await api.post('/settings/update', settings)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công!' })
    } catch (e) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : 'Lưu thất bại.' })
    } finally {
      setSaving(false)
    }
  }

  const f = (key: string, label: string, type = 'text', placeholder = '') => (
    <div className="form-group" key={key}>
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" value={settings[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
    </div>
  )

  const ta = (key: string, label: string, rows = 3) => (
    <div className="form-group" key={key}>
      <label className="form-label">{label}</label>
      <textarea className="form-control" value={settings[key] ?? ''} onChange={e => set(key, e.target.value)} rows={rows} />
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Cấu hình toàn bộ website</div>
        </div>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>

      {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

      <div className="settings-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`settings-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'general' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Thông tin chung</div>
            {f('site_name', 'Tên website')}
            {ta('site_description', 'Mô tả website', 2)}
            <div className="form-group">
              <ImageField label="Logo" value={settings['site_logo'] ?? ''} onChange={v => set('site_logo', v)} />
            </div>
            {f('site_email', 'Email liên hệ', 'email')}
            {f('site_phone', 'Số điện thoại')}
            {f('site_phone_2', 'Số điện thoại 2')}
            {ta('site_address', 'Địa chỉ', 2)}
            {f('working_hours', 'Giờ làm việc', 'text', 'Thứ 2-6: 7:30-17:30')}
          </div>
        )}

        {tab === 'seo' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Cài đặt SEO</div>
            {f('meta_title', 'Meta Title')}
            {ta('meta_description', 'Meta Description', 2)}
            {f('meta_keywords', 'Từ khóa SEO')}
            <div className="form-group">
              <ImageField label="OG Image" value={settings['og_image'] ?? ''} onChange={v => set('og_image', v)} />
            </div>
            {f('google_analytics_id', 'Google Analytics ID', 'text', 'G-XXXXXXXXXX')}
          </div>
        )}

        {tab === 'social' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Mạng xã hội</div>
            {f('social_facebook', 'Facebook URL')}
            {f('social_youtube', 'YouTube URL')}
            {f('social_instagram', 'Instagram URL')}
            {f('social_tiktok', 'TikTok URL')}
            {f('social_zalo', 'Zalo (số điện thoại)')}
            {f('social_linkedin', 'LinkedIn URL')}
          </div>
        )}

        {tab === 'footer' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Footer</div>
            {f('footer_copyright', 'Bản quyền')}
            {ta('footer_description', 'Mô tả footer', 2)}
            <div className="form-group">
              <label className="form-label">Hiển thị mạng xã hội</label>
              <select className="form-control" value={settings['footer_show_social'] ?? '1'} onChange={e => set('footer_show_social', e.target.value)}>
                <option value="1">Hiển thị</option>
                <option value="0">Ẩn</option>
              </select>
            </div>
          </div>
        )}

        {tab === 'contact' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Cài đặt liên hệ</div>
            <div className="form-group">
              <label className="form-label">Bật form liên hệ</label>
              <select className="form-control" value={settings['contact_form_enabled'] ?? '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                <option value="1">Bật</option>
                <option value="0">Tắt</option>
              </select>
            </div>
            {f('contact_email_receiver', 'Email nhận liên hệ', 'email')}
            {ta('google_map_embed', 'Google Maps Embed Code', 4)}
          </div>
        )}

        {tab === 'about' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Giới thiệu</div>
            {f('about_title', 'Tiêu đề giới thiệu')}
            {ta('about_content', 'Nội dung giới thiệu', 4)}
            <div className="form-group">
              <ImageField label="Ảnh giới thiệu" value={settings['about_image'] ?? ''} onChange={v => set('about_image', v)} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8 }}>Thống kê</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {f('stat_projects', 'Số công trình hoàn thành')}
              {f('stat_years', 'Năm kinh nghiệm')}
              {f('stat_staff', 'Nhân sự')}
              {f('stat_provinces', 'Tỉnh thành hoạt động')}
            </div>
          </div>
        )}

        {tab === 'smtp' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Cấu hình SMTP Email</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              {f('smtp_host', 'SMTP Host', 'text', 'smtp.gmail.com')}
              {f('smtp_port', 'Port', 'text', '587')}
            </div>
            {f('smtp_user', 'Tài khoản SMTP', 'email')}
            {f('smtp_password', 'Mật khẩu SMTP', 'password')}
            {f('smtp_from_name', 'Tên người gửi')}
            {f('smtp_from_email', 'Email người gửi', 'email')}
          </div>
        )}

        {tab === 'system' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Cài đặt hệ thống</div>
            <div className="form-group">
              <label className="form-label">Chế độ bảo trì</label>
              <select className="form-control" value={settings['maintenance_mode'] ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                <option value="0">Tắt</option>
                <option value="1">Bật</option>
              </select>
            </div>
            {f('maintenance_message', 'Thông báo bảo trì')}
          </div>
        )}

        {tab === 'cloudinary' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Cấu hình Cloudinary</div>
            <div className="alert alert-info">
              Cấu hình Cloudinary để lưu trữ ảnh trên cloud. Lấy thông tin tại <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer">cloudinary.com</a>
            </div>
            {f('cloudinary_cloud_name', 'Cloud Name')}
            {f('cloudinary_api_key', 'API Key')}
            {f('cloudinary_api_secret', 'API Secret', 'password')}
            {f('cloudinary_folder', 'Thư mục Upload', 'text', 'cong-ty-xay-dung')}
          </div>
        )}

        {tab === 'integrations' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Tích hợp bên ngoài</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Unsplash</div>
              <div className="alert alert-info" style={{ marginBottom: 12 }}>
                Cung cấp API Key để tìm kiếm ảnh miễn phí từ Unsplash. Đăng ký tại <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer">unsplash.com/developers</a>
              </div>
              {f('unsplash_access_key', 'Unsplash Access Key')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
