import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',     label: 'Thông tin chung' },
  { id: 'about',       label: 'Giới thiệu' },
  { id: 'reservation', label: 'Đặt bàn' },
  { id: 'seo',         label: 'SEO' },
  { id: 'social',      label: 'Mạng xã hội' },
  { id: 'footer',      label: 'Footer' },
  { id: 'contact',     label: 'Liên hệ' },
  { id: 'smtp',        label: 'Email (SMTP)' },
  { id: 'system',      label: 'Nâng cao' },
  { id: 'cloudinary',  label: 'Cloudinary' },
  { id: 'integrations',label: 'Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/settings/update', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  const s = settings

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Cài đặt</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Cấu hình toàn bộ nội dung website</p>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Tab sidebar */}
        <div style={{ width: 180, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{ textAlign: 'left', padding: '9px 14px', borderRadius: 8, border: 'none', background: tab === t.id ? 'var(--accent-light)' : 'transparent', color: tab === t.id ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 600 : 400 }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSave}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
              {tab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Thông tin chung</div>
                  <div><label className="form-label">Tên website *</label><input className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} placeholder="Nhà Hàng Ẩm Thực" /></div>
                  <div><label className="form-label">Tagline</label><input className="form-control" value={s.site_tagline ?? ''} onChange={e => set('site_tagline', e.target.value)} placeholder="Ẩm thực Việt Nam truyền thống" /></div>
                  <div><label className="form-label">Mô tả ngắn</label><textarea className="form-control" rows={3} value={s.site_description ?? ''} onChange={e => set('site_description', e.target.value)} /></div>
                  <ImageField label="Logo" value={s.site_logo ?? ''} onChange={v => set('site_logo', v)} placeholder="URL logo" />
                  <ImageField label="Favicon" value={s.site_favicon ?? ''} onChange={v => set('site_favicon', v)} placeholder="URL favicon" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label className="form-label">Email</label><input type="email" className="form-control" value={s.site_email ?? ''} onChange={e => set('site_email', e.target.value)} /></div>
                    <div><label className="form-label">Điện thoại 1</label><input className="form-control" value={s.site_phone ?? ''} onChange={e => set('site_phone', e.target.value)} /></div>
                    <div><label className="form-label">Điện thoại 2</label><input className="form-control" value={s.site_phone_2 ?? ''} onChange={e => set('site_phone_2', e.target.value)} /></div>
                  </div>
                  <div><label className="form-label">Địa chỉ</label><input className="form-control" value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} /></div>
                  <div><label className="form-label">Giờ làm việc</label><input className="form-control" value={s.working_hours ?? ''} onChange={e => set('working_hours', e.target.value)} placeholder="Trưa: 10:00 – 14:00 | Tối: 17:30 – 22:00" /></div>
                </div>
              )}

              {tab === 'about' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Giới thiệu nhà hàng</div>
                  <div><label className="form-label">Tiêu đề phần Giới thiệu</label><input className="form-control" value={s.about_title ?? ''} onChange={e => set('about_title', e.target.value)} /></div>
                  <div><label className="form-label">Nội dung</label><textarea className="form-control" rows={5} value={s.about_content ?? ''} onChange={e => set('about_content', e.target.value)} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label className="form-label">Số năm kinh nghiệm</label><input className="form-control" value={s.about_years ?? ''} onChange={e => set('about_years', e.target.value)} placeholder="15+" /></div>
                    <div><label className="form-label">Số món ăn</label><input className="form-control" value={s.about_dishes ?? ''} onChange={e => set('about_dishes', e.target.value)} placeholder="60+" /></div>
                    <div><label className="form-label">Số đánh giá</label><input className="form-control" value={s.about_reviews ?? ''} onChange={e => set('about_reviews', e.target.value)} placeholder="380+" /></div>
                  </div>
                  <ImageField label="Ảnh giới thiệu 1" value={s.about_image_1 ?? ''} onChange={v => set('about_image_1', v)} />
                  <ImageField label="Ảnh giới thiệu 2" value={s.about_image_2 ?? ''} onChange={v => set('about_image_2', v)} />
                  <ImageField label="Ảnh giới thiệu 3" value={s.about_image_3 ?? ''} onChange={v => set('about_image_3', v)} />
                </div>
              )}

              {tab === 'reservation' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Cài đặt đặt bàn</div>
                  <div>
                    <label className="form-label">Bật tính năng đặt bàn</label>
                    <select className="form-control" value={s.reservation_enabled ?? '1'} onChange={e => set('reservation_enabled', e.target.value)}>
                      <option value="1">Bật</option>
                      <option value="0">Tắt</option>
                    </select>
                  </div>
                  <div><label className="form-label">Ghi chú xác nhận</label><input className="form-control" value={s.reservation_confirm_note ?? ''} onChange={e => set('reservation_confirm_note', e.target.value)} placeholder="Xác nhận qua điện thoại trong 30 phút..." /></div>
                  <div><label className="form-label">Thông tin bãi đỗ xe</label><input className="form-control" value={s.parking_info ?? ''} onChange={e => set('parking_info', e.target.value)} placeholder="Miễn phí · 50 chỗ · Có bảo vệ" /></div>
                </div>
              )}

              {tab === 'seo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Tối ưu SEO</div>
                  <div><label className="form-label">Meta Title</label><input className="form-control" value={s.meta_title ?? ''} onChange={e => set('meta_title', e.target.value)} /></div>
                  <div><label className="form-label">Meta Description</label><textarea className="form-control" rows={3} value={s.meta_description ?? ''} onChange={e => set('meta_description', e.target.value)} /></div>
                  <div><label className="form-label">Từ khóa</label><input className="form-control" value={s.meta_keywords ?? ''} onChange={e => set('meta_keywords', e.target.value)} /></div>
                  <ImageField label="OG Image (ảnh chia sẻ)" value={s.og_image ?? ''} onChange={v => set('og_image', v)} />
                  <div><label className="form-label">Google Analytics ID</label><input className="form-control" value={s.google_analytics_id ?? ''} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
                </div>
              )}

              {tab === 'social' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Mạng xã hội</div>
                  {[
                    { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
                    { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                    { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
                    { key: 'social_tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
                    { key: 'social_zalo', label: 'Zalo', placeholder: 'https://zalo.me/...' },
                  ].map(f => (
                    <div key={f.key}><label className="form-label">{f.label}</label><input className="form-control" value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} /></div>
                  ))}
                </div>
              )}

              {tab === 'footer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Footer</div>
                  <div><label className="form-label">Copyright</label><input className="form-control" value={s.footer_copyright ?? ''} onChange={e => set('footer_copyright', e.target.value)} placeholder="© 2026 Nhà Hàng Ẩm Thực" /></div>
                  <div><label className="form-label">Mô tả footer</label><textarea className="form-control" rows={2} value={s.footer_description ?? ''} onChange={e => set('footer_description', e.target.value)} /></div>
                  <div>
                    <label className="form-label">Hiển thị mạng xã hội</label>
                    <select className="form-control" value={s.footer_show_social ?? '1'} onChange={e => set('footer_show_social', e.target.value)}>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                  </div>
                </div>
              )}

              {tab === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Form liên hệ</div>
                  <div>
                    <label className="form-label">Bật form liên hệ</label>
                    <select className="form-control" value={s.contact_form_enabled ?? '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                      <option value="1">Bật</option>
                      <option value="0">Tắt</option>
                    </select>
                  </div>
                  <div><label className="form-label">Email nhận liên hệ</label><input type="email" className="form-control" value={s.contact_email_receiver ?? ''} onChange={e => set('contact_email_receiver', e.target.value)} /></div>
                  <div><label className="form-label">Google Map Embed URL</label><textarea className="form-control" rows={3} value={s.google_map_embed ?? ''} onChange={e => set('google_map_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." /></div>
                </div>
              )}

              {tab === 'smtp' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Cài đặt Email (SMTP)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label className="form-label">SMTP Host</label><input className="form-control" value={s.smtp_host ?? ''} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" /></div>
                    <div><label className="form-label">SMTP Port</label><input className="form-control" value={s.smtp_port ?? ''} onChange={e => set('smtp_port', e.target.value)} placeholder="587" /></div>
                    <div><label className="form-label">Username</label><input className="form-control" value={s.smtp_user ?? ''} onChange={e => set('smtp_user', e.target.value)} /></div>
                    <div><label className="form-label">Password</label><input type="password" className="form-control" value={s.smtp_password ?? ''} onChange={e => set('smtp_password', e.target.value)} /></div>
                    <div><label className="form-label">Tên người gửi</label><input className="form-control" value={s.smtp_from_name ?? ''} onChange={e => set('smtp_from_name', e.target.value)} /></div>
                    <div><label className="form-label">Email người gửi</label><input type="email" className="form-control" value={s.smtp_from_email ?? ''} onChange={e => set('smtp_from_email', e.target.value)} /></div>
                  </div>
                </div>
              )}

              {tab === 'system' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Nâng cao</div>
                  <div>
                    <label className="form-label">Chế độ bảo trì</label>
                    <select className="form-control" value={s.maintenance_mode ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                      <option value="0">Tắt (website hoạt động bình thường)</option>
                      <option value="1">Bật (hiện thông báo bảo trì)</option>
                    </select>
                  </div>
                  <div><label className="form-label">Thông báo bảo trì</label><textarea className="form-control" rows={3} value={s.maintenance_message ?? ''} onChange={e => set('maintenance_message', e.target.value)} /></div>
                </div>
              )}

              {tab === 'cloudinary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Cloudinary — Lưu trữ ảnh đám mây</div>
                  <div style={{ padding: 12, background: 'var(--warm)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)' }}>
                    Đăng ký tài khoản miễn phí tại <a href="https://cloudinary.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>cloudinary.com</a>. Sau khi có API keys, điền vào bên dưới.
                  </div>
                  <div><label className="form-label">Cloud Name</label><input className="form-control" value={s.cloudinary_cloud_name ?? ''} onChange={e => set('cloudinary_cloud_name', e.target.value)} placeholder="my-cloud-name" /></div>
                  <div><label className="form-label">API Key</label><input className="form-control" value={s.cloudinary_api_key ?? ''} onChange={e => set('cloudinary_api_key', e.target.value)} /></div>
                  <div><label className="form-label">API Secret</label><input type="password" className="form-control" value={s.cloudinary_api_secret ?? ''} onChange={e => set('cloudinary_api_secret', e.target.value)} /></div>
                  <div><label className="form-label">Upload Folder</label><input className="form-control" value={s.cloudinary_upload_folder ?? ''} onChange={e => set('cloudinary_upload_folder', e.target.value)} placeholder="am-thuc" /></div>
                </div>
              )}

              {tab === 'integrations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Tích hợp bên thứ ba</div>
                  <div>
                    <label className="form-label">Unsplash Access Key</label>
                    <input className="form-control" value={s.unsplash_access_key ?? ''} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="Nhập Unsplash Access Key" />
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Tìm ảnh miễn phí từ Unsplash. Đăng ký API tại <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a></div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
              {saved && <span style={{ fontSize: 13, color: 'var(--accent)' }}>Đã lưu thành công!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
