import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type GroupSettings = Record<string, Record<string, string>>

const TABS = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'about',   label: 'Trang chủ / Hero' },
  { key: 'seo',     label: 'SEO' },
  { key: 'social',  label: 'Mạng xã hội' },
  { key: 'footer',  label: 'Footer' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'smtp',    label: 'SMTP' },
  { key: 'system',  label: 'Hệ thống' },
]

export default function Settings() {
  const [all, setAll] = useState<GroupSettings>({})
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => {
    api.get<GroupSettings>('/settings').then(setAll).catch(() => {})
  }, [])

  function get(key: string): string {
    for (const g of Object.values(all)) {
      if (key in g) return g[key] ?? ''
    }
    return ''
  }

  function set(key: string, value: string) {
    setAll(a => {
      const copy = { ...a }
      for (const g of Object.keys(copy)) {
        if (key in (copy[g] || {})) {
          copy[g] = { ...copy[g], [key]: value }
          return copy
        }
      }
      return copy
    })
  }

  async function handleSave() {
    setSaving(true); setAlert('')
    const flat: Record<string, string> = {}
    for (const g of Object.values(all)) Object.assign(flat, g)
    try {
      await api.post('/settings', flat)
      setAlert('success:Đã lưu cài đặt thành công.')
    } catch (err: unknown) {
      setAlert('error:' + (err instanceof Error ? err.message : 'Lỗi khi lưu'))
    } finally { setSaving(false) }
  }

  const alertType = alert.startsWith('success:') ? 'success' : 'error'
  const alertMsg  = alert.replace(/^(success:|error:)/, '')

  const Field = ({ label, fkey, type = 'text', placeholder = '' }: { label: string; fkey: string; type?: string; placeholder?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea'
        ? <textarea className="form-textarea" value={get(fkey)} onChange={e => set(fkey, e.target.value)} placeholder={placeholder} rows={3} />
        : <input className="form-input" type={type} value={get(fkey)} onChange={e => set(fkey, e.target.value)} placeholder={placeholder} />
      }
    </div>
  )

  return (
    <>
      <div className="page-hdr">
        <h1>Cài đặt</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
      </div>

      {alert && <div className={`alert alert-${alertType}`}>{alertMsg}</div>}

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.key} className={`tab-btn${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="form-card">
        {tab === 'general' && (
          <>
            <Field label="Tên văn phòng luật" fkey="site_name" placeholder="Nguyễn & Đồng Nghiệp" />
            <Field label="Tagline" fkey="site_tagline" placeholder="Văn Phòng Luật Sư" />
            <Field label="Mô tả website" fkey="site_description" type="textarea" />
            <div className="form-row">
              <Field label="Email" fkey="site_email" type="email" />
              <Field label="Số điện thoại chính" fkey="site_phone" />
            </div>
            <div className="form-row">
              <Field label="Số điện thoại phụ (24/7)" fkey="site_phone_2" />
              <Field label="Năm thành lập" fkey="established_year" />
            </div>
            <Field label="Địa chỉ" fkey="site_address" type="textarea" />
            <Field label="Giờ làm việc" fkey="working_hours" type="textarea" placeholder="Thứ Hai – Thứ Sáu: 8:00 – 17:30&#10;Thứ Bảy: 8:00 – 12:00" />
          </>
        )}

        {tab === 'about' && (
          <>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-2)' }}>Hero Section (Trang chủ)</h3>
            <Field label="Kicker text" fkey="hero_kicker" placeholder="Văn Phòng Luật Sư · Thành Lập 2009" />
            <Field label="Hero heading" fkey="hero_heading" type="textarea" placeholder="Bảo vệ&#10;quyền lợi&#10;của bạn." />
            <Field label="Hero sub text" fkey="hero_sub" type="textarea" />
            <Field label="Hero image URL" fkey="hero_image" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '20px 0 16px', color: 'var(--text-2)' }}>Số liệu thống kê</h3>
            <div className="form-row">
              <Field label="Số vụ thành công" fkey="stat_cases" placeholder="500+" />
              <Field label="Năm kinh nghiệm" fkey="stat_years" placeholder="15" />
            </div>
            <div className="form-row">
              <Field label="Số luật sư" fkey="stat_lawyers" placeholder="12" />
              <Field label="Tỷ lệ thắng kiện" fkey="stat_winrate" placeholder="94%" />
            </div>
          </>
        )}

        {tab === 'seo' && (
          <>
            <Field label="Meta title" fkey="meta_title" />
            <Field label="Meta description" fkey="meta_description" type="textarea" />
            <Field label="Meta keywords" fkey="meta_keywords" />
            <Field label="OG Image URL" fkey="og_image" />
            <Field label="Google Analytics ID" fkey="google_analytics_id" placeholder="G-XXXXXXXXXX" />
          </>
        )}

        {tab === 'social' && (
          <>
            <Field label="Facebook URL" fkey="social_facebook" placeholder="https://facebook.com/..." />
            <Field label="LinkedIn URL" fkey="social_linkedin" placeholder="https://linkedin.com/..." />
            <Field label="Zalo số điện thoại" fkey="social_zalo" placeholder="0900000000" />
            <Field label="YouTube URL" fkey="social_youtube" />
          </>
        )}

        {tab === 'footer' && (
          <>
            <Field label="Copyright text" fkey="footer_copyright" placeholder="© 2024 Văn Phòng Luật Sư. Bảo lưu mọi quyền." />
            <Field label="Mô tả footer" fkey="footer_description" type="textarea" />
            <div className="form-group">
              <label className="form-label">Hiển thị mạng xã hội</label>
              <select className="form-select" value={get('footer_show_social')} onChange={e => set('footer_show_social', e.target.value)}>
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
          </>
        )}

        {tab === 'contact' && (
          <>
            <div className="form-group">
              <label className="form-label">Bật form liên hệ</label>
              <select className="form-select" value={get('contact_form_enabled')} onChange={e => set('contact_form_enabled', e.target.value)}>
                <option value="1">Bật</option>
                <option value="0">Tắt</option>
              </select>
            </div>
            <Field label="Email nhận liên hệ" fkey="contact_email_receiver" type="email" />
            <Field label="Google Maps Embed (iframe)" fkey="google_map_embed" type="textarea" placeholder="<iframe src='...'></iframe>" />
          </>
        )}

        {tab === 'smtp' && (
          <>
            <div className="form-row">
              <Field label="SMTP Host" fkey="smtp_host" placeholder="smtp.gmail.com" />
              <Field label="SMTP Port" fkey="smtp_port" placeholder="587" />
            </div>
            <div className="form-row">
              <Field label="SMTP User" fkey="smtp_user" type="email" />
              <Field label="SMTP Password" fkey="smtp_password" type="password" />
            </div>
            <div className="form-row">
              <Field label="Tên người gửi" fkey="smtp_from_name" />
              <Field label="Email người gửi" fkey="smtp_from_email" type="email" />
            </div>
          </>
        )}

        {tab === 'system' && (
          <>
            <div className="form-group">
              <label className="form-label">Chế độ bảo trì</label>
              <select className="form-select" value={get('maintenance_mode')} onChange={e => set('maintenance_mode', e.target.value)}>
                <option value="0">Tắt</option>
                <option value="1">Bật (website hiển thị trang bảo trì)</option>
              </select>
            </div>
            <Field label="Thông báo bảo trì" fkey="maintenance_message" type="textarea" />
          </>
        )}

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </div>
    </>
  )
}
