import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import ImageField from '../../components/ImageField'
import { api } from '../../api/client'

interface SettingsData {
  [key: string]: string
}

type TabId = 'general' | 'seo' | 'social' | 'footer' | 'contact' | 'smtp' | 'about' | 'stats' | 'system' | 'cloudinary' | 'integrations'

const TABS: { id: TabId; label: string }[] = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'smtp',         label: 'SMTP Email' },
  { id: 'about',        label: 'Hero & About' },
  { id: 'stats',        label: 'Thống kê' },
  { id: 'system',       label: 'Hệ thống' },
  { id: 'cloudinary',   label: 'Cloudinary' },
  { id: 'integrations', label: 'Tích hợp' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [data, setData]           = useState<SettingsData>({})
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState('')

  useEffect(() => {
    api.get<{ [group: string]: SettingsData }>('/settings')
      .then(groups => {
        const flat: SettingsData = {}
        Object.values(groups).forEach(g => Object.assign(flat, g))
        setData(flat)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: string) => setData(d => ({ ...d, [key]: val }))

  const handleSave = async () => {
    setSaving(true); setMsg('')
    try {
      await api.post('/settings/update', data)
      setMsg('Đã lưu cài đặt!')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <AdminLayout title="Cài đặt"><div className="empty-state"><div className="empty-state-icon">⏳</div></div></AdminLayout>

  return (
    <AdminLayout title="Cài đặt">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cài đặt</h1>
          <p className="page-sub">Quản lý cấu hình website</p>
        </div>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>

      {msg && <div className={`alert ${msg.includes('thất bại') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 13, fontFamily: 'var(--sans)',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-1px', whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Thông tin chung</h3>
            <div className="form-group"><label className="form-label">Tên website</label><input className="form-control" value={data.site_name || ''} onChange={e => set('site_name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Mô tả website</label><textarea className="form-control" value={data.site_description || ''} onChange={e => set('site_description', e.target.value)} rows={3} /></div>
            <div className="form-group"><ImageField label="Logo" value={data.site_logo || ''} onChange={v => set('site_logo', v)} /></div>
            <div className="form-group"><ImageField label="Favicon" value={data.site_favicon || ''} onChange={v => set('site_favicon', v)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" value={data.site_email || ''} onChange={e => set('site_email', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Điện thoại</label><input className="form-control" value={data.site_phone || ''} onChange={e => set('site_phone', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="form-label">Địa chỉ</label><input className="form-control" value={data.site_address || ''} onChange={e => set('site_address', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Giờ làm việc</label><input className="form-control" value={data.working_hours || ''} onChange={e => set('working_hours', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>SEO</h3>
            <div className="form-group"><label className="form-label">Meta Title</label><input className="form-control" value={data.meta_title || ''} onChange={e => set('meta_title', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-control" value={data.meta_description || ''} onChange={e => set('meta_description', e.target.value)} rows={3} /></div>
            <div className="form-group"><label className="form-label">Meta Keywords</label><input className="form-control" value={data.meta_keywords || ''} onChange={e => set('meta_keywords', e.target.value)} /></div>
            <div className="form-group"><ImageField label="OG Image" value={data.og_image || ''} onChange={v => set('og_image', v)} /></div>
            <div className="form-group"><label className="form-label">Google Analytics ID</label><input className="form-control" value={data.google_analytics_id || ''} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Mạng xã hội</h3>
            {[
              { key: 'social_facebook',  label: 'Facebook URL' },
              { key: 'social_instagram', label: 'Instagram URL' },
              { key: 'social_behance',   label: 'Behance URL' },
              { key: 'social_linkedin',  label: 'LinkedIn URL' },
              { key: 'social_youtube',   label: 'YouTube URL' },
              { key: 'social_tiktok',    label: 'TikTok URL' },
              { key: 'social_zalo',      label: 'Số Zalo' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input className="form-control" value={data[f.key] || ''} onChange={e => set(f.key, e.target.value)} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'footer' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Footer</h3>
            <div className="form-group"><label className="form-label">Copyright</label><input className="form-control" value={data.footer_copyright || ''} onChange={e => set('footer_copyright', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Mô tả footer</label><textarea className="form-control" value={data.footer_description || ''} onChange={e => set('footer_description', e.target.value)} rows={3} /></div>
            <div className="form-group">
              <label className="form-label">Hiển thị mạng xã hội</label>
              <select className="form-control" value={data.footer_show_social || '1'} onChange={e => set('footer_show_social', e.target.value)}>
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Liên hệ</h3>
            <div className="form-group">
              <label className="form-label">Bật form liên hệ</label>
              <select className="form-control" value={data.contact_form_enabled || '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Email nhận liên hệ</label><input className="form-control" type="email" value={data.contact_email_receiver || ''} onChange={e => set('contact_email_receiver', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Google Map Embed</label><textarea className="form-control" value={data.google_map_embed || ''} onChange={e => set('google_map_embed', e.target.value)} rows={4} placeholder='<iframe src="https://maps.google.com/..." />' /></div>
          </div>
        )}

        {activeTab === 'smtp' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>SMTP Email</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 16 }}>
              <div className="form-group"><label className="form-label">SMTP Host</label><input className="form-control" value={data.smtp_host || ''} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" /></div>
              <div className="form-group"><label className="form-label">Port</label><input className="form-control" value={data.smtp_port || '587'} onChange={e => set('smtp_port', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Username</label><input className="form-control" value={data.smtp_user || ''} onChange={e => set('smtp_user', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-control" type="password" value={data.smtp_password || ''} onChange={e => set('smtp_password', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">From Name</label><input className="form-control" value={data.smtp_from_name || ''} onChange={e => set('smtp_from_name', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">From Email</label><input className="form-control" type="email" value={data.smtp_from_email || ''} onChange={e => set('smtp_from_email', e.target.value)} /></div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Hero & About</h3>
            <div className="form-group"><label className="form-label">Hero Tagline (dòng trên)</label><input className="form-control" value={data.hero_tagline || ''} onChange={e => set('hero_tagline', e.target.value)} placeholder="Agency Sáng Tạo · TP.HCM · Est. 2016" /></div>
            <div className="form-group"><label className="form-label">Hero Year (dòng trên phải)</label><input className="form-control" value={data.hero_year || ''} onChange={e => set('hero_year', e.target.value)} placeholder="Branding · Design · Digital" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">Hero Dòng 1</label><input className="form-control" value={data.hero_line1 || ''} onChange={e => set('hero_line1', e.target.value)} placeholder="WE BUILD" /></div>
              <div className="form-group"><label className="form-label">Hero Dòng 2 (outline)</label><input className="form-control" value={data.hero_line2 || ''} onChange={e => set('hero_line2', e.target.value)} placeholder="BRANDS" /></div>
              <div className="form-group"><label className="form-label">Hero Dòng 3 (accent)</label><input className="form-control" value={data.hero_line3 || ''} onChange={e => set('hero_line3', e.target.value)} placeholder="& STORIES" /></div>
            </div>
            <div className="form-group"><label className="form-label">About / Giới thiệu</label><textarea className="form-control" value={data.about_content || ''} onChange={e => set('about_content', e.target.value)} rows={4} /></div>
            <div className="form-group"><ImageField label="Ảnh Team Hero" value={data.about_image || ''} onChange={v => set('about_image', v)} /></div>
            <div className="form-group"><label className="form-label">Team Hero Title</label><input className="form-control" value={data.team_hero_title || ''} onChange={e => set('team_hero_title', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Team Hero Sub</label><input className="form-control" value={data.team_hero_sub || ''} onChange={e => set('team_hero_sub', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Chỉ số thống kê</h3>
            <div className="form-group"><label className="form-label">Số dự án (ví dụ: 120+)</label><input className="form-control" value={data.stat_projects || ''} onChange={e => set('stat_projects', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Số khách hàng (ví dụ: 80+)</label><input className="form-control" value={data.stat_clients || ''} onChange={e => set('stat_clients', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Số giải thưởng (ví dụ: 15)</label><input className="form-control" value={data.stat_awards || ''} onChange={e => set('stat_awards', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Năm kinh nghiệm (ví dụ: 8)</label><input className="form-control" value={data.stat_years || ''} onChange={e => set('stat_years', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'system' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Hệ thống</h3>
            <div className="form-group">
              <label className="form-label">Chế độ bảo trì</label>
              <select className="form-control" value={data.maintenance_mode || '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                <option value="0">Tắt</option>
                <option value="1">Bật</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Thông báo bảo trì</label><textarea className="form-control" value={data.maintenance_message || ''} onChange={e => set('maintenance_message', e.target.value)} rows={3} /></div>
          </div>
        )}

        {activeTab === 'cloudinary' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Cloudinary</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>Cấu hình Cloudinary để lưu trữ ảnh trên cloud. Để trống sẽ dùng upload local.</p>
            <div className="form-group"><label className="form-label">Cloud Name</label><input className="form-control" value={data.cloudinary_cloud_name || ''} onChange={e => set('cloudinary_cloud_name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">API Key</label><input className="form-control" value={data.cloudinary_api_key || ''} onChange={e => set('cloudinary_api_key', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">API Secret</label><input className="form-control" type="password" value={data.cloudinary_api_secret || ''} onChange={e => set('cloudinary_api_secret', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Upload Folder</label><input className="form-control" value={data.cloudinary_folder || 'agency-sang-tao'} onChange={e => set('cloudinary_folder', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Tích hợp</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>Cấu hình API keys cho các tích hợp bên ngoài.</p>
            <div className="form-group">
              <label className="form-label">Unsplash Access Key</label>
              <input className="form-control" value={data.unsplash_access_key || ''} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="Lấy tại unsplash.com/oauth/applications" />
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Dùng để tìm kiếm ảnh miễn phí trong ImageField. Tạo tài khoản tại <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer">unsplash.com/developers</a>.</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 d-flex gap-2">
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu tất cả cài đặt'}
        </button>
      </div>
    </AdminLayout>
  )
}
