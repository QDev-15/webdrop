import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import PaymentSettingsTab from '../../components/PaymentSettingsTab'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'home', label: 'Trang chủ' },
  { id: 'stats', label: 'Thống kê' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'shop', label: 'Cửa hàng' },
  { id: 'payment', label: '💳 Thanh toán' },
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
          <Field label="Tên cửa hàng" name="site_name" value={val('site_name')} onChange={set} placeholder="Shop Đồ Gia Dụng" />
          <Field label="Email" name="site_email" value={val('site_email')} onChange={set} type="email" placeholder="hello@shopgiadadung.vn" />
          <Field label="Số điện thoại" name="site_phone" value={val('site_phone')} onChange={set} placeholder="0900 888 666" />
          <Field label="Địa chỉ" name="site_address" value={val('site_address')} onChange={set} placeholder="456 Nguyễn Huệ, Q.1, TP.HCM" />
          <Field label="Giờ làm việc" name="working_hours" value={val('working_hours')} onChange={set} placeholder="9:00 – 20:00 · Tất cả các ngày" />
          <Field label="Mô tả ngắn" name="site_description" value={val('site_description')} onChange={set} type="textarea" placeholder="Cửa hàng đồ gia dụng chất lượng cao với giá hợp lý..." />
        </>}

        {activeTab === 'home' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>
            Trang chủ dùng "Search Zone" (tiêu đề lớn + ô tìm kiếm + danh mục chip) thay cho hero ảnh/slider —
            các mục dưới đây quản lý nội dung liên quan đến khu vực này.
          </p>
          <Field label="Mô tả phụ dưới tiêu đề Search Zone" name="hero_subtitle" value={val('hero_subtitle')} onChange={set} placeholder="Tìm trong hơn 40 sản phẩm đồ gia dụng chất lượng cao" />
          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Dự phòng cho thiết kế hero khác trong tương lai (hiện chưa hiển thị trên giao diện)</p>
          <Field label="Nhãn nhỏ (tag)" name="hero_tag" value={val('hero_tag')} onChange={set} placeholder="Thiết Bị Gia Đình Tốt Nhất 2025" />
          <div className="form-row">
            <Field label="Tiêu đề phần 1" name="hero_title_part1" value={val('hero_title_part1')} onChange={set} placeholder="Đồ Gia Dụng" />
            <Field label="Tiêu đề phần 2" name="hero_title_part2" value={val('hero_title_part2')} onChange={set} placeholder="Chất Lượng" />
          </div>
          <Field label="Tiêu đề dòng 2" name="hero_title_line2" value={val('hero_title_line2')} onChange={set} placeholder="– Chăm Sóc Gia Đình Bạn" />
          <Field label="Ghi chú nhỏ" name="hero_note" value={val('hero_note')} onChange={set} placeholder="Giao hàng miễn phí từ 500.000đ · Đảm bảo chất lượng" />
        </>}

        {activeTab === 'stats' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Số liệu thương hiệu (hiện chưa hiển thị trên giao diện, dự phòng cho section thống kê).</p>
          <div className="form-row">
            <Field label="Số khách hàng" name="stat_customers" value={val('stat_customers')} onChange={set} placeholder="8000" />
            <Field label="Số sản phẩm" name="stat_products" value={val('stat_products')} onChange={set} placeholder="400" />
          </div>
          <div className="form-row">
            <Field label="Số năm hoạt động" name="stat_years" value={val('stat_years')} onChange={set} placeholder="3" />
            <Field label="Số tỉnh thành giao hàng" name="stat_provinces" value={val('stat_provinces')} onChange={set} placeholder="63" />
          </div>
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} placeholder="Shop Đồ Gia Dụng – Chất Lượng & Giá Tốt" />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="facebook" value={val('facebook')} onChange={set} placeholder="https://www.facebook.com/..." />
          <Field label="Instagram URL" name="instagram" value={val('instagram')} onChange={set} placeholder="https://www.instagram.com/..." />
          <Field label="TikTok URL" name="tiktok" value={val('tiktok')} onChange={set} placeholder="https://www.tiktok.com/@..." />
          <Field label="Zalo URL" name="zalo" value={val('zalo')} onChange={set} placeholder="https://zalo.me/..." />
          <Field label="Số Zalo (không dấu cách)" name="zalo_number" value={val('zalo_number')} onChange={set} placeholder="0900888666" />
        </>}

        {activeTab === 'footer' && <>
          <Field label="Mô tả footer" name="footer_desc" value={val('footer_desc')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'contact' && <>
          <Field label="Mã nhúng Google Maps (embed URL)" name="map_embed" value={val('map_embed')} onChange={set} type="textarea" placeholder="https://www.google.com/maps/embed?..." />
          <p style={{ color: 'var(--text-3)', fontSize: 12 }}>Điện thoại / email / địa chỉ / giờ làm việc — chỉnh ở tab "Thông tin chung".</p>
        </>}

        {activeTab === 'shop' && <>
          <Field label="Số ngày đổi trả" name="return_days" value={val('return_days')} onChange={set} placeholder="30" />
          <Field label="Số tháng bảo hành" name="warranty_months" value={val('warranty_months')} onChange={set} placeholder="12" />
          <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '4px 0 16px' }}>Phí vận chuyển / Miễn phí vận chuyển từ — cấu hình tại tab "💳 Thanh toán".</p>
        </>}

        {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}

        {activeTab === 'smtp' && <>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} placeholder="you@gmail.com" />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="From Email" name="smtp_from" value={val('smtp_from')} onChange={set} placeholder="no-reply@shopgiadadung.vn" />
          <Field label="From Name" name="smtp_from_name" value={val('smtp_from_name')} onChange={set} placeholder="Shop Đồ Gia Dụng" />
        </>}

        {activeTab === 'system' && <>
          <ToggleField label="Bật chế độ bảo trì (ẩn website, chỉ admin truy cập được)" name="maintenance_mode" value={val('maintenance_mode')} onChange={set} />
          <Field label="Google Analytics ID" name="google_analytics" value={val('google_analytics')} onChange={set} placeholder="G-XXXXXXXXXX" />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Cấu hình Cloudinary để upload và quản lý ảnh sản phẩm.</p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} placeholder="mycloud" />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} placeholder="123456789012345" />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" placeholder="••••••••" />
        </>}

        {activeTab === 'integrations' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>API keys cho các tích hợp bên ngoài.</p>
          <Field label="Unsplash Access Key" name="unsplash_access_key" value={val('unsplash_access_key')} onChange={set} placeholder="Unsplash Access Key" />
          <Field label="Facebook Pixel ID" name="fb_pixel_id" value={val('fb_pixel_id')} onChange={set} placeholder="123456789012345" />
          <Field label="Zalo OA ID" name="zalo_oa_id" value={val('zalo_oa_id')} onChange={set} placeholder="Zalo Official Account ID" />
        </>}

        <div className="form-actions" style={{ marginTop: 32 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
