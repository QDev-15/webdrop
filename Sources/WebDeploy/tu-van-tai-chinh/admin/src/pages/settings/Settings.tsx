import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Setting { key: string; value: string; group: string }

type Tab = 'general' | 'seo' | 'social' | 'footer' | 'contact' | 'about' | 'smtp' | 'system'

const TABS: { key: Tab; label: string }[] = [
  { key: 'general',  label: 'Thông tin chung' },
  { key: 'about',    label: 'Hero & Thống kê' },
  { key: 'seo',      label: 'SEO' },
  { key: 'social',   label: 'Mạng xã hội' },
  { key: 'footer',   label: 'Footer' },
  { key: 'contact',  label: 'Liên hệ' },
  { key: 'smtp',     label: 'SMTP' },
  { key: 'system',   label: 'Hệ thống' },
]

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<Tab>('general')

  useEffect(() => {
    api.get<Setting[]>('/settings').then(rows => {
      const map: Record<string, string> = {}
      rows.forEach(r => { map[r.key] = r.value ?? '' })
      setSettings(map)
    }).finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }))

  async function handleSave() {
    setSaving(true)
    try {
      await api.post('/settings/update', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) { alert('Lưu thất bại.') }
    finally { setSaving(false) }
  }

  const Field = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="form-control" value={settings[k] ?? ''} onChange={e => set(k, e.target.value)} rows={3} placeholder={placeholder} />
      ) : (
        <input className="form-control" type={type} value={settings[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )

  if (loading) return <p style={{ color: 'var(--text-3)' }}>Đang tải...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Cài đặt website</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu cài đặt'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {TABS.map(t => (
          <button key={t.key} className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ maxWidth: '640px' }}>
        {saved && <div className="alert alert-success">Đã lưu cài đặt!</div>}

        {tab === 'general' && (
          <>
            <Field label="Tên website" k="site_name" />
            <Field label="Mô tả website" k="site_description" type="textarea" />
            <Field label="Email" k="site_email" type="email" />
            <Field label="Điện thoại" k="site_phone" placeholder="028 3823 4567" />
            <Field label="Điện thoại 2" k="site_phone_2" />
            <Field label="Địa chỉ" k="site_address" />
            <Field label="Giờ làm việc" k="working_hours" placeholder="Thứ 2–6: 8:00–17:30" />
            <Field label="Số giấy phép UBCKNN" k="license_number" placeholder="XXXX/UBCKNN" />
            <Field label="Tagline footer" k="footer_tagline" type="textarea" />
          </>
        )}

        {tab === 'about' && (
          <>
            <Field label="Nhãn Hero (label)" k="hero_label" placeholder="Tư Vấn Tài Chính Chuyên Nghiệp" />
            <Field label="Tiêu đề Hero" k="hero_title" />
            <Field label="Mô tả Hero" k="hero_subtitle" type="textarea" />
            <Field label="Số năm kinh nghiệm" k="stat_years" placeholder="20+" />
            <Field label="Số khách hàng" k="stat_clients" placeholder="500+" />
            <Field label="Tỷ lệ hài lòng" k="stat_satisfaction" placeholder="98%" />
            <Field label="Số chuyên gia" k="stat_experts" placeholder="15+" />
          </>
        )}

        {tab === 'seo' && (
          <>
            <Field label="Meta Title" k="meta_title" />
            <Field label="Meta Description" k="meta_description" type="textarea" />
            <Field label="Meta Keywords" k="meta_keywords" />
            <Field label="OG Image URL" k="og_image" type="url" />
            <Field label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
          </>
        )}

        {tab === 'social' && (
          <>
            <Field label="Facebook URL" k="social_facebook" type="url" />
            <Field label="YouTube URL" k="social_youtube" type="url" />
            <Field label="Instagram URL" k="social_instagram" type="url" />
            <Field label="LinkedIn URL" k="social_linkedin" type="url" />
            <Field label="Zalo (số điện thoại)" k="social_zalo" placeholder="0912345678" />
          </>
        )}

        {tab === 'footer' && (
          <>
            <Field label="Copyright" k="footer_copyright" placeholder="2025 VietFinance. Bảo lưu mọi quyền." />
            <Field label="Mô tả footer" k="footer_description" type="textarea" />
            <Field label="Disclaimer" k="footer_disclaimer" type="textarea" />
            <div className="form-group">
              <label className="form-label">Hiển thị mạng xã hội</label>
              <select className="form-control" value={settings.footer_show_social ?? '1'} onChange={e => set('footer_show_social', e.target.value)}>
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
              <select className="form-control" value={settings.contact_form_enabled ?? '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                <option value="1">Bật</option>
                <option value="0">Tắt</option>
              </select>
            </div>
            <Field label="Email nhận liên hệ" k="contact_email_receiver" type="email" />
            <Field label="Google Map Embed (iframe HTML)" k="google_map_embed" type="textarea" placeholder="<iframe src='...' ...></iframe>" />
          </>
        )}

        {tab === 'smtp' && (
          <>
            <Field label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
            <Field label="SMTP Port" k="smtp_port" placeholder="587" />
            <Field label="SMTP User" k="smtp_user" type="email" />
            <Field label="SMTP Password" k="smtp_password" type="password" />
            <Field label="Tên người gửi" k="smtp_from_name" />
            <Field label="Email người gửi" k="smtp_from_email" type="email" />
          </>
        )}

        {tab === 'system' && (
          <>
            <div className="form-group">
              <label className="form-label">Chế độ bảo trì</label>
              <select className="form-control" value={settings.maintenance_mode ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                <option value="0">Tắt</option>
                <option value="1">Bật</option>
              </select>
            </div>
            <Field label="Thông báo bảo trì" k="maintenance_message" type="textarea" />
          </>
        )}

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>
    </div>
  )
}
