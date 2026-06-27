import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type Settings = Record<string, string>

const TABS = [
  { key: 'general',      label: 'Thông tin chung' },
  { key: 'seo',          label: 'SEO' },
  { key: 'social',       label: 'Mạng xã hội' },
  { key: 'hero',         label: 'Hero & Trang chủ' },
  { key: 'stats',        label: 'Thống kê' },
  { key: 'about',        label: 'Giới thiệu' },
  { key: 'booking',      label: 'Đặt lịch' },
  { key: 'footer',       label: 'Footer' },
  { key: 'contact',      label: 'Liên hệ' },
  { key: 'smtp',         label: 'SMTP Email' },
  { key: 'system',       label: 'Nâng cao' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({})
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Settings>('/settings').then(setSettings)
  }, [])

  function set(key: string, value: string) { setSettings(s => ({ ...s, [key]: value })) }
  function v(key: string) { return settings[key] ?? '' }

  async function save() {
    setSaving(true); setMsg(''); setError('')
    try {
      await api.post('/settings', settings)
      setMsg('Đã lưu cài đặt.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
    setSaving(false)
  }

  const f = (label: string, key: string, type = 'text', placeholder = '') => (
    <div className="form-group" key={key}>
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" value={v(key)} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
    </div>
  )
  const ta = (label: string, key: string, rows = 3, placeholder = '') => (
    <div className="form-group" key={key}>
      <label className="form-label">{label}</label>
      <textarea className="form-control" rows={rows} value={v(key)} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
    </div>
  )

  const tabContent: Record<string, React.ReactNode> = {
    general: <>{f('Tên website','site_name')}{f('Tagline','site_tagline')}{f('Số điện thoại','site_phone','tel')}{f('Email','site_email','email')}{ta('Địa chỉ','site_address',2)}{f('Giờ mở cửa','working_hours')}</>,
    seo: <>{f('Meta Title','meta_title')}{ta('Meta Description','meta_description',3)}{f('Meta Keywords','meta_keywords')}</>,
    social: <>{f('Facebook URL','facebook')}{f('Instagram URL','instagram')}{f('TikTok URL','tiktok')}{f('Số Zalo','zalo_number','tel')}</>,
    hero: (
      <>
        <div style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 12 }}>Nội dung phần hero trang chủ</div>
        {f('Badge text','hero_badge')}
        {f('Dòng tiêu đề 1','hero_title1')}
        {f('Dòng tiêu đề 2 (in nghiêng, màu accent)','hero_title2')}
        {f('Dòng tiêu đề 3','hero_title3')}
        {ta('Mô tả phụ','hero_sub',3)}
        {f('CTA chính','hero_cta_primary')}
        {f('CTA phụ','hero_cta_secondary')}
      </>
    ),
    stats: (
      <>
        <div style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 12 }}>Các con số thống kê hiển thị trong stats bar</div>
        {f('Số khách hàng','stat_customers')}
        {f('Năm kinh nghiệm','stat_years')}
        {f('Số dịch vụ','stat_services')}
        {f('Đánh giá trung bình','stat_rating')}
      </>
    ),
    about: (
      <>
        {f('Tiêu đề section Giới thiệu','about_title')}
        {ta('Mô tả','about_sub',4)}
        {f('Ảnh minh họa (URL)','about_image')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Tính năng 1</div>
            {f('Icon','feature1_icon')}{f('Tiêu đề','feature1_title')}{f('Mô tả','feature1_desc')}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Tính năng 2</div>
            {f('Icon','feature2_icon')}{f('Tiêu đề','feature2_title')}{f('Mô tả','feature2_desc')}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Tính năng 3</div>
            {f('Icon','feature3_icon')}{f('Tiêu đề','feature3_title')}{f('Mô tả','feature3_desc')}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Tính năng 4</div>
            {f('Icon','feature4_icon')}{f('Tiêu đề','feature4_title')}{f('Mô tả','feature4_desc')}
          </div>
        </div>
      </>
    ),
    booking: (
      <>
        <div style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 12 }}>Nội dung trang Đặt lịch</div>
        {ta('Ghi chú đặt lịch','booking_note',2)}
        <div style={{ marginTop: 16, fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Ưu đãi</div>
        {f('Ưu đãi 1 — Tiêu đề','booking_promo1_title')}{f('Ưu đãi 1 — Mô tả','booking_promo1_desc')}
        {f('Ưu đãi 2 — Tiêu đề','booking_promo2_title')}{f('Ưu đãi 2 — Mô tả','booking_promo2_desc')}
        {f('Ưu đãi 3 — Tiêu đề','booking_promo3_title')}{f('Ưu đãi 3 — Mô tả','booking_promo3_desc')}
      </>
    ),
    footer: <>{ta('Mô tả footer','footer_desc',3)}{f('Copyright','footer_copyright')}</>,
    contact: (
      <>
        {ta('Google Maps Embed URL','map_embed',3,'https://www.google.com/maps/embed?...')}
      </>
    ),
    smtp: <>{f('SMTP Host','smtp_host')}{f('SMTP Port','smtp_port','number')}{f('Username','smtp_user')}{f('Password','smtp_pass','password')}{f('Tên người gửi','smtp_from_name')}{f('Email người gửi','smtp_from_email','email')}</>,
    system: (
      <div className="form-group">
        <label className="form-label">Chế độ bảo trì</label>
        <select className="form-control" value={v('maintenance_mode')} onChange={e => set('maintenance_mode', e.target.value)}>
          <option value="0">Tắt — website hoạt động bình thường</option>
          <option value="1">Bật — hiển thị trang bảo trì</option>
        </select>
      </div>
    ),
    cloudinary: (
      <>
        <div className="alert alert-info">Cấu hình Cloudinary để lưu ảnh trên cloud thay vì server.</div>
        {f('Cloud Name','cloud_name')}
        {f('API Key','cloud_api_key')}
        {f('API Secret','cloud_api_secret','password')}
      </>
    ),
    integrations: (
      <>
        <div className="alert alert-info">Unsplash Access Key — dùng để tìm kiếm ảnh miễn phí trong admin.</div>
        {f('Unsplash Access Key','unsplash_access_key')}
      </>
    ),
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Cài đặt hệ thống</div></div>
        <button className="btn-accent" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : '💾 Lưu cài đặt'}</button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 8 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: tab === t.key ? 'var(--accent-light)' : 'transparent',
                color: tab === t.key ? 'var(--accent)' : 'var(--text-2)',
                fontWeight: tab === t.key ? 600 : 400,
                fontSize: 13, fontFamily: 'var(--sans)', marginBottom: 2,
              }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="card">{tabContent[tab]}</div>
      </div>
    </div>
  )
}
