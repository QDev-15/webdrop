import { FormEvent, useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'about',   label: 'Về chúng tôi' },
  { key: 'stats',   label: 'Thống kê' },
  { key: 'cta',     label: 'CTA Section' },
  { key: 'seo',     label: 'SEO' },
  { key: 'social',  label: 'Mạng xã hội' },
  { key: 'footer',  label: 'Footer' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'smtp',    label: 'SMTP Email' },
  { key: 'system',  label: 'Nâng cao' },
]

type TabKey = typeof TABS[number]['key']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [settings, setSettings]   = useState<SettingsMap>({})
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    api.get<Record<string, SettingsMap>>('/settings').then(grouped => {
      const flat: SettingsMap = {}
      Object.values(grouped).forEach(g => Object.assign(flat, g))
      setSettings(flat)
    }).catch(() => {})
  }, [])

  const set = (k: string, v: string) => setSettings(p => ({ ...p, [k]: v }))

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    // Group settings by tab key
    const groupMap: Record<string, Record<string, string>> = {}

    const keyGroupMap: Record<string, string> = {
      site_name:'general',site_tagline:'general',site_description:'general',site_logo:'general',site_favicon:'general',site_email:'general',site_phone:'general',site_phone_2:'general',site_address:'general',working_hours:'general',
      about_title:'about',about_tagline:'about',about_content:'about',about_image:'about',about_stat1_num:'about',about_stat1_label:'about',about_stat2_num:'about',about_stat2_label:'about',about_stat3_num:'about',about_stat3_label:'about',about_members_count:'about',
      stats_projects:'stats',stats_clients:'stats',stats_years:'stats',stats_rating:'stats',
      cta_title:'cta',cta_subtitle:'cta',cta_button_text:'cta',
      meta_title:'seo',meta_description:'seo',meta_keywords:'seo',og_image:'seo',google_analytics_id:'seo',
      social_facebook:'social',social_youtube:'social',social_instagram:'social',social_tiktok:'social',social_zalo:'social',social_linkedin:'social',
      footer_copyright:'footer',footer_description:'footer',footer_show_social:'footer',
      contact_form_enabled:'contact',contact_email_receiver:'contact',google_map_embed:'contact',
      smtp_host:'smtp',smtp_port:'smtp',smtp_user:'smtp',smtp_password:'smtp',smtp_from_name:'smtp',smtp_from_email:'smtp',
      maintenance_mode:'system',maintenance_message:'system',custom_css:'system',primary_color:'design',secondary_color:'design',
    }

    for (const [key, value] of Object.entries(settings)) {
      const group = keyGroupMap[key] || 'general'
      if (!groupMap[group]) groupMap[group] = {}
      groupMap[group][key] = value
    }

    try {
      for (const [group, data] of Object.entries(groupMap)) {
        await api.post('/settings', { group, data })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Lỗi lưu cài đặt')
    } finally {
      setSaving(false)
    }
  }

  const F = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="form-control" rows={4} value={settings[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="form-control" type={type} value={settings[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )

  const renderTab = () => {
    switch (activeTab) {
      case 'general': return (
        <div className="form-grid-2">
          <F label="Tên website" k="site_name" placeholder="Agency Web" />
          <F label="Tagline" k="site_tagline" placeholder="Thiết kế web & Dịch vụ số" />
          <F label="Email liên hệ" k="site_email" type="email" />
          <F label="Số điện thoại" k="site_phone" placeholder="0901 234 567" />
          <F label="Số điện thoại 2" k="site_phone_2" />
          <F label="Giờ làm việc" k="working_hours" placeholder="T2-T7, 8:00-18:00" />
          <div style={{ gridColumn: '1/-1' }}><F label="Địa chỉ" k="site_address" placeholder="Hà Nội, Việt Nam" /></div>
          <div style={{ gridColumn: '1/-1' }}><F label="Mô tả website" k="site_description" type="textarea" /></div>
          <F label="Logo (URL)" k="site_logo" />
          <F label="Favicon (URL)" k="site_favicon" />
        </div>
      )
      case 'about': return (
        <div className="form-grid-2">
          <F label="Eyebrow (nhãn nhỏ)" k="about_tagline" placeholder="Câu chuyện của chúng tôi" />
          <F label="Tiêu đề" k="about_title" placeholder="Bắt đầu từ niềm đam mê" />
          <div style={{ gridColumn: '1/-1' }}><F label="Nội dung" k="about_content" type="textarea" /></div>
          <F label="Ảnh (URL)" k="about_image" />
          <F label="Số thành viên" k="about_members_count" placeholder="25+" />
          <F label="Stat 1 — Số" k="about_stat1_num" placeholder="120+" />
          <F label="Stat 1 — Label" k="about_stat1_label" placeholder="Dự án hoàn thành" />
          <F label="Stat 2 — Số" k="about_stat2_num" placeholder="8 năm" />
          <F label="Stat 2 — Label" k="about_stat2_label" placeholder="Kinh nghiệm" />
          <F label="Stat 3 — Số" k="about_stat3_num" placeholder="98%" />
          <F label="Stat 3 — Label" k="about_stat3_label" placeholder="Hài lòng" />
        </div>
      )
      case 'stats': return (
        <div className="form-grid-2">
          <F label="Dự án hoàn thành" k="stats_projects" placeholder="120+" />
          <F label="Khách hàng dài hạn" k="stats_clients" placeholder="50+" />
          <F label="Số năm kinh nghiệm" k="stats_years" placeholder="8 năm" />
          <F label="Đánh giá trung bình" k="stats_rating" placeholder="4.9 ★" />
        </div>
      )
      case 'cta': return (
        <div className="form-grid-2">
          <div style={{ gridColumn: '1/-1' }}><F label="Tiêu đề CTA" k="cta_title" placeholder="Bắt đầu dự án của bạn" /></div>
          <div style={{ gridColumn: '1/-1' }}><F label="Mô tả phụ" k="cta_subtitle" placeholder="Tư vấn miễn phí. Báo giá trong 24 giờ." /></div>
          <F label="Text nút" k="cta_button_text" placeholder="Liên hệ tư vấn →" />
        </div>
      )
      case 'seo': return (
        <div className="form-grid-2">
          <div style={{ gridColumn: '1/-1' }}><F label="Meta title" k="meta_title" /></div>
          <div style={{ gridColumn: '1/-1' }}><F label="Meta description" k="meta_description" type="textarea" /></div>
          <F label="Meta keywords" k="meta_keywords" />
          <F label="OG Image (URL)" k="og_image" />
          <F label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
        </div>
      )
      case 'social': return (
        <div className="form-grid-2">
          <F label="Facebook" k="social_facebook" placeholder="https://facebook.com/..." />
          <F label="YouTube" k="social_youtube" placeholder="https://youtube.com/..." />
          <F label="Instagram" k="social_instagram" placeholder="https://instagram.com/..." />
          <F label="TikTok" k="social_tiktok" placeholder="https://tiktok.com/..." />
          <F label="Zalo (số điện thoại)" k="social_zalo" placeholder="0901234567" />
          <F label="LinkedIn" k="social_linkedin" placeholder="https://linkedin.com/..." />
        </div>
      )
      case 'footer': return (
        <div className="form-grid-2">
          <div style={{ gridColumn: '1/-1' }}><F label="Copyright" k="footer_copyright" placeholder="© 2026 Agency Web · Made in Vietnam" /></div>
          <div style={{ gridColumn: '1/-1' }}><F label="Mô tả footer" k="footer_description" type="textarea" /></div>
          <div className="form-group">
            <label className="form-label">Hiển thị Social</label>
            <select className="form-select" value={settings.footer_show_social || '1'} onChange={e => set('footer_show_social', e.target.value)}>
              <option value="1">Có</option><option value="0">Không</option>
            </select>
          </div>
        </div>
      )
      case 'contact': return (
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Form liên hệ</label>
            <select className="form-select" value={settings.contact_form_enabled || '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
              <option value="1">Bật</option><option value="0">Tắt</option>
            </select>
          </div>
          <F label="Email nhận form" k="contact_email_receiver" type="email" />
          <div style={{ gridColumn: '1/-1' }}><F label="Google Maps Embed URL" k="google_map_embed" placeholder="https://www.google.com/maps/embed?..." /></div>
        </div>
      )
      case 'smtp': return (
        <div className="form-grid-2">
          <F label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
          <F label="SMTP Port" k="smtp_port" placeholder="587" />
          <F label="SMTP User" k="smtp_user" type="email" />
          <F label="SMTP Password" k="smtp_password" type="password" />
          <F label="From Name" k="smtp_from_name" />
          <F label="From Email" k="smtp_from_email" type="email" />
        </div>
      )
      case 'system': return (
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Bảo trì</label>
            <select className="form-select" value={settings.maintenance_mode || '0'} onChange={e => set('maintenance_mode', e.target.value)}>
              <option value="0">Tắt</option><option value="1">Bật (website hiển thị thông báo)</option>
            </select>
          </div>
          <F label="Thông báo bảo trì" k="maintenance_message" />
          <F label="Màu chính" k="primary_color" type="color" />
          <F label="Màu phụ" k="secondary_color" type="color" />
          <div style={{ gridColumn: '1/-1' }}><F label="Custom CSS" k="custom_css" type="textarea" /></div>
        </div>
      )
      default: return null
    }
  }

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Cài đặt</h1></div>
        {saved && <span style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 500 }}>✓ Đã lưu thành công!</span>}
      </div>

      <div style={{ display: 'flex', gap: '0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Tab list */}
        <div style={{ width: '176px', flexShrink: 0, borderRight: '1px solid var(--border)', padding: '8px 0' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px',
                background: activeTab === t.key ? 'var(--accent-light)' : 'transparent',
                color: activeTab === t.key ? 'var(--accent)' : 'var(--text-2)',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '13px',
                fontWeight: activeTab === t.key ? 500 : 400,
                borderLeft: activeTab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, padding: '24px' }}>
          <form onSubmit={save}>
            {renderTab()}
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
