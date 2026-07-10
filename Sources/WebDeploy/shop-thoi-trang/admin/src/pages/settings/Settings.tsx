import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type Settings = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'hero', label: 'Trang chủ' },
  { id: 'about', label: 'Câu chuyện' },
  { id: 'promo', label: 'Flash Sale' },
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
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

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

  const handleSyncSepay = async () => {
    const apiKey = (val('sepay_webhook_secret') || '').trim()
    if (!apiKey) {
      setSyncMsg({ type: 'error', text: 'Nhập SePay API Access trước khi đồng bộ' })
      return
    }
    setSyncing(true)
    setSyncMsg(null)
    try {
      const data = await api.post<{ ok: boolean; bank: { bank_code: string; account_no: string; account_name: string }; warning?: string }>(
        '/settings/sepay-sync', { api_key: apiKey }
      )
      setSettings(s => ({
        ...s,
        sepay_bank_code:      data.bank.bank_code,
        sepay_account_number: data.bank.account_no,
        sepay_account_name:   data.bank.account_name,
      }))
      setSyncMsg({
        type: data.warning ? 'error' : 'ok',
        text: data.warning || '✓ Đã lấy thông tin tài khoản từ SePay — nhớ nhấn "Lưu cài đặt" để áp dụng',
      })
    } catch (err) {
      setSyncMsg({ type: 'error', text: err instanceof Error ? err.message : 'Đồng bộ thất bại' })
    } finally {
      setSyncing(false)
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
          <Field label="Tên cửa hàng" name="site_name" value={val('site_name')} onChange={set} placeholder="Nova Store" />
          <Field label="Slogan" name="site_slogan" value={val('site_slogan')} onChange={set} placeholder="Phong cách mới mỗi ngày" />
          <Field label="Mô tả ngắn" name="site_description" value={val('site_description')} onChange={set} type="textarea" />
          <Field label="Logo URL" name="site_logo" value={val('site_logo')} onChange={set} placeholder="https://..." />
          <Field label="Favicon URL" name="site_favicon" value={val('site_favicon')} onChange={set} placeholder="https://..." />
          <Field label="Giờ mở cửa" name="working_hours" value={val('working_hours')} onChange={set} placeholder="8:00 – 21:00, Thứ 2 – CN" />
          <Field label="Số Zalo" name="zalo_number" value={val('zalo_number')} onChange={set} placeholder="0901234567" />
        </>}

        {activeTab === 'hero' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>
            Nội dung phần Hero (Magazine Grid) trên trang chủ. 3 ảnh lưới bên phải quản lý tại menu "Hero Slides".
          </p>
          <Field label="Eyebrow (dòng nhỏ phía trên)" name="hero_eyebrow" value={val('hero_eyebrow')} onChange={set} placeholder="Bộ Sưu Tập Mới — 2026" />
          <div className="form-row">
            <Field label="Tiêu đề dòng 1" name="hero_title_1" value={val('hero_title_1')} onChange={set} placeholder="PHONG" />
            <Field label="Tiêu đề dòng 2" name="hero_title_2" value={val('hero_title_2')} onChange={set} placeholder="CÁCH" />
            <Field label="Tiêu đề dòng 3 (nhấn màu accent)" name="hero_title_3" value={val('hero_title_3')} onChange={set} placeholder="MỚI" />
          </div>
          <Field label="Mô tả" name="hero_desc" value={val('hero_desc')} onChange={set} type="textarea" />
          <div className="form-row">
            <Field label="Nút 1 — Nhãn" name="hero_cta1_text" value={val('hero_cta1_text')} onChange={set} placeholder="Khám Phá Ngay" />
            <Field label="Nút 1 — Link" name="hero_cta1_link" value={val('hero_cta1_link')} onChange={set} placeholder="/san-pham" />
          </div>
          <div className="form-row">
            <Field label="Nút 2 — Nhãn" name="hero_cta2_text" value={val('hero_cta2_text')} onChange={set} placeholder="Xem Lookbook" />
            <Field label="Nút 2 — Link" name="hero_cta2_link" value={val('hero_cta2_link')} onChange={set} placeholder="/san-pham" />
          </div>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '20px 0 8px' }}>Thanh thống kê (Stat bar)</p>
          <div className="form-row">
            <Field label="Số khách hàng" name="stat_customers" value={val('stat_customers')} onChange={set} placeholder="50" />
            <Field label="Hậu tố" name="stat_customers_suffix" value={val('stat_customers_suffix')} onChange={set} placeholder="K+" />
          </div>
          <div className="form-row">
            <Field label="Số sản phẩm" name="stat_products" value={val('stat_products')} onChange={set} placeholder="2850" />
            <Field label="Hậu tố" name="stat_products_suffix" value={val('stat_products_suffix')} onChange={set} placeholder="+" />
          </div>
          <div className="form-row">
            <Field label="Đánh giá trung bình" name="stat_rating" value={val('stat_rating')} onChange={set} placeholder="5" />
            <Field label="% Miễn phí vận chuyển" name="stat_freeship_pct" value={val('stat_freeship_pct')} onChange={set} placeholder="100" />
          </div>
        </>}

        {activeTab === 'about' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Section "Câu chuyện thương hiệu" — 2 dải xen kẽ trên trang chủ.</p>
          <p style={{ fontWeight: 600, fontSize: 13, margin: '4px 0 8px' }}>Dải 1</p>
          <Field label="Nhãn" name="story1_badge" value={val('story1_badge')} onChange={set} placeholder="Câu Chuyện" />
          <div className="form-row">
            <Field label="Tiêu đề dòng 1" name="story1_title_1" value={val('story1_title_1')} onChange={set} placeholder="Thời Trang" />
            <Field label="Tiêu đề dòng 2" name="story1_title_2" value={val('story1_title_2')} onChange={set} placeholder="Từ Trái Tim" />
          </div>
          <Field label="Nội dung" name="story1_text" value={val('story1_text')} onChange={set} type="textarea" />
          <Field label="Điểm nổi bật 1" name="story1_feat1" value={val('story1_feat1')} onChange={set} />
          <Field label="Điểm nổi bật 2" name="story1_feat2" value={val('story1_feat2')} onChange={set} />
          <Field label="Điểm nổi bật 3" name="story1_feat3" value={val('story1_feat3')} onChange={set} />

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Dải 2</p>
          <Field label="Nhãn" name="story2_badge" value={val('story2_badge')} onChange={set} placeholder="Cam Kết" />
          <div className="form-row">
            <Field label="Tiêu đề dòng 1" name="story2_title_1" value={val('story2_title_1')} onChange={set} placeholder="Chất Lượng" />
            <Field label="Tiêu đề dòng 2" name="story2_title_2" value={val('story2_title_2')} onChange={set} placeholder="Không Thỏa Hiệp" />
          </div>
          <Field label="Nội dung" name="story2_text" value={val('story2_text')} onChange={set} type="textarea" />
          <Field label="Điểm nổi bật 1" name="story2_feat1" value={val('story2_feat1')} onChange={set} />
          <Field label="Điểm nổi bật 2" name="story2_feat2" value={val('story2_feat2')} onChange={set} />
          <Field label="Điểm nổi bật 3" name="story2_feat3" value={val('story2_feat3')} onChange={set} />
        </>}

        {activeTab === 'promo' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Banner Flash Sale với đồng hồ đếm ngược.</p>
          <Field label="Tag" name="promo_tag" value={val('promo_tag')} onChange={set} placeholder="Flash Sale" />
          <div className="form-row">
            <Field label="Tiêu đề" name="promo_title" value={val('promo_title')} onChange={set} placeholder="GIẢM ĐẾN" />
            <Field label="Phần trăm (nhấn màu accent)" name="promo_percent" value={val('promo_percent')} onChange={set} placeholder="50%" />
          </div>
          <Field label="Mô tả" name="promo_desc" value={val('promo_desc')} onChange={set} type="textarea" />
          <Field label="Thời điểm kết thúc (ISO — vd 2026-12-31T23:59:59)" name="promo_end_at" value={val('promo_end_at')} onChange={set} placeholder="Để trống = đếm ngược ~12 tiếng kể từ lúc tải trang" />
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} placeholder="Nova Store — Thời Trang Phong Cách Mới" />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" placeholder="Mô tả SEO..." />
          <Field label="OG Image URL" name="og_image" value={val('og_image')} onChange={set} placeholder="https://..." />
          <Field label="Google Analytics ID" name="ga_id" value={val('ga_id')} onChange={set} placeholder="G-XXXXXXXXXX" />
          <Field label="Google Tag Manager ID" name="gtm_id" value={val('gtm_id')} onChange={set} placeholder="GTM-XXXXXXX" />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="facebook" value={val('facebook')} onChange={set} placeholder="https://facebook.com/novastore" />
          <Field label="Instagram URL" name="instagram" value={val('instagram')} onChange={set} placeholder="https://instagram.com/novastore" />
          <Field label="TikTok URL" name="tiktok" value={val('tiktok')} onChange={set} placeholder="https://tiktok.com/@novastore" />
          <Field label="YouTube URL" name="youtube" value={val('youtube')} onChange={set} placeholder="https://youtube.com/@novastore" />
          <Field label="Zalo URL" name="zalo" value={val('zalo')} onChange={set} placeholder="https://zalo.me/0901234567" />
        </>}

        {activeTab === 'shop' && <>
          <Field label="Phí vận chuyển (VND)" name="shipping_fee" value={val('shipping_fee')} onChange={set} placeholder="30000" />
          <Field label="Miễn phí vận chuyển từ (VND)" name="free_shipping_threshold" value={val('free_shipping_threshold')} onChange={set} placeholder="300000" />
          <Field label="Số ngày đổi trả" name="return_days" value={val('return_days')} onChange={set} placeholder="14" />
          <Field label="Tiêu đề newsletter" name="newsletter_title" value={val('newsletter_title')} onChange={set} placeholder="Nhận Ưu Đãi Độc Quyền" />
          <Field label="Mô tả newsletter" name="newsletter_sub" value={val('newsletter_sub')} onChange={set} placeholder="Đăng ký ngay để nhận thông tin..." />
          <Field label="Mô tả footer" name="footer_desc" value={val('footer_desc')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'payment' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Bật/tắt từng phương thức thanh toán hiển thị ở trang thanh toán của khách.</p>
          <div className="form-row" style={{ gap: 24, marginBottom: 20 }}>
            <ToggleField label="Thanh toán khi nhận hàng (COD)" name="payment_cod_enabled" value={val('payment_cod_enabled')} onChange={set} />
            <ToggleField label="Chuyển khoản trước qua SePay" name="payment_sepay_enabled" value={val('payment_sepay_enabled')} onChange={set} />
          </div>
          <Field label="SePay API Access" name="sepay_webhook_secret" value={val('sepay_webhook_secret')} onChange={set} type="password" placeholder="Lấy tại my.sepay.vn → Cài đặt công ty → API Access" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '4px 0 20px' }}>
            <button type="button" className="btn btn-outline" onClick={handleSyncSepay} disabled={syncing}>
              {syncing ? 'Đang đồng bộ...' : '🔄 Đồng bộ tài khoản từ SePay'}
            </button>
            {syncMsg && (
              <span style={{ fontSize: 12.5, color: syncMsg.type === 'ok' ? 'var(--accent)' : 'var(--danger)' }}>
                {syncMsg.text}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '20px 0 8px' }}>Thông tin tài khoản nhận tiền (dùng để tạo mã QR VietQR khi khách chọn SePay) — điền tay hoặc dùng nút đồng bộ ở trên:</p>
          <Field label="Mã ngân hàng (VietQR)" name="sepay_bank_code" value={val('sepay_bank_code')} onChange={set} placeholder="VD: MB, VCB, TCB, ACB" />
          <Field label="Số tài khoản" name="sepay_account_number" value={val('sepay_account_number')} onChange={set} placeholder="0123456789" />
          <Field label="Tên chủ tài khoản" name="sepay_account_name" value={val('sepay_account_name')} onChange={set} placeholder="NGUYEN VAN A" />
        </>}

        {activeTab === 'contact' && <>
          <Field label="Email liên hệ" name="site_email" value={val('site_email')} onChange={set} type="email" placeholder="hello@novastore.vn" />
          <Field label="Số điện thoại" name="site_phone" value={val('site_phone')} onChange={set} placeholder="0901 234 567" />
          <Field label="Số điện thoại hỗ trợ online" name="site_phone2" value={val('site_phone2')} onChange={set} placeholder="0912 345 678" />
          <Field label="Địa chỉ" name="site_address" value={val('site_address')} onChange={set} placeholder="88 Đường Nguyễn Huệ, Quận 1, TP.HCM" />
          <Field label="Giới thiệu ngắn (trang Liên hệ)" name="contact_intro" value={val('contact_intro')} onChange={set} type="textarea" />
          <Field label="Google Maps Embed URL" name="map_embed" value={val('map_embed')} onChange={set} placeholder="https://maps.google.com/maps?..." />
        </>}

        {activeTab === 'smtp' && <>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} placeholder="you@gmail.com" />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="From Email" name="smtp_from" value={val('smtp_from')} onChange={set} placeholder="no-reply@novastore.vn" />
          <Field label="From Name" name="smtp_from_name" value={val('smtp_from_name')} onChange={set} placeholder="Nova Store" />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Cấu hình Cloudinary để upload và quản lý ảnh sản phẩm.</p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} placeholder="mycloud" />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} placeholder="123456789012345" />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" placeholder="••••••••" />
        </>}

        {activeTab === 'integrations' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>API keys cho các tích hợp bên ngoài.</p>
          <Field label="Unsplash Access Key" name="unsplash_access_key" value={val('unsplash_access_key')} onChange={set} placeholder="Unsplash Access Key" />
          <Field label="Facebook Pixel ID" name="fb_pixel_id" value={val('fb_pixel_id')} onChange={set} placeholder="123456789012345" />
        </>}

        <div className="form-actions" style={{ marginTop: 32 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        </div>
      </form>
    </div>
  )
}
