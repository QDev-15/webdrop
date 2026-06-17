import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type TabId = 'general' | 'about' | 'seo' | 'social' | 'footer' | 'contact' | 'reservation' | 'smtp' | 'system' | 'cloudinary' | 'integrations'

interface Tab { id: TabId; label: string }

const TABS: Tab[] = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'about',        label: 'Giới thiệu & Bếp trưởng' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'reservation',  label: 'Đặt bàn' },
  { id: 'smtp',         label: 'SMTP Email' },
  { id: 'system',       label: 'Hệ thống' },
  { id: 'cloudinary',   label: 'Cloudinary' },
  { id: 'integrations', label: 'Tích hợp' },
]

export default function Settings() {
  const [tab, setTab] = useState<TabId>('general')
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<Record<string, string>>('/settings').then(d => {
      setValues(d)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) => setValues(v => ({ ...v, [key]: value }))

  async function handleSave() {
    setSaving(true); setMsg(null)
    try {
      await api.post('/settings/update', values)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công!' })
    } catch {
      setMsg({ type: 'error', text: 'Lưu thất bại. Vui lòng thử lại.' })
    } finally { setSaving(false) }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', padding: '32px' }}>Đang tải...</div>

  const Field = ({ label, k, type = 'text', placeholder = '', rows = 0 }: { label: string; k: string; type?: string; placeholder?: string; rows?: number }) => (
    <div>
      <label className="form-label">{label}</label>
      {rows > 0
        ? <textarea className="form-control" rows={rows} value={values[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
        : <input type={type} className="form-control" value={values[k] ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      }
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600 }}>Cài đặt</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-3)', marginTop: '4px' }}>Cấu hình thông tin website nhà hàng</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ fontSize: '13px', padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
              color: tab === t.id ? 'var(--accent)' : 'var(--text-2)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: tab === t.id ? 600 : 400, marginBottom: '-1px' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
        <div style={{ display: 'grid', gap: '20px', maxWidth: '640px' }}>
          {tab === 'general' && <>
            <Field label="Tên nhà hàng" k="site_name" placeholder="Nhà Hàng Nhật Bản Omakase & Sushi" />
            <Field label="Mô tả ngắn" k="site_description" rows={3} placeholder="Nhà hàng Nhật Bản chính thống..." />
            <Field label="Logo URL" k="site_logo" placeholder="https://..." />
            <Field label="Favicon URL" k="site_favicon" placeholder="https://..." />
            <Field label="Email liên hệ" k="site_email" type="email" placeholder="info@nhahangnhat.vn" />
            <Field label="Số điện thoại" k="site_phone" placeholder="0901 234 567" />
            <Field label="Số điện thoại 2" k="site_phone_2" placeholder="" />
            <Field label="Địa chỉ" k="site_address" rows={2} placeholder="Số nhà, Đường, Quận, TP" />
            <Field label="Giờ mở cửa" k="working_hours" rows={3} placeholder="T2-T6: 11:30–22:00 | T7-CN: 11:00–22:30" />
          </>}

          {tab === 'about' && <>
            <Field label="Tiêu đề phần giới thiệu bếp trưởng" k="about_title" />
            <Field label="Nội dung giới thiệu" k="about_content" rows={5} placeholder="Bếp trưởng có hơn 15 năm kinh nghiệm..." />
            <Field label="Ảnh bếp trưởng (URL)" k="about_image" placeholder="https://..." />
            <Field label="Tagline / Slogan bếp trưởng" k="about_tagline" placeholder="15 năm kinh nghiệm tại Tokyo" />
          </>}

          {tab === 'seo' && <>
            <Field label="Meta Title" k="meta_title" />
            <Field label="Meta Description" k="meta_description" rows={3} />
            <Field label="Meta Keywords" k="meta_keywords" />
            <Field label="OG Image URL" k="og_image" placeholder="https://..." />
            <Field label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
          </>}

          {tab === 'social' && <>
            <Field label="Facebook URL" k="social_facebook" placeholder="https://facebook.com/..." />
            <Field label="Instagram URL" k="social_instagram" placeholder="https://instagram.com/..." />
            <Field label="YouTube URL" k="social_youtube" placeholder="https://youtube.com/..." />
            <Field label="TikTok URL" k="social_tiktok" placeholder="https://tiktok.com/..." />
            <Field label="Số Zalo" k="social_zalo" placeholder="0901234567" />
          </>}

          {tab === 'footer' && <>
            <Field label="Copyright" k="footer_copyright" placeholder="© 2024 Nhà Hàng Nhật Bản" />
            <Field label="Mô tả footer" k="footer_description" rows={3} />
            <div>
              <label className="form-label">Hiển thị mạng xã hội</label>
              <select className="form-control" value={values['footer_show_social'] ?? '1'} onChange={e => set('footer_show_social', e.target.value)}>
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
          </>}

          {tab === 'contact' && <>
            <div>
              <label className="form-label">Bật form liên hệ</label>
              <select className="form-control" value={values['contact_form_enabled'] ?? '1'} onChange={e => set('contact_form_enabled', e.target.value)}>
                <option value="1">Bật</option>
                <option value="0">Tắt</option>
              </select>
            </div>
            <Field label="Email nhận liên hệ" k="contact_email_receiver" type="email" />
            <Field label="Google Map Embed URL" k="google_map_embed" placeholder="https://maps.google.com/maps?..." />
          </>}

          {tab === 'reservation' && <>
            <div>
              <label className="form-label">Bật chức năng đặt bàn</label>
              <select className="form-control" value={values['reservation_enabled'] ?? '1'} onChange={e => set('reservation_enabled', e.target.value)}>
                <option value="1">Bật</option>
                <option value="0">Tắt</option>
              </select>
            </div>
            <Field label="Lưu ý đặt cọc Omakase" k="reservation_deposit_note" rows={3} placeholder="Gói Omakase yêu cầu đặt cọc 30% giá trị..." />
            <Field label="Số ghế Sushi Bar Counter" k="sushi_bar_seats" placeholder="8" />
          </>}

          {tab === 'smtp' && <>
            <Field label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
            <Field label="SMTP Port" k="smtp_port" placeholder="587" />
            <Field label="SMTP User" k="smtp_user" placeholder="your@email.com" />
            <Field label="SMTP Password" k="smtp_password" type="password" />
            <Field label="Tên người gửi" k="smtp_from_name" />
            <Field label="Email người gửi" k="smtp_from_email" type="email" />
          </>}

          {tab === 'system' && <>
            <div>
              <label className="form-label">Chế độ bảo trì</label>
              <select className="form-control" value={values['maintenance_mode'] ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                <option value="0">Tắt (website hoạt động bình thường)</option>
                <option value="1">Bật (hiển thị trang bảo trì)</option>
              </select>
            </div>
            <Field label="Thông báo bảo trì" k="maintenance_message" rows={3} />
          </>}

          {tab === 'cloudinary' && <>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>
              Cấu hình Cloudinary để lưu ảnh trên cloud. Tạo tài khoản miễn phí tại{' '}
              <a href="https://cloudinary.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>cloudinary.com</a>.
            </p>
            <Field label="Cloud Name" k="cloudinary_cloud_name" placeholder="your-cloud-name" />
            <Field label="API Key" k="cloudinary_api_key" placeholder="123456789012345" />
            <Field label="API Secret" k="cloudinary_api_secret" type="password" placeholder="••••••••••••••" />
            <Field label="Upload Folder" k="cloudinary_upload_folder" placeholder="nha-hang-nhat-ban" />
          </>}

          {tab === 'integrations' && <>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>
              Cấu hình Unsplash API để tìm kiếm ảnh đẹp miễn phí. Tạo app tại{' '}
              <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a>.
            </p>
            <Field label="Unsplash Access Key" k="unsplash_access_key" placeholder="your-access-key" />
          </>}
        </div>
      </div>

      {msg && (
        <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', fontSize: '13px',
          background: msg.type === 'success' ? 'var(--accent-light)' : '#fff0f0',
          color: msg.type === 'success' ? 'var(--accent)' : 'var(--danger)',
          border: `1px solid ${msg.type === 'success' ? 'var(--accent-light)' : '#fdd'}` }}>
          {msg.text}
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  )
}
