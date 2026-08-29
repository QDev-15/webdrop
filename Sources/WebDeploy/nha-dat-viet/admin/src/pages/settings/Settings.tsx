import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type Values = Record<string, string>

interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'image' | 'number'
  placeholder?: string
  hint?: string
}

const TABS: { id: string; label: string; fields: FieldDef[] }[] = [
  {
    id: 'general', label: 'Thông tin chung',
    fields: [
      { key: 'site_name', label: 'Tên website' },
      { key: 'site_tagline', label: 'Slogan / Tagline' },
      { key: 'site_description', label: 'Mô tả ngắn', type: 'textarea' },
      { key: 'site_logo', label: 'Logo', type: 'image' },
      { key: 'site_favicon', label: 'Favicon', type: 'image' },
      { key: 'site_email', label: 'Email liên hệ' },
      { key: 'site_phone', label: 'Hotline', hint: 'Vd: 1900 6789' },
      { key: 'site_phone2', label: 'SĐT di động', hint: 'Vd: 0909 888 777' },
      { key: 'site_address', label: 'Địa chỉ văn phòng', type: 'textarea' },
      { key: 'working_hours', label: 'Giờ làm việc' },
    ],
  },
  {
    id: 'seo', label: 'SEO',
    fields: [
      { key: 'meta_title', label: 'Meta Title' },
      { key: 'meta_description', label: 'Meta Description', type: 'textarea' },
      { key: 'meta_keywords', label: 'Meta Keywords', hint: 'Phân cách bằng dấu phẩy' },
    ],
  },
  {
    id: 'social', label: 'Mạng xã hội',
    fields: [
      { key: 'social_facebook', label: 'Facebook URL' },
      { key: 'social_youtube', label: 'YouTube URL' },
      { key: 'zalo_phone', label: 'Số Zalo (nút chat nổi)', hint: 'Chỉ nhập số, vd: 0909888777' },
    ],
  },
  {
    id: 'footer', label: 'Footer',
    fields: [
      { key: 'footer_description', label: 'Mô tả footer', type: 'textarea' },
      { key: 'footer_copyright', label: 'Dòng bản quyền' },
    ],
  },
  {
    id: 'contact', label: 'Liên hệ',
    fields: [
      { key: 'contact_map_lat', label: 'Vĩ độ bản đồ (lat)', type: 'number' },
      { key: 'contact_map_lng', label: 'Kinh độ bản đồ (lng)', type: 'number' },
    ],
  },
  {
    id: 'stats', label: '📊 Số liệu thống kê',
    fields: [
      { key: 'stat_listings', label: 'Số tin đăng đã xử lý' },
      { key: 'stat_deals', label: 'Số giao dịch thành công' },
      { key: 'stat_experience_years', label: 'Số năm kinh nghiệm' },
      { key: 'stat_satisfaction_percent', label: 'Tỷ lệ khách hàng hài lòng (%)' },
      { key: 'stat_agents_count', label: 'Số chuyên viên tư vấn' },
    ],
  },
  {
    id: 'about', label: '📖 Giới thiệu',
    fields: [
      { key: 'about_story_title', label: 'Tiêu đề câu chuyện' },
      { key: 'about_story_text1', label: 'Đoạn 1', type: 'textarea' },
      { key: 'about_story_text2', label: 'Đoạn 2', type: 'textarea' },
      { key: 'about_story_image', label: 'Ảnh minh họa', type: 'image' },
    ],
  },
  {
    id: 'design', label: '🖼 Ảnh banner trang con',
    fields: [
      { key: 'banner_properties', label: 'Banner trang Bất động sản', type: 'image' },
      { key: 'banner_projects', label: 'Banner trang Dự án', type: 'image' },
      { key: 'banner_about', label: 'Banner trang Giới thiệu', type: 'image' },
      { key: 'banner_contact', label: 'Banner trang Liên hệ', type: 'image' },
      { key: 'banner_privacy', label: 'Banner trang Chính sách bảo mật', type: 'image' },
      { key: 'banner_terms', label: 'Banner trang Điều khoản sử dụng', type: 'image' },
    ],
  },
  {
    id: 'smtp', label: 'SMTP',
    fields: [
      { key: 'smtp_host', label: 'SMTP Host' },
      { key: 'smtp_port', label: 'SMTP Port', type: 'number' },
      { key: 'smtp_user', label: 'SMTP User' },
      { key: 'smtp_pass', label: 'SMTP Password' },
      { key: 'smtp_from_name', label: 'Tên người gửi' },
      { key: 'smtp_from_email', label: 'Email người gửi' },
    ],
  },
  {
    id: 'system', label: 'Nâng cao',
    fields: [
      { key: 'ga_id', label: 'Google Analytics ID' },
      { key: 'custom_scripts', label: 'Script tùy chỉnh (chèn vào <head>)', type: 'textarea' },
    ],
  },
  {
    id: 'cloudinary', label: '☁️ Cloudinary',
    fields: [
      { key: 'cloudinary_cloud_name', label: 'Cloud Name' },
      { key: 'cloudinary_api_key', label: 'API Key' },
      { key: 'cloudinary_api_secret', label: 'API Secret' },
      { key: 'cloudinary_folder', label: 'Thư mục lưu trữ' },
    ],
  },
  {
    id: 'integrations', label: '🔌 Tích hợp',
    fields: [
      { key: 'unsplash_access_key', label: 'Unsplash Access Key', hint: 'Dùng để tìm ảnh miễn phí trong ImageField' },
    ],
  },
]

export default function Settings() {
  const [val, setVal] = useState<Values>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    api.get<Values>('/settings').then(setVal).finally(() => setLoading(false))
  }, [])

  function set(key: string, v: string) { setVal(prev => ({ ...prev, [key]: v })) }

  async function handleSave() {
    setSaving(true); setMsg(null)
    try {
      await api.post('/settings', val)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công!' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Lưu thất bại.' })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  const tab = TABS.find(t => t.id === activeTab)!

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý cấu hình website Nhà Đất Việt</div>
        </div>
        <button onClick={handleSave} className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
      </div>

      {msg && <div className={msg.type === 'success' ? 'form-success-banner' : 'form-error-banner'}>{msg.text}</div>}

      <div className="settings-tabs" style={{ flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <div key={t.id} className={'settings-tab' + (activeTab === t.id ? ' active' : '')} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        {tab.fields.map(f => (
          <div className="form-group" key={f.key}>
            <label className="form-label">{f.label}</label>
            {f.type === 'image' ? (
              <ImageField value={val[f.key] ?? ''} onChange={v => set(f.key, v)} />
            ) : f.type === 'textarea' ? (
              <textarea className="form-control" value={val[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
            ) : (
              <input
                type={f.type === 'number' ? 'number' : 'text'}
                className="form-control"
                value={val[f.key] ?? ''}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            )}
            {f.hint && <div className="form-hint">{f.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
