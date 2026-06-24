import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: 'Thông tin chung' },
  { key: 'seo',         label: 'SEO' },
  { key: 'social',      label: 'Mạng xã hội' },
  { key: 'footer',      label: 'Footer' },
  { key: 'contact',     label: 'Liên hệ' },
  { key: 'about',       label: 'Giới thiệu' },
  { key: 'booking',     label: 'Đặt lịch' },
  { key: 'smtp',        label: 'SMTP' },
  { key: 'system',      label: 'Nâng cao' },
  { key: 'cloudinary',  label: 'Cloudinary' },
  { key: 'integrations',label: 'Tích hợp' },
]

export default function Settings() {
  const [tab, setTab] = useState('general')
  const [form, setForm] = useState<SettingsMap>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SettingsMap>('/settings').then(d => {
      setForm(d)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))
  const field = (key: string, label: string, type = 'text', placeholder = '') => (
    <div key={key} style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea value={form[key] ?? ''} onChange={e => set(key, e.target.value)}
          placeholder={placeholder} rows={3}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', resize: 'vertical', outline: 'none' }} />
      ) : (
        <input type={type} value={form[key] ?? ''} onChange={e => set(key, e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', outline: 'none' }} />
      )}
    </div>
  )

  const handleSave = async () => {
    setSaving(true); setMsg('')
    try {
      await api.post('/settings/update', form)
      setMsg('Đã lưu cài đặt thành công!')
    } catch (e) {
      setMsg('Lưu thất bại: ' + (e instanceof Error ? e.message : 'Lỗi không xác định'))
    } finally { setSaving(false) }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', padding: 20 }}>Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt hệ thống</div>
          <div className="page-sub">Quản lý thông tin, nội dung và các tích hợp</div>
        </div>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>

      {msg && (
        <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 20, fontSize: 13.5,
          background: msg.startsWith('Đã lưu') ? 'var(--accent-light)' : '#fff0f0',
          color: msg.startsWith('Đã lưu') ? 'var(--accent)' : 'var(--danger)',
          border: `1px solid ${msg.startsWith('Đã lưu') ? '#c3e6d8' : '#fdd'}` }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t.key ? 600 : 400, fontFamily: 'var(--sans)',
              background: tab === t.key ? 'var(--accent)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--text-2)',
              transition: 'all .15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {tab === 'general' && (
          <>
            {field('site_name',    'Tên website',       'text', 'Tâm Thư Massage')}
            {field('site_email',   'Email',             'email')}
            {field('site_phone',   'Số điện thoại',     'text', '0901 234 567')}
            {field('site_address', 'Địa chỉ',           'textarea')}
            {field('working_hours','Giờ mở cửa',        'text', 'T2-T6: 9:00-21:00 | T7-CN: 8:00-22:00')}
            {field('zalo_number',  'Số Zalo',           'text', '0901234567')}
            {field('logo_url',     'URL Logo',          'text')}
          </>
        )}
        {tab === 'seo' && (
          <>
            {field('meta_title',       'Meta Title',       'text')}
            {field('meta_description', 'Meta Description', 'textarea')}
            {field('meta_keywords',    'Meta Keywords',    'text')}
          </>
        )}
        {tab === 'social' && (
          <>
            {field('facebook',  'Facebook URL',  'text')}
            {field('instagram', 'Instagram URL', 'text')}
            {field('youtube',   'YouTube URL',   'text')}
            {field('tiktok',    'TikTok URL',    'text')}
            {field('zalo',      'Zalo URL',      'text')}
          </>
        )}
        {tab === 'footer' && (
          <>
            {field('footer_desc', 'Mô tả footer', 'textarea')}
            {field('footer_copy', 'Bản quyền',    'text')}
          </>
        )}
        {tab === 'contact' && (
          <>
            {field('map_embed',    'Google Maps Embed (iframe src)', 'textarea')}
            {field('phone2',       'Số điện thoại thứ 2',           'text')}
            {field('hours_weekday','Giờ thứ 2-6',                   'text', '9:00 - 21:00')}
            {field('hours_weekend','Giờ thứ 7-CN',                  'text', '8:00 - 22:00')}
            {field('hours_holiday','Giờ lễ tết',                    'text', '9:00 - 20:00')}
          </>
        )}
        {tab === 'about' && (
          <>
            {field('about_title',      'Tiêu đề section giới thiệu', 'text')}
            {field('about_desc',       'Mô tả section giới thiệu',   'textarea')}
            {field('stat_clients',     'Số khách hàng',              'text', '1200')}
            {field('stat_years',       'Năm kinh nghiệm',            'text', '8')}
            {field('stat_therapists',  'Số chuyên viên',             'text', '12')}
            {field('stat_return_rate', 'Tỉ lệ quay lại (%)',         'text', '98')}
          </>
        )}
        {tab === 'booking' && (
          <>
            {field('booking_confirm_time',   'Thời gian xác nhận (phút)', 'text', '30')}
            {field('booking_cancel_policy',  'Chính sách hủy lịch',       'textarea')}
          </>
        )}
        {tab === 'smtp' && (
          <>
            {field('smtp_host',       'SMTP Host',       'text', 'smtp.gmail.com')}
            {field('smtp_port',       'SMTP Port',       'text', '587')}
            {field('smtp_user',       'SMTP Username',   'text')}
            {field('smtp_pass',       'SMTP Password',   'password')}
            {field('smtp_from_name',  'Tên gửi',         'text')}
            {field('smtp_from_email', 'Email gửi',       'email')}
          </>
        )}
        {tab === 'system' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Chế độ bảo trì</label>
              <select value={form['maintenance_mode'] ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)' }}>
                <option value="0">Tắt (website hoạt động bình thường)</option>
                <option value="1">Bật (hiện thị trang bảo trì)</option>
              </select>
            </div>
            {field('items_per_page', 'Số mục mỗi trang', 'text', '20')}
          </>
        )}
        {tab === 'cloudinary' && (
          <>
            <div style={{ padding: '10px 14px', background: 'var(--warm)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
              Cấu hình Cloudinary để lưu trữ ảnh trên cloud. Để trống nếu dùng lưu trữ cục bộ (local).
            </div>
            {field('cloudinary_cloud_name',   'Cloud Name',     'text')}
            {field('cloudinary_api_key',      'API Key',        'text')}
            {field('cloudinary_api_secret',   'API Secret',     'password')}
            {field('cloudinary_upload_preset','Upload Preset',  'text')}
          </>
        )}
        {tab === 'integrations' && (
          <>
            <div style={{ padding: '10px 14px', background: 'var(--warm)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
              Cấu hình các tích hợp bên ngoài.
            </div>
            {field('unsplash_access_key', 'Unsplash Access Key', 'text', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY')}
            {field('google_analytics',    'Google Analytics ID', 'text', 'G-XXXXXXXXXX')}
          </>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  )
}
