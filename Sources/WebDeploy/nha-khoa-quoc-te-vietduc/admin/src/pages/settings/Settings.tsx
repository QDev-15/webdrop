import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api/client'

interface SettingsMap { [key: string]: string }

const TABS = [
  { id: 'general',      label: 'Chung' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'hero',         label: 'Hero' },
  { id: 'stats',        label: 'Thống kê' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

const FIELD_MAP: Record<string, { key: string; label: string; type?: string; rows?: number }[]> = {
  general: [
    { key: 'site_name',      label: 'Tên website' },
    { key: 'site_tagline',   label: 'Tagline' },
    { key: 'site_phone',     label: 'Số điện thoại' },
    { key: 'site_email',     label: 'Email' },
    { key: 'site_address',   label: 'Địa chỉ chính' },
    { key: 'working_hours',  label: 'Giờ làm việc' },
    { key: 'footer_copy',    label: 'Bản quyền footer' },
    { key: 'footer_cert',    label: 'Chứng chỉ footer' },
  ],
  seo: [
    { key: 'meta_title',       label: 'Meta Title' },
    { key: 'meta_description', label: 'Meta Description', type: 'textarea', rows: 3 },
    { key: 'og_image',         label: 'OG Image URL' },
  ],
  social: [
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'youtube',  label: 'YouTube URL' },
    { key: 'zalo',     label: 'Số Zalo / Zalo URL' },
  ],
  contact: [
    { key: 'contact_form_title', label: 'Tiêu đề form liên hệ' },
    { key: 'map_embed',          label: 'Google Maps Embed URL', type: 'textarea', rows: 3 },
    { key: 'branch_hcm_address', label: 'TP.HCM — Địa chỉ' },
    { key: 'branch_hcm_phone',   label: 'TP.HCM — Điện thoại' },
    { key: 'branch_hn_address',  label: 'Hà Nội — Địa chỉ' },
    { key: 'branch_hn_phone',    label: 'Hà Nội — Điện thoại' },
    { key: 'branch_dn_address',  label: 'Đà Nẵng — Địa chỉ' },
    { key: 'branch_dn_phone',    label: 'Đà Nẵng — Điện thoại' },
    { key: 'branch_ct_address',  label: 'Cần Thơ — Địa chỉ' },
    { key: 'branch_ct_phone',    label: 'Cần Thơ — Điện thoại' },
    { key: 'branch_nt_address',  label: 'Nha Trang — Địa chỉ' },
    { key: 'branch_nt_phone',    label: 'Nha Trang — Điện thoại' },
  ],
  hero: [
    { key: 'hero_badge',         label: 'Badge nhỏ' },
    { key: 'hero_title',         label: 'Tiêu đề chính' },
    { key: 'hero_subtitle',      label: 'Tiêu đề phụ' },
    { key: 'hero_lead',          label: 'Mô tả', type: 'textarea', rows: 3 },
    { key: 'hero_image',         label: 'Ảnh hero (URL)' },
    { key: 'hero_cta_primary',   label: 'CTA chính' },
    { key: 'hero_cta_secondary', label: 'CTA phụ' },
  ],
  stats: [
    { key: 'stat_branches',           label: 'Số chi nhánh' },
    { key: 'stat_branches_label',     label: 'Nhãn chi nhánh' },
    { key: 'stat_doctors',            label: 'Số bác sĩ' },
    { key: 'stat_doctors_label',      label: 'Nhãn bác sĩ' },
    { key: 'stat_patients',           label: 'Số bệnh nhân' },
    { key: 'stat_patients_label',     label: 'Nhãn bệnh nhân' },
    { key: 'stat_satisfaction',       label: 'Tỉ lệ hài lòng' },
    { key: 'stat_satisfaction_label', label: 'Nhãn hài lòng' },
  ],
  cloudinary: [
    { key: 'cloudinary_cloud_name',     label: 'Cloud Name' },
    { key: 'cloudinary_upload_preset',  label: 'Upload Preset' },
    { key: 'unsplash_access_key',       label: 'Unsplash Access Key' },
  ],
  integrations: [
    { key: 'google_analytics', label: 'Google Analytics (Measurement ID)' },
    { key: 'facebook_pixel',   label: 'Facebook Pixel ID' },
    { key: 'chat_widget',      label: 'Chat widget script', type: 'textarea', rows: 4 },
  ],
}

export default function Settings() {
  const [tab, setTab]         = useState('general')
  const [data, setData]       = useState<SettingsMap>({})
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings').then(setData).catch(() => {})
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true); setMsg('')
    try {
      await api.post('/settings/update', data)
      setMsg('Đã lưu thành công.')
    } catch {
      setMsg('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const fields = FIELD_MAP[tab] ?? []

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Cài đặt</h1>
      </div>

      <div className="adm-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`adm-tab${tab === t.id ? ' active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && <div className="adm-alert">{msg}</div>}

      <form onSubmit={handleSubmit} className="adm-form">
        {fields.map(f => (
          <div key={f.key} className="adm-field">
            <label className="adm-label" htmlFor={f.key}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                id={f.key}
                className="adm-input"
                rows={f.rows ?? 3}
                value={data[f.key] ?? ''}
                onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
              />
            ) : (
              <input
                id={f.key}
                type="text"
                className="adm-input"
                value={data[f.key] ?? ''}
                onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
              />
            )}
          </div>
        ))}

        <button type="submit" className="adm-btn-primary" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </form>
    </div>
  )
}
