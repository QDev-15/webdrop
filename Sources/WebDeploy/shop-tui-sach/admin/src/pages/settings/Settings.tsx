import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import PaymentSettingsTab from '../../components/PaymentSettingsTab'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'home', label: 'Trang chủ' },
  { id: 'reviews', label: 'Đánh giá khách hàng' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'shop', label: 'Cửa hàng' },
  { id: 'payment', label: '💳 Thanh toán' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'smtp', label: 'SMTP' },
  { id: 'system', label: 'Nâng cao' },
  { id: 'cloudinary', label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

function Field({ label, name, value, onChange, type = 'text', placeholder = '' }: {
  label: string; name: string; value: string; onChange: (k: string, v: string) => void
  type?: string; placeholder?: string
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}

function ToggleField({ label, name, value, onChange }: {
  label: string; name: string; value: string; onChange: (k: string, v: string) => void
}) {
  return (
    <label className="form-check">
      <input type="checkbox" checked={value === '1'} onChange={e => onChange(name, e.target.checked ? '1' : '0')} />
      <span>{label}</span>
    </label>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setSettings(s => ({ ...s, [k]: v }))
  const val = (k: string) => settings[k] ?? ''

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/settings/update', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Cài đặt hệ thống</h1>
      </div>

      <div className="settings-tabs">
        {TABS.map(t => (
          <button key={t.id} className={'settings-tab' + (activeTab === t.id ? ' active' : '')} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="admin-form" style={{ marginTop: 24, maxWidth: 760 }}>
        {saved && <div className="form-success-banner">Đã lưu cài đặt thành công!</div>}
        {error && <div className="form-error-banner">{error}</div>}

        {activeTab === 'general' && <>
          <Field label="Tên cửa hàng" name="site_name" value={val('site_name')} onChange={set} placeholder="Maison Cuir" />
          <Field label="Slogan" name="site_slogan" value={val('site_slogan')} onChange={set} placeholder="Túi Da Thủ Công Cao Cấp" />
          <Field label="Mô tả ngắn" name="site_description" value={val('site_description')} onChange={set} type="textarea" />
          <Field label="Logo URL" name="site_logo" value={val('site_logo')} onChange={set} placeholder="https://..." />
          <Field label="Favicon URL" name="site_favicon" value={val('site_favicon')} onChange={set} placeholder="https://..." />
          <Field label="Giờ mở cửa" name="working_hours" value={val('working_hours')} onChange={set} placeholder="9:00 – 20:00 · Thứ 2 – Chủ nhật" />
          <Field label="Số Zalo" name="zalo_number" value={val('zalo_number')} onChange={set} placeholder="0900000000" />
        </>}

        {activeTab === 'home' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>
            Nội dung trang chủ. Ảnh + tiêu đề chính của Hero quản lý tại menu "Hero Slides".
          </p>
          <p style={{ fontWeight: 600, fontSize: 13, margin: '4px 0 8px' }}>Hero</p>
          <Field label="Tag (dòng nhỏ phía trên tiêu đề)" name="hero_tag" value={val('hero_tag')} onChange={set} placeholder="Bộ sưu tập Thu Đông 2026" />
          <div className="form-row">
            <Field label="Chỉ số 1 — Số" name="hero_stat1_num" value={val('hero_stat1_num')} onChange={set} placeholder="15" />
            <Field label="Hậu tố" name="hero_stat1_suffix" value={val('hero_stat1_suffix')} onChange={set} placeholder="+" />
            <Field label="Nhãn" name="hero_stat1_label" value={val('hero_stat1_label')} onChange={set} placeholder="Năm kinh nghiệm" />
          </div>
          <div className="form-row">
            <Field label="Chỉ số 2 — Số" name="hero_stat2_num" value={val('hero_stat2_num')} onChange={set} placeholder="100" />
            <Field label="Hậu tố" name="hero_stat2_suffix" value={val('hero_stat2_suffix')} onChange={set} placeholder="%" />
            <Field label="Nhãn" name="hero_stat2_label" value={val('hero_stat2_label')} onChange={set} placeholder="Da thật cao cấp" />
          </div>
          <div className="form-row">
            <Field label="Chỉ số 3 — Số" name="hero_stat3_num" value={val('hero_stat3_num')} onChange={set} placeholder="5000" />
            <Field label="Hậu tố" name="hero_stat3_suffix" value={val('hero_stat3_suffix')} onChange={set} placeholder="+" />
            <Field label="Nhãn" name="hero_stat3_label" value={val('hero_stat3_label')} onChange={set} placeholder="Khách hàng tin chọn" />
          </div>

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Trust badges (4 mục)</p>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="form-row" style={{ marginBottom: 4 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Mục {i} — Bootstrap Icon (không có tiền tố "bi-")</label>
                <input type="text" value={val(`value${i}_icon`)} onChange={e => set(`value${i}_icon`, e.target.value)} placeholder="gem" />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Mục {i} — Tiêu đề</label>
                <input type="text" value={val(`value${i}_title`)} onChange={e => set(`value${i}_title`, e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 3 }}>
                <label>Mục {i} — Mô tả</label>
                <input type="text" value={val(`value${i}_desc`)} onChange={e => set(`value${i}_desc`, e.target.value)} />
              </div>
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Banner khuyến mãi</p>
          <div className="form-row">
            <Field label="Nhãn" name="promo_label" value={val('promo_label')} onChange={set} placeholder="Ưu đãi giới hạn" />
            <Field label="Tiêu đề" name="promo_title" value={val('promo_title')} onChange={set} placeholder="Giảm" />
            <Field label="Phần trăm" name="promo_percent" value={val('promo_percent')} onChange={set} placeholder="20%" />
          </div>
          <Field label="Mô tả" name="promo_desc" value={val('promo_desc')} onChange={set} type="textarea" />
          <Field label="Ảnh banner" name="promo_image" value={val('promo_image')} onChange={set} placeholder="https://..." />

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Thanh thống kê (4 mục)</p>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="form-row" style={{ marginBottom: 4 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Số {i}</label>
                <input type="number" value={val(`stat${i}_num`)} onChange={e => set(`stat${i}_num`, e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Hậu tố</label>
                <input type="text" value={val(`stat${i}_suffix`)} onChange={e => set(`stat${i}_suffix`, e.target.value)} placeholder="+" />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Nhãn</label>
                <input type="text" value={val(`stat${i}_label`)} onChange={e => set(`stat${i}_label`, e.target.value)} />
              </div>
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Newsletter</p>
          <Field label="Tiêu đề" name="newsletter_title" value={val('newsletter_title')} onChange={set} placeholder="Đăng ký nhận ưu đãi riêng" />
          <Field label="Mô tả" name="newsletter_desc" value={val('newsletter_desc')} onChange={set} placeholder="Nhận thông tin bộ sưu tập mới..." />
        </>}

        {activeTab === 'reviews' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>4 đánh giá hiển thị ở section "Khách hàng nói gì" trên trang chủ.</p>
          <div className="form-row">
            <Field label="Điểm trung bình" name="reviews_avg" value={val('reviews_avg')} onChange={set} placeholder="5.0" />
            <Field label="Tổng số đánh giá" name="reviews_count" value={val('reviews_count')} onChange={set} placeholder="128" />
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ padding: '12px 0', borderTop: '1px solid var(--border)', marginTop: 8 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Đánh giá {i}</p>
              <div className="form-row">
                <Field label="Tên khách hàng" name={`review${i}_name`} value={val(`review${i}_name`)} onChange={set} />
                <Field label="Địa điểm" name={`review${i}_location`} value={val(`review${i}_location`)} onChange={set} placeholder="TP. Hồ Chí Minh" />
                <Field label="Số sao (1-5)" name={`review${i}_rating`} value={val(`review${i}_rating`)} onChange={set} placeholder="5" />
              </div>
              <Field label="Nội dung" name={`review${i}_content`} value={val(`review${i}_content`)} onChange={set} type="textarea" />
            </div>
          ))}
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} placeholder="Maison Cuir — Túi Da Thủ Công Cao Cấp" />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" />
          <Field label="OG Image URL" name="og_image" value={val('og_image')} onChange={set} placeholder="https://..." />
          <Field label="Google Analytics ID" name="ga_id" value={val('ga_id')} onChange={set} placeholder="G-XXXXXXXXXX" />
          <Field label="Google Tag Manager ID" name="gtm_id" value={val('gtm_id')} onChange={set} placeholder="GTM-XXXXXXX" />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="facebook" value={val('facebook')} onChange={set} placeholder="https://www.facebook.com/maisoncuir" />
          <Field label="Instagram URL" name="instagram" value={val('instagram')} onChange={set} placeholder="https://www.instagram.com/maisoncuir" />
          <Field label="TikTok URL" name="tiktok" value={val('tiktok')} onChange={set} placeholder="https://www.tiktok.com/@maisoncuir" />
          <Field label="Zalo URL" name="zalo" value={val('zalo')} onChange={set} placeholder="https://zalo.me/0900000000" />
        </>}

        {activeTab === 'footer' && <>
          <Field label="Mô tả footer" name="footer_desc" value={val('footer_desc')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'shop' && <>
          <Field label="Số ngày đổi trả" name="return_days" value={val('return_days')} onChange={set} placeholder="30" />
          <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '4px 0 16px' }}>Phí vận chuyển / Miễn phí vận chuyển từ — cấu hình tại tab "💳 Thanh toán".</p>
        </>}

        {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}

        {activeTab === 'contact' && <>
          <Field label="Email liên hệ" name="site_email" value={val('site_email')} onChange={set} type="email" placeholder="hello@maisoncuir.vn" />
          <Field label="Số điện thoại" name="site_phone" value={val('site_phone')} onChange={set} placeholder="0900 000 000" />
          <Field label="Địa chỉ" name="site_address" value={val('site_address')} onChange={set} placeholder="12 Nguyễn Huệ, Quận 1, TP.HCM" />
          <Field label="Giới thiệu ngắn (trang Liên hệ)" name="contact_intro" value={val('contact_intro')} onChange={set} type="textarea" />
          <Field label="Google Maps Embed URL" name="map_embed" value={val('map_embed')} onChange={set} placeholder="https://www.google.com/maps/embed?..." />
        </>}

        {activeTab === 'smtp' && <>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} placeholder="you@gmail.com" />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="From Email" name="smtp_from" value={val('smtp_from')} onChange={set} placeholder="no-reply@maisoncuir.vn" />
          <Field label="From Name" name="smtp_from_name" value={val('smtp_from_name')} onChange={set} placeholder="Maison Cuir" />
        </>}

        {activeTab === 'system' && <>
          <ToggleField label="Bật chế độ bảo trì (ẩn website, chỉ admin truy cập được)" name="maintenance_mode" value={val('maintenance_mode')} onChange={set} />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Cấu hình Cloudinary để upload và quản lý ảnh sản phẩm.</p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} placeholder="mycloud" />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} placeholder="123456789012345" />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="Thư mục lưu ảnh" name="cloudinary_folder" value={val('cloudinary_folder')} onChange={set} placeholder="maison-cuir" />
        </>}

        {activeTab === 'integrations' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>API keys cho các tích hợp bên ngoài.</p>
          <Field label="Unsplash Access Key" name="unsplash_access_key" value={val('unsplash_access_key')} onChange={set} placeholder="Unsplash Access Key" />
          <Field label="Facebook Pixel ID" name="fb_pixel_id" value={val('fb_pixel_id')} onChange={set} placeholder="123456789012345" />
        </>}

        <div className="form-actions" style={{ marginTop: 32 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
