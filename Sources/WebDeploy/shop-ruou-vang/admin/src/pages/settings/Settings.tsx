import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import PaymentSettingsTab from '../../components/PaymentSettingsTab'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
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
        <textarea rows={3} className="form-control" value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} className="form-control" value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} />
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
          <Field label="Tên cửa hàng" name="site_name" value={val('site_name')} onChange={set} placeholder="Mộc Vang" />
          <Field label="Slogan" name="site_tagline" value={val('site_tagline')} onChange={set} placeholder="Rượu vang nhập khẩu chính hãng" />
          <Field label="Số điện thoại" name="site_phone" value={val('site_phone')} onChange={set} placeholder="1900 6868" />
          <Field label="Email" name="site_email" value={val('site_email')} onChange={set} type="email" placeholder="hello@mocvang.vn" />
          <Field label="Địa chỉ showroom" name="site_address" value={val('site_address')} onChange={set} placeholder="88 Đường Đồng Khởi, Quận 1, TP.HCM" />
          <Field label="Giờ mở cửa" name="working_hours" value={val('working_hours')} onChange={set} placeholder="Thứ 2 – Chủ nhật: 9:00 – 21:00" />
          <Field label="Số Zalo (không dấu cách)" name="zalo_number" value={val('zalo_number')} onChange={set} placeholder="0900000000" />
          <Field label="Google Maps embed URL" name="map_embed_url" value={val('map_embed_url')} onChange={set} placeholder="https://maps.google.com/maps?q=...&output=embed" />
          <Field label="Số giấy phép kinh doanh rượu" name="license_number" value={val('license_number')} onChange={set} placeholder="Giấy phép kinh doanh rượu số [XXXX/GP-KDR] · TP. Hồ Chí Minh" />
          <Field label="Ngày kết thúc khuyến mãi (đếm ngược ở trang Khuyến mãi)" name="sale_countdown_end" value={val('sale_countdown_end')} onChange={set} placeholder="2026-09-30T23:59:59" />
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} placeholder="Mộc Vang — Rượu Vang Nhập Khẩu Chính Hãng" />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="facebook" value={val('facebook')} onChange={set} placeholder="https://www.facebook.com/..." />
          <Field label="Instagram URL" name="instagram" value={val('instagram')} onChange={set} placeholder="https://www.instagram.com/..." />
          <Field label="Youtube URL" name="youtube" value={val('youtube')} onChange={set} placeholder="https://www.youtube.com/..." />
        </>}

        {activeTab === 'footer' && <>
          <Field label="Mô tả footer" name="footer_about" value={val('footer_about')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}

        {activeTab === 'smtp' && <>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} placeholder="you@gmail.com" />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="From Email" name="smtp_from" value={val('smtp_from')} onChange={set} placeholder="no-reply@mocvang.vn" />
          <Field label="From Name" name="smtp_from_name" value={val('smtp_from_name')} onChange={set} placeholder="Mộc Vang" />
        </>}

        {activeTab === 'system' && <>
          <ToggleField label="Bật chế độ bảo trì (ẩn website, chỉ admin truy cập được)" name="maintenance_mode" value={val('maintenance_mode')} onChange={set} />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Cấu hình Cloudinary để upload và quản lý ảnh sản phẩm.</p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} placeholder="mycloud" />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} placeholder="123456789012345" />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="Thư mục lưu ảnh" name="cloudinary_folder" value={val('cloudinary_folder')} onChange={set} placeholder="shop-ruou-vang" />
        </>}

        {activeTab === 'integrations' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>API keys cho các tích hợp bên ngoài.</p>
          <Field label="Unsplash Access Key" name="unsplash_access_key" value={val('unsplash_access_key')} onChange={set} placeholder="Unsplash Access Key" />
        </>}

        <div className="form-actions" style={{ marginTop: 32 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
