import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { THEMES, DEFAULT_THEME_SLUG } from '../../data/themes'

type Settings = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'theme', label: '🎨 Giao diện' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'shop', label: 'Cửa hàng' },
  { id: 'payment', label: '💳 Thanh toán' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'smtp', label: 'SMTP' },
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
  const [settings, setSettings] = useState<Settings>({})
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Settings>('/settings')
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
    } finally { setSaving(false) }
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

      <form onSubmit={handleSave} className="admin-form" style={{ marginTop: 24 }}>
        {saved && <div className="form-success-banner">Đã lưu cài đặt thành công!</div>}
        {error && <div className="form-error-banner">{error}</div>}

        {activeTab === 'general' && <>
          <Field label="Tên cửa hàng" name="site_name" value={val('site_name')} onChange={set} placeholder="Shop Hữu Cơ" />
          <Field label="Slogan" name="site_slogan" value={val('site_slogan')} onChange={set} placeholder="Thiên nhiên trong từng sản phẩm" />
          <Field label="Mô tả ngắn" name="site_description" value={val('site_description')} onChange={set} type="textarea" />
          <Field label="Logo URL" name="site_logo" value={val('site_logo')} onChange={set} placeholder="https://..." />
          <Field label="Favicon URL" name="site_favicon" value={val('site_favicon')} onChange={set} placeholder="https://..." />
          <Field label="Giờ mở cửa" name="working_hours" value={val('working_hours')} onChange={set} placeholder="8:00 – 21:00, Thứ 2 – CN" />
          <Field label="Số Zalo" name="zalo_number" value={val('zalo_number')} onChange={set} placeholder="0901234567" />
        </>}

        {activeTab === 'theme' && <>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>
            Chọn bảng màu hiển thị cho website. Theme chỉ đổi màu sắc/hiệu ứng — không ảnh hưởng bố cục, font chữ hay nội dung.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {THEMES.map(theme => {
              const active = (val('site_theme') || DEFAULT_THEME_SLUG) === theme.slug
              return (
                <button
                  key={theme.slug}
                  type="button"
                  onClick={() => set('site_theme', theme.slug)}
                  aria-pressed={active}
                  aria-label={`Chọn theme ${theme.name}`}
                  style={{
                    textAlign: 'left', cursor: 'pointer', borderRadius: 12, padding: 14,
                    border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: active ? 'var(--accent-light)' : 'var(--surface)',
                  }}
                >
                  <div style={{ display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden', marginBottom: 10, border: '1px solid rgba(0,0,0,.06)' }}>
                    <span style={{ flex: 2, background: theme.vars['--bg'] }} />
                    <span style={{ flex: 1, background: theme.vars['--accent'] }} />
                    <span style={{ flex: 1, background: theme.vars['--sage'] }} />
                    <span style={{ flex: 1, background: theme.vars['--dark'] }} />
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {theme.name}
                    {active && <span style={{ fontSize: 11, color: 'var(--accent)' }}>✓ Đang dùng</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{theme.description}</div>
                </button>
              )
            })}
          </div>
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} placeholder="Shop Hữu Cơ | Sản phẩm thiên nhiên" />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" placeholder="Mô tả SEO..." />
          <Field label="OG Image URL" name="og_image" value={val('og_image')} onChange={set} placeholder="https://..." />
          <Field label="Google Analytics ID" name="ga_id" value={val('ga_id')} onChange={set} placeholder="G-XXXXXXXXXX" />
          <Field label="Google Tag Manager ID" name="gtm_id" value={val('gtm_id')} onChange={set} placeholder="GTM-XXXXXXX" />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="facebook" value={val('facebook')} onChange={set} placeholder="https://facebook.com/shopname" />
          <Field label="Instagram URL" name="instagram" value={val('instagram')} onChange={set} placeholder="https://instagram.com/shopname" />
          <Field label="TikTok URL" name="tiktok" value={val('tiktok')} onChange={set} placeholder="https://tiktok.com/@shopname" />
          <Field label="YouTube URL" name="youtube" value={val('youtube')} onChange={set} placeholder="https://youtube.com/@shopname" />
          <Field label="Pinterest URL" name="pinterest" value={val('pinterest')} onChange={set} placeholder="https://pinterest.com/shopname" />
        </>}

        {activeTab === 'shop' && <>
          <Field label="Phí vận chuyển (VND)" name="shipping_fee" value={val('shipping_fee')} onChange={set} placeholder="30000" />
          <Field label="Miễn phí vận chuyển từ (VND)" name="free_shipping_threshold" value={val('free_shipping_threshold')} onChange={set} placeholder="500000" />
          <Field label="Tiêu đề promo banner" name="promo_title" value={val('promo_title')} onChange={set} placeholder="Flash Sale Cuối Tuần" />
          <Field label="Mô tả promo" name="promo_subtitle" value={val('promo_subtitle')} onChange={set} placeholder="Giảm đến 30% toàn bộ sản phẩm" />
          <Field label="Ngày kết thúc promo (YYYY-MM-DD HH:MM:SS)" name="promo_end_date" value={val('promo_end_date')} onChange={set} placeholder="2026-12-31 23:59:59" />
          <Field label="Thống kê: Số sản phẩm" name="stat_products" value={val('stat_products')} onChange={set} placeholder="500+" />
          <Field label="Thống kê: Khách hàng" name="stat_customers" value={val('stat_customers')} onChange={set} placeholder="10.000+" />
          <Field label="Thống kê: Năm kinh nghiệm" name="stat_years" value={val('stat_years')} onChange={set} placeholder="5+" />
          <Field label="Thống kê: Đánh giá 5 sao" name="stat_reviews" value={val('stat_reviews')} onChange={set} placeholder="99%" />
        </>}

        {activeTab === 'payment' && <>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>Bật/tắt từng phương thức thanh toán hiển thị ở trang thanh toán của khách.</p>
          <div className="form-row" style={{ gap: 24, marginBottom: 20 }}>
            <ToggleField label="Thanh toán khi nhận hàng (COD)" name="payment_cod_enabled" value={val('payment_cod_enabled')} onChange={set} />
            <ToggleField label="Chuyển khoản trước qua SePay" name="payment_sepay_enabled" value={val('payment_sepay_enabled')} onChange={set} />
          </div>
          <p style={{ color: '#888', fontSize: 13, margin: '20px 0 8px' }}>Thông tin tài khoản nhận tiền (dùng để tạo mã QR VietQR khi khách chọn SePay):</p>
          <Field label="Mã ngân hàng (VietQR)" name="sepay_bank_code" value={val('sepay_bank_code')} onChange={set} placeholder="VD: MB, VCB, TCB, ACB" />
          <Field label="Số tài khoản" name="sepay_account_number" value={val('sepay_account_number')} onChange={set} placeholder="0123456789" />
          <Field label="Tên chủ tài khoản" name="sepay_account_name" value={val('sepay_account_name')} onChange={set} placeholder="NGUYEN VAN A" />
          <Field label="SePay API Access" name="sepay_webhook_secret" value={val('sepay_webhook_secret')} onChange={set} type="password" placeholder="Lấy tại my.sepay.vn → Cài đặt công ty → API Access" />
        </>}

        {activeTab === 'contact' && <>
          <Field label="Email liên hệ" name="site_email" value={val('site_email')} onChange={set} type="email" placeholder="hello@shophuuco.vn" />
          <Field label="Số điện thoại" name="site_phone" value={val('site_phone')} onChange={set} placeholder="0901 234 567" />
          <Field label="Địa chỉ" name="site_address" value={val('site_address')} onChange={set} placeholder="123 Đường ABC, Quận 1, TP.HCM" />
          <Field label="Google Maps Embed URL" name="map_embed" value={val('map_embed')} onChange={set} placeholder="https://maps.google.com/maps?..." />
        </>}

        {activeTab === 'smtp' && <>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} placeholder="you@gmail.com" />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="From Email" name="smtp_from_email" value={val('smtp_from_email')} onChange={set} placeholder="no-reply@shophuuco.vn" />
          <Field label="From Name" name="smtp_from_name" value={val('smtp_from_name')} onChange={set} placeholder="Shop Hữu Cơ" />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>Cấu hình Cloudinary để upload và quản lý ảnh sản phẩm.</p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} placeholder="mycloud" />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} placeholder="123456789012345" />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="Upload Preset" name="cloudinary_upload_preset" value={val('cloudinary_upload_preset')} onChange={set} placeholder="ml_default" />
        </>}

        {activeTab === 'integrations' && <>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>API keys cho các tích hợp bên ngoài.</p>
          <Field label="Unsplash Access Key" name="unsplash_access_key" value={val('unsplash_access_key')} onChange={set} placeholder="Unsplash Access Key" />
          <Field label="Facebook Pixel ID" name="fb_pixel_id" value={val('fb_pixel_id')} onChange={set} placeholder="123456789012345" />
          <Field label="Zalo OA ID" name="zalo_oa_id" value={val('zalo_oa_id')} onChange={set} placeholder="Zalo OA ID" />
        </>}

        <div className="form-actions" style={{ marginTop: 32 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
