import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, Record<string, string>>

type TabKey = 'general' | 'author' | 'seo' | 'social' | 'footer' | 'contact' | 'smtp' | 'newsletter' | 'system'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'author', label: 'Tác giả' },
  { key: 'seo', label: 'SEO' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'footer', label: 'Footer' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'smtp', label: 'SMTP' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'system', label: 'Hệ thống' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(data => setForm(flattenSettings(data)))
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
      setSuccess('Đã lưu cài đặt thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      alert('Lưu thất bại')
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
        <div className="page-title">Cài đặt</div>
        <button form="settings-form" type="submit" className="btn btn-accent" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
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
              <div className="form-section-title">Thông tin website</div>
              <div className="form-row">
                {field('site_name', 'Tên website')}
                {field('site_email', 'Email', 'email')}
              </div>
              {field('site_description', 'Mô tả website', 'textarea')}
              <div className="form-row">
                {field('site_logo', 'URL Logo')}
                {field('site_phone', 'Số điện thoại')}
              </div>
              {field('site_address', 'Địa chỉ')}
            </>
          )}

          {activeTab === 'author' && (
            <>
              <div className="form-section-title">Thông tin tác giả</div>
              <div className="form-row">
                {field('author_name', 'Tên tác giả')}
                {field('author_title', 'Chức danh / Mô tả ngắn')}
              </div>
              {field('author_bio', 'Giới thiệu bản thân', 'textarea')}
              {field('author_avatar', 'URL ảnh đại diện', 'url', 'Link ảnh avatar hiển thị ở sidebar và trang Về tôi')}
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
              {field('meta_keywords', 'Meta keywords', 'text', 'Các từ khóa cách nhau bằng dấu phẩy')}
              {field('og_image', 'OG Image URL', 'url')}
              {field('google_analytics_id', 'Google Analytics ID', 'text', 'Ví dụ: G-XXXXXXXXXX')}
            </>
          )}

          {activeTab === 'social' && (
            <>
              <div className="form-section-title">Mạng xã hội</div>
              {field('social_facebook', 'Facebook URL', 'url')}
              {field('social_youtube', 'YouTube URL', 'url')}
              {field('social_instagram', 'Instagram URL', 'url')}
              {field('social_tiktok', 'TikTok URL', 'url')}
              {field('social_zalo', 'Zalo (số điện thoại)', 'text', 'Số điện thoại Zalo (không có +84)')}
            </>
          )}

          {activeTab === 'footer' && (
            <>
              <div className="form-section-title">Footer</div>
              {field('footer_copyright', 'Bản quyền')}
              {field('footer_description', 'Mô tả footer', 'textarea')}
              {toggleField('footer_show_social', 'Hiển thị icon mạng xã hội')}
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <div className="form-section-title">Liên hệ</div>
              {toggleField('contact_form_enabled', 'Bật form liên hệ')}
              {field('contact_email_receiver', 'Email nhận liên hệ', 'email')}
              {field('google_map_embed', 'Google Map Embed code', 'textarea', 'Dán iframe Google Maps vào đây')}
            </>
          )}

          {activeTab === 'smtp' && (
            <>
              <div className="form-section-title">Cài đặt SMTP Email</div>
              <div className="form-row">
                {field('smtp_host', 'SMTP Host', 'text', 'smtp.gmail.com')}
                {field('smtp_port', 'SMTP Port', 'text', '587')}
              </div>
              <div className="form-row">
                {field('smtp_user', 'SMTP Username', 'email')}
                {field('smtp_password', 'SMTP Password', 'password')}
              </div>
              <div className="form-row">
                {field('smtp_from_name', 'Tên người gửi')}
                {field('smtp_from_email', 'Email người gửi', 'email')}
              </div>
            </>
          )}

          {activeTab === 'newsletter' && (
            <>
              <div className="form-section-title">Newsletter</div>
              {toggleField('newsletter_enabled', 'Bật chức năng đăng ký newsletter')}
              {field('newsletter_thank_you', 'Thông báo cảm ơn sau khi đăng ký', 'textarea')}
            </>
          )}

          {activeTab === 'system' && (
            <>
              <div className="form-section-title">Hệ thống</div>
              {toggleField('maintenance_mode', 'Chế độ bảo trì (website hiện thông báo bảo trì)')}
              {field('maintenance_message', 'Thông báo bảo trì', 'textarea')}
            </>
          )}
        </div>
      </form>
    </div>
  )
}
