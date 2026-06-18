import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',      label: '🏠 Thông tin chung' },
  { id: 'about',        label: '📖 Giới thiệu' },
  { id: 'reservation',  label: '📅 Đặt bàn' },
  { id: 'seo',          label: '🔍 SEO' },
  { id: 'social',       label: '📱 Mạng xã hội' },
  { id: 'footer',       label: '🦶 Footer' },
  { id: 'contact',      label: '📍 Liên hệ' },
  { id: 'smtp',         label: '📧 Email SMTP' },
  { id: 'system',       label: '🔧 Hệ thống' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      await api.post('/settings/update', settings)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công!' })
    } catch {
      setMsg({ type: 'error', text: 'Lưu thất bại. Vui lòng thử lại.' })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const s = settings

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt website</div>
          <div className="page-sub">Quản lý toàn bộ nội dung và cấu hình</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Tab list */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: 'left', padding: '9px 14px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                  background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
                  fontFamily: 'var(--sans)',
                  transition: 'all .15s',
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {msg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, background: msg.type === 'success' ? 'var(--accent-light)' : '#fff0f0', color: msg.type === 'success' ? 'var(--accent)' : 'var(--danger)', border: `1px solid ${msg.type === 'success' ? 'var(--accent-light)' : '#fdd'}` }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="card">

              {/* Thông tin chung */}
              {activeTab === 'general' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Tên website</label>
                    <input type="text" className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả ngắn</label>
                    <textarea className="form-control" value={s.site_description ?? ''} onChange={e => set('site_description', e.target.value)} rows={3} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={s.site_email ?? ''} onChange={e => set('site_email', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <input type="text" className="form-control" value={s.site_phone ?? ''} onChange={e => set('site_phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Điện thoại 2</label>
                      <input type="text" className="form-control" value={s.site_phone_2 ?? ''} onChange={e => set('site_phone_2', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Địa chỉ</label>
                    <input type="text" className="form-control" value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giờ mở cửa</label>
                    <input type="text" className="form-control" value={s.working_hours ?? ''} onChange={e => set('working_hours', e.target.value)} placeholder="Ví dụ: 10:00 – 22:00 hàng ngày" />
                  </div>
                  <div className="form-group">
                    <ImageField label="Logo website" value={s.site_logo ?? ''} onChange={v => set('site_logo', v)} />
                  </div>
                </div>
              )}

              {/* Giới thiệu */}
              {activeTab === 'about' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Tagline (dòng chữ nhỏ bên hero)</label>
                    <input type="text" className="form-control" value={s.about_tagline ?? ''} onChange={e => set('about_tagline', e.target.value)} placeholder="Ví dụ: Nhà hàng ẩm thực truyền thống từ 2004" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tiêu đề phần Câu chuyện</label>
                    <input type="text" className="form-control" value={s.about_title ?? ''} onChange={e => set('about_title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nội dung giới thiệu</label>
                    <textarea className="form-control" value={s.about_content ?? ''} onChange={e => set('about_content', e.target.value)} rows={6} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Số năm kinh nghiệm</label>
                      <input type="text" className="form-control" value={s.about_stat_years ?? ''} onChange={e => set('about_stat_years', e.target.value)} placeholder="20+" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số món ăn</label>
                      <input type="text" className="form-control" value={s.about_stat_dishes ?? ''} onChange={e => set('about_stat_dishes', e.target.value)} placeholder="70+" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số đánh giá 5 sao</label>
                      <input type="text" className="form-control" value={s.about_stat_reviews ?? ''} onChange={e => set('about_stat_reviews', e.target.value)} placeholder="450+" />
                    </div>
                  </div>
                  <div className="form-group">
                    <ImageField label="Ảnh câu chuyện" value={s.about_image ?? ''} onChange={v => set('about_image', v)} />
                  </div>
                </div>
              )}

              {/* Đặt bàn */}
              {activeTab === 'reservation' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Bật chức năng đặt bàn</label>
                    <select className="form-control" value={s.reservation_enabled ?? '1'} onChange={e => set('reservation_enabled', e.target.value)}>
                      <option value="1">Bật</option>
                      <option value="0">Tắt</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ghi chú khi đặt bàn</label>
                    <textarea className="form-control" value={s.reservation_note ?? ''} onChange={e => set('reservation_note', e.target.value)} rows={3} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giờ mở cửa (hiển thị trong form đặt bàn)</label>
                    <input type="text" className="form-control" value={s.open_hours_text ?? ''} onChange={e => set('open_hours_text', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thông tin chỗ đỗ xe</label>
                    <input type="text" className="form-control" value={s.parking_info ?? ''} onChange={e => set('parking_info', e.target.value)} />
                  </div>
                </div>
              )}

              {/* SEO */}
              {activeTab === 'seo' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Tiêu đề SEO (meta title)</label>
                    <input type="text" className="form-control" value={s.meta_title ?? ''} onChange={e => set('meta_title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả SEO (meta description)</label>
                    <textarea className="form-control" value={s.meta_description ?? ''} onChange={e => set('meta_description', e.target.value)} rows={3} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Từ khóa (meta keywords)</label>
                    <input type="text" className="form-control" value={s.meta_keywords ?? ''} onChange={e => set('meta_keywords', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Google Analytics ID</label>
                    <input type="text" className="form-control" value={s.google_analytics_id ?? ''} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div className="form-group">
                    <ImageField label="Ảnh OG (dùng khi chia sẻ mạng xã hội)" value={s.og_image ?? ''} onChange={v => set('og_image', v)} />
                  </div>
                </div>
              )}

              {/* Mạng xã hội */}
              {activeTab === 'social' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  {[
                    { key: 'social_facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/...' },
                    { key: 'social_youtube',   label: 'YouTube URL',   placeholder: 'https://youtube.com/...' },
                    { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
                    { key: 'social_tiktok',    label: 'TikTok URL',   placeholder: 'https://tiktok.com/...' },
                    { key: 'social_zalo',      label: 'Zalo URL',     placeholder: 'https://zalo.me/...' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input type="url" className="form-control" value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {activeTab === 'footer' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Bản quyền (copyright)</label>
                    <input type="text" className="form-control" value={s.footer_copyright ?? ''} onChange={e => set('footer_copyright', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả footer</label>
                    <textarea className="form-control" value={s.footer_description ?? ''} onChange={e => set('footer_description', e.target.value)} rows={3} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hiển thị mạng xã hội trong footer</label>
                    <select className="form-control" value={s.footer_show_social ?? '1'} onChange={e => set('footer_show_social', e.target.value)}>
                      <option value="1">Hiển thị</option>
                      <option value="0">Ẩn</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Liên hệ */}
              {activeTab === 'contact' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Bật form liên hệ</label>
                    <select className="form-control" value={s.contact_form_enabled ?? '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                      <option value="1">Bật</option>
                      <option value="0">Tắt</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email nhận thông báo liên hệ</label>
                    <input type="email" className="form-control" value={s.contact_email_receiver ?? ''} onChange={e => set('contact_email_receiver', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Google Maps Embed URL</label>
                    <textarea className="form-control" value={s.google_map_embed ?? ''} onChange={e => set('google_map_embed', e.target.value)} rows={3} placeholder="<iframe src='https://maps.google.com/...'></iframe>" />
                  </div>
                </div>
              )}

              {/* SMTP */}
              {activeTab === 'smtp' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">SMTP Host</label>
                    <input type="text" className="form-control" value={s.smtp_host ?? ''} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SMTP Port</label>
                    <input type="number" className="form-control" value={s.smtp_port ?? ''} onChange={e => set('smtp_port', e.target.value)} placeholder="587" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SMTP Username</label>
                    <input type="text" className="form-control" value={s.smtp_user ?? ''} onChange={e => set('smtp_user', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SMTP Password</label>
                    <input type="password" className="form-control" value={s.smtp_password ?? ''} onChange={e => set('smtp_password', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tên người gửi</label>
                    <input type="text" className="form-control" value={s.smtp_from_name ?? ''} onChange={e => set('smtp_from_name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email người gửi</label>
                    <input type="email" className="form-control" value={s.smtp_from_email ?? ''} onChange={e => set('smtp_from_email', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Hệ thống */}
              {activeTab === 'system' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Chế độ bảo trì</label>
                    <select className="form-control" value={s.maintenance_mode ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                      <option value="0">Tắt — Website hoạt động bình thường</option>
                      <option value="1">Bật — Hiển thị thông báo bảo trì</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thông báo bảo trì</label>
                    <textarea className="form-control" value={s.maintenance_message ?? ''} onChange={e => set('maintenance_message', e.target.value)} rows={3} />
                  </div>
                </div>
              )}

              {/* Cloudinary */}
              {activeTab === 'cloudinary' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ padding: '12px 16px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--accent)' }}>
                    Cloudinary dùng để lưu trữ ảnh trên cloud. Đăng ký miễn phí tại <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>cloudinary.com</a>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cloud Name</label>
                    <input type="text" className="form-control" value={s.cloudinary_cloud_name ?? ''} onChange={e => set('cloudinary_cloud_name', e.target.value)} placeholder="my-cloud-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">API Key</label>
                    <input type="text" className="form-control" value={s.cloudinary_api_key ?? ''} onChange={e => set('cloudinary_api_key', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">API Secret</label>
                    <input type="password" className="form-control" value={s.cloudinary_api_secret ?? ''} onChange={e => set('cloudinary_api_secret', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload Folder</label>
                    <input type="text" className="form-control" value={s.cloudinary_upload_folder ?? ''} onChange={e => set('cloudinary_upload_folder', e.target.value)} placeholder="nha-hang-truyen-thong" />
                  </div>
                </div>
              )}

              {/* Tích hợp */}
              {activeTab === 'integrations' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ padding: '12px 16px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--accent)' }}>
                    Unsplash cho phép tìm và dùng ảnh miễn phí. Đăng ký tại <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>unsplash.com/developers</a>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unsplash Access Key</label>
                    <input type="text" className="form-control" value={s.unsplash_access_key ?? ''} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="Dán Access Key từ Unsplash API vào đây" />
                  </div>
                </div>
              )}

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="submit" className="btn-accent" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
