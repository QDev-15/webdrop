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
      { key: 'site_name', label: 'Tên dự án' },
      { key: 'site_tagline', label: 'Slogan / Tagline' },
      { key: 'site_description', label: 'Mô tả ngắn', type: 'textarea' },
      { key: 'site_logo', label: 'Logo', type: 'image' },
      { key: 'site_favicon', label: 'Favicon', type: 'image' },
      { key: 'site_email', label: 'Email liên hệ' },
      { key: 'site_phone', label: 'Hotline chính', hint: 'Vd: 1900 6868' },
      { key: 'site_phone2', label: 'SĐT tư vấn viên', hint: 'Vd: 0909 888 686' },
      { key: 'site_address', label: 'Địa chỉ nhà mẫu / VP kinh doanh', type: 'textarea' },
      { key: 'working_hours', label: 'Giờ đón tiếp nhà mẫu' },
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
      { key: 'social_linkedin', label: 'LinkedIn URL' },
      { key: 'social_youtube', label: 'YouTube URL' },
      { key: 'zalo_phone', label: 'Số Zalo (nút chat nổi)', hint: 'Chỉ nhập số, vd: 0909888686' },
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
      { key: 'sales_office_name', label: 'Tên Phòng Kinh doanh dự án' },
      { key: 'sales_agent_avatar', label: 'Ảnh đại diện Phòng KD', type: 'image' },
      { key: 'contact_map_lat', label: 'Vĩ độ bản đồ (lat)', type: 'number' },
      { key: 'contact_map_lng', label: 'Kinh độ bản đồ (lng)', type: 'number' },
    ],
  },
  {
    id: 'project', label: '🏢 Dự án',
    fields: [
      { key: 'developer_name', label: 'Tên chủ đầu tư' },
      { key: 'developer_founded', label: 'Năm thành lập CĐT' },
      { key: 'developer_experience_years', label: 'Số năm kinh nghiệm CĐT' },
      { key: 'developer_projects_delivered', label: 'Số dự án đã bàn giao' },
      { key: 'developer_units_delivered', label: 'Số căn hộ đã bàn giao' },
      { key: 'developer_bio', label: 'Giới thiệu chủ đầu tư', type: 'textarea' },
      { key: 'project_location', label: 'Vị trí dự án' },
      { key: 'tower1_name', label: 'Tên tháp 1' },
      { key: 'tower1_floors', label: 'Số tầng tháp 1' },
      { key: 'tower1_units', label: 'Số căn tháp 1' },
      { key: 'tower2_name', label: 'Tên tháp 2' },
      { key: 'tower2_floors', label: 'Số tầng tháp 2' },
      { key: 'tower2_units', label: 'Số căn tháp 2' },
      { key: 'total_units', label: 'Tổng số căn hộ' },
      { key: 'site_area', label: 'Diện tích dự án (m²)' },
      { key: 'density', label: 'Mật độ xây dựng (%)' },
      { key: 'legal_status', label: 'Tình trạng pháp lý', type: 'textarea' },
      { key: 'progress_percent', label: 'Tiến độ tổng thể (%)' },
      { key: 'progress_label', label: 'Mô tả tiến độ hiện tại' },
      { key: 'progress_updated', label: 'Ngày cập nhật tiến độ' },
      { key: 'groundbreaking', label: 'Ngày khởi công' },
      { key: 'handover', label: 'Ngày dự kiến bàn giao' },
      { key: 'management_fee', label: 'Phí quản lý (đ/m²/tháng)' },
      { key: 'bank_partners', label: 'Ngân hàng liên kết', hint: 'Phân cách bằng dấu phẩy' },
      { key: 'loan_support_percent', label: 'Tỷ lệ hỗ trợ vay (%)' },
      { key: 'loan_grace_months', label: 'Số tháng ân hạn gốc' },
    ],
  },
  {
    id: 'content', label: '📝 Nội dung mô tả',
    fields: [
      { key: 'content_home_about', label: 'Trang chủ — đoạn "Về dự án"', type: 'textarea' },
      { key: 'content_home_location_feature', label: 'Trang chủ — mô tả vị trí ngắn', type: 'textarea' },
      { key: 'content_home_progress', label: 'Trang chủ — đoạn tiến độ xây dựng', type: 'textarea' },
      { key: 'content_about_intro', label: 'Tổng quan dự án — đoạn giới thiệu đầu trang', type: 'textarea' },
      { key: 'content_about_location', label: 'Tổng quan dự án — đoạn vị trí', type: 'textarea' },
      { key: 'content_about_progress', label: 'Tổng quan dự án — đoạn tiến độ chi tiết', type: 'textarea' },
      { key: 'content_amenities_intro', label: 'Trang tiện ích — đoạn giới thiệu tiện ích xung quanh', type: 'textarea' },
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
          <div className="page-sub">Quản lý cấu hình website Green Valley Residence</div>
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
