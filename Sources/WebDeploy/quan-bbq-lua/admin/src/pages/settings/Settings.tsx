import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'seo', label: 'SEO' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'footer', label: 'Footer' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'smtp', label: 'SMTP' },
  { key: 'system', label: 'Nâng cao' },
  { key: 'bbq', label: 'BBQ & Nội dung' },
  { key: 'cloudinary', label: 'Cloudinary' },
  { key: 'integrations', label: 'Tích hợp' },
]

export default function Settings() {
  const [data, setData] = useState<SettingsMap>({})
  const [tab, setTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setData)
      .catch(() => setError('Không tải được cài đặt.'))
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setData(d => ({ ...d, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setSuccess(''); setError('')
    try {
      await api.post('/settings', data)
      setSuccess('Đã lưu cài đặt thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Lưu thất bại. Vui lòng thử lại.')
    } finally { setSaving(false) }
  }

  function field(key: string, label: string, type = 'text', placeholder = '') {
    return (
      <div className="form-group" key={key}>
        <label className="form-label">{label}</label>
        <input
          type={type}
          className="form-control"
          value={data[key] ?? ''}
          onChange={e => set(key, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    )
  }

  function textarea(key: string, label: string, rows = 3) {
    return (
      <div className="form-group" key={key}>
        <label className="form-label">{label}</label>
        <textarea
          className="form-control"
          value={data[key] ?? ''}
          onChange={e => set(key, e.target.value)}
          rows={rows}
        />
      </div>
    )
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý thông tin và cấu hình website</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={tab === t.key ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}
          >
            {t.label}
          </button>
        ))}
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSave}>
        <div className="card">
          {tab === 'general' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Thông tin chung</div>
              {field('site_name', 'Tên quán', 'text', 'BBQ Lửa Hồng')}
              {field('site_tagline', 'Slogan', 'text', 'Thịt nướng than hoa tươi ngon...')}
              {field('site_phone', 'Số điện thoại', 'tel', '0901 234 567')}
              {field('site_email', 'Email', 'email', 'info@bbqluahong.vn')}
              {textarea('site_address', 'Địa chỉ')}
              {textarea('working_hours', 'Giờ mở cửa')}
              {field('zalo_number', 'Số Zalo', 'text', '0901234567')}
            </div>
          )}

          {tab === 'seo' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>SEO</div>
              {field('meta_title', 'Tiêu đề trang (Title)')}
              {textarea('meta_description', 'Mô tả trang (Description)', 2)}
              {field('meta_keywords', 'Từ khóa (Keywords)')}
            </div>
          )}

          {tab === 'social' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Mạng xã hội</div>
              {field('facebook', 'Facebook URL', 'url')}
              {field('instagram', 'Instagram URL', 'url')}
              {field('tiktok', 'TikTok URL', 'url')}
              {field('zalo', 'Zalo URL', 'url')}
            </div>
          )}

          {tab === 'footer' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Footer</div>
              {textarea('footer_desc', 'Mô tả footer', 2)}
              {field('footer_copy', 'Copyright text')}
            </div>
          )}

          {tab === 'contact' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Thông tin liên hệ</div>
              {textarea('map_embed', 'Google Maps Embed (iframe code)', 4)}
              {textarea('contact_note', 'Lưu ý đặt bàn', 2)}
            </div>
          )}

          {tab === 'smtp' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>SMTP Email</div>
              {field('smtp_host', 'SMTP Host', 'text', 'smtp.gmail.com')}
              {field('smtp_port', 'SMTP Port', 'text', '587')}
              {field('smtp_user', 'SMTP Username / Email')}
              {field('smtp_pass', 'SMTP Password', 'password')}
              {field('smtp_from', 'Email gửi đi')}
            </div>
          )}

          {tab === 'system' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Nâng cao</div>
              <div className="form-group">
                <label className="form-label">Chế độ bảo trì</label>
                <select className="form-control" value={data['maintenance_mode'] ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                  <option value="0">Tắt (website hoạt động bình thường)</option>
                  <option value="1">Bật (website hiển thị trang bảo trì)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cho phép đăng ký tài khoản</label>
                <select className="form-control" value={data['allow_register'] ?? '0'} onChange={e => set('allow_register', e.target.value)}>
                  <option value="0">Không cho phép</option>
                  <option value="1">Cho phép</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'bbq' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>BBQ & Nội dung trang chủ</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>Thống kê hiển thị trên hero section</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {field('stat_meats', 'Số loại thịt & hải sản', 'text', '60')}
                {field('stat_seats', 'Số chỗ ngồi', 'text', '200')}
                {field('stat_years', 'Năm kinh nghiệm', 'text', '8')}
                {field('stat_rating', 'Điểm đánh giá Google', 'text', '4.9')}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>Nội dung Hero Section</div>
                {field('hero_badge', 'Hero Badge text')}
                {field('hero_title', 'Hero Title')}
                {textarea('hero_sub', 'Hero Subtitle', 2)}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>Nội dung About Section</div>
                {field('about_title', 'About Title')}
                {textarea('about_desc', 'About Description', 3)}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>Nội dung CTA Section</div>
                {field('cta_title', 'CTA Title')}
                {textarea('cta_sub', 'CTA Subtitle', 2)}
              </div>
            </div>
          )}

          {tab === 'cloudinary' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Cloudinary — Lưu trữ ảnh đám mây</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.6 }}>
                Cấu hình Cloudinary để upload ảnh lên đám mây. Không bắt buộc — để trống nếu dùng upload local.
              </div>
              {field('cloudinary_cloud_name', 'Cloud Name')}
              {field('cloudinary_upload_preset', 'Upload Preset')}
              {field('cloudinary_api_key', 'API Key')}
            </div>
          )}

          {tab === 'integrations' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Tích hợp bên thứ ba</div>
              <div className="form-group">
                <label className="form-label">Unsplash Access Key</label>
                <input
                  type="text"
                  className="form-control"
                  value={data['unsplash_access_key'] ?? 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY'}
                  onChange={e => set('unsplash_access_key', e.target.value)}
                  placeholder="Unsplash API Access Key"
                />
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
                  Dùng để tìm kiếm ảnh miễn phí từ Unsplash khi thêm ảnh vào admin.
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </form>
    </div>
  )
}
