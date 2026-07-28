import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import PaymentSettingsTab from '../../components/PaymentSettingsTab'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'home', label: 'Trang chủ' },
  { id: 'about', label: 'Giới thiệu' },
  { id: 'collection', label: 'Bộ sưu tập' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'shop', label: 'Cửa hàng' },
  { id: 'payment', label: '💳 Thanh toán' },
  { id: 'contact', label: 'Liên hệ' },
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
          <Field label="Tên cửa hàng" name="site_name" value={val('site_name')} onChange={set} placeholder="LUMIÈRE Beauty" />
          <Field label="Slogan" name="site_slogan" value={val('site_slogan')} onChange={set} placeholder="Mỹ phẩm cao cấp, thành phần an toàn" />
          <Field label="Mô tả ngắn" name="site_description" value={val('site_description')} onChange={set} type="textarea" />
          <Field label="Logo URL" name="site_logo" value={val('site_logo')} onChange={set} placeholder="https://..." />
          <Field label="Favicon URL" name="site_favicon" value={val('site_favicon')} onChange={set} placeholder="https://..." />
          <Field label="Giờ làm việc" name="working_hours" value={val('working_hours')} onChange={set} placeholder="Thứ Hai – Thứ Bảy: 8:00 – 22:00" />
          <Field label="Số Zalo (không dấu cách)" name="zalo_number" value={val('zalo_number')} onChange={set} placeholder="0901234567" />

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Thanh thông báo (topbar — hiển thị mọi trang, tối đa 3 mục)</p>
          <Field label="Mục 1" name="topbar_text_1" value={val('topbar_text_1')} onChange={set} placeholder="Miễn phí ship đơn từ 500K" />
          <Field label="Mục 2" name="topbar_text_2" value={val('topbar_text_2')} onChange={set} placeholder="Đổi trả 30 ngày" />
          <Field label="Mục 3" name="topbar_text_3" value={val('topbar_text_3')} onChange={set} placeholder="Thành phần an toàn" />
        </>}

        {activeTab === 'home' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>
            Trang chủ LUMIÈRE dùng "Search Zone" (tiêu đề lớn + ô tìm kiếm + danh mục chip) thay cho hero ảnh — không có banner/slider.
          </p>
          <Field label="Tiêu đề Search Zone" name="home_search_heading" value={val('home_search_heading')} onChange={set} placeholder="Tìm trong 36 sản phẩm mỹ phẩm" />
          <Field label="Mô tả phụ" name="home_search_sub" value={val('home_search_sub')} onChange={set} placeholder="Chăm sóc da · Trang điểm · Nước hoa · Dụng cụ làm đẹp" />
        </>}

        {activeTab === 'about' && <>
          <p style={{ fontWeight: 600, fontSize: 13, margin: '4px 0 8px' }}>Hero — Câu chuyện thương hiệu</p>
          <Field label="Ảnh nền hero" name="about_hero_image" value={val('about_hero_image')} onChange={set} placeholder="https://..." />
          <Field label="Nhãn nhỏ" name="about_hero_label" value={val('about_hero_label')} onChange={set} placeholder="Câu chuyện của chúng tôi" />
          <div className="form-row">
            <Field label="Tiêu đề dòng 1" name="about_hero_title1" value={val('about_hero_title1')} onChange={set} placeholder="Vẻ Đẹp Đích Thực" />
            <Field label="Tiêu đề dòng 2" name="about_hero_title2" value={val('about_hero_title2')} onChange={set} placeholder="Từ Thiên Nhiên" />
          </div>
          <Field label="Mô tả" name="about_hero_desc" value={val('about_hero_desc')} onChange={set} type="textarea" />

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Câu chuyện thương hiệu (2 khối)</p>
          {[1, 2].map(i => (
            <div key={i} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <Field label={`Ảnh minh họa ${i}`} name={`story${i}_image`} value={val(`story${i}_image`)} onChange={set} placeholder="https://..." />
              <Field label="Nhãn nhỏ" name={`story${i}_label`} value={val(`story${i}_label`)} onChange={set} />
              <div className="form-row">
                <Field label="Tiêu đề dòng 1" name={`story${i}_title1`} value={val(`story${i}_title1`)} onChange={set} />
                <Field label="Tiêu đề dòng 2" name={`story${i}_title2`} value={val(`story${i}_title2`)} onChange={set} />
              </div>
              <Field label="Đoạn 1" name={`story${i}_p1`} value={val(`story${i}_p1`)} onChange={set} type="textarea" />
              <Field label="Đoạn 2" name={`story${i}_p2`} value={val(`story${i}_p2`)} onChange={set} type="textarea" />
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Bốn giá trị cốt lõi</p>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="form-row" style={{ marginBottom: 4 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Tiêu đề {i}</label>
                <input type="text" value={val(`value${i}_title`)} onChange={e => set(`value${i}_title`, e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Mô tả {i}</label>
                <input type="text" value={val(`value${i}_desc`)} onChange={e => set(`value${i}_desc`, e.target.value)} />
              </div>
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Số liệu thương hiệu (4 mục)</p>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="form-row" style={{ marginBottom: 4 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Số {i}</label>
                <input type="text" value={val(`astat${i}_num`)} onChange={e => set(`astat${i}_num`, e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Hậu tố</label>
                <input type="text" value={val(`astat${i}_suffix`)} onChange={e => set(`astat${i}_suffix`, e.target.value)} placeholder="+" />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Nhãn</label>
                <input type="text" value={val(`astat${i}_label`)} onChange={e => set(`astat${i}_label`, e.target.value)} />
              </div>
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Vì sao chọn LUMIÈRE (4 mục, icon cố định theo thiết kế)</p>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="form-row" style={{ marginBottom: 4 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Tiêu đề {i}</label>
                <input type="text" value={val(`why${i}_title`)} onChange={e => set(`why${i}_title`, e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Mô tả {i}</label>
                <input type="text" value={val(`why${i}_desc`)} onChange={e => set(`why${i}_desc`, e.target.value)} />
              </div>
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Đánh giá khách hàng (3 mục)</p>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <Field label={`Nội dung ${i}`} name={`testi${i}_text`} value={val(`testi${i}_text`)} onChange={set} type="textarea" />
              <div className="form-row">
                <Field label="Tên khách hàng" name={`testi${i}_name`} value={val(`testi${i}_name`)} onChange={set} />
                <Field label="Vai trò" name={`testi${i}_role`} value={val(`testi${i}_role`)} onChange={set} />
              </div>
              <div className="form-row">
                <Field label="Số sao (1-5)" name={`testi${i}_stars`} value={val(`testi${i}_stars`)} onChange={set} />
                <Field label="Ảnh đại diện" name={`testi${i}_avatar`} value={val(`testi${i}_avatar`)} onChange={set} placeholder="https://..." />
              </div>
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>Chính sách mua hàng (4 mục, icon cố định theo thiết kế)</p>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="form-row" style={{ marginBottom: 4 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Tiêu đề {i}</label>
                <input type="text" value={val(`policy${i}_title`)} onChange={e => set(`policy${i}_title`, e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Mô tả {i}</label>
                <input type="text" value={val(`policy${i}_desc`)} onChange={e => set(`policy${i}_desc`, e.target.value)} />
              </div>
            </div>
          ))}

          <p style={{ fontWeight: 600, fontSize: 13, margin: '20px 0 8px' }}>CTA cuối trang</p>
          <Field label="Nhãn nhỏ" name="about_cta_label" value={val('about_cta_label')} onChange={set} />
          <div className="form-row">
            <Field label="Tiêu đề dòng 1" name="about_cta_title1" value={val('about_cta_title1')} onChange={set} />
            <Field label="Tiêu đề dòng 2" name="about_cta_title2" value={val('about_cta_title2')} onChange={set} />
          </div>
          <Field label="Mô tả" name="about_cta_desc" value={val('about_cta_desc')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'collection' && <>
          <Field label="Tiêu đề trang" name="coll_hero_title" value={val('coll_hero_title')} onChange={set} placeholder="Bộ Sưu Tập" />
          <Field label="Mô tả" name="coll_hero_sub" value={val('coll_hero_sub')} onChange={set} type="textarea" />

          {[1, 2, 3].map(i => (
            <div key={i} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: 12, marginTop: 12 }}>
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Bộ sưu tập {i}</p>
              <Field label="Ảnh" name={`c${i}_image`} value={val(`c${i}_image`)} onChange={set} placeholder="https://..." />
              <Field label="Nhãn nhỏ" name={`c${i}_label`} value={val(`c${i}_label`)} onChange={set} />
              <div className="form-row">
                <Field label="Tiêu đề dòng 1" name={`c${i}_title1`} value={val(`c${i}_title1`)} onChange={set} />
                <Field label="Tiêu đề dòng 2" name={`c${i}_title2`} value={val(`c${i}_title2`)} onChange={set} />
              </div>
              <Field label="Mô tả" name={`c${i}_desc`} value={val(`c${i}_desc`)} onChange={set} type="textarea" />
              {i !== 1 && (
                <>
                  <Field label="Đặc điểm 1" name={`c${i}_feature1`} value={val(`c${i}_feature1`)} onChange={set} />
                  <Field label="Đặc điểm 2" name={`c${i}_feature2`} value={val(`c${i}_feature2`)} onChange={set} />
                  <Field label="Đặc điểm 3" name={`c${i}_feature3`} value={val(`c${i}_feature3`)} onChange={set} />
                </>
              )}
              <div className="form-row">
                <Field label="Link (đường dẫn)" name={`c${i}_link`} value={val(`c${i}_link`)} onChange={set} placeholder="/san-pham?category=..." />
                <Field label="Nhãn link" name={`c${i}_link_label`} value={val(`c${i}_link_label`)} onChange={set} placeholder="Xem bộ sưu tập →" />
              </div>
            </div>
          ))}
        </>}

        {activeTab === 'seo' && <>
          <Field label="Meta Title" name="meta_title" value={val('meta_title')} onChange={set} placeholder="LUMIÈRE Beauty — Mỹ phẩm cao cấp, thành phần an toàn" />
          <Field label="Meta Description" name="meta_description" value={val('meta_description')} onChange={set} type="textarea" />
          <Field label="OG Image URL" name="og_image" value={val('og_image')} onChange={set} placeholder="https://..." />
          <Field label="Google Analytics ID" name="ga_id" value={val('ga_id')} onChange={set} placeholder="G-XXXXXXXXXX" />
          <Field label="Google Tag Manager ID" name="gtm_id" value={val('gtm_id')} onChange={set} placeholder="GTM-XXXXXXX" />
        </>}

        {activeTab === 'social' && <>
          <Field label="Facebook URL" name="facebook" value={val('facebook')} onChange={set} placeholder="https://www.facebook.com/..." />
          <Field label="Instagram URL" name="instagram" value={val('instagram')} onChange={set} placeholder="https://www.instagram.com/..." />
          <Field label="YouTube URL" name="youtube" value={val('youtube')} onChange={set} placeholder="https://www.youtube.com/..." />
          <Field label="TikTok URL" name="tiktok" value={val('tiktok')} onChange={set} placeholder="https://www.tiktok.com/@..." />
        </>}

        {activeTab === 'footer' && <>
          <Field label="Mô tả footer" name="footer_about" value={val('footer_about')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'shop' && <>
          <Field label="Số ngày đổi trả" name="return_days" value={val('return_days')} onChange={set} placeholder="30" />
          <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '4px 0 16px' }}>Phí vận chuyển / Miễn phí vận chuyển từ — cấu hình tại tab "💳 Thanh toán".</p>
        </>}

        {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}

        {activeTab === 'contact' && <>
          <Field label="Email liên hệ" name="site_email" value={val('site_email')} onChange={set} type="email" placeholder="hello@lumiere-beauty.vn" />
          <Field label="Số điện thoại" name="site_phone" value={val('site_phone')} onChange={set} placeholder="0901 234 567" />
          <Field label="Địa chỉ" name="site_address" value={val('site_address')} onChange={set} placeholder="123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" />
          <Field label="Ghi chú phản hồi nhanh" name="contact_note" value={val('contact_note')} onChange={set} type="textarea" />
          <Field label="Ghi chú chính sách đổi trả" name="return_policy_note" value={val('return_policy_note')} onChange={set} type="textarea" />
        </>}

        {activeTab === 'smtp' && <>
          <Field label="SMTP Host" name="smtp_host" value={val('smtp_host')} onChange={set} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" name="smtp_port" value={val('smtp_port')} onChange={set} placeholder="587" />
          <Field label="SMTP Username" name="smtp_user" value={val('smtp_user')} onChange={set} placeholder="you@gmail.com" />
          <Field label="SMTP Password" name="smtp_pass" value={val('smtp_pass')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="From Email" name="smtp_from" value={val('smtp_from')} onChange={set} placeholder="no-reply@lumiere-beauty.vn" />
          <Field label="From Name" name="smtp_from_name" value={val('smtp_from_name')} onChange={set} placeholder="LUMIÈRE Beauty" />
        </>}

        {activeTab === 'system' && <>
          <ToggleField label="Bật chế độ bảo trì (ẩn website, chỉ admin truy cập được)" name="maintenance_mode" value={val('maintenance_mode')} onChange={set} />
        </>}

        {activeTab === 'cloudinary' && <>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Cấu hình Cloudinary để upload và quản lý ảnh sản phẩm.</p>
          <Field label="Cloud Name" name="cloudinary_cloud_name" value={val('cloudinary_cloud_name')} onChange={set} placeholder="mycloud" />
          <Field label="API Key" name="cloudinary_api_key" value={val('cloudinary_api_key')} onChange={set} placeholder="123456789012345" />
          <Field label="API Secret" name="cloudinary_api_secret" value={val('cloudinary_api_secret')} onChange={set} type="password" placeholder="••••••••" />
          <Field label="Thư mục lưu ảnh" name="cloudinary_folder" value={val('cloudinary_folder')} onChange={set} placeholder="lumiere-beauty" />
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
