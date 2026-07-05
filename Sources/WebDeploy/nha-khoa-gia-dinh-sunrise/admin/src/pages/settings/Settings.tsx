import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type KV = Record<string, string>

const TABS = [
  { key: 'general',    label: 'Thong tin chung' },
  { key: 'seo',        label: 'SEO' },
  { key: 'social',     label: 'Mang xa hoi' },
  { key: 'contact',    label: 'Lien he' },
  { key: 'hero',       label: 'Hero / Stats' },
  { key: 'about',      label: 'Gioi thieu' },
  { key: 'cloudinary', label: 'Cloudinary' },
  { key: 'smtp',       label: 'SMTP Email' },
]

const FIELD_MAP: Record<string, { key: string; label: string; type?: string; hint?: string }[]> = {
  general: [
    { key: 'site_name',      label: 'Ten website' },
    { key: 'site_tagline',   label: 'Tagline / Slogan' },
    { key: 'site_phone',     label: 'Dien thoai chinh' },
    { key: 'site_email',     label: 'Email chinh' },
    { key: 'site_address',   label: 'Dia chi', type: 'textarea' },
    { key: 'working_hours',  label: 'Gio lam viec', hint: 'Vi du: Thu 2 - Chu nhat: 8:00 - 20:00' },
  ],
  seo: [
    { key: 'meta_title',       label: 'Meta Title' },
    { key: 'meta_description', label: 'Meta Description', type: 'textarea' },
  ],
  social: [
    { key: 'facebook',  label: 'Facebook URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'youtube',   label: 'YouTube URL' },
    { key: 'tiktok',    label: 'TikTok URL' },
    { key: 'zalo',      label: 'So Zalo (khong dau cach)', hint: 'Vi du: 0900000000' },
  ],
  contact: [
    { key: 'zalo_number', label: 'So Zalo float button' },
    { key: 'map_embed',   label: 'Google Maps Embed URL', type: 'textarea' },
  ],
  hero: [
    { key: 'hero_badge',           label: 'Hero Badge (dong chu nho)' },
    { key: 'hero_title',           label: 'Hero Title (co the dung <em> cho chu nghieng)', type: 'textarea' },
    { key: 'hero_subtitle',        label: 'Hero Subtitle' },
    { key: 'hero_image',           label: 'Hero Image URL' },
    { key: 'hero_float_years',     label: 'Float Badge — So nam (vi du: 10 nam)' },
    { key: 'hero_float_label',     label: 'Float Badge — Mo ta' },
    { key: 'hero_meta_families',   label: 'Hero meta 1 (vi du: 1.200+ gia dinh)' },
    { key: 'hero_meta_rating',     label: 'Hero meta 2 (vi du: 4.9/5 tu khach hang)' },
    { key: 'stat_years',           label: 'Stat — So nam kinh nghiem' },
    { key: 'stat_families',        label: 'Stat — So gia dinh tin tuong' },
    { key: 'stat_staff',           label: 'Stat — So bac si & nhan vien' },
    { key: 'stat_satisfaction',    label: 'Stat — Ti le hai long' },
  ],
  about: [
    { key: 'about_strip1_title',         label: 'Ve chung toi — Khoi 1: Tieu de', hint: 'Co the dung <em> cho chu nghieng' },
    { key: 'about_strip1_text',          label: 'Ve chung toi — Khoi 1: Noi dung', type: 'textarea' },
    { key: 'about_strip1_badge_num',     label: 'Ve chung toi — Khoi 1: So lieu (vi du: 15.000+)' },
    { key: 'about_strip1_badge_label',   label: 'Ve chung toi — Khoi 1: Nhan so lieu' },
    { key: 'about_strip1_image',         label: 'Ve chung toi — Khoi 1: URL hinh anh' },
    { key: 'about_strip2_title',         label: 'Ve chung toi — Khoi 2: Tieu de' },
    { key: 'about_strip2_text',          label: 'Ve chung toi — Khoi 2: Noi dung', type: 'textarea' },
    { key: 'about_strip2_badge_num',     label: 'Ve chung toi — Khoi 2: So lieu' },
    { key: 'about_strip2_badge_label',   label: 'Ve chung toi — Khoi 2: Nhan so lieu' },
    { key: 'about_strip2_image',         label: 'Ve chung toi — Khoi 2: URL hinh anh' },
  ],
  cloudinary: [
    { key: 'cloudinary_cloud_name',    label: 'Cloud Name' },
    { key: 'cloudinary_api_key',       label: 'API Key' },
    { key: 'cloudinary_api_secret',    label: 'API Secret', type: 'password' },
    { key: 'unsplash_access_key',      label: 'Unsplash Access Key' },
  ],
  smtp: [
    { key: 'smtp_host', label: 'SMTP Host' },
    { key: 'smtp_port', label: 'SMTP Port' },
    { key: 'smtp_user', label: 'SMTP User' },
    { key: 'smtp_pass', label: 'SMTP Password', type: 'password' },
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
