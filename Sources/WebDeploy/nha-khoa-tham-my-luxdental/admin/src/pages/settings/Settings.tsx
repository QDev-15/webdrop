import { useEffect, useState, FormEvent } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: '🏢 Thông tin chung' },
  { key: 'seo',          label: '🔍 SEO' },
  { key: 'social',       label: '📱 Mạng xã hội' },
  { key: 'contact',      label: '📞 Liên hệ' },
  { key: 'hero',         label: '🎯 Hero' },
  { key: 'stats',        label: '📊 Thống kê' },
  { key: 'footer',       label: '📄 Footer' },
  { key: 'smtp',         label: '📧 SMTP' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await api.post('/settings/update', settings)
      setMsg('Đã lưu cài đặt thành công!')
    } catch {
      setMsg('Lỗi khi lưu cài đặt.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Cài đặt</h1>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer',
              background: activeTab === t.key ? 'var(--accent)' : 'var(--surface)',
              color: activeTab === t.key ? '#fff' : 'var(--text-2)' }}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={save}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
          {activeTab === 'general' && <>
            <Field label="Tên website" value={settings.site_name ?? ''} onChange={v => set('site_name', v)} />
            <Field label="Tagline" value={settings.site_tagline ?? ''} onChange={v => set('site_tagline', v)} />
            <Field label="Mô tả ngắn" value={settings.site_description ?? ''} onChange={v => set('site_description', v)} textarea />
            <Field label="Ký hiệu logo (1 chữ)" value={settings.logo_mark ?? ''} onChange={v => set('logo_mark', v)} />
            <Field label="Logo sub-text" value={settings.logo_sub ?? ''} onChange={v => set('logo_sub', v)} />
          </>}

          {activeTab === 'seo' && <>
            <Field label="Tiêu đề trang (meta title)" value={settings.meta_title ?? ''} onChange={v => set('meta_title', v)} />
            <Field label="Mô tả trang (meta description)" value={settings.meta_description ?? ''} onChange={v => set('meta_description', v)} textarea />
            <Field label="Từ khóa (meta keywords)" value={settings.meta_keywords ?? ''} onChange={v => set('meta_keywords', v)} />
          </>}

          {activeTab === 'social' && <>
            <Field label="Facebook URL" value={settings.facebook ?? ''} onChange={v => set('facebook', v)} />
            <Field label="Instagram URL" value={settings.instagram ?? ''} onChange={v => set('instagram', v)} />
            <Field label="TikTok URL" value={settings.tiktok ?? ''} onChange={v => set('tiktok', v)} />
            <Field label="Zalo URL" value={settings.zalo ?? ''} onChange={v => set('zalo', v)} />
          </>}

          {activeTab === 'contact' && <>
            <Field label="Số điện thoại" value={settings.site_phone ?? ''} onChange={v => set('site_phone', v)} />
            <Field label="Email" value={settings.site_email ?? ''} onChange={v => set('site_email', v)} />
            <Field label="Địa chỉ" value={settings.site_address ?? ''} onChange={v => set('site_address', v)} />
            <Field label="Giờ làm việc" value={settings.working_hours ?? ''} onChange={v => set('working_hours', v)} />
            <Field label="Google Maps Embed HTML" value={settings.google_maps_embed ?? ''} onChange={v => set('google_maps_embed', v)} textarea />
          </>}

          {activeTab === 'hero' && <>
            <Field label="Badge text" value={settings.hero_badge ?? ''} onChange={v => set('hero_badge', v)} />
            <Field label="Tiêu đề dòng 1" value={settings.hero_title_line1 ?? ''} onChange={v => set('hero_title_line1', v)} />
            <Field label="Tiêu đề dòng 2 (nhấn mạnh)" value={settings.hero_title_line2 ?? ''} onChange={v => set('hero_title_line2', v)} />
            <Field label="Mô tả hero" value={settings.hero_subtitle ?? ''} onChange={v => set('hero_subtitle', v)} textarea />
            <Field label="CTA chính" value={settings.hero_cta_primary ?? ''} onChange={v => set('hero_cta_primary', v)} />
            <Field label="CTA phụ" value={settings.hero_cta_secondary ?? ''} onChange={v => set('hero_cta_secondary', v)} />
          </>}

          {activeTab === 'stats' && <>
            <Field label="Số nụ cười kiến tạo" value={settings.stat_smiles ?? ''} onChange={v => set('stat_smiles', v)} />
            <Field label="Năm kinh nghiệm" value={settings.stat_years ?? ''} onChange={v => set('stat_years', v)} />
            <Field label="Tỷ lệ hài lòng (%)" value={settings.stat_satisfaction ?? ''} onChange={v => set('stat_satisfaction', v)} />
            <Field label="Số bác sĩ chuyên khoa" value={settings.stat_doctors ?? ''} onChange={v => set('stat_doctors', v)} />
          </>}

          {activeTab === 'footer' && <>
            <Field label="Mô tả footer" value={settings.footer_description ?? ''} onChange={v => set('footer_description', v)} textarea />
            <Field label="Copyright text" value={settings.footer_copyright ?? ''} onChange={v => set('footer_copyright', v)} />
            <Field label="Giấy phép CSYT" value={settings.footer_license ?? ''} onChange={v => set('footer_license', v)} />
          </>}

          {activeTab === 'smtp' && <>
            <Field label="SMTP Host" value={settings.smtp_host ?? ''} onChange={v => set('smtp_host', v)} />
            <Field label="SMTP Port" value={settings.smtp_port ?? ''} onChange={v => set('smtp_port', v)} />
            <Field label="SMTP User" value={settings.smtp_user ?? ''} onChange={v => set('smtp_user', v)} />
            <Field label="SMTP Password" value={settings.smtp_pass ?? ''} onChange={v => set('smtp_pass', v)} type="password" />
            <Field label="Tên người gửi" value={settings.smtp_from_name ?? ''} onChange={v => set('smtp_from_name', v)} />
            <Field label="Email người gửi" value={settings.smtp_from_email ?? ''} onChange={v => set('smtp_from_email', v)} />
          </>}

          {activeTab === 'cloudinary' && <>
            <Field label="Cloud Name" value={settings.cloudinary_cloud_name ?? ''} onChange={v => set('cloudinary_cloud_name', v)} />
            <Field label="API Key" value={settings.cloudinary_api_key ?? ''} onChange={v => set('cloudinary_api_key', v)} />
            <Field label="API Secret" value={settings.cloudinary_api_secret ?? ''} onChange={v => set('cloudinary_api_secret', v)} type="password" />
          </>}

          {activeTab === 'integrations' && <>
            <Field label="Unsplash Access Key" value={settings.unsplash_access_key ?? ''} onChange={v => set('unsplash_access_key', v)} />
            <Field label="Google Analytics ID" value={settings.google_analytics_id ?? ''} onChange={v => set('google_analytics_id', v)} />
          </>}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <button type="submit" disabled={saving}
              style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
            {msg && <span style={{ fontSize: 13, color: msg.includes('Lỗi') ? 'var(--danger)' : 'var(--accent)' }}>{msg}</span>}
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, textarea, type }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string
}) {
  const style = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--bg)' }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...style, resize: 'vertical' }} />
        : <input type={type ?? 'text'} value={value} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  )
}
