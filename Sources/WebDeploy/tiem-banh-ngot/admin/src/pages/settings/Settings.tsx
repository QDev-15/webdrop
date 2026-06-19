import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',      label: '🏠 Thông tin chung' },
  { id: 'about',        label: '📖 Giới thiệu' },
  { id: 'order',        label: '🎂 Đặt bánh' },
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
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: 'left', padding: '9px 14px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                  background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
                  fontFamily: 'var(--sans)', transition: 'all .15s',
                }}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {msg && (
            <div className={`alert alert-${msg.type}`} style={{ marginBottom: 16 }}>{msg.text}</div>
          )}
          <form onSubmit={handleSave}>
            <div className="card">

              {activeTab === 'general' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Thông tin chung</div>
                  <div className="form-group">
                    <label className="form-label">Tên tiệm bánh</label>
                    <input type="text" className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} placeholder="La Douceur Patisserie" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả ngắn</label>
                    <textarea className="form-control" rows={2} value={s.site_description ?? ''} onChange={e => set('site_description', e.target.value)} placeholder="Tiệm bánh thủ công cao cấp..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={s.site_email ?? ''} onChange={e => set('site_email', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Điện thoại</label>
                      <input type="text" className="form-control" value={s.site_phone ?? ''} onChange={e => set('site_phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Địa chỉ tiệm</label>
                    <input type="text" className="form-control" value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giờ mở cửa</label>
                    <input type="text" className="form-control" value={s.working_hours ?? ''} onChange={e => set('working_hours', e.target.value)} placeholder="Thứ 2–6: 8:00–21:00 | Thứ 7: 7:30–21:30" />
                  </div>
                  <div className="form-group">
                    <ImageField label="Logo" value={s.site_logo ?? ''} onChange={v => set('site_logo', v)} />
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Section Giới thiệu</div>
                  <div className="form-group">
                    <label className="form-label">Tiêu đề</label>
                    <input type="text" className="form-control" value={s.about_title ?? ''} onChange={e => set('about_title', e.target.value)} placeholder="Làm từ tình yêu & niềm đam mê" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tagline</label>
                    <input type="text" className="form-control" value={s.about_tagline ?? ''} onChange={e => set('about_tagline', e.target.value)} placeholder="Tiệm bánh thủ công từ 2018" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nội dung</label>
                    <textarea className="form-control" rows={5} value={s.about_content ?? ''} onChange={e => set('about_content', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Số năm kinh nghiệm</label>
                      <input type="text" className="form-control" value={s.about_stat_years ?? ''} onChange={e => set('about_stat_years', e.target.value)} placeholder="6+" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số loại bánh</label>
                      <input type="text" className="form-control" value={s.about_stat_products ?? ''} onChange={e => set('about_stat_products', e.target.value)} placeholder="200+" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Đơn hàng/tháng</label>
                      <input type="text" className="form-control" value={s.about_stat_orders ?? ''} onChange={e => set('about_stat_orders', e.target.value)} placeholder="3K+" />
                    </div>
                  </div>
                  <div className="form-group">
                    <ImageField label="Ảnh giới thiệu" value={s.about_image ?? ''} onChange={v => set('about_image', v)} />
                  </div>
                </div>
              )}

              {activeTab === 'order' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Cài đặt đặt bánh</div>
                  <div className="form-group">
                    <label className="form-label">Bật nhận đơn đặt bánh</label>
                    <select className="form-control" value={s.order_enabled ?? '1'} onChange={e => set('order_enabled', e.target.value)}>
                      <option value="1">Có</option>
                      <option value="0">Không (tạm dừng nhận đơn)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đặt trước tối thiểu (ngày)</label>
                    <input type="number" className="form-control" value={s.order_min_days ?? '3'} onChange={e => set('order_min_days', e.target.value)} min={1} style={{ maxWidth: 120 }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ghi chú đặt bánh</label>
                    <textarea className="form-control" rows={3} value={s.order_note ?? ''} onChange={e => set('order_note', e.target.value)} placeholder="Đặt trước tối thiểu 3–5 ngày..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bán kính giao hàng (km)</label>
                    <input type="number" className="form-control" value={s.delivery_radius ?? '10'} onChange={e => set('delivery_radius', e.target.value)} min={0} style={{ maxWidth: 120 }} />
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>SEO & Meta tags</div>
                  <div className="form-group">
                    <label className="form-label">Tiêu đề trang (meta title)</label>
                    <input type="text" className="form-control" value={s.meta_title ?? ''} onChange={e => set('meta_title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả trang (meta description)</label>
                    <textarea className="form-control" rows={2} value={s.meta_description ?? ''} onChange={e => set('meta_description', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Từ khóa</label>
                    <input type="text" className="form-control" value={s.meta_keywords ?? ''} onChange={e => set('meta_keywords', e.target.value)} placeholder="tiệm bánh, macaron, bánh kem sinh nhật..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Google Analytics ID</label>
                    <input type="text" className="form-control" value={s.google_analytics_id ?? ''} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div className="form-group">
                    <ImageField label="Ảnh OG (chia sẻ mạng xã hội)" value={s.og_image ?? ''} onChange={v => set('og_image', v)} />
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Mạng xã hội</div>
                  {[
                    { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/tiem-banh' },
                    { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/tiem-banh' },
                    { key: 'social_tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@tiem-banh' },
                    { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/' },
                    { key: 'social_zalo', label: 'Zalo (số điện thoại)', placeholder: 'https://zalo.me/0901234567' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input type="text" className="form-control" value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'footer' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Footer</div>
                  <div className="form-group">
                    <label className="form-label">Copyright</label>
                    <input type="text" className="form-control" value={s.footer_copyright ?? ''} onChange={e => set('footer_copyright', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả footer</label>
                    <textarea className="form-control" rows={2} value={s.footer_description ?? ''} onChange={e => set('footer_description', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hiển thị mạng xã hội ở footer</label>
                    <select className="form-control" value={s.footer_show_social ?? '1'} onChange={e => set('footer_show_social', e.target.value)}>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Form liên hệ</div>
                  <div className="form-group">
                    <label className="form-label">Bật form liên hệ</label>
                    <select className="form-control" value={s.contact_form_enabled ?? '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                      <option value="1">Có</option>
                      <option value="0">Không</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email nhận liên hệ</label>
                    <input type="email" className="form-control" value={s.contact_email_receiver ?? ''} onChange={e => set('contact_email_receiver', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Google Maps Embed (iframe src)</label>
                    <textarea className="form-control" rows={3} value={s.google_map_embed ?? ''} onChange={e => set('google_map_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
                  </div>
                </div>
              )}

              {activeTab === 'smtp' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Cấu hình Email SMTP</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">SMTP Host</label>
                      <input type="text" className="form-control" value={s.smtp_host ?? ''} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SMTP Port</label>
                      <input type="number" className="form-control" value={s.smtp_port ?? '587'} onChange={e => set('smtp_port', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tên người gửi</label>
                      <input type="text" className="form-control" value={s.smtp_from_name ?? ''} onChange={e => set('smtp_from_name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email gửi</label>
                      <input type="email" className="form-control" value={s.smtp_from_email ?? ''} onChange={e => set('smtp_from_email', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Username</label>
                      <input type="text" className="form-control" value={s.smtp_user ?? ''} onChange={e => set('smtp_user', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input type="password" className="form-control" value={s.smtp_password ?? ''} onChange={e => set('smtp_password', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Cài đặt hệ thống</div>
                  <div className="form-group">
                    <label className="form-label">Chế độ bảo trì</label>
                    <select className="form-control" value={s.maintenance_mode ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                      <option value="0">Tắt (website hoạt động bình thường)</option>
                      <option value="1">Bật (hiển thị thông báo bảo trì)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thông báo bảo trì</label>
                    <textarea className="form-control" rows={2} value={s.maintenance_message ?? ''} onChange={e => set('maintenance_message', e.target.value)} />
                  </div>
                </div>
              )}

              {activeTab === 'cloudinary' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Cloudinary — Lưu trữ ảnh đám mây</div>
                  <div style={{ padding: '12px 16px', background: 'var(--warm)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
                    Cấu hình Cloudinary để lưu ảnh trên đám mây. Đăng ký miễn phí tại cloudinary.com
                  </div>
                  {[
                    { key: 'cloudinary_cloud_name', label: 'Cloud Name', placeholder: 'your-cloud-name' },
                    { key: 'cloudinary_api_key', label: 'API Key', placeholder: '123456789' },
                    { key: 'cloudinary_api_secret', label: 'API Secret', placeholder: '***' },
                    { key: 'cloudinary_upload_folder', label: 'Upload Folder', placeholder: 'tiem-banh-ngot' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input type="text" className="form-control" value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'integrations' && (
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>API tích hợp bên ngoài</div>
                  <div className="form-group">
                    <label className="form-label">Unsplash Access Key</label>
                    <input type="text" className="form-control" value={s.unsplash_access_key ?? ''} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="Unsplash API key..." />
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Dùng để tìm ảnh từ Unsplash. Đăng ký tại unsplash.com/developers</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, marginTop: 8, borderTop: '1px solid var(--border-light)' }}>
                <button type="submit" className="btn-accent" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
