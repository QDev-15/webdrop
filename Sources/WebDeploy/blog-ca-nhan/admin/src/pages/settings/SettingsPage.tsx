import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, Record<string, string>>

type TabKey = 'general' | 'author' | 'seo' | 'social' | 'footer' | 'contact' | 'smtp' | 'newsletter' | 'system'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'Thong tin chung' },
  { key: 'author', label: 'Tac gia' },
  { key: 'seo', label: 'SEO' },
  { key: 'social', label: 'Mang xa hoi' },
  { key: 'footer', label: 'Footer' },
  { key: 'contact', label: 'Lien he' },
  { key: 'smtp', label: 'SMTP' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'system', label: 'He thong' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(data => {
        setForm(flattenSettings(data))
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  function flattenSettings(data: SettingsMap): Record<string, string> {
    const out: Record<string, string> = {}
    for (const group of Object.values(data)) {
      for (const [k, v] of Object.entries(group)) {
        out[k] = v ?? ''
      }
    }
    return out
  }

  function handleChange(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/settings/update', form)
      setSuccess('Da luu cai dat thanh cong!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      alert('Luu that bai')
    } finally {
      setSaving(false)
    }
  }

  function field(key: string, label: string, type: 'text' | 'email' | 'url' | 'textarea' | 'password' = 'text', hint?: string) {
    return (
      <div className="form-group" key={key}>
        <label className="form-label">{label}</label>
        {type === 'textarea' ? (
          <textarea
            className="form-control"
            value={form[key] ?? ''}
            onChange={e => handleChange(key, e.target.value)}
            rows={3}
          />
        ) : (
          <input
            type={type}
            className="form-control"
            value={form[key] ?? ''}
            onChange={e => handleChange(key, e.target.value)}
          />
        )}
        {hint && <div className="form-hint">{hint}</div>}
      </div>
    )
  }

  function toggleField(key: string, label: string) {
    return (
      <div className="form-group" key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          id={`toggle-${key}`}
          checked={form[key] === '1'}
          onChange={e => handleChange(key, e.target.checked ? '1' : '0')}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
        <label htmlFor={`toggle-${key}`} className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>{label}</label>
      </div>
    )
  }

  if (loading) return <div><div className="skeleton" style={{ height: '400px' }} /></div>

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Cai dat</div>
        <button form="settings-form" type="submit" className="btn btn-accent" disabled={saving}>
          {saving ? 'Dang luu...' : 'Luu cai dat'}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? '600' : '400',
              padding: '8px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-2)',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: 'all .15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form id="settings-form" onSubmit={handleSave}>
        <div className="form-card">
          {activeTab === 'general' && (
            <>
              <div className="form-section-title">Thong tin website</div>
              <div className="form-row">
                {field('site_name', 'Ten website')}
                {field('site_email', 'Email', 'email')}
              </div>
              {field('site_description', 'Mo ta website', 'textarea')}
              <div className="form-row">
                {field('site_logo', 'URL Logo')}
                {field('site_phone', 'So dien thoai')}
              </div>
              {field('site_address', 'Dia chi')}
            </>
          )}

          {activeTab === 'author' && (
            <>
              <div className="form-section-title">Thong tin tac gia</div>
              <div className="form-row">
                {field('author_name', 'Ten tac gia')}
                {field('author_title', 'Chuc danh / Mo ta ngan')}
              </div>
              {field('author_bio', 'Gioi thieu ban than', 'textarea')}
              {field('author_avatar', 'URL anh dai dien', 'url', 'Link anh avatar hien thi o sidebar')}
              {form.author_avatar && (
                <div style={{ marginTop: '8px' }}>
                  <img src={form.author_avatar} alt="Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                </div>
              )}
            </>
          )}

          {activeTab === 'seo' && (
            <>
              <div className="form-section-title">SEO & Meta</div>
              {field('meta_title', 'Meta title')}
              {field('meta_description', 'Meta description', 'textarea')}
              {field('meta_keywords', 'Meta keywords', 'text', 'Cac tu khoa cach nhau bang dau phay')}
              {field('og_image', 'OG Image URL', 'url')}
              {field('google_analytics_id', 'Google Analytics ID', 'text', 'Vi du: G-XXXXXXXXXX')}
            </>
          )}

          {activeTab === 'social' && (
            <>
              <div className="form-section-title">Mang xa hoi</div>
              {field('social_facebook', 'Facebook URL', 'url')}
              {field('social_youtube', 'YouTube URL', 'url')}
              {field('social_instagram', 'Instagram URL', 'url')}
              {field('social_tiktok', 'TikTok URL', 'url')}
              {field('social_zalo', 'Zalo (so dien thoai)', 'text', 'So dien thoai Zalo (khong co +84)')}
            </>
          )}

          {activeTab === 'footer' && (
            <>
              <div className="form-section-title">Footer</div>
              {field('footer_copyright', 'Ban quyen')}
              {field('footer_description', 'Mo ta footer', 'textarea')}
              {toggleField('footer_show_social', 'Hien thi icon mang xa hoi')}
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <div className="form-section-title">Lien he</div>
              {toggleField('contact_form_enabled', 'Bat form lien he')}
              {field('contact_email_receiver', 'Email nhan lien he', 'email')}
              {field('google_map_embed', 'Google Map Embed code', 'textarea', 'Dan iframe Google Maps vao day')}
            </>
          )}

          {activeTab === 'smtp' && (
            <>
              <div className="form-section-title">Cai dat SMTP Email</div>
              <div className="form-row">
                {field('smtp_host', 'SMTP Host', 'text', 'smtp.gmail.com')}
                {field('smtp_port', 'SMTP Port', 'text', '587')}
              </div>
              <div className="form-row">
                {field('smtp_user', 'SMTP Username', 'email')}
                {field('smtp_password', 'SMTP Password', 'password')}
              </div>
              <div className="form-row">
                {field('smtp_from_name', 'Ten nguoi gui')}
                {field('smtp_from_email', 'Email nguoi gui', 'email')}
              </div>
            </>
          )}

          {activeTab === 'newsletter' && (
            <>
              <div className="form-section-title">Newsletter</div>
              {toggleField('newsletter_enabled', 'Bat chuc nang dang ky newsletter')}
              {field('newsletter_thank_you', 'Thong bao cam on sau khi dang ky', 'textarea')}
            </>
          )}

          {activeTab === 'system' && (
            <>
              <div className="form-section-title">He thong</div>
              {toggleField('maintenance_mode', 'Che do bao tri (website hien thong bao bao tri)')}
              {field('maintenance_message', 'Thong bao bao tri', 'textarea')}
            </>
          )}
        </div>
      </form>
    </div>
  )
}
