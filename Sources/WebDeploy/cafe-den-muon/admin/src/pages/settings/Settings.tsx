import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',      label: '🏠 Thông tin chung' },
  { id: 'home',         label: '🌙 Trang chủ' },
  { id: 'menu',         label: '☕ Thực đơn' },
  { id: 'about',        label: '📖 Giới thiệu' },
  { id: 'seo',          label: '🔍 SEO' },
  { id: 'social',       label: '📱 Mạng xã hội' },
  { id: 'footer',       label: '📄 Footer' },
  { id: 'contact',      label: '📍 Liên hệ' },
  { id: 'legal',        label: '⚖️ Pháp lý' },
  { id: 'smtp',         label: '📧 SMTP' },
  { id: 'system',       label: '🛠 Hệ thống' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

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
    setSaving(true)
    try {
      await api.post('/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const F = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" value={settings[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
    </div>
  )

  const TA = ({ label, k, rows = 3, placeholder = '', mono = false }: { label: string; k: string; rows?: number; placeholder?: string; mono?: boolean }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-control" rows={rows} value={settings[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} style={mono ? { fontFamily: 'monospace', fontSize: 12.5 } : undefined} />
    </div>
  )

  const Toggle = ({ label, k, help }: { label: string; k: string; help?: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-control" value={settings[k] ?? '0'} onChange={e => set(k, e.target.value)} style={{ maxWidth: 160 }}>
        <option value="1">Bật</option>
        <option value="0">Tắt</option>
      </select>
      {help && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{help}</div>}
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý toàn bộ nội dung và cấu hình website</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Tab nav */}
        <div style={{ width: 210, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: 'left',
                  padding: '9px 14px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: 'var(--sans)',
                  background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <form onSubmit={handleSave} style={{ flex: 1, minWidth: 0 }}>
          <div className="card">
            {saved && (
              <div className="alert" style={{ marginBottom: 20, background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-light)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                Đã lưu cài đặt thành công!
              </div>
            )}

            {activeTab === 'general' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Thông tin chung</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="Tên website" k="site_name" placeholder="NOX Coffee" />
                  <F label="Tagline" k="site_tagline" placeholder="Thành phố ngủ, NOX vẫn sáng đèn" />
                  <F label="Email" k="site_email" type="email" placeholder="hello@noxcoffee.vn" />
                  <F label="Số điện thoại" k="site_phone" placeholder="0901 234 567" />
                </div>
                <F label="Địa chỉ" k="site_address" placeholder="184 Nguyễn Thị Minh Khai, Q.3, TP.HCM" />
                <F label="Giờ mở cửa (hiển thị)" k="working_hours" placeholder="18:00 – 02:00 hằng ngày" />
                <TA label="Mô tả website" k="site_description" placeholder="Mô tả ngắn về NOX Coffee..." />
                <div className="form-group">
                  <ImageField label="Logo website" value={settings['site_logo'] ?? ''} onChange={v => set('site_logo', v)} />
                </div>
                <div className="form-group">
                  <ImageField label="Favicon" value={settings['site_favicon'] ?? ''} onChange={v => set('site_favicon', v)} />
                </div>
              </div>
            )}

            {activeTab === 'home' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Trang chủ</div>
                <TA
                  label="Thống kê 'Vì sao chọn giờ muộn' — mỗi dòng: giá trị|nhãn"
                  k="home_stats" rows={5} mono
                  placeholder={'18:00–02:00|Giờ hoạt động mỗi ngày\n100%|Bàn có ổ cắm riêng'}
                />
                <TA
                  label="3 nhóm khách 'Ai hay ghé NOX' — mỗi dòng: icon|tiêu đề|mô tả"
                  k="home_features" rows={6} mono
                  placeholder={'💻|Dân văn phòng tăng ca|Bàn riêng, ổ cắm...'}
                />
              </div>
            )}

            {activeTab === 'menu' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Trang thực đơn</div>
                <F label="Ghi chú ưu đãi (đầu trang thực đơn)" k="menu_section_note" placeholder="🌙 Sau 22:00, mọi món giảm 10%..." />
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Câu chuyện thương hiệu</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="Eyebrow" k="about_eyebrow" placeholder="Khởi nguồn" />
                  <F label="Năm thành lập" k="about_year" placeholder="2021" />
                </div>
                <TA label="Đoạn 1" k="about_desc1" rows={3} />
                <TA label="Đoạn 2" k="about_desc2" rows={3} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <ImageField label="Ảnh 1" value={settings['about_image1'] ?? ''} onChange={v => set('about_image1', v)} />
                  <ImageField label="Ảnh 2" value={settings['about_image2'] ?? ''} onChange={v => set('about_image2', v)} />
                  <ImageField label="Ảnh 3" value={settings['about_image3'] ?? ''} onChange={v => set('about_image3', v)} />
                </div>

                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', margin: '24px 0 16px' }}>Giờ mở cửa</div>
                <TA
                  label="Thống kê giờ mở cửa — mỗi dòng: giá trị|nhãn"
                  k="hours_stats" rows={5} mono
                  placeholder={'18:00|Giờ mở cửa mỗi ngày\n02:00|Giờ đóng cửa (T2–CN)'}
                />
                <F label="Ghi chú thêm" k="hours_note" placeholder="* Vào tuần thi cuối kỳ..." />

                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', margin: '24px 0 16px' }}>Đối tượng khách hàng</div>
                <TA
                  label="3 kiểu khách — mỗi dòng: icon|tiêu đề|mô tả"
                  k="audience_features" rows={6} mono
                  placeholder={'💻|Người làm việc từ xa & tăng ca|Cần một nơi yên tĩnh...'}
                />
              </div>
            )}

            {activeTab === 'seo' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>SEO & Meta</div>
                <F label="Meta title" k="meta_title" placeholder="NOX Coffee — Cà Phê Đêm Muộn" />
                <TA label="Meta description" k="meta_description" rows={3} />
                <F label="Meta keywords" k="meta_keywords" placeholder="cà phê đêm muộn, cafe xuyên đêm" />
                <div className="form-group">
                  <ImageField label="OG Image (chia sẻ mạng xã hội)" value={settings['og_image'] ?? ''} onChange={v => set('og_image', v)} />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Mạng xã hội</div>
                <F label="Facebook" k="social_facebook" placeholder="https://facebook.com/noxcoffee" />
                <F label="Instagram" k="social_instagram" placeholder="https://instagram.com/noxcoffee" />
                <F label="TikTok" k="social_tiktok" placeholder="https://tiktok.com/@noxcoffee" />
                <F label="Zalo (số điện thoại)" k="social_zalo" placeholder="0901234567" />
              </div>
            )}

            {activeTab === 'footer' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Footer</div>
                <F label="Copyright" k="footer_copyright" placeholder="© 2026 NOX Coffee · Made in Vietnam 🇻🇳" />
                <TA label="Mô tả footer" k="footer_description" rows={3} />
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Liên hệ & Bản đồ</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="Vĩ độ (lat) bản đồ" k="map_lat" placeholder="10.7847" />
                  <F label="Kinh độ (lng) bản đồ" k="map_lng" placeholder="106.6917" />
                </div>
              </div>
            )}

            {activeTab === 'legal' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Pháp lý</div>
                <F label="Ngày cập nhật lần cuối" k="legal_updated" placeholder="01/01/2026" />
                <TA label="Nội dung Chính sách bảo mật (HTML)" k="privacy_content" rows={12} mono />
                <TA label="Nội dung Điều khoản sử dụng (HTML)" k="terms_content" rows={12} mono />
              </div>
            )}

            {activeTab === 'smtp' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Cấu hình Email (SMTP)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
                  <F label="SMTP Port" k="smtp_port" placeholder="587" />
                  <F label="SMTP User" k="smtp_user" placeholder="your@gmail.com" />
                  <F label="SMTP Password" k="smtp_password" type="password" placeholder="App password" />
                  <F label="Tên người gửi" k="smtp_from_name" placeholder="NOX Coffee" />
                  <F label="Email người gửi" k="smtp_from_email" type="email" placeholder="no-reply@noxcoffee.vn" />
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Hệ thống</div>
                <Toggle label="Chế độ bảo trì" k="maintenance_mode" help="Khi bật, website sẽ hiển thị trang bảo trì thay vì nội dung." />
                <TA label="Nội dung trang bảo trì" k="maintenance_message" rows={3} />
              </div>
            )}

            {activeTab === 'cloudinary' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Cloudinary — Lưu trữ ảnh đám mây</div>
                <div style={{ padding: '12px 16px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
                  Đăng ký miễn phí tại <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>cloudinary.com</a>. Gói miễn phí cho 25GB lưu trữ.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <F label="Cloud Name" k="cloudinary_cloud_name" placeholder="your-cloud-name" />
                  <F label="Upload Folder" k="cloudinary_folder" placeholder="cafe-den-muon" />
                  <F label="API Key" k="cloudinary_api_key" placeholder="123456789012345" />
                  <F label="API Secret" k="cloudinary_api_secret" type="password" placeholder="xxxxxxxxxxxxxxxxxxx" />
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)', marginBottom: 20 }}>Tích hợp bên thứ ba</div>
                <div style={{ padding: '12px 16px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
                  Đăng ký API key miễn phí tại <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a> để dùng bộ ảnh miễn phí.
                </div>
                <F label="Unsplash Access Key" k="unsplash_access_key" placeholder="Dán Access Key tại đây" />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
              <button type="submit" className="btn-accent" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
