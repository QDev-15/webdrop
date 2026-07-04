import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: 'Thông tin chung' },
  { key: 'seo',          label: 'SEO' },
  { key: 'social',       label: 'Mạng xã hội' },
  { key: 'footer',       label: 'Footer' },
  { key: 'contact',      label: 'Liên hệ' },
  { key: 'smtp',         label: 'SMTP' },
  { key: 'about',        label: 'Nội dung trang chủ' },
  { key: 'system',       label: 'Nâng cao' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      await api.post('/settings', settings)
      setMsg('Đã lưu cài đặt!')
    } catch (e: unknown) {
      setMsg((e as Error).message || 'Lỗi khi lưu.')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const F = (label: string, key: string, type = 'text', placeholder = '') => (
    <div className="form-field" key={key}>
      <label>{label}</label>
      <input
        type={type}
        value={settings[key] ?? ''}
        placeholder={placeholder}
        onChange={e => set(key, e.target.value)}
      />
    </div>
  )

  const TA = (label: string, key: string, rows = 3) => (
    <div className="form-field" key={key}>
      <label>{label}</label>
      <textarea
        rows={rows}
        value={settings[key] ?? ''}
        onChange={e => set(key, e.target.value)}
      />
    </div>
  )

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Cài đặt</h1>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`settings-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="settings-panel card">
          {activeTab === 'general' && (
            <div className="form-grid">
              {F('Tên website', 'site_name')}
              {F('Tagline', 'site_tagline')}
              {F('Email', 'site_email', 'email')}
              {F('Số điện thoại', 'site_phone', 'tel')}
              {F('Địa chỉ', 'site_address')}
              {F('Giờ làm việc', 'working_hours')}
              {TA('Google Maps embed URL', 'map_embed')}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="form-grid">
              {F('Meta title', 'meta_title')}
              {TA('Meta description', 'meta_description', 3)}
              {F('Meta keywords', 'meta_keywords')}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="form-grid">
              {F('Facebook URL', 'facebook', 'url')}
              {F('Instagram URL', 'instagram', 'url')}
              {F('Zalo URL', 'zalo', 'url')}
              {F('YouTube URL', 'youtube', 'url')}
              {F('TikTok URL', 'tiktok', 'url')}
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="form-grid">
              {TA('Mô tả footer', 'footer_desc', 3)}
              {F('Copyright', 'footer_copyright')}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="form-grid">
              {F('Zalo OA URL', 'zalo_url', 'url')}
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="form-grid">
              {F('SMTP Host', 'smtp_host')}
              {F('SMTP Port', 'smtp_port', 'number')}
              {F('SMTP User (email)', 'smtp_user', 'email')}
              {F('SMTP Password', 'smtp_pass', 'password')}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="form-grid">
              {F('Hero eyebrow', 'hero_eyebrow')}
              {F('Hero heading', 'hero_heading')}
              {TA('Hero subtitle', 'hero_sub', 3)}
              {F('Số bệnh nhân (stat)', 'stat_patients')}
              {F('Độ chính xác AI (stat)', 'stat_accuracy')}
              {F('Số năm kinh nghiệm (stat)', 'stat_years')}
              {F('Số công nghệ (stat)', 'stat_tech')}
            </div>
          )}

          {activeTab === 'system' && (
            <div className="form-grid">
              <div className="form-field">
                <label>Chế độ bảo trì</label>
                <select
                  value={settings['maintenance_mode'] ?? '0'}
                  onChange={e => set('maintenance_mode', e.target.value)}
                >
                  <option value="0">Tắt (website hoạt động bình thường)</option>
                  <option value="1">Bật (tạm thời đóng website)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'cloudinary' && (
            <div className="form-grid">
              <p className="form-note">Dùng Cloudinary để lưu trữ ảnh trên cloud (tuỳ chọn, mặc định lưu local).</p>
              {F('Cloud Name', 'cloudinary_cloud_name')}
              {F('API Key', 'cloudinary_api_key')}
              {F('API Secret', 'cloudinary_api_secret', 'password')}
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="form-grid">
              <p className="form-note">Unsplash Access Key dùng để tìm kiếm ảnh miễn phí khi upload ảnh.</p>
              {F('Unsplash Access Key', 'unsplash_access_key')}
            </div>
          )}

          <div className="form-actions">
            {msg && <span className="form-msg">{msg}</span>}
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
