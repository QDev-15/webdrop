import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, Record<string, string>>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'about', label: 'Giới thiệu' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'contact', label: 'Liên hệ & Bản đồ' },
  { id: 'reservation', label: 'Đặt chỗ' },
  { id: 'smtp', label: 'SMTP Email' },
  { id: 'system', label: 'Hệ thống' },
  { id: 'cloudinary', label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [flat, setFlat] = useState<Record<string, string>>({})

  useEffect(() => {
    api.get<SettingsMap>('/settings').then(data => {
      const f: Record<string, string> = {}
      Object.values(data).forEach(group => {
        Object.entries(group).forEach(([k, v]) => { f[k] = v })
      })
      setFlat(f)
    }).catch(console.error)
  }, [])

  const set = (key: string, value: string) => {
    setFlat(prev => ({ ...prev, [key]: value }))
  }
  const get = (key: string) => flat[key] || ''

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/settings/update', flat)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi lưu')
    } finally { setSaving(false) }
  }

  const input = (key: string, placeholder = '') => (
    <input className="form-control" value={get(key)} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
  )
  const textarea = (key: string, rows = 3, placeholder = '') => (
    <textarea className="form-control" rows={rows} value={get(key)} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
  )
  const toggle = (key: string, label: string) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
      <input type="checkbox" checked={get(key) === '1'} onChange={e => set(key, e.target.checked ? '1' : '0')} />
      {label}
    </label>
  )

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Cài đặt website</div></div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '13px', color: 'var(--accent)' }}>Đã lưu!</span>}
          <button className="btn-accent" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu tất cả'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Tabs */}
        <div style={{ width: '180px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ padding: '9px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontFamily: 'var(--sans)', background: activeTab === t.id ? 'var(--accent-light)' : 'transparent', color: activeTab === t.id ? 'var(--accent)' : 'var(--text-2)', fontWeight: activeTab === t.id ? 600 : 400 }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="card" style={{ flex: 1 }}>
          {activeTab === 'general' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Thông tin chung</h3>
              <div className="form-group"><label className="form-label">Tên quán</label>{input('site_name', 'Cà Phê Thời Gian')}</div>
              <div className="form-group"><label className="form-label">Mô tả ngắn</label>{textarea('site_description', 2)}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Số điện thoại</label>{input('site_phone', '0901 234 567')}</div>
                <div className="form-group"><label className="form-label">Số điện thoại 2</label>{input('site_phone_2')}</div>
              </div>
              <div className="form-group"><label className="form-label">Email</label>{input('site_email', 'hello@caphethogian.vn')}</div>
              <div className="form-group"><label className="form-label">Địa chỉ</label>{input('site_address')}</div>
              <div className="form-group"><label className="form-label">Giờ mở cửa</label>{textarea('working_hours', 2, 'Thứ 2-6: 7:00-22:00 | Thứ 7-CN: 6:30-23:00')}</div>
            </div>
          )}

          {activeTab === 'about' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Giới thiệu về quán</h3>
              <div className="form-group"><label className="form-label">Tagline</label>{input('about_tagline', 'Mỗi tách là một khoảnh khắc')}</div>
              <div className="form-group"><label className="form-label">Tiêu đề section About</label>{input('about_title', 'Hành trình từ hạt đến ly')}</div>
              <div className="form-group"><label className="form-label">Nội dung About</label>{textarea('about_content', 5)}</div>
              <div className="form-group"><label className="form-label">URL ảnh About</label>{input('about_image', 'https://...')}</div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>Thống kê nổi bật</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group"><label className="form-label">Vùng nguyên liệu</label>{input('stat_regions', '3')}</div>
                <div className="form-group"><label className="form-label">Năm rang xay</label>{input('stat_years', '8+')}</div>
                <div className="form-group"><label className="form-label">Ly/ngày</label>{input('stat_cups_day', '200')}</div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>SEO</h3>
              <div className="form-group"><label className="form-label">Meta Title</label>{input('meta_title')}</div>
              <div className="form-group"><label className="form-label">Meta Description</label>{textarea('meta_description', 3)}</div>
              <div className="form-group"><label className="form-label">Meta Keywords</label>{input('meta_keywords')}</div>
              <div className="form-group"><label className="form-label">OG Image URL</label>{input('og_image', 'https://...')}</div>
              <div className="form-group"><label className="form-label">Google Analytics ID</label>{input('google_analytics_id', 'G-XXXXXXXXXX')}</div>
            </div>
          )}

          {activeTab === 'social' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Mạng xã hội</h3>
              {[['Facebook', 'social_facebook', 'https://facebook.com/...'], ['Instagram', 'social_instagram', 'https://instagram.com/...'], ['TikTok', 'social_tiktok', 'https://tiktok.com/@...'], ['YouTube', 'social_youtube', 'https://youtube.com/...'], ['Zalo (số điện thoại)', 'social_zalo', '0901234567']].map(([label, key, ph]) => (
                <div key={key} className="form-group"><label className="form-label">{label}</label>{input(key, ph)}</div>
              ))}
            </div>
          )}

          {activeTab === 'footer' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Footer</h3>
              <div className="form-group"><label className="form-label">Copyright</label>{input('footer_copyright', `© ${new Date().getFullYear()} Cà Phê Thời Gian`)}</div>
              <div className="form-group"><label className="form-label">Mô tả footer</label>{textarea('footer_description', 2)}</div>
              <div>{toggle('footer_show_social', 'Hiển thị social links trong footer')}</div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Liên hệ & Bản đồ</h3>
              <div>{toggle('contact_form_enabled', 'Bật form liên hệ')}</div>
              <div className="form-group"><label className="form-label">Email nhận liên hệ</label>{input('contact_email_receiver')}</div>
              <div className="form-group"><label className="form-label">Google Maps Embed HTML</label>{textarea('google_map_embed', 5, '<iframe src="https://www.google.com/maps/embed?..." ...')}</div>
            </div>
          )}

          {activeTab === 'reservation' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Cài đặt đặt chỗ</h3>
              <div>{toggle('reservation_enabled', 'Bật tính năng đặt chỗ')}</div>
              <div className="form-group"><label className="form-label">Ghi chú đặt chỗ (hiển thị cho khách)</label>{textarea('reservation_note', 3, 'Phản hồi trong vòng 15 phút...')}</div>
              <div className="form-group"><label className="form-label">Giữ bàn bao nhiêu phút sau giờ đặt</label>{input('reservation_hold_minutes', '20')}</div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>SMTP Email</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label className="form-label">SMTP Host</label>{input('smtp_host', 'smtp.gmail.com')}</div>
                <div className="form-group"><label className="form-label">SMTP Port</label>{input('smtp_port', '587')}</div>
                <div className="form-group"><label className="form-label">Username</label>{input('smtp_user')}</div>
                <div className="form-group"><label className="form-label">Password</label><input className="form-control" type="password" value={get('smtp_password')} onChange={e => set('smtp_password', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Tên người gửi</label>{input('smtp_from_name')}</div>
                <div className="form-group"><label className="form-label">Email người gửi</label>{input('smtp_from_email')}</div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Hệ thống</h3>
              <div>{toggle('maintenance_mode', 'Bật chế độ bảo trì (website sẽ không truy cập được)')}</div>
              <div className="form-group"><label className="form-label">Thông báo bảo trì</label>{textarea('maintenance_message', 2, 'Website đang bảo trì...')}</div>
            </div>
          )}

          {activeTab === 'cloudinary' && (
            <div className="row g-3">
              <div className="col-12"><h6 className="fw-semibold mb-3">☁️ Cloudinary — Lưu trữ ảnh</h6></div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Cloud Name</label>
                {input('cloudinary_cloud_name', 'your-cloud-name')}
                <div className="form-text">Lấy tại cloudinary.com → Dashboard → Cloud Name</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">API Key</label>
                {input('cloudinary_api_key', '123456789012345')}
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">API Secret</label>
                {input('cloudinary_api_secret', '••••••••••••••••••••••••')}
                <div className="form-text">Dashboard → Settings → Access Keys → API Secret</div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Upload Folder (tuỳ chọn)</label>
                {input('cloudinary_folder', 'webdrop')}
                <div className="form-text">Thư mục lưu ảnh trên Cloudinary. Mặc định: webdrop</div>
              </div>
            </div>
          )}
          {activeTab === 'integrations' && (
            <div className="row g-3">
              <div className="col-12"><h6 className="fw-semibold mb-3">🔌 Tích hợp bên ngoài</h6></div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Unsplash Access Key</label>
                {input('unsplash_access_key', 'Dán Access Key từ unsplash.com/developers')}
                <div className="form-text">Đăng ký miễn phí tại unsplash.com/developers → New Application → copy Access Key. Dùng để tìm kiếm ảnh trong admin.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
