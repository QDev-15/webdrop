import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'hero', label: 'Hero / Trang chủ' },
  { key: 'about', label: 'Về chúng tôi' },
  { key: 'stats', label: 'Thống kê' },
  { key: 'cta', label: 'CTA Section' },
  { key: 'seo', label: 'SEO' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'footer', label: 'Footer' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'smtp', label: 'SMTP Email' },
  { key: 'system', label: 'Hệ thống' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<Record<string, SettingsMap>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get<Record<string, SettingsMap>>('/settings')
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [])

  function get(group: string, key: string, fallback = '') {
    return settings[group]?.[key] ?? fallback
  }

  function set(group: string, key: string, val: string) {
    setSettings(prev => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [key]: val },
    }))
  }

  async function handleSave() {
    const group = activeTab
    const data = settings[group] || {}
    setSaving(true)
    try {
      await api.post('/settings', { group, data })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  function Field({ group, keyName, label, type = 'text', placeholder = '', hint = '' }: { group: string; keyName: string; label: string; type?: string; placeholder?: string; hint?: string }) {
    const val = get(group, keyName)
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        {type === 'textarea' ? (
          <textarea className="form-control" value={val} onChange={e => set(group, keyName, e.target.value)} rows={3} placeholder={placeholder} />
        ) : type === 'checkbox' ? (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={val === '1'} onChange={e => set(group, keyName, e.target.checked ? '1' : '0')} />
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{placeholder}</span>
          </label>
        ) : (
          <input type={type} className="form-control" value={val} onChange={e => set(group, keyName, e.target.value)} placeholder={placeholder} />
        )}
        {hint && <div className="form-hint">{hint}</div>}
      </div>
    )
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">Cài đặt website</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : (saved ? '✓ Đã lưu' : 'Lưu thay đổi')}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500,
              padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: '8px 8px 0 0',
              background: activeTab === tab.key ? 'var(--surface)' : 'transparent',
              color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-3)',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all .15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {/* THÔNG TIN CHUNG */}
        {activeTab === 'general' && <>
          <div className="form-grid-2">
            <Field group="general" keyName="site_name" label="Tên agency" placeholder="NOVA." />
            <Field group="general" keyName="site_established" label="Năm thành lập" placeholder="2016" />
          </div>
          <Field group="general" keyName="site_tagline" label="Tagline" placeholder="Agency Sáng Tạo · Hồ Chí Minh · Est. 2016" />
          <Field group="general" keyName="site_description" label="Mô tả ngắn" type="textarea" />
          <div className="form-grid-2">
            <Field group="general" keyName="site_email" label="Email liên hệ" type="email" placeholder="hello@nova.vn" />
            <Field group="general" keyName="site_phone" label="Số điện thoại" placeholder="0909 123 456" />
          </div>
          <Field group="general" keyName="site_address" label="Địa chỉ văn phòng" placeholder="123 Nguyễn Huệ, Quận 1, TP. HCM" />
          <Field group="general" keyName="working_hours" label="Giờ làm việc" placeholder="Thứ 2 – Thứ 6, 8:00 – 18:00" />
          <Field group="general" keyName="site_city" label="Thành phố" placeholder="Hồ Chí Minh" />
          <div className="form-grid-2">
            <Field group="general" keyName="site_logo" label="URL Logo" placeholder="https://..." hint="URL ảnh logo (để trống dùng text)" />
            <Field group="general" keyName="site_favicon" label="URL Favicon" placeholder="https://..." />
          </div>
        </>}

        {/* HERO */}
        {activeTab === 'hero' && <>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px' }}>
            Nội dung hiển thị trong section hero trên trang chủ (nền đen, chữ lớn).
          </p>
          <div className="form-grid-2">
            <Field group="hero" keyName="hero_line1" label="Dòng 1 (màu trắng)" placeholder="WE BUILD" />
            <Field group="hero" keyName="hero_line2" label="Dòng 2 (outline)" placeholder="BRANDS" />
          </div>
          <Field group="hero" keyName="hero_line3" label="Dòng 3 (màu vàng)" placeholder="& STORIES" />
          <div className="form-grid-2">
            <Field group="hero" keyName="hero_tagline" label="Tagline trái" placeholder="Agency Sáng Tạo · Hồ Chí Minh · Est. 2016" />
            <Field group="hero" keyName="hero_tagline_right" label="Tagline phải" placeholder="Branding · Design · Digital" />
          </div>
          <hr className="section-sep" />
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>Thống kê trong hero (số đếm animation)</p>
          <div className="form-grid-2">
            <Field group="hero" keyName="hero_stat1_num" label="Stat 1 - Số" placeholder="120" />
            <Field group="hero" keyName="hero_stat1_suffix" label="Stat 1 - Suffix" placeholder="+" />
          </div>
          <Field group="hero" keyName="hero_stat1_label" label="Stat 1 - Label" placeholder="Dự án hoàn thành" />
          <div className="form-grid-2">
            <Field group="hero" keyName="hero_stat2_num" label="Stat 2 - Số" placeholder="80" />
            <Field group="hero" keyName="hero_stat2_suffix" label="Stat 2 - Suffix" placeholder="+" />
          </div>
          <Field group="hero" keyName="hero_stat2_label" label="Stat 2 - Label" placeholder="Khách hàng tin tưởng" />
          <div className="form-grid-2">
            <Field group="hero" keyName="hero_stat3_num" label="Stat 3 - Số" placeholder="8" />
            <Field group="hero" keyName="hero_stat3_suffix" label="Stat 3 - Suffix" placeholder="" />
          </div>
          <Field group="hero" keyName="hero_stat3_label" label="Stat 3 - Label" placeholder="Năm kinh nghiệm" />
        </>}

        {/* ABOUT */}
        {activeTab === 'about' && <>
          <Field group="about" keyName="about_manifesto" label="Manifesto (section tối)" type="textarea" hint="Văn bản hiển thị trong section tối trang Về chúng tôi" />
          <div className="form-grid-2">
            <Field group="about" keyName="about_story_title" label="Tiêu đề câu chuyện" placeholder="Bắt đầu từ một" />
            <Field group="about" keyName="about_approach_title" label="Tiêu đề cách tiếp cận" placeholder="Sáng tạo có" />
          </div>
          <Field group="about" keyName="about_story_content" label="Nội dung câu chuyện" type="textarea" hint="Dùng 2 dòng trống để tạo đoạn văn mới" />
          <Field group="about" keyName="about_image" label="URL Ảnh câu chuyện" placeholder="https://..." />
          <div className="form-grid-2">
            <Field group="about" keyName="about_team_count" label="Số lượng thành viên" placeholder="15" />
            <Field group="about" keyName="about_team_photo" label="URL Ảnh đội ngũ full-bleed" placeholder="https://..." />
          </div>
          <Field group="about" keyName="about_team_caption" label="Caption đội ngũ" placeholder="Đội ngũ đa dạng chuyên môn — designer, strategist, copywriter" />
        </>}

        {/* STATS */}
        {activeTab === 'stats' && <>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px' }}>
            Các con số hiển thị trong thanh thống kê (trang Dự án, Về chúng tôi).
          </p>
          <div className="form-grid-2">
            <Field group="stats" keyName="stats_projects" label="Dự án" placeholder="120+" />
            <Field group="stats" keyName="stats_clients" label="Khách hàng" placeholder="80+" />
          </div>
          <div className="form-grid-2">
            <Field group="stats" keyName="stats_years" label="Năm kinh nghiệm" placeholder="8" />
            <Field group="stats" keyName="stats_awards" label="Giải thưởng" placeholder="15" />
          </div>
        </>}

        {/* CTA */}
        {activeTab === 'cta' && <>
          <Field group="cta" keyName="cta_label" label="Label nhỏ trên CTA" placeholder="Sẵn sàng chưa?" />
          <Field group="cta" keyName="cta_title" label="Tiêu đề CTA" type="textarea" placeholder="LET'S START YOUR&#10;NEXT PROJECT" hint="Dùng Enter để xuống dòng trong tiêu đề" />
          <Field group="cta" keyName="cta_desc" label="Mô tả CTA" type="textarea" placeholder="Kể cho chúng tôi nghe về thương hiệu và mục tiêu của bạn..." />
        </>}

        {/* SEO */}
        {activeTab === 'seo' && <>
          <Field group="seo" keyName="meta_title" label="Meta Title" placeholder="NOVA. — Agency Sáng Tạo & Branding" />
          <Field group="seo" keyName="meta_description" label="Meta Description" type="textarea" />
          <Field group="seo" keyName="meta_keywords" label="Meta Keywords" placeholder="agency sáng tạo, branding, thiết kế thương hiệu" />
          <Field group="seo" keyName="og_image" label="OG Image URL" placeholder="https://..." hint="Ảnh hiển thị khi share lên Facebook, Zalo" />
          <Field group="seo" keyName="google_analytics_id" label="Google Analytics ID" placeholder="G-XXXXXXXXXX" />
        </>}

        {/* SOCIAL */}
        {activeTab === 'social' && <>
          <Field group="social" keyName="social_facebook" label="Facebook URL" placeholder="https://facebook.com/page" />
          <Field group="social" keyName="social_instagram" label="Instagram URL" placeholder="https://instagram.com/username" />
          <Field group="social" keyName="social_behance" label="Behance URL" placeholder="https://behance.net/username" />
          <Field group="social" keyName="social_linkedin" label="LinkedIn URL" placeholder="https://linkedin.com/company/..." />
          <Field group="social" keyName="social_youtube" label="YouTube URL" placeholder="https://youtube.com/@channel" />
          <Field group="social" keyName="social_zalo" label="Zalo Phone (dùng cho nút float)" placeholder="0909123456" hint="Số điện thoại Zalo, dùng để tạo link zalo.me/..." />
        </>}

        {/* FOOTER */}
        {activeTab === 'footer' && <>
          <Field group="footer" keyName="footer_copyright" label="Copyright text" placeholder="© 2026 NOVA. Agency. All rights reserved." />
          <Field group="footer" keyName="footer_description" label="Mô tả footer" type="textarea" />
          <Field group="footer" keyName="footer_show_social" label="Hiển thị social links" type="checkbox" placeholder="Hiển thị social links trong footer" />
        </>}

        {/* CONTACT */}
        {activeTab === 'contact' && <>
          <Field group="contact" keyName="contact_form_enabled" label="Form liên hệ" type="checkbox" placeholder="Bật form liên hệ/brief" />
          <Field group="contact" keyName="contact_email_receiver" label="Email nhận brief" type="email" placeholder="hello@nova.vn" hint="Email nhận thông báo khi có brief mới" />
          <Field group="contact" keyName="google_map_embed" label="Google Maps Embed URL" type="textarea" placeholder="https://www.google.com/maps/embed?pb=..." hint="URL từ Google Maps > Share > Embed a map > Copy link" />
        </>}

        {/* SMTP */}
        {activeTab === 'smtp' && <>
          <div className="form-grid-2">
            <Field group="smtp" keyName="smtp_host" label="SMTP Host" placeholder="smtp.gmail.com" />
            <Field group="smtp" keyName="smtp_port" label="SMTP Port" placeholder="587" />
          </div>
          <div className="form-grid-2">
            <Field group="smtp" keyName="smtp_user" label="SMTP User" type="email" />
            <Field group="smtp" keyName="smtp_password" label="SMTP Password" type="password" hint="App password (không phải mật khẩu Gmail)" />
          </div>
          <div className="form-grid-2">
            <Field group="smtp" keyName="smtp_from_name" label="Tên người gửi" placeholder="NOVA. Agency" />
            <Field group="smtp" keyName="smtp_from_email" label="Email người gửi" type="email" />
          </div>
        </>}

        {/* SYSTEM */}
        {activeTab === 'system' && <>
          <Field group="system" keyName="maintenance_mode" label="Chế độ bảo trì" type="checkbox" placeholder="Bật chế độ bảo trì (ẩn website với người dùng thông thường)" />
          <Field group="system" keyName="maintenance_message" label="Thông báo bảo trì" type="textarea" placeholder="Website đang bảo trì, vui lòng quay lại sau." />
          <Field group="system" keyName="custom_css" label="Custom CSS" type="textarea" hint="CSS tuỳ chỉnh được nhúng vào trang" />
        </>}

        <hr className="section-sep" />
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : (saved ? '✓ Đã lưu' : 'Lưu thay đổi')}
        </button>
      </div>
    </>
  )
}
