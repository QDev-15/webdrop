import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: 'Thông tin chung' },
  { key: 'clinic',       label: 'Phòng khám' },
  { key: 'seo',          label: 'SEO' },
  { key: 'social',       label: 'Mạng xã hội' },
  { key: 'footer',       label: 'Footer' },
  { key: 'contact',      label: 'Liên hệ' },
  { key: 'smtp',         label: 'SMTP' },
  { key: 'system',       label: 'Nâng cao' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('general')
  const [msg, setMsg] = useState('')

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
    setSaving(true); setMsg('')
    try {
      await api.post('/settings', settings)
      setMsg('Đã lưu cài đặt thành công!')
      setTimeout(() => setMsg(''), 3000)
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Lỗi khi lưu.')
    } finally { setSaving(false) }
  }

  function field(key: string, label: string, type = 'text', placeholder = '') {
    return (
      <div className="form-group" key={key}>
        <label className="form-label">{label}</label>
        {type === 'textarea' ? (
          <textarea className="form-input" rows={3} value={settings[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
        ) : (
          <input className="form-input" type={type} value={settings[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
        )}
      </div>
    )
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Cài đặt hệ thống</h1>
      </div>

      <div className="settings-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`settings-tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form className="form-card" onSubmit={handleSave}>
        {msg && <div className="form-success">{msg}</div>}

        {tab === 'general' && (
          <>
            {field('site_name', 'Tên website', 'text', 'DermaCare Clinic')}
            {field('site_tagline', 'Tagline', 'text', 'Phòng khám Da liễu Chuyên sâu')}
            {field('site_phone', 'Số điện thoại', 'text', '0901 234 567')}
            {field('site_email', 'Email', 'email', 'info@dermacare.vn')}
            {field('site_address', 'Địa chỉ', 'text', '123 Nguyễn Huệ, Q.1, TP.HCM')}
            {field('working_hours', 'Giờ làm việc', 'text', 'Thứ 2 – Thứ 7: 8:00 – 18:00 | CN: 8:00 – 12:00')}
            {field('zalo_number', 'Zalo number', 'text', '0901234567')}
          </>
        )}

        {tab === 'clinic' && (
          <>
            {field('hero_badge_percent', 'Hero badge số (ví dụ: 98%)', 'text', '98%')}
            {field('hero_badge_label', 'Hero badge nhãn', 'text', 'Tỷ lệ hài lòng của bệnh nhân')}
            {field('stat_cases', 'Số ca điều trị', 'text', '3000+')}
            {field('stat_doctors', 'Số bác sĩ', 'text', '8 BS')}
            {field('stat_satisfied', 'Tỷ lệ hài lòng', 'text', '98%')}
            {field('stat_years', 'Số năm kinh nghiệm', 'text', '10 năm')}
          </>
        )}

        {tab === 'seo' && (
          <>
            {field('meta_title', 'Meta Title', 'text', 'DermaCare Clinic — Phòng khám Da liễu & Skincare')}
            {field('meta_description', 'Meta Description', 'textarea', 'Phòng khám da liễu chuyên sâu...')}
          </>
        )}

        {tab === 'social' && (
          <>
            {field('facebook', 'Facebook URL', 'url', 'https://facebook.com/...')}
            {field('instagram', 'Instagram URL', 'url', 'https://instagram.com/...')}
            {field('youtube', 'YouTube URL', 'url', 'https://youtube.com/...')}
            {field('tiktok', 'TikTok URL', 'url', 'https://tiktok.com/...')}
          </>
        )}

        {tab === 'footer' && (
          <>
            {field('footer_desc', 'Mô tả footer', 'textarea', 'Phòng khám da liễu chuyên sâu...')}
            {field('footer_copy', 'Copyright text', 'text', '© 2026 DermaCare Clinic')}
          </>
        )}

        {tab === 'contact' && (
          <>
            {field('map_embed', 'Google Maps Embed URL', 'url', 'https://www.google.com/maps/embed?pb=...')}
            {field('map_link', 'Link Google Maps', 'url', 'https://maps.google.com/?q=...')}
          </>
        )}

        {tab === 'smtp' && (
          <>
            {field('smtp_host', 'SMTP Host', 'text', 'smtp.gmail.com')}
            {field('smtp_port', 'SMTP Port', 'text', '587')}
            {field('smtp_user', 'SMTP User', 'email')}
            {field('smtp_pass', 'SMTP Password', 'password')}
          </>
        )}

        {tab === 'system' && (
          <div className="form-group">
            <label className="form-label">Chế độ bảo trì</label>
            <select className="form-input" value={settings['maintenance_mode'] ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
              <option value="0">Tắt (website hoạt động bình thường)</option>
              <option value="1">Bật (hiển thị trang bảo trì)</option>
            </select>
          </div>
        )}

        {tab === 'cloudinary' && (
          <>
            {field('cloudinary_cloud_name', 'Cloud Name', 'text', 'your-cloud-name')}
            {field('cloudinary_api_key', 'API Key', 'text')}
            {field('cloudinary_api_secret', 'API Secret', 'password')}
          </>
        )}

        {tab === 'integrations' && (
          <>
            {field('unsplash_access_key', 'Unsplash Access Key', 'text', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY')}
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
