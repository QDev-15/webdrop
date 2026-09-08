import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'smtp', label: 'SMTP' },
  { id: 'system', label: 'Nâng cao' },
  { id: 'cloudinary', label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [val, setVal] = useState<SettingsMap>({})
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings').then(setVal).catch(() => setError('Không tải được cài đặt.')).finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) { setVal(v => ({ ...v, [key]: value })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setSuccess(''); setError('')
    try {
      await api.post('/settings/update', val)
      setSuccess('Đã lưu cài đặt.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const field = (key: string, label: string, placeholder = '', type = 'text') => (
    <div className="form-group" key={key}>
      <label className="form-label" htmlFor={`settings-${key}`}>{label}</label>
      <input id={`settings-${key}`} type={type} className="form-control" value={val[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
    </div>
  )

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Cài đặt</div><div className="page-sub">Cấu hình chung của hệ thống POS</div></div></div>

      <div className="settings-tabs" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.id} type="button" className={activeTab === t.id ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <form onSubmit={handleSave} className="card">
        {activeTab === 'general' && (
          <>
            {field('site_name', 'Tên cửa hàng', 'POS Bán Hàng')}
            {field('site_tagline', 'Slogan / mô tả ngắn')}
            {field('site_description', 'Mô tả chi tiết')}
            <div className="form-group"><ImageField label="Logo" value={val.site_logo ?? ''} onChange={v => set('site_logo', v)} /></div>
            <div className="form-group"><ImageField label="Favicon" value={val.site_favicon ?? ''} onChange={v => set('site_favicon', v)} /></div>
            {field('site_email', 'Email', 'info@pos-shop.com')}
            {field('site_phone', 'Điện thoại', '0900 000 000')}
            {field('site_address', 'Địa chỉ')}
            {field('working_hours', 'Giờ làm việc')}
          </>
        )}
        {activeTab === 'seo' && (
          <>
            {field('meta_title', 'Meta Title')}
            {field('meta_description', 'Meta Description')}
            {field('meta_keywords', 'Từ khoá (phân cách bởi dấu phẩy)')}
          </>
        )}
        {activeTab === 'social' && (
          <>
            {field('facebook_url', 'Facebook')}
            {field('instagram_url', 'Instagram')}
            {field('zalo_url', 'Zalo')}
          </>
        )}
        {activeTab === 'footer' && (
          <>
            {field('footer_copyright', 'Dòng bản quyền')}
            {field('footer_description', 'Mô tả footer')}
          </>
        )}
        {activeTab === 'contact' && (
          <>
            {field('site_email', 'Email nhận liên hệ')}
            {field('site_phone', 'Số điện thoại')}
            {field('site_address', 'Địa chỉ cửa hàng')}
            {field('working_hours', 'Giờ làm việc')}
          </>
        )}
        {activeTab === 'smtp' && (
          <>
            {field('smtp_host', 'SMTP Host', 'smtp.gmail.com')}
            {field('smtp_port', 'SMTP Port', '587')}
            {field('smtp_user', 'SMTP User')}
            {field('smtp_pass', 'SMTP Password', '', 'password')}
          </>
        )}
        {activeTab === 'system' && (
          <>
            {field('currency_symbol', 'Ký hiệu tiền tệ', 'đ')}
          </>
        )}
        {activeTab === 'cloudinary' && (
          <>
            {field('cloudinary_cloud_name', 'Cloud Name')}
            {field('cloudinary_api_key', 'API Key')}
            {field('cloudinary_api_secret', 'API Secret', '', 'password')}
            {field('cloudinary_folder', 'Thư mục lưu ảnh', 'webdrop')}
          </>
        )}
        {activeTab === 'integrations' && (
          <>
            {field('unsplash_access_key', 'Unsplash Access Key')}
          </>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
