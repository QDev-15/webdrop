import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsData = Record<string, Record<string, string>>
type FlatData = Record<string, string>

const tabs = [
  { id: 'about', label: 'Về tôi' },
  { id: 'general', label: 'Thông tin chung' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'smtp', label: 'SMTP' },
  { id: 'system', label: 'Nâng cao' },
  { id: 'cloudinary', label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [data, setData] = useState<FlatData>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get<SettingsData>('/settings').then(raw => {
      const flat: FlatData = {}
      for (const group of Object.values(raw)) {
        for (const [k, v] of Object.entries(group)) {
          flat[k] = v ?? ''
        }
      }
      setData(flat)
    }).finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: string) => setData(d => ({ ...d, [key]: val }))

  const handleSave = async () => {
    setSaving(true); setSaved(false)
    try {
      await api.post('/settings/update', data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Cấu hình nội dung và thông tin website</div>
        </div>
        <button onClick={handleSave} className="btn-accent" disabled={saving}>
          {saving ? 'Đang lưu...' : saved ? '✓ Đã lưu' : 'Lưu cài đặt'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 14px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
              background: 'transparent', borderBottom: activeTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === t.id ? 'var(--accent)' : 'var(--text-2)', transition: 'all .15s', fontFamily: 'var(--sans)'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {/* Về tôi */}
        {activeTab === 'about' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Tên đầy đủ</label>
                <input type="text" className="form-control" value={data.about_name ?? ''} onChange={e => set('about_name', e.target.value)} placeholder="Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label className="form-label">Chức danh / Vai trò</label>
                <input type="text" className="form-control" value={data.about_role ?? ''} onChange={e => set('about_role', e.target.value)} placeholder="UI/UX Designer & Developer" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái (hiển thị trên hero)</label>
              <input type="text" className="form-control" value={data.about_status ?? ''} onChange={e => set('about_status', e.target.value)} placeholder="Sẵn sàng nhận dự án mới" />
            </div>
            <div className="form-group">
              <label className="form-label">Giới thiệu bản thân</label>
              <textarea className="form-control" value={data.about_bio ?? ''} onChange={e => set('about_bio', e.target.value)} placeholder="Tôi thiết kế và xây dựng..." />
            </div>
            <div className="form-group">
              <label className="form-label">Giới thiệu thêm</label>
              <textarea className="form-control" value={data.about_bio_2 ?? ''} onChange={e => set('about_bio_2', e.target.value)} placeholder="Khi không ngồi thiết kế..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Số năm kinh nghiệm</label>
                <input type="text" className="form-control" value={data.about_years_exp ?? ''} onChange={e => set('about_years_exp', e.target.value)} placeholder="5" />
              </div>
              <div className="form-group">
                <label className="form-label">Số dự án</label>
                <input type="text" className="form-control" value={data.about_projects_count ?? ''} onChange={e => set('about_projects_count', e.target.value)} placeholder="40+" />
              </div>
              <div className="form-group">
                <label className="form-label">Số khách hàng</label>
                <input type="text" className="form-control" value={data.about_clients_count ?? ''} onChange={e => set('about_clients_count', e.target.value)} placeholder="15+" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Link CV (Google Drive / PDF)</label>
              <input type="url" className="form-control" value={data.about_cv_url ?? ''} onChange={e => set('about_cv_url', e.target.value)} placeholder="https://drive.google.com/..." />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh đại diện (Hero)" value={data.about_avatar ?? ''} onChange={v => set('about_avatar', v)} />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh phần Về tôi" value={data.about_image ?? ''} onChange={v => set('about_image', v)} />
            </div>
          </div>
        )}

        {/* Thông tin chung */}
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên website</label>
              <input type="text" className="form-control" value={data.site_name ?? ''} onChange={e => set('site_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả website</label>
              <textarea className="form-control" value={data.site_description ?? ''} onChange={e => set('site_description', e.target.value)} />
            </div>
            <div className="form-group">
              <ImageField label="Logo" value={data.site_logo ?? ''} onChange={v => set('site_logo', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Email liên hệ</label>
                <input type="email" className="form-control" value={data.site_email ?? ''} onChange={e => set('site_email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input type="text" className="form-control" value={data.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tiêu đề trang (Meta Title)</label>
              <input type="text" className="form-control" value={data.meta_title ?? ''} onChange={e => set('meta_title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả trang (Meta Description)</label>
              <textarea className="form-control" value={data.meta_description ?? ''} onChange={e => set('meta_description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Từ khóa (Meta Keywords)</label>
              <input type="text" className="form-control" value={data.meta_keywords ?? ''} onChange={e => set('meta_keywords', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Google Analytics ID</label>
              <input type="text" className="form-control" value={data.google_analytics_id ?? ''} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh OG (Open Graph)" value={data.og_image ?? ''} onChange={v => set('og_image', v)} />
            </div>
          </div>
        )}

        {/* Mạng xã hội */}
        {activeTab === 'social' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { key: 'social_linkedin', label: 'LinkedIn URL' },
              { key: 'social_github', label: 'GitHub URL' },
              { key: 'social_behance', label: 'Behance URL' },
              { key: 'social_dribbble', label: 'Dribbble URL' },
              { key: 'social_instagram', label: 'Instagram URL' },
              { key: 'social_facebook', label: 'Facebook URL' },
              { key: 'social_youtube', label: 'YouTube URL' },
              { key: 'social_tiktok', label: 'TikTok URL' },
              { key: 'social_zalo', label: 'Zalo (số điện thoại)' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input type="text" className="form-control" value={data[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} placeholder="https://..." />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {activeTab === 'footer' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Bản quyền</label>
              <input type="text" className="form-control" value={data.footer_copyright ?? ''} onChange={e => set('footer_copyright', e.target.value)} placeholder="© 2025 Portfolio Tôi." />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả footer</label>
              <textarea className="form-control" value={data.footer_description ?? ''} onChange={e => set('footer_description', e.target.value)} />
            </div>
          </div>
        )}

        {/* Liên hệ */}
        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email nhận liên hệ</label>
              <input type="email" className="form-control" value={data.contact_email_receiver ?? ''} onChange={e => set('contact_email_receiver', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Google Maps Embed URL</label>
              <input type="text" className="form-control" value={data.google_map_embed ?? ''} onChange={e => set('google_map_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
            </div>
            <div className="form-group">
              <label className="form-label">Bật form liên hệ</label>
              <select className="form-control" value={data.contact_form_enabled ?? '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                <option value="1">Bật</option>
                <option value="0">Tắt</option>
              </select>
            </div>
          </div>
        )}

        {/* SMTP */}
        {activeTab === 'smtp' && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1d4ed8', marginBottom: 8 }}>
              Cấu hình SMTP để gửi email thông báo khi có liên hệ mới.
            </div>
            {[
              { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtp.gmail.com' },
              { key: 'smtp_port', label: 'SMTP Port', placeholder: '587' },
              { key: 'smtp_user', label: 'Tên đăng nhập (Email)', placeholder: 'your@gmail.com' },
              { key: 'smtp_password', label: 'Mật khẩu App', placeholder: 'App Password' },
              { key: 'smtp_from_name', label: 'Tên hiển thị', placeholder: 'Portfolio Tôi' },
              { key: 'smtp_from_email', label: 'Email gửi', placeholder: 'noreply@yourdomain.com' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input
                  type={f.key === 'smtp_password' ? 'password' : 'text'}
                  className="form-control"
                  value={data[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
        )}

        {/* Nâng cao */}
        {activeTab === 'system' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Chế độ bảo trì</label>
              <select className="form-control" value={data.maintenance_mode ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                <option value="0">Tắt (website hoạt động bình thường)</option>
                <option value="1">Bật (hiển thị trang bảo trì)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thông báo bảo trì</label>
              <textarea className="form-control" value={data.maintenance_message ?? ''} onChange={e => set('maintenance_message', e.target.value)} />
            </div>
          </div>
        )}

        {/* Cloudinary */}
        {activeTab === 'cloudinary' && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1d4ed8', marginBottom: 8 }}>
              Cấu hình Cloudinary để lưu trữ ảnh trên cloud. Nếu để trống, ảnh sẽ được lưu trên hosting.
            </div>
            {[
              { key: 'cloudinary_cloud_name', label: 'Cloud Name', placeholder: 'my-cloud' },
              { key: 'cloudinary_api_key', label: 'API Key', placeholder: '123456789' },
              { key: 'cloudinary_api_secret', label: 'API Secret', placeholder: 'xxxxxxxxxxxxxxx' },
              { key: 'cloudinary_folder', label: 'Thư mục upload', placeholder: 'portfolio-toi' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input
                  type={f.key === 'cloudinary_api_secret' ? 'password' : 'text'}
                  className="form-control"
                  value={data[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tích hợp */}
        {activeTab === 'integrations' && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13, color: '#1d4ed8', marginBottom: 8 }}>
              Cấu hình API keys cho các dịch vụ tích hợp.
            </div>
            <div className="form-group">
              <label className="form-label">Unsplash Access Key</label>
              <input
                type="text" className="form-control"
                value={data.unsplash_access_key ?? ''}
                onChange={e => set('unsplash_access_key', e.target.value)}
                placeholder="Lấy tại unsplash.com/oauth/applications"
              />
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Dùng để tìm ảnh Unsplash trong trình chọn ảnh. Đăng ký miễn phí tại unsplash.com/developers</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} className="btn-accent" disabled={saving}>
          {saving ? 'Đang lưu...' : saved ? '✓ Đã lưu' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  )
}
