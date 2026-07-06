'use client'
import AdminLayout from '@/components/admin/AdminLayout'
import { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'

const ImageField = dynamic(() => import('@/components/admin/ImageField'), { ssr: false })

interface SettingField {
  key: string
  label: string
  type?: 'text' | 'email' | 'password' | 'textarea' | 'image' | 'toggle'
  placeholder?: string
  hint?: string
  rows?: number
}

interface SettingGroup {
  label: string
  key: string
  icon: string
  fields: SettingField[]
}

const FOOTER_LINKS_HINT = 'Mỗi dòng: Tên hiển thị|/đường-dẫn'

const SETTING_GROUPS: SettingGroup[] = [
  {
    label: 'Thông tin chung', key: 'general', icon: '🏢',
    fields: [
      { key: 'site_name',        label: 'Tên công ty / Website', placeholder: 'webdrop.store' },
      { key: 'site_description', label: 'Mô tả ngắn (hiện footer)', placeholder: 'Nền tảng mẫu website chuyên nghiệp...', type: 'textarea', rows: 2 },
      { key: 'site_logo',    label: 'Logo', type: 'image', hint: 'Hiển thị trên nav và footer' },
      { key: 'site_favicon', label: 'Favicon (icon tab trình duyệt)', type: 'image', hint: 'Ảnh vuông PNG 32×32 hoặc 64×64. Có hiệu lực sau khi reload trang.' },
      { key: 'site_email',       label: 'Email liên hệ',  type: 'email',    placeholder: 'hello@webdrop.store' },
      { key: 'site_phone',       label: 'Zalo / Điện thoại',               placeholder: '0988 632 841' },
      { key: 'site_address',     label: 'Địa chỉ',                          placeholder: 'Cầu Giấy, Hà Nội, Việt Nam' },
      { key: 'working_hours',    label: 'Giờ hỗ trợ',                       placeholder: '8:30–18:00 · T2–T7' },
    ],
  },
  {
    label: 'Mạng xã hội', key: 'social', icon: '📡',
    fields: [
      { key: 'social_facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/webdrop.store' },
      { key: 'social_zalo',      label: 'Số Zalo',       placeholder: '0988632841' },
      { key: 'social_youtube',   label: 'YouTube URL',   placeholder: 'https://youtube.com/@webdrop' },
      { key: 'social_tiktok',    label: 'TikTok URL',    placeholder: 'https://tiktok.com/@webdrop' },
      { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/webdrop.store' },
    ],
  },
  {
    label: 'Footer', key: 'footer', icon: '🔗',
    fields: [
      {
        key: 'footer_services', label: 'Cột "Dịch vụ"',
        type: 'textarea', rows: 6, hint: FOOTER_LINKS_HINT,
        placeholder: 'Thư viện mẫu|/templates\nGói Template|/pricing#goi-template\nGói Web cơ bản|/pricing#goi-web-co-ban\nGói Theo Yêu cầu|/pricing#goi-theo-yeu-cau\nQuy trình làm việc|/how-it-works',
      },
      {
        key: 'footer_resources', label: 'Cột "Tài nguyên"',
        type: 'textarea', rows: 5, hint: FOOTER_LINKS_HINT,
        placeholder: 'Hướng dẫn chọn mẫu|/faq\nBlog & Tips|/blog\nFAQ|/faq',
      },
      {
        key: 'footer_company', label: 'Cột "Công ty"',
        type: 'textarea', rows: 5, hint: FOOTER_LINKS_HINT,
        placeholder: 'Về chúng tôi|/about\nLiên hệ|/contact\nChính sách bảo mật|/policies/privacy\nĐiều khoản|/policies/terms',
      },
      {
        key: 'footer_map_url', label: 'Google Maps Embed URL',
        type: 'textarea', rows: 3,
        hint: 'Lấy tại: Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép URL trong src="..."',
        placeholder: 'https://www.google.com/maps/embed?pb=...',
      },
      {
        key: 'footer_legal', label: 'Link pháp lý (chân trang)',
        type: 'textarea', rows: 4, hint: FOOTER_LINKS_HINT,
        placeholder: 'Chính sách bảo mật|/policies/privacy\nĐiều khoản sử dụng|/policies/terms\nChính sách hoàn tiền|/policies/refund',
      },
      {
        key: 'footer_copyright', label: 'Dòng bản quyền (sau năm & tên)',
        hint: 'Hiển thị: © 2026 {tên web} · [nội dung này]',
        placeholder: 'Made in Vietnam 🇻🇳',
      },
    ],
  },
  {
    label: 'SEO', key: 'seo', icon: '🔍',
    fields: [
      { key: 'meta_title',            label: 'Meta Title',            placeholder: 'webdrop.store — Mẫu web đẹp, triển khai trọn gói' },
      { key: 'meta_description',      label: 'Meta Description',      placeholder: 'Hơn 30 mẫu website Bootstrap 5...', type: 'textarea', rows: 2 },
      { key: 'google_analytics_id',   label: 'Google Analytics ID (GA4)',   placeholder: 'G-XXXXXXXXXX', hint: 'Dùng khi KHÔNG dùng GTM. Nếu đã có GTM thì cấu hình GA4 bên trong GTM.' },
      { key: 'gtm_id',               label: 'Google Tag Manager ID',  placeholder: 'GTM-XXXXXXX',  hint: 'Khuyên dùng — quản lý GA4, Pixel, v.v. mà không cần sửa code.' },
    ],
  },
  {
    label: 'SMTP / Email', key: 'smtp', icon: '📧',
    fields: [
      { key: 'smtp_host',       label: 'SMTP Host',        placeholder: 'smtp.gmail.com' },
      { key: 'smtp_port',       label: 'SMTP Port',        placeholder: '587' },
      { key: 'smtp_user',       label: 'SMTP User',        placeholder: 'your@gmail.com' },
      { key: 'smtp_password',   label: 'SMTP Password',    type: 'password', placeholder: '••••••••' },
      { key: 'smtp_from_name',  label: 'Tên người gửi',   placeholder: 'webdrop.store' },
      { key: 'smtp_from_email', label: 'Email người gửi', type: 'email', placeholder: 'noreply@webdrop.store' },
      {
        key: 'email_send_download',
        label: 'Tự động gửi link download qua email',
        type: 'toggle',
        hint: 'Khi bật: sau khi khách thanh toán, hệ thống gửi link download về email khách hàng. Yêu cầu SMTP đã cấu hình đầy đủ.',
      },
    ],
  },
  {
    label: 'Cloudinary', key: 'cloudinary', icon: '☁️',
    fields: [
      {
        key: 'cloudinary_cloud_name',
        label: 'Cloud Name',
        placeholder: 'your-cloud-name',
        hint: 'Lấy tại cloudinary.com → Dashboard → Cloud Name',
      },
      {
        key: 'cloudinary_api_key',
        label: 'API Key',
        placeholder: '123456789012345',
      },
      {
        key: 'cloudinary_api_secret',
        label: 'API Secret',
        type: 'password',
        placeholder: '••••••••••••••••••••••••',
        hint: 'Dashboard → Settings → Access Keys → API Secret',
      },
      {
        key: 'cloudinary_folder',
        label: 'Upload Folder (tuỳ chọn)',
        placeholder: 'webdrop',
        hint: 'Thư mục lưu ảnh trên Cloudinary. Mặc định: webdrop',
      },
    ],
  },
  {
    label: 'SePay / Ngân hàng', key: 'sepay', icon: '🏦',
    fields: [
      {
        key: 'sepay_api_key',
        label: 'SePay API Access',
        type: 'password',
        placeholder: 'Dán API Access từ my.sepay.vn → Công ty → API Access',
        hint: 'Token này dùng để xác thực webhook Sepay gửi đến VÀ để đồng bộ thông tin tài khoản ngân hàng bên dưới. Chỉ 1 token duy nhất — Sepay không cấp token riêng cho từng việc.',
      },
      { key: 'sepay_bank_name',    label: 'Ngân hàng (tên hiển thị)', placeholder: 'MB Bank' },
      { key: 'sepay_bank_code',    label: 'Mã ngân hàng (VietQR)',    placeholder: 'MB', hint: 'Mã ngắn dùng để tạo QR — VD: MB, VCB, TCB...' },
      { key: 'sepay_account_no',   label: 'Số tài khoản',             placeholder: '0988632841' },
      { key: 'sepay_account_name', label: 'Chủ tài khoản',            placeholder: 'NGUYEN HUU QUYNH' },
    ],
  },
  {
    label: 'Tích hợp', key: 'integrations', icon: '🔌',
    fields: [
      {
        key: 'unsplash_access_key',
        label: 'Unsplash Access Key',
        type: 'password',
        placeholder: 'Dán Access Key từ unsplash.com/developers',
        hint: 'Đăng ký miễn phí tại unsplash.com/developers → New Application → copy Access Key. Dùng để tìm kiếm ảnh trong admin.',
      },
      {
        key: 'football_api_key',
        label: 'Football API Key (football-data.org)',
        type: 'password',
        placeholder: 'Dán API key từ football-data.org/account',
        hint: 'Đăng ký miễn phí tại football-data.org → My Account → API Key. Dùng để hiển thị lịch & tỉ số World Cup 2026 tự động.',
      },
      {
        key: 'football_youtube_embed',
        label: 'YouTube Live — ID hoặc URL video',
        placeholder: 'VD: dQw4w9WgXcQ hoặc https://youtu.be/dQw4w9WgXcQ',
        hint: 'Dán ID / URL video YouTube chính thức đang livestream. Hiển thị tự động trên trang Lịch WC 2026. Xóa trắng khi không có stream.',
      },
    ],
  },
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid var(--border)', background: 'var(--bg)',
  fontSize: 13, fontFamily: 'var(--sans)', outline: 'none',
  color: 'var(--text)', boxSizing: 'border-box',
}

export default function AdminSettingsPage() {
  const [values, setValues]       = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [activeGroup, setActiveGroup] = useState('general')
  const [syncing, setSyncing]     = useState(false)
  const [syncMsg, setSyncMsg]     = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => { if (data.settings) setValues(data.settings) })
      .catch(() => {})
  }, [])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: values }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  const set = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }))
  const currentGroup = SETTING_GROUPS.find(g => g.key === activeGroup)!

  async function handleSyncFromSepay() {
    const apiKey = (values.sepay_api_key || '').trim()
    if (!apiKey) {
      setSyncMsg({ type: 'error', text: 'Nhập SePay API Access trước khi đồng bộ' })
      return
    }
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res  = await fetch('/api/admin/settings/sepay-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSyncMsg({ type: 'error', text: data.error || 'Đồng bộ thất bại' })
        return
      }
      setValues(prev => ({
        ...prev,
        sepay_bank_name:    data.bank.bankName,
        sepay_bank_code:    data.bank.bankCode,
        sepay_account_no:   data.bank.accountNo,
        sepay_account_name: data.bank.accountName,
      }))
      setSyncMsg({
        type: data.warning ? 'error' : 'ok',
        text: data.warning || '✓ Đã lấy thông tin tài khoản từ SePay — nhớ nhấn "Lưu cài đặt" để áp dụng',
      })
    } catch {
      setSyncMsg({ type: 'error', text: 'Không kết nối được đến SePay' })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <AdminLayout title="Cài đặt">
      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <div style={{ width: 180, flexShrink: 0 }}>
            {SETTING_GROUPS.map(g => (
              <div key={g.key} onClick={() => setActiveGroup(g.key)}
                style={{
                  padding: '9px 14px', borderRadius: 8, fontSize: 13,
                  cursor: 'pointer', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8,
                  background: activeGroup === g.key ? 'var(--accent-light)' : 'transparent',
                  color: activeGroup === g.key ? 'var(--accent)' : 'var(--text-2)',
                  fontWeight: activeGroup === g.key ? 500 : 400,
                  transition: 'all .15s',
                }}
              >
                <span>{g.icon}</span>{g.label}
              </div>
            ))}
          </div>

          {/* Fields panel */}
          <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{currentGroup.icon} {currentGroup.label}</div>

            {currentGroup.key === 'sepay' && (
              <div style={{ margin: '14px 0 4px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSyncFromSepay}
                  disabled={syncing}
                  style={{
                    padding: '9px 16px', background: 'var(--accent-light)', color: 'var(--accent)',
                    border: '1px solid var(--accent-mid)', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    fontFamily: 'var(--sans)', cursor: syncing ? 'not-allowed' : 'pointer', opacity: syncing ? .7 : 1,
                  }}
                >
                  {syncing ? 'Đang đồng bộ...' : '🔄 Đồng bộ tài khoản từ SePay'}
                </button>
                {syncMsg && (
                  <span style={{ fontSize: 12.5, color: syncMsg.type === 'ok' ? 'var(--accent)' : 'var(--danger)' }}>
                    {syncMsg.text}
                  </span>
                )}
              </div>
            )}

            {/* Footer group: full-width single column */}
            {currentGroup.key === 'footer' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 18 }}>
                {currentGroup.fields.map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{f.label}</label>
                    {f.hint && <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>{f.hint}</div>}
                    <textarea
                      rows={f.rows || 4}
                      value={values[f.key] || ''}
                      onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Other groups: 2-column grid */
              <div className="row g-3" style={{ marginTop: 6 }}>
                {currentGroup.fields.map(f => (
                  <div key={f.key} className={f.type === 'textarea' || f.type === 'image' ? 'col-12' : 'col-md-6'}>
                    {f.type !== 'image' && (
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>{f.label}</label>
                    )}
                    {f.type === 'image' ? (
                      <ImageField
                        label={f.label}
                        hint={f.hint}
                        value={values[f.key] || ''}
                        onChange={v => set(f.key, v)}
                      />
                    ) : f.type === 'textarea' ? (
                      <textarea
                        rows={f.rows || 3}
                        value={values[f.key] || ''}
                        onChange={e => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    ) : f.type === 'toggle' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                        <button
                          type="button"
                          onClick={() => set(f.key, values[f.key] === 'true' ? 'false' : 'true')}
                          style={{
                            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                            background: values[f.key] === 'true' ? 'var(--accent)' : 'var(--border)',
                            position: 'relative', transition: 'background .2s', flexShrink: 0,
                          }}
                        >
                          <span style={{
                            position: 'absolute', top: 3, left: values[f.key] === 'true' ? 23 : 3,
                            width: 18, height: 18, borderRadius: '50%', background: '#fff',
                            transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.2)',
                          }} />
                        </button>
                        <span style={{ fontSize: 13, color: values[f.key] === 'true' ? 'var(--accent)' : 'var(--text-3)', fontWeight: values[f.key] === 'true' ? 500 : 400 }}>
                          {values[f.key] === 'true' ? 'Đang bật' : 'Đang tắt'}
                        </span>
                      </div>
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={values[f.key] || ''}
                        onChange={e => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={inputStyle}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 12, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 13, color: 'var(--accent)' }}>✓ Đã lưu thành công</span>}
          <button type="submit" disabled={saving}
            style={{ padding: '10px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
