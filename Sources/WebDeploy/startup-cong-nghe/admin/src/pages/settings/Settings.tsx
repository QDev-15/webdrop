import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, Record<string, string>>

const tabs = [
  { key: 'general',  label: 'Thông tin chung' },
  { key: 'seo',      label: 'SEO' },
  { key: 'social',   label: 'Mạng xã hội' },
  { key: 'about',    label: 'Trang chủ' },
  { key: 'footer',   label: 'Footer' },
  { key: 'contact',  label: 'Liên hệ' },
  { key: 'smtp',     label: 'SMTP Email' },
  { key: 'system',   label: 'Hệ thống' },
  { key: 'cloudinary', label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [data, setData]     = useState<SettingsMap>({})
  const [active, setActive] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SettingsMap>('/settings').then(setData).finally(() => setLoading(false))
  }, [])

  function set(group: string, key: string, value: string) {
    setData(d => ({ ...d, [group]: { ...(d[group] ?? {}), [key]: value } }))
  }

  async function handleSave() {
    setSaving(true)
    const flat: Record<string, string> = {}
    Object.values(data).forEach(group => Object.assign(flat, group))
    try {
      await api.post('/settings', flat)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) { alert(err instanceof Error ? err.message : 'Lỗi lưu cài đặt') }
    finally { setSaving(false) }
  }

  const g = (group: string) => data[group] ?? {}

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Cài đặt</h1><p className="page-sub">Cấu hình nội dung và hệ thống</p></div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu cài đặt'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActive(tab.key)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', borderRadius: 9, border: 'none', background: active === tab.key ? 'var(--accent-light)' : 'transparent', color: active === tab.key ? 'var(--accent)' : 'var(--text-2)', fontFamily: 'var(--sans)', fontSize: 13.5, fontWeight: active === tab.key ? 600 : 400, cursor: 'pointer', marginBottom: 3 }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ flex: 1 }}>
          {active === 'general' && (
            <div>
              <Field label="Tên website" value={g('general').site_name} onChange={v => set('general','site_name',v)} />
              <Field label="Slogan" value={g('general').site_tagline} onChange={v => set('general','site_tagline',v)} />
              <Field label="Mô tả website" value={g('general').site_description} onChange={v => set('general','site_description',v)} textarea />
              <Field label="URL Logo" value={g('general').site_logo} onChange={v => set('general','site_logo',v)} />
              <Field label="Email" value={g('general').site_email} onChange={v => set('general','site_email',v)} />
              <Field label="Điện thoại chính" value={g('general').site_phone} onChange={v => set('general','site_phone',v)} />
              <Field label="Điện thoại phụ" value={g('general').site_phone_2} onChange={v => set('general','site_phone_2',v)} />
              <Field label="Địa chỉ" value={g('general').site_address} onChange={v => set('general','site_address',v)} />
              <Field label="Giờ làm việc" value={g('general').working_hours} onChange={v => set('general','working_hours',v)} textarea />
            </div>
          )}

          {active === 'seo' && (
            <div>
              <Field label="Meta Title" value={g('seo').meta_title} onChange={v => set('seo','meta_title',v)} />
              <Field label="Meta Description" value={g('seo').meta_description} onChange={v => set('seo','meta_description',v)} textarea />
              <Field label="Meta Keywords" value={g('seo').meta_keywords} onChange={v => set('seo','meta_keywords',v)} />
              <Field label="OG Image URL" value={g('seo').og_image} onChange={v => set('seo','og_image',v)} />
              <Field label="Google Analytics ID" value={g('seo').google_analytics_id} onChange={v => set('seo','google_analytics_id',v)} placeholder="G-XXXXXXXXXX" />
            </div>
          )}

          {active === 'social' && (
            <div>
              <Field label="Facebook URL" value={g('social').social_facebook} onChange={v => set('social','social_facebook',v)} />
              <Field label="LinkedIn URL" value={g('social').social_linkedin} onChange={v => set('social','social_linkedin',v)} />
              <Field label="YouTube URL" value={g('social').social_youtube} onChange={v => set('social','social_youtube',v)} />
              <Field label="Twitter / X URL" value={g('social').social_twitter} onChange={v => set('social','social_twitter',v)} />
              <Field label="Zalo (số điện thoại hoặc OA ID)" value={g('social').social_zalo} onChange={v => set('social','social_zalo',v)} />
              <Field label="TikTok URL" value={g('social').social_tiktok} onChange={v => set('social','social_tiktok',v)} />
            </div>
          )}

          {active === 'about' && (
            <div>
              <Field label="Badge trang chủ (ví dụ: Ra mắt v2.0 — Thử nghiệm miễn phí)" value={g('about').hero_badge} onChange={v => set('about','hero_badge',v)} />
              <Field label="Tiêu đề Hero" value={g('about').hero_heading} onChange={v => set('about','hero_heading',v)} />
              <Field label="Mô tả Hero" value={g('about').hero_sub} onChange={v => set('about','hero_sub',v)} textarea />
              <Field label="Stat: Khách hàng" value={g('about').stat_customers} onChange={v => set('about','stat_customers',v)} placeholder="500+" />
              <Field label="Stat: Uptime" value={g('about').stat_uptime} onChange={v => set('about','stat_uptime',v)} placeholder="99.9%" />
              <Field label="Stat: Tích hợp" value={g('about').stat_integrations} onChange={v => set('about','stat_integrations',v)} placeholder="100+" />
              <Field label="Stat: Hỗ trợ" value={g('about').stat_support} onChange={v => set('about','stat_support',v)} placeholder="24/7" />
              <Field label="Khách hàng tin dùng (cách nhau bằng dấu phẩy)" value={g('about').trusted_by} onChange={v => set('about','trusted_by',v)} placeholder="Shopee,Grab,Tiki,MoMo" />
            </div>
          )}

          {active === 'footer' && (
            <div>
              <Field label="Bản quyền footer" value={g('footer').footer_copyright} onChange={v => set('footer','footer_copyright',v)} />
              <Field label="Mô tả footer" value={g('footer').footer_description} onChange={v => set('footer','footer_description',v)} textarea />
              <Field label="Hiện mạng xã hội (1/0)" value={g('footer').footer_show_social} onChange={v => set('footer','footer_show_social',v)} placeholder="1" />
            </div>
          )}

          {active === 'contact' && (
            <div>
              <Field label="Bật form liên hệ (1/0)" value={g('contact').contact_form_enabled} onChange={v => set('contact','contact_form_enabled',v)} />
              <Field label="Email nhận liên hệ" value={g('contact').contact_email_receiver} onChange={v => set('contact','contact_email_receiver',v)} />
              <Field label="Google Map Embed URL" value={g('contact').google_map_embed} onChange={v => set('contact','google_map_embed',v)} textarea />
            </div>
          )}

          {active === 'smtp' && (
            <div>
              <Field label="SMTP Host" value={g('smtp').smtp_host} onChange={v => set('smtp','smtp_host',v)} placeholder="smtp.gmail.com" />
              <Field label="SMTP Port" value={g('smtp').smtp_port} onChange={v => set('smtp','smtp_port',v)} placeholder="587" />
              <Field label="SMTP User (email)" value={g('smtp').smtp_user} onChange={v => set('smtp','smtp_user',v)} />
              <Field label="SMTP Password" value={g('smtp').smtp_password} onChange={v => set('smtp','smtp_password',v)} type="password" />
              <Field label="Tên người gửi" value={g('smtp').smtp_from_name} onChange={v => set('smtp','smtp_from_name',v)} />
              <Field label="Email người gửi" value={g('smtp').smtp_from_email} onChange={v => set('smtp','smtp_from_email',v)} />
            </div>
          )}

          {active === 'system' && (
            <div>
              <Field label="Chế độ bảo trì (1/0)" value={g('system').maintenance_mode} onChange={v => set('system','maintenance_mode',v)} />
              <Field label="Thông báo bảo trì" value={g('system').maintenance_message} onChange={v => set('system','maintenance_message',v)} textarea />
            </div>
          )}

          {active === 'cloudinary' && (
            <div className="row g-3">
              <div className="col-12"><h6 className="fw-semibold mb-3">☁️ Cloudinary — Lưu trữ ảnh</h6></div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Cloud Name</label>
                <Field label="Cloud Name" value={g('cloudinary').cloudinary_cloud_name ?? ''} onChange={v => set('cloudinary','cloudinary_cloud_name',v)} placeholder="your-cloud-name" />
                <div className="form-text">Lấy tại cloudinary.com → Dashboard → Cloud Name</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">API Key</label>
                <Field label="API Key" value={g('cloudinary').cloudinary_api_key ?? ''} onChange={v => set('cloudinary','cloudinary_api_key',v)} placeholder="123456789012345" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">API Secret</label>
                <Field label="API Secret" value={g('cloudinary').cloudinary_api_secret ?? ''} onChange={v => set('cloudinary','cloudinary_api_secret',v)} placeholder="••••••••••••••••••••••••" />
                <div className="form-text">Dashboard → Settings → Access Keys → API Secret</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Upload Folder (tuỳ chọn)</label>
                <Field label="Upload Folder" value={g('cloudinary').cloudinary_folder ?? ''} onChange={v => set('cloudinary','cloudinary_folder',v)} placeholder="webdrop" />
                <div className="form-text">Thư mục lưu ảnh trên Cloudinary. Mặc định: webdrop</div>
              </div>
            </div>
          )}
          {active === 'integrations' && (
            <div className="row g-3">
              <div className="col-12"><h6 className="fw-semibold mb-3">🔌 Tích hợp bên ngoài</h6></div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Unsplash Access Key</label>
                <Field label="Unsplash Access Key" value={g('integrations').unsplash_access_key ?? ''} onChange={v => set('integrations','unsplash_access_key',v)} placeholder="Dán Access Key từ unsplash.com/developers" />
                <div className="form-text">Đăng ký miễn phí tại unsplash.com/developers → New Application → copy Access Key. Dùng để tìm kiếm ảnh trong admin.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, textarea, placeholder, type }: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; placeholder?: string; type?: string
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {textarea
        ? <textarea className="form-control" rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input type={type ?? 'text'} className="form-control" value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  )
}
