import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general', label: 'Chung' },
  { key: 'seo', label: 'SEO' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'stats', label: 'Số liệu' },
  { key: 'hero', label: 'Hero' },
  { key: 'cloudinary', label: 'Cloudinary' },
  { key: 'integrations', label: 'Tích hợp' },
]

const FIELDS: Record<string, Array<{ key: string; label: string; type?: string; rows?: number }>> = {
  general: [
    { key: 'site_name', label: 'Tên phòng khám' },
    { key: 'site_tagline', label: 'Slogan / Tagline' },
    { key: 'site_phone', label: 'Số điện thoại' },
    { key: 'site_email', label: 'Email' },
    { key: 'site_address', label: 'Địa chỉ' },
    { key: 'working_hours', label: 'Giờ làm việc' },
    { key: 'zalo_number', label: 'Số Zalo' },
    { key: 'footer_desc', label: 'Mô tả footer', type: 'textarea', rows: 2 },
    { key: 'footer_copyright', label: 'Copyright' },
  ],
  seo: [
    { key: 'meta_title', label: 'Meta Title' },
    { key: 'meta_description', label: 'Meta Description', type: 'textarea', rows: 3 },
    { key: 'meta_keywords', label: 'Meta Keywords' },
  ],
  social: [
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'youtube', label: 'YouTube URL' },
    { key: 'tiktok', label: 'TikTok URL' },
    { key: 'zalo', label: 'Zalo URL' },
  ],
  contact: [
    { key: 'map_embed', label: 'Google Maps Embed URL' },
    { key: 'parking_note', label: 'Ghi chú đậu xe' },
  ],
  stats: [
    { key: 'stat_patients', label: 'Số bé đã khám' },
    { key: 'stat_years', label: 'Số năm kinh nghiệm' },
    { key: 'stat_satisfaction', label: 'Tỷ lệ phụ huynh hài lòng' },
    { key: 'stat_doctors', label: 'Số bác sĩ' },
  ],
  hero: [
    { key: 'hero_eyebrow', label: 'Eyebrow / Badge' },
    { key: 'hero_title', label: 'Tiêu đề hero' },
    { key: 'hero_subtitle', label: 'Mô tả hero', type: 'textarea', rows: 2 },
  ],
  cloudinary: [
    { key: 'cloudinary_cloud_name', label: 'Cloud Name' },
    { key: 'cloudinary_api_key', label: 'API Key' },
    { key: 'cloudinary_api_secret', label: 'API Secret', type: 'password' },
    { key: 'cloudinary_upload_preset', label: 'Upload Preset' },
  ],
  integrations: [
    { key: 'unsplash_access_key', label: 'Unsplash Access Key' },
  ],
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true); setMsg(null)
    try {
      await api.post('/settings/update', settings)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công.' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Lưu thất bại.' })
    } finally { setSaving(false) }
  }

  function set(key: string, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const fields = FIELDS[tab] || []

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Cấu hình thông tin phòng khám KidSmile</div>
        </div>
        <button onClick={handleSave} className="btn-accent" disabled={saving}>
          {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
        </button>
      </div>

      {msg && (
        <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={tab === t.key ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div style={{ display: 'grid', gap: 20 }}>
          {fields.map(f => (
            <div className="form-group" key={f.key} style={{ margin: 0 }}>
              <label htmlFor={`s-${f.key}`} className="form-label">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  id={`s-${f.key}`}
                  className="form-control"
                  value={settings[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  rows={f.rows || 3}
                />
              ) : (
                <input
                  id={`s-${f.key}`}
                  type={f.type || 'text'}
                  className="form-control"
                  value={settings[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
