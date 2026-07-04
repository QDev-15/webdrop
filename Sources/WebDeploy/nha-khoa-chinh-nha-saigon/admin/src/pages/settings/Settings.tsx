import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type KV = Record<string, string>

const TABS = [
  { key: 'general',     label: 'Thong tin chung' },
  { key: 'seo',         label: 'SEO' },
  { key: 'social',      label: 'Mang xa hoi' },
  { key: 'contact',     label: 'Lien he' },
  { key: 'hero',        label: 'Hero / Stats' },
  { key: 'cloudinary',  label: 'Cloudinary' },
  { key: 'integration', label: 'Tich hop' },
]

const FIELD_MAP: Record<string, { key: string; label: string; type?: string; hint?: string }[]> = {
  general: [
    { key: 'site_name',    label: 'Ten website' },
    { key: 'site_tagline', label: 'Tagline / Slogan' },
    { key: 'working_hours',label: 'Gio lam viec', hint: 'Vi du: T2-T7: 8:00-20:00 | CN: 8:00-12:00' },
    { key: 'zalo_number',  label: 'So dien thoai Zalo (khong dau cach)' },
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
    { key: 'site_phone',   label: 'Dien thoai chinh' },
    { key: 'site_email',   label: 'Email' },
    { key: 'site_address', label: 'Dia chi day du', type: 'textarea' },
    { key: 'map_embed',    label: 'Google Maps Embed URL', type: 'textarea' },
  ],
  hero: [
    { key: 'hero_badge',      label: 'Hero Badge (dong chu nho)' },
    { key: 'hero_title_1',    label: 'Hero Title (truoc em)' },
    { key: 'hero_title_em',   label: 'Hero Title (chu em nhan)' },
    { key: 'hero_subtitle',   label: 'Hero Subtitle' },
    { key: 'stat_cases',      label: 'So ca chinh nha (stat)' },
    { key: 'stat_doctors',    label: 'So bac si (stat)' },
    { key: 'stat_years',      label: 'So nam kinh nghiem (stat)' },
    { key: 'stat_satisfaction',label: 'Ti le hai long (stat)' },
  ],
  cloudinary: [
    { key: 'cloudinary_cloud_name', label: 'Cloud Name' },
    { key: 'cloudinary_upload_preset', label: 'Upload Preset (unsigned)' },
    { key: 'unsplash_access_key', label: 'Unsplash Access Key' },
  ],
  integration: [
    { key: 'smtp_host',     label: 'SMTP Host' },
    { key: 'smtp_port',     label: 'SMTP Port' },
    { key: 'smtp_user',     label: 'SMTP User' },
    { key: 'smtp_pass',     label: 'SMTP Password', type: 'password' },
    { key: 'smtp_from_email', label: 'From Email' },
    { key: 'notify_email',  label: 'Email nhan thong bao dat lich' },
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
      await api.put('/settings', body)
      setToast('Da luu thanh cong')
      setTimeout(() => setToast(''), 2500)
    } catch {
      setToast('Luu that bai — thu lai')
      setTimeout(() => setToast(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Cai dat he thong</div>
          <div className="page-subtitle">Thong tin website, SEO, mang xa hoi, tich hop</div>
        </div>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>{saving ? 'Dang luu...' : 'Luu cai dat'}</button>
      </div>

      {toast && (
        <div style={{ background: toast.includes('thanh cong') ? 'var(--accent-light)' : '#fef2f2', color: toast.includes('thanh cong') ? 'var(--accent)' : 'var(--danger)', border: `1px solid ${toast.includes('thanh cong') ? 'var(--accent)' : 'var(--danger)'}`, borderRadius: '8px', padding: '12px 18px', marginBottom: '16px', fontSize: '14px' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={tab === t.key ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="form-card">
        {fields.map(f => (
          <div className="form-group" key={f.key}>
            <label className="form-label">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                className="form-control"
                rows={3}
                value={data[f.key] ?? ''}
                onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
              />
            ) : (
              <input
                className="form-control"
                type={f.type || 'text'}
                value={data[f.key] ?? ''}
                onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
              />
            )}
            {f.hint && <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>{f.hint}</div>}
          </div>
        ))}
      </div>
    </>
  )
}
