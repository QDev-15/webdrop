import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type KV = Record<string, string>

const TABS = [
  { key: 'general',     label: 'Thông tin chung' },
  { key: 'seo',         label: 'SEO' },
  { key: 'social',      label: 'Mạng xã hội' },
  { key: 'contact',     label: 'Liên hệ' },
  { key: 'hero',        label: 'Hero / Thống kê' },
  { key: 'cloudinary',  label: '☁️ Cloudinary' },
  { key: 'integration', label: '🔌 Tích hợp' },
]

const FIELD_MAP: Record<string, { key: string; label: string; type?: string; hint?: string }[]> = {
  general: [
    { key: 'site_name',     label: 'Tên website' },
    { key: 'site_tagline',  label: 'Tagline / Slogan' },
    { key: 'working_hours', label: 'Giờ làm việc', hint: 'VD: T2-CN: 08:00 - 20:00' },
    { key: 'zalo_number',   label: 'Số Zalo (không dấu cách)' },
  ],
  seo: [
    { key: 'meta_title',       label: 'Meta Title' },
    { key: 'meta_description', label: 'Meta Description', type: 'textarea' },
    { key: 'og_image',         label: 'OG Image URL' },
  ],
  social: [
    { key: 'facebook_url',  label: 'Facebook URL' },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'youtube_url',   label: 'YouTube URL' },
    { key: 'tiktok_url',    label: 'TikTok URL' },
  ],
  contact: [
    { key: 'site_phone',   label: 'Điện thoại chính' },
    { key: 'site_email',   label: 'Email' },
    { key: 'site_address', label: 'Địa chỉ đầy đủ', type: 'textarea' },
    { key: 'map_embed',    label: 'Google Maps Embed URL', type: 'textarea' },
  ],
  hero: [
    { key: 'hero_title_main',    label: 'Tiêu đề Hero' },
    { key: 'hero_subtitle',      label: 'Mô tả Hero', type: 'textarea' },
    { key: 'stat_years',         label: 'Số năm kinh nghiệm (stat)' },
    { key: 'stat_cases',         label: 'Số ca điều trị (stat)' },
    { key: 'stat_doctors',       label: 'Số bác sĩ (stat)' },
    { key: 'stat_satisfaction',  label: 'Tỉ lệ hài lòng % (stat)' },
  ],
  cloudinary: [
    { key: 'cloudinary_cloud_name',    label: 'Cloud Name' },
    { key: 'cloudinary_upload_preset', label: 'Upload Preset (unsigned)' },
    { key: 'unsplash_access_key',      label: 'Unsplash Access Key' },
  ],
  integration: [
    { key: 'smtp_host',       label: 'SMTP Host' },
    { key: 'smtp_port',       label: 'SMTP Port' },
    { key: 'smtp_user',       label: 'SMTP User' },
    { key: 'smtp_pass',       label: 'SMTP Password', type: 'password' },
    { key: 'smtp_from_email', label: 'From Email' },
    { key: 'notify_email',    label: 'Email nhận thông báo đặt lịch' },
  ],
}

export default function Settings() {
  const [tab, setTab] = useState('general')
  const [data, setData] = useState<KV>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    api.get<KV>('/settings').then(setData).catch(console.error)
  }, [])

  const fields = FIELD_MAP[tab] || []

  const handleSave = async () => {
    setSaving(true)
    const body: KV = {}
    fields.forEach(f => { body[f.key] = data[f.key] ?? '' })
    try {
      await api.post('/settings/update', body)
      setToast('Đã lưu thành công!')
      setTimeout(() => setToast(''), 2500)
    } catch {
      setToast('Lỗi khi lưu. Vui lòng thử lại.')
      setTimeout(() => setToast(''), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt website</div>
          <div className="page-sub">Quản lý thông tin, SEO và tích hợp của Nha Khoa Đông Đô</div>
        </div>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {toast && (
        <div className="toast" style={{
          background: toast.startsWith('Lỗi') ? '#fee2e2' : '#d1fae5',
          color: toast.startsWith('Lỗi') ? '#991b1b' : '#065f46',
          padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
        }}>
          {toast}
        </div>
      )}

      <div className="tabs" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', marginBottom: '28px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={'tab-btn' + (tab === t.key ? ' active' : '')}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: tab === t.key ? 600 : 400,
              borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t.key ? 'var(--accent)' : 'var(--text-2)',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {fields.map(f => (
          <div key={f.key} className={'form-field' + (f.type === 'textarea' ? ' full' : '')}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: f.type === 'textarea' ? '1 / -1' : undefined }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-2)' }}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={data[f.key] ?? ''}
                onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
                rows={3}
                style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
              />
            ) : (
              <input
                type={f.type ?? 'text'}
                value={data[f.key] ?? ''}
                onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
                style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }}
              />
            )}
            {f.hint && <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{f.hint}</span>}
          </div>
        ))}
      </div>
    </>
  )
}
