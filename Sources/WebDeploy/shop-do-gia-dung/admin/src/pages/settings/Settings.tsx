import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import PaymentSettingsTab from '../../components/PaymentSettingsTab'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'hero',         label: '🏠 Trang chủ' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'smtp',         label: 'SMTP' },
  { id: 'system',       label: 'Nâng cao' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'payment',      label: '💳 Thanh toán' },
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
          <button
            key={t.id}
            className={'settings-tab' + (activeTab === t.id ? ' active' : '')}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="admin-form" style={{ maxWidth: 760 }}>
        {saved && <div className="form-success-banner">Đã lưu cài đặt thành công!</div>}
        {error && <div className="form-error-banner">{error}</div>}

        {activeTab === 'general' && <>
          <Field label="Tên cửa hàng" name="site_name" value={val('site_name')} onChange={set} placeholder="Shop Đồ Gia Dụng" />
          <Field label="Email" name="site_email" value={val('site_email')} onChange={set} type="email" placeholder="hello@shopgiadung.vn" />
          <Field label="Số điện thoại" name="site_phone" value={val('site_phone')} onChange={set} placeholder="0900 888 666" />
          <Field label="Địa chỉ" name="site_address" value={val('site_address')} onChange={set} placeholder="456 Nguyễn Huệ, Q.1, TP.HCM" />
          <Field label="Giờ làm việc" name="working_hours" value={val('working_hours')} onChange={set} placeholder="9:00 – 20:00 · Tất cả các ngày" />
          <Field label="Mô tả ngắn" name="site_description" value={val('site_description')} onChange={set} type="textarea" placeholder="Cửa hàng đồ gia dụng chất lượng cao..." />
          <Field label="Khẩu hiệu (tagline)" name="site_slogan" value={val('site_slogan')} onChange={set} placeholder="Đồ Gia Dụng Chất Lượng Cao" />
        </>}

        {activeTab === 'hero' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 8 }}>
            Nội dung hiển thị trên khu vực hero trang chủ.
          </p>
          <Field label="Tag / Label hero" name="hero_tag" value={val('hero_tag')} onChange={set} placeholder="VD: Thiết Bị Gia Đình Tốt Nhất 2025" />
          <Field label="Tiêu đề phần 1 (chữ bình thường)" name="hero_title_part1" value={val('hero_title_part1')} onChange={set} placeholder="Đồ Gia Dụng" />
          <Field label="Tiêu đề phần 2 (chữ highlight màu)" name="hero_title_part2" value={val('hero_title_part2')} onChange={set} placeholder="Chất Lượng" />
          <Field label="Dòng tiêu đề thứ 2" name="hero_title_line2" value={val('hero_title_line2')} onChange={set} placeholder="– Chăm Sóc Gia Đình Bạn" />
          <Field label="Mô tả hero" name="hero_subtitle" value={val('hero_subtitle')} onChange={set} type="textarea" placeholder="Tất cả những gì bạn cần để tạo một ngôi nhà ấm cúng..." />
          <Field label="Ghi chú nhỏ dưới nút CTA" name="hero_note" value={val('hero_note')} onChange={set} placeholder="Giao hàng miễn phí từ 500.000đ · Đảm bảo chất lượng" />
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} placeholder="Shop Đồ Gia Dụng – Chất Lượng & Giá Tốt" />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" placeholder="Khám phá bộ sưu tập đồ gia dụng..." />
          <Field label="Meta Keywords" name="meta_keywords" value={val('meta_keywords')} onChange={set} placeholder="đồ gia dụng, nhà bếp, trang trí nhà" />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="facebook" value={val('facebook')} onChange={set} placeholder="https://www.facebook.com/shopgiadung" />
          <Field label="Instagram URL" name="instagram" value={val('instagram')} onChange={set} placeholder="https://www.instagram.com/shopgiadung" />
          <Field label="TikTok URL" name="tiktok" value={val('tiktok')} onChange={set} placeholder="https://www.tiktok.com/@shopgiadung" />
          <Field label="Zalo URL" name="zalo" value={val('zalo')} onChange={set} placeholder="https://zalo.me/0900888666" />
          <Field label="Số Zalo" name="zalo_number" value={val('zalo_number')} onChange={set} placeholder="0900888666" />
          <Field label="YouTube URL" name="youtube" value={val('youtube')} onChange={set} placeholder="https://www.youtube.com/@shopgiadung" />
        </>}

        {activeTab === 'footer' && <>
          <Field label="Mô tả Footer" name="footer_desc" value={val('footer_desc')} onChange={set} type="textarea" placeholder="Chúng tôi mang đến những sản phẩm đồ gia dụng chất lượng cao..." />
        </>}

        {activeTab === 'contact' && <>
          <Field label="Google Maps Embed URL" name="map_embed" value={val('map_embed')} onChange={set} type="textarea" placeholder="https://www.google.com/maps/embed?pb=..." />
        </>}

        {activeTab === 'smtp' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 8 }}>
            Cấu hình email để nhận thông báo đơn hàng và liên hệ từ khách hàng.
          </p>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} placeholder="email@gmail.com" />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" placeholder="App password" />
          <Field label="From Email" name="smtp_from" value={val('smtp_from')} onChange={set} placeholder="hello@shopgiadung.vn" />
          <Field label="From Name" name="smtp_from_name" value={val('smtp_from_name')} onChange={set} placeholder="Shop Đồ Gia Dụng" />
        </>}

        {activeTab === 'system' && <>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={val('maintenance_mode') === '1'} onChange={e => set('maintenance_mode', e.target.checked ? '1' : '0')} />
              Bật chế độ bảo trì (Maintenance Mode)
            </label>
          </div>
          <Field label="Google Analytics (Tracking ID)" name="google_analytics" value={val('google_analytics')} onChange={set} placeholder="G-XXXXXXXXXX" />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 8 }}>
            Cấu hình Cloudinary để lưu trữ ảnh trên đám mây thay vì server.
          </p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} placeholder="your-cloud-name" />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} placeholder="123456789012345" />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" placeholder="API Secret từ Cloudinary dashboard" />
        </>}

        {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}

        {activeTab === 'integrations' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 8 }}>
            Unsplash Access Key dùng để tìm kiếm và chọn ảnh sản phẩm từ Unsplash.
          </p>
          <Field label="Unsplash Access Key" name="unsplash_access_key" value={val('unsplash_access_key')} onChange={set} type="password" placeholder="Nhận từ https://unsplash.com/oauth/applications" />
          <Field label="Facebook Pixel ID" name="fb_pixel_id" value={val('fb_pixel_id')} onChange={set} placeholder="123456789012345" />
          <Field label="Zalo OA ID" name="zalo_oa_id" value={val('zalo_oa_id')} onChange={set} placeholder="123456789012345" />
        </>}

        <div className="form-actions" style={{ marginTop: 32 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </form>
    </div>
  )
}
