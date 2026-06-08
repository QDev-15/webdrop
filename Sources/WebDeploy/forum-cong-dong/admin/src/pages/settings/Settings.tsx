import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, Record<string, string>>

const TABS = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'forum',        label: 'Diễn đàn' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'smtp',         label: 'SMTP Email' },
  { id: 'system',       label: 'Nâng cao' },
  { id: 'cloudinary',   label: 'Cloudinary' },
  { id: 'integrations', label: 'Tích hợp' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function get(group: string, key: string) {
    return settings[group]?.[key] ?? ''
  }

  function set(group: string, key: string, val: string) {
    setSettings(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: val }
    }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const flat: Record<string, string> = {}
      for (const group of Object.keys(settings)) {
        for (const key of Object.keys(settings[group])) {
          flat[key] = settings[group][key]
        }
      }
      await api.post('/settings/update', flat)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Cấu hình thông tin và hiển thị website</div>
        </div>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu cài đặt'}
        </button>
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: 16 }}>Cài đặt đã được lưu thành công!</div>}

      <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {/* THÔNG TIN CHUNG */}
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <Field label="Tên website" value={get('general','site_name')} onChange={v => set('general','site_name',v)} />
            <Field label="Mô tả website" value={get('general','site_description')} onChange={v => set('general','site_description',v)} textarea />
            <Field label="Email liên hệ" value={get('general','site_email')} onChange={v => set('general','site_email',v)} type="email" />
            <Field label="Số điện thoại" value={get('general','site_phone')} onChange={v => set('general','site_phone',v)} />
            <Field label="Địa chỉ" value={get('general','site_address')} onChange={v => set('general','site_address',v)} />
            <Field label="URL Logo" value={get('general','site_logo')} onChange={v => set('general','site_logo',v)} placeholder="https://" />
            <Field label="URL Favicon" value={get('general','site_favicon')} onChange={v => set('general','site_favicon',v)} placeholder="https://" />
          </div>
        )}

        {/* DIỄN ĐÀN */}
        {activeTab === 'forum' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <Field label="Tagline diễn đàn" value={get('forum','forum_tagline')} onChange={v => set('forum','forum_tagline',v)} placeholder="Nơi kết nối cộng đồng" />
            <Field label="Mô tả ngắn" value={get('forum','forum_description')} onChange={v => set('forum','forum_description',v)} textarea />
            <Field label="URL trang quy tắc" value={get('forum','forum_rules_url')} onChange={v => set('forum','forum_rules_url',v)} placeholder="https://" />
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Thống kê hiển thị (Hero banner)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="Số thành viên" value={get('forum','forum_stat_members')} onChange={v => set('forum','forum_stat_members',v)} />
                <Field label="Số chủ đề" value={get('forum','forum_stat_threads')} onChange={v => set('forum','forum_stat_threads',v)} />
                <Field label="Số bài viết" value={get('forum','forum_stat_posts')} onChange={v => set('forum','forum_stat_posts',v)} />
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <Field label="Meta Title" value={get('seo','meta_title')} onChange={v => set('seo','meta_title',v)} />
            <Field label="Meta Description" value={get('seo','meta_description')} onChange={v => set('seo','meta_description',v)} textarea />
            <Field label="Keywords" value={get('seo','meta_keywords')} onChange={v => set('seo','meta_keywords',v)} placeholder="từ khóa, cách nhau bởi dấu phẩy" />
            <Field label="OG Image URL" value={get('seo','og_image')} onChange={v => set('seo','og_image',v)} placeholder="https://" />
            <Field label="Google Analytics ID" value={get('seo','google_analytics_id')} onChange={v => set('seo','google_analytics_id',v)} placeholder="G-XXXXXXXXXX" />
          </div>
        )}

        {/* MẠNG XÃ HỘI */}
        {activeTab === 'social' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <Field label="Facebook" value={get('social','social_facebook')} onChange={v => set('social','social_facebook',v)} placeholder="https://facebook.com/..." />
            <Field label="YouTube" value={get('social','social_youtube')} onChange={v => set('social','social_youtube',v)} placeholder="https://youtube.com/..." />
            <Field label="Instagram" value={get('social','social_instagram')} onChange={v => set('social','social_instagram',v)} placeholder="https://instagram.com/..." />
            <Field label="TikTok" value={get('social','social_tiktok')} onChange={v => set('social','social_tiktok',v)} placeholder="https://tiktok.com/..." />
            <Field label="Zalo" value={get('social','social_zalo')} onChange={v => set('social','social_zalo',v)} placeholder="Số điện thoại Zalo" />
          </div>
        )}

        {/* FOOTER */}
        {activeTab === 'footer' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <Field label="Bản quyền" value={get('footer','footer_copyright')} onChange={v => set('footer','footer_copyright',v)} placeholder="© 2025 Tên website..." />
            <Field label="Mô tả footer" value={get('footer','footer_description')} onChange={v => set('footer','footer_description',v)} textarea />
            <div>
              <label className="form-label">Hiển thị mạng xã hội</label>
              <select className="form-control" value={get('footer','footer_show_social')} onChange={e => set('footer','footer_show_social',e.target.value)}>
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
          </div>
        )}

        {/* LIÊN HỆ */}
        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label className="form-label">Bật form liên hệ</label>
              <select className="form-control" value={get('contact','contact_form_enabled')} onChange={e => set('contact','contact_form_enabled',e.target.value)}>
                <option value="1">Bật</option>
                <option value="0">Tắt</option>
              </select>
            </div>
            <Field label="Email nhận liên hệ" type="email" value={get('contact','contact_email_receiver')} onChange={v => set('contact','contact_email_receiver',v)} />
            <Field label="Google Map Embed HTML" value={get('contact','google_map_embed')} onChange={v => set('contact','google_map_embed',v)} textarea placeholder='<iframe src="..." ...></iframe>' />
          </div>
        )}

        {/* SMTP */}
        {activeTab === 'smtp' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
              <Field label="SMTP Host" value={get('smtp','smtp_host')} onChange={v => set('smtp','smtp_host',v)} placeholder="smtp.gmail.com" />
              <div>
                <label className="form-label">Port</label>
                <input className="form-control" style={{ width: 80 }} value={get('smtp','smtp_port')} onChange={e => set('smtp','smtp_port',e.target.value)} />
              </div>
            </div>
            <Field label="SMTP User (Email)" type="email" value={get('smtp','smtp_user')} onChange={v => set('smtp','smtp_user',v)} />
            <Field label="SMTP Password" type="password" value={get('smtp','smtp_password')} onChange={v => set('smtp','smtp_password',v)} />
            <Field label="Tên người gửi" value={get('smtp','smtp_from_name')} onChange={v => set('smtp','smtp_from_name',v)} />
            <Field label="Email người gửi" type="email" value={get('smtp','smtp_from_email')} onChange={v => set('smtp','smtp_from_email',v)} />
          </div>
        )}

        {/* NÂNG CAO */}
        {activeTab === 'system' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label className="form-label">Chế độ bảo trì</label>
              <select className="form-control" value={get('system','maintenance_mode')} onChange={e => set('system','maintenance_mode',e.target.value)}>
                <option value="0">Tắt (Hoạt động bình thường)</option>
                <option value="1">Bật (Đang bảo trì)</option>
              </select>
            </div>
            <Field label="Thông báo bảo trì" value={get('system','maintenance_message')} onChange={v => set('system','maintenance_message',v)} textarea />
          </div>
        )}

        {/* CLOUDINARY */}
        {activeTab === 'cloudinary' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ padding: '12px 14px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--accent)', marginBottom: 8 }}>
              Cấu hình Cloudinary để lưu trữ ảnh trên cloud. Lấy thông tin tại dashboard.cloudinary.com
            </div>
            <Field label="Cloud Name" value={get('cloudinary','cloudinary_cloud_name')} onChange={v => set('cloudinary','cloudinary_cloud_name',v)} placeholder="your-cloud-name" />
            <Field label="API Key" value={get('cloudinary','cloudinary_api_key')} onChange={v => set('cloudinary','cloudinary_api_key',v)} />
            <Field label="API Secret" type="password" value={get('cloudinary','cloudinary_api_secret')} onChange={v => set('cloudinary','cloudinary_api_secret',v)} />
            <Field label="Upload Folder" value={get('cloudinary','cloudinary_folder')} onChange={v => set('cloudinary','cloudinary_folder',v)} placeholder="forum-cong-dong" />
          </div>
        )}

        {/* TÍCH HỢP */}
        {activeTab === 'integrations' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ padding: '12px 14px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--accent)', marginBottom: 8 }}>
              Cấu hình API key của các dịch vụ tích hợp. Unsplash cho phép tìm kiếm ảnh miễn phí.
            </div>
            <Field label="Unsplash Access Key" value={get('integrations','unsplash_access_key')} onChange={v => set('integrations','unsplash_access_key',v)} placeholder="Lấy tại unsplash.com/developers" />
          </div>
        )}
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  type?: string
  placeholder?: string
  textarea?: boolean
}

function Field({ label, value, onChange, type = 'text', placeholder, textarea }: FieldProps) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {textarea ? (
        <textarea
          className="form-control"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          type={type}
          className="form-control"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
