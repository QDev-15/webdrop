import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'about', label: 'Thống kê trang chủ' },
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
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="form-control" rows={3} value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="form-control" type={type} value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}

function ToggleField({ label, name, value, onChange }: {
  label: string; name: string; value: string; onChange: (k: string, v: string) => void
}) {
  return (
    <label className="form-check" style={{ marginBottom: 16 }}>
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
    api.get<SettingsMap>('/settings').then(setSettings).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: string) => setSettings(s => ({ ...s, [k]: v }))
  const val = (k: string) => settings[k] ?? ''

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await api.post('/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại, vui lòng thử lại')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header"><div className="page-title">Cài đặt hệ thống</div></div>

      <div className="settings-tabs">
        {TABS.map(t => (
          <button key={t.id} type="button" className={'settings-tab' + (activeTab === t.id ? ' active' : '')} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="form-card" style={{ marginTop: 24 }}>
        {saved && <div className="form-success-banner">Đã lưu cài đặt thành công!</div>}
        {error && <div className="form-error-banner">{error}</div>}

        {activeTab === 'general' && <>
          <Field label="Tên sàn" name="site_name" value={val('site_name')} onChange={set} placeholder="RaoNhà" />
          <Field label="Khẩu hiệu (tagline)" name="site_tagline" value={val('site_tagline')} onChange={set} />
          <Field label="Mô tả ngắn" name="site_description" value={val('site_description')} onChange={set} type="textarea" />
          <Field label="Logo URL" name="site_logo" value={val('site_logo')} onChange={set} placeholder="https://..." />
          <Field label="Favicon URL" name="site_favicon" value={val('site_favicon')} onChange={set} placeholder="https://..." />
          <Field label="Email" name="site_email" value={val('site_email')} onChange={set} type="email" />
          <Field label="Hotline" name="site_phone" value={val('site_phone')} onChange={set} placeholder="1900 6789" />
          <Field label="Địa chỉ văn phòng" name="site_address" value={val('site_address')} onChange={set} />
          <Field label="Giờ hỗ trợ" name="working_hours" value={val('working_hours')} onChange={set} placeholder="7:30 - 21:00 hằng ngày" />
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" />
          <Field label="Meta Keywords" name="meta_keywords" value={val('meta_keywords')} onChange={set} />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="social_facebook" value={val('social_facebook')} onChange={set} placeholder="https://facebook.com/..." />
          <Field label="Zalo URL" name="social_zalo" value={val('social_zalo')} onChange={set} placeholder="https://zalo.me/..." />
          <Field label="YouTube URL" name="social_youtube" value={val('social_youtube')} onChange={set} placeholder="https://youtube.com/..." />
        </>}

        {activeTab === 'footer' && <>
          <Field label="Copyright" name="footer_copyright" value={val('footer_copyright')} onChange={set} />
          <Field label="Mô tả footer" name="footer_description" value={val('footer_description')} onChange={set} type="textarea" />
          <Field label="Văn phòng đại diện (dòng dưới bản đồ)" name="footer_office" value={val('footer_office')} onChange={set} />
          <Field label="Google Maps embed URL" name="footer_map_embed" value={val('footer_map_embed')} onChange={set} placeholder="https://maps.google.com/maps?q=...&output=embed" />
        </>}

        {activeTab === 'contact' && <>
          <Field label="Hotline hỗ trợ" name="contact_hotline" value={val('contact_hotline')} onChange={set} />
          <Field label="Email hỗ trợ" name="contact_email" value={val('contact_email')} onChange={set} type="email" />
          <Field label="Địa chỉ" name="contact_address" value={val('contact_address')} onChange={set} />
        </>}

        {activeTab === 'about' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Số liệu hiển thị ở stat-bar trang chủ &amp; trang Giới thiệu (chỉ nhập số, không cần dấu +).</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Tổng tin đăng đang hoạt động" name="stat_listings" value={val('stat_listings')} onChange={set} placeholder="12500" />
            <Field label="Môi giới & chính chủ tham gia" name="stat_members" value={val('stat_members')} onChange={set} placeholder="3200" />
            <Field label="Số khu vực phủ sóng" name="stat_areas" value={val('stat_areas')} onChange={set} placeholder="15" />
            <Field label="Lượt truy cập / tháng (nghìn)" name="stat_visits" value={val('stat_visits')} onChange={set} placeholder="850" />
          </div>
        </>}

        {activeTab === 'payment' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>
            Cấu hình 2 phương thức nạp credit vào ví cho người đăng tin: chuyển khoản thủ công (admin xác nhận) và SePay (tự động qua webhook).
          </p>
          <ToggleField label="Bật nạp credit qua chuyển khoản thủ công (admin xác nhận trong mục Ví & giao dịch)" name="payment_manual_enabled" value={val('payment_manual_enabled')} onChange={set} />
          <ToggleField label="Bật nạp credit tự động qua SePay (webhook)" name="payment_sepay_enabled" value={val('payment_sepay_enabled')} onChange={set} />
          <Field label="Tên ngân hàng hiển thị" name="sepay_bank_name" value={val('sepay_bank_name')} onChange={set} placeholder="Vietcombank — CN Cầu Giấy" />
          <Field label="Số tài khoản" name="sepay_account_number" value={val('sepay_account_number')} onChange={set} />
          <Field label="Tên chủ tài khoản" name="sepay_account_name" value={val('sepay_account_name')} onChange={set} />
          <Field label="Webhook Secret (SePay gọi POST /api/public/sepay-webhook)" name="sepay_webhook_secret" value={val('sepay_webhook_secret')} onChange={set} type="password" />
        </>}

        {activeTab === 'smtp' && <>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" />
        </>}

        {activeTab === 'system' && <>
          <ToggleField label="Bật chế độ bảo trì (ẩn website, chỉ admin truy cập được)" name="maintenance_mode" value={val('maintenance_mode')} onChange={set} />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Cấu hình Cloudinary để upload &amp; quản lý ảnh (hero slide, tin đăng, avatar).</p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" />
          <Field label="Thư mục lưu ảnh" name="cloudinary_folder" value={val('cloudinary_folder')} onChange={set} placeholder="rao-nha" />
        </>}

        {activeTab === 'integrations' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>API keys cho tích hợp bên ngoài.</p>
          <Field label="Unsplash Access Key" name="unsplash_access_key" value={val('unsplash_access_key')} onChange={set} />
        </>}

        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
