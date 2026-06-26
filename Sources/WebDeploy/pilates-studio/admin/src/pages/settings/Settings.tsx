import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',     label: '🏠 Chung' },
  { key: 'seo',         label: '🔍 SEO' },
  { key: 'social',      label: '📱 Mạng xã hội' },
  { key: 'contact',     label: '📍 Liên hệ' },
  { key: 'cloudinary',  label: '☁️ Cloudinary' },
  { key: 'integration', label: '🔌 Tích hợp' },
]

const FIELD_GROUPS: Record<string, Array<{ key: string; label: string; type?: string; placeholder?: string }>> = {
  general: [
    { key: 'site_name',        label: 'Tên studio',       placeholder: 'Balance Pilates Studio' },
    { key: 'site_tagline',     label: 'Slogan',           placeholder: 'Studio Pilates & Fitness Hiện Đại' },
    { key: 'site_description', label: 'Mô tả ngắn',      type: 'textarea', placeholder: 'Mô tả về studio...' },
    { key: 'site_phone',       label: 'Số điện thoại',   placeholder: '0901 234 567' },
    { key: 'site_email',       label: 'Email',            type: 'email', placeholder: 'info@studio.vn' },
    { key: 'working_hours',    label: 'Giờ mở cửa',      placeholder: 'T2–T7: 6:30 – 21:00 | CN: 7:00 – 17:00' },
    { key: 'footer_description', label: 'Mô tả footer', type: 'textarea', placeholder: 'Studio pilates chuyên nghiệp...' },
  ],
  seo: [
    { key: 'meta_title',       label: 'Meta Title',       placeholder: 'Balance Pilates Studio — ...' },
    { key: 'meta_description', label: 'Meta Description', type: 'textarea', placeholder: 'Mô tả cho SEO...' },
  ],
  social: [
    { key: 'social_facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/...' },
    { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
    { key: 'social_youtube',   label: 'YouTube URL',   placeholder: 'https://youtube.com/...' },
    { key: 'social_zalo',      label: 'Số Zalo',       placeholder: '0901234567' },
  ],
  contact: [
    { key: 'site_address',     label: 'Địa chỉ đầy đủ', type: 'textarea', placeholder: '123 Nguyễn Đình Chiểu, Quận 3, TP.HCM' },
    { key: 'google_maps_url',  label: 'Google Maps embed URL', placeholder: 'https://www.google.com/maps/embed?pb=...' },
  ],
  cloudinary: [
    { key: 'cloudinary_cloud_name', label: 'Cloud Name', placeholder: 'my-cloud' },
    { key: 'cloudinary_api_key',    label: 'API Key',    placeholder: '' },
    { key: 'cloudinary_api_secret', label: 'API Secret', type: 'password', placeholder: '' },
  ],
  integration: [
    { key: 'unsplash_access_key', label: 'Unsplash Access Key', placeholder: 'Dùng cho tìm kiếm ảnh trong admin' },
  ],
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [form, setForm] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(data => { setForm(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.post('/settings', form)
      // form already reflects saved state
      setMessage('Đã lưu thành công!')
    } catch (err: unknown) {
      setMessage('Lỗi: ' + (err instanceof Error ? err.message : 'Không lưu được.'))
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const fields = FIELD_GROUPS[activeTab] ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý thông tin và cấu hình website.</div>
        </div>
        <button onClick={handleSave} className="btn-accent" disabled={saving}>
          {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.startsWith('Lỗi') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: 16 }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              background: activeTab === t.key ? 'var(--accent)' : 'transparent',
              color: activeTab === t.key ? '#fff' : 'var(--text-2)',
              border: activeTab === t.key ? 'none' : '1px solid var(--border)',
              padding: '7px 16px',
              borderRadius: '8px 8px 0 0',
              fontSize: 13,
              fontFamily: 'var(--sans)',
              cursor: 'pointer',
              fontWeight: activeTab === t.key ? 600 : 400,
              marginBottom: -1,
              transition: 'all .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        {fields.map(f => (
          <div className="form-group" key={f.key}>
            <label className="form-label">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                className="form-control"
                rows={3}
                value={form[f.key] ?? ''}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            ) : (
              <input
                type={f.type ?? 'text'}
                className="form-control"
                value={form[f.key] ?? ''}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}

        {activeTab === 'cloudinary' && (
          <div className="alert alert-info" style={{ marginTop: 8 }}>
            Cloudinary được dùng để upload ảnh lên cloud. Để trống nếu dùng upload local.
          </div>
        )}
      </div>
    </div>
  )
}
