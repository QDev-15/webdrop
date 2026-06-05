import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface SettingsMap { [key: string]: string }

type Tab = 'general' | 'hero' | 'stats' | 'about' | 'seo' | 'social' | 'footer' | 'contact' | 'smtp' | 'system' | 'cloudinary' | 'integrations'

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [tab, setTab] = useState<Tab>('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get<Record<string, { value: string }>>('/settings')
      .then(raw => {
        const flat: SettingsMap = {}
        Object.entries(raw).forEach(([k, v]) => { flat[k] = v.value ?? '' })
        setSettings(flat)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const s = (key: string) => settings[key] ?? ''
  const set = (key: string, val: string) => setSettings(p => ({ ...p, [key]: val }))

  const handleSave = async () => {
    setSaving(true); setSaved(false)
    try {
      await api.post('/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi lưu')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'Thông tin chung' },
    { id: 'hero', label: 'Hero / Trang chủ' },
    { id: 'stats', label: 'Thống kê' },
    { id: 'about', label: 'Năng lực' },
    { id: 'seo', label: 'SEO' },
    { id: 'social', label: 'Mạng xã hội' },
    { id: 'footer', label: 'Footer' },
    { id: 'contact', label: 'Liên hệ' },
    { id: 'smtp', label: 'SMTP Email' },
    { id: 'system', label: 'Hệ thống' },
    { id: 'cloudinary', label: '☁️ Cloudinary' },
    { id: 'integrations', label: '🔌 Tích hợp' },
  ]

  if (loading) return <div className="card"><p style={{ color: 'var(--text-3)' }}>Đang tải cài đặt...</p></div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Cài đặt website</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : '✓ Lưu tất cả cài đặt'}
        </button>
      </div>

      {saved && <div className="alert alert-success">Đã lưu cài đặt thành công!</div>}

      <div className="settings-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`settings-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="card">
        {/* GENERAL */}
        {tab === 'general' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Thông tin công ty</h2>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <Field label="Tên công ty" value={s('site_name')} onChange={v => set('site_name', v)} />
              <Field label="Tagline" value={s('site_tagline')} onChange={v => set('site_tagline', v)} />
              <Field label="Email liên hệ" value={s('site_email')} onChange={v => set('site_email', v)} type="email" />
              <Field label="Số điện thoại chính" value={s('site_phone')} onChange={v => set('site_phone', v)} />
              <Field label="Số điện thoại phụ" value={s('site_phone_2')} onChange={v => set('site_phone_2', v)} />
              <Field label="Số Zalo" value={s('site_zalo')} onChange={v => set('site_zalo', v)} />
              <Field label="Mã số thuế (MST)" value={s('site_mst')} onChange={v => set('site_mst', v)} />
              <Field label="Thành phố / Khu vực" value={s('site_city')} onChange={v => set('site_city', v)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Địa chỉ văn phòng</label>
              <input className="form-input" value={s('site_address')} onChange={e => set('site_address', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Giờ làm việc</label>
              <input className="form-input" value={s('working_hours')} onChange={e => set('working_hours', e.target.value)} placeholder="Thứ 2 – Thứ 6: 7:30–17:30 | Thứ 7: 7:30–11:30" />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả công ty (ngắn)</label>
              <textarea className="form-textarea" rows={3} value={s('site_description')} onChange={e => set('site_description', e.target.value)} />
            </div>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <Field label="URL Logo" value={s('site_logo')} onChange={v => set('site_logo', v)} />
              <Field label="URL Favicon" value={s('site_favicon')} onChange={v => set('site_favicon', v)} />
            </div>
          </div>
        )}

        {/* HERO */}
        {tab === 'hero' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Nội dung Hero / Trang chủ</h2>
            <div className="form-group">
              <label className="form-label">Badge text (dòng nhỏ trên heading)</label>
              <input className="form-input" value={s('hero_badge')} onChange={e => set('hero_badge', e.target.value)} />
            </div>
            <div className="grid grid-3" style={{ gap: 16 }}>
              <Field label="Heading dòng 1" value={s('hero_line1')} onChange={v => set('hero_line1', v)} />
              <Field label="Heading dòng 2 (accent)" value={s('hero_line2')} onChange={v => set('hero_line2', v)} />
              <Field label="Heading dòng 3" value={s('hero_line3')} onChange={v => set('hero_line3', v)} />
            </div>
            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">Đoạn mô tả (sub)</label>
              <textarea className="form-textarea" rows={3} value={s('hero_sub')} onChange={e => set('hero_sub', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">URL ảnh hero background</label>
              <input className="form-input" value={s('hero_image')} onChange={e => set('hero_image', e.target.value)} />
            </div>
            {s('hero_image') && <img src={s('hero_image')} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 16 }} alt="" />}
            <div className="grid grid-2" style={{ gap: 16 }}>
              <Field label="Nút 1 (CTA solid)" value={s('hero_btn1_text')} onChange={v => set('hero_btn1_text', v)} />
              <Field label="Nút 2 (Ghost)" value={s('hero_btn2_text')} onChange={v => set('hero_btn2_text', v)} />
            </div>
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Thống kê (Stats Bar)</h2>
            {[1,2,3,4].map(i => (
              <div key={i} className="card" style={{ marginBottom: 12, border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Thống kê {i}</div>
                <div className="grid grid-3" style={{ gap: 12 }}>
                  <Field label="Con số" value={s(`stat${i}_num`)} onChange={v => set(`stat${i}_num`, v)} />
                  <Field label="Suffix (+, %, ...)" value={s(`stat${i}_suffix`)} onChange={v => set(`stat${i}_suffix`, v)} />
                  <Field label="Nhãn" value={s(`stat${i}_label`)} onChange={v => set(`stat${i}_label`, v)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABOUT */}
        {tab === 'about' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Section Năng lực (Alternating Strips)</h2>
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>Strip 1: Đội ngũ kỹ sư</div>
              <Field label="Tiêu đề" value={s('about_team_title')} onChange={v => set('about_team_title', v)} />
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Mô tả</label>
                <textarea className="form-textarea" rows={2} value={s('about_team_sub')} onChange={e => set('about_team_sub', e.target.value)} />
              </div>
              <Field label="Badge text" value={s('about_team_badge')} onChange={v => set('about_team_badge', v)} />
              <Field label="URL ảnh" value={s('about_team_image')} onChange={v => set('about_team_image', v)} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>Strip 2: Trang thiết bị</div>
              <Field label="Tiêu đề" value={s('about_equip_title')} onChange={v => set('about_equip_title', v)} />
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Mô tả</label>
                <textarea className="form-textarea" rows={2} value={s('about_equip_sub')} onChange={e => set('about_equip_sub', e.target.value)} />
              </div>
              <Field label="Badge text" value={s('about_equip_badge')} onChange={v => set('about_equip_badge', v)} />
              <Field label="URL ảnh" value={s('about_equip_image')} onChange={v => set('about_equip_image', v)} />
            </div>
          </div>
        )}

        {/* SEO */}
        {tab === 'seo' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>SEO & Meta</h2>
            <Field label="Meta Title" value={s('meta_title')} onChange={v => set('meta_title', v)} />
            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">Meta Description</label>
              <textarea className="form-textarea" rows={3} value={s('meta_description')} onChange={e => set('meta_description', e.target.value)} />
            </div>
            <Field label="Meta Keywords" value={s('meta_keywords')} onChange={v => set('meta_keywords', v)} />
            <Field label="OG Image URL" value={s('og_image')} onChange={v => set('og_image', v)} />
            <Field label="Google Analytics ID" value={s('google_analytics_id')} onChange={v => set('google_analytics_id', v)} placeholder="G-XXXXXXXXXX" />
          </div>
        )}

        {/* SOCIAL */}
        {tab === 'social' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Mạng xã hội</h2>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <Field label="Facebook URL" value={s('social_facebook')} onChange={v => set('social_facebook', v)} placeholder="https://facebook.com/..." />
              <Field label="YouTube URL" value={s('social_youtube')} onChange={v => set('social_youtube', v)} placeholder="https://youtube.com/..." />
              <Field label="Instagram URL" value={s('social_instagram')} onChange={v => set('social_instagram', v)} placeholder="https://instagram.com/..." />
              <Field label="TikTok URL" value={s('social_tiktok')} onChange={v => set('social_tiktok', v)} placeholder="https://tiktok.com/..." />
              <Field label="Zalo URL / ID" value={s('social_zalo')} onChange={v => set('social_zalo', v)} />
              <Field label="LinkedIn URL" value={s('social_linkedin')} onChange={v => set('social_linkedin', v)} />
            </div>
          </div>
        )}

        {/* FOOTER */}
        {tab === 'footer' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Footer</h2>
            <Field label="Dòng Copyright" value={s('footer_copyright')} onChange={v => set('footer_copyright', v)} />
            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">Mô tả footer</label>
              <textarea className="form-textarea" rows={3} value={s('footer_description')} onChange={e => set('footer_description', e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <input type="checkbox" id="show_social" checked={s('footer_show_social') === '1'}
                onChange={e => set('footer_show_social', e.target.checked ? '1' : '0')} />
              <label htmlFor="show_social" style={{ fontSize: 13, cursor: 'pointer' }}>Hiển thị icon mạng xã hội trong footer</label>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {tab === 'contact' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Cài đặt liên hệ & Bản đồ</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <input type="checkbox" id="form_enabled" checked={s('contact_form_enabled') === '1'}
                onChange={e => set('contact_form_enabled', e.target.checked ? '1' : '0')} />
              <label htmlFor="form_enabled" style={{ fontSize: 13, cursor: 'pointer' }}>Bật form báo giá</label>
            </div>
            <Field label="Email nhận yêu cầu báo giá" value={s('contact_email_receiver')} onChange={v => set('contact_email_receiver', v)} type="email" />
            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">Google Maps Embed URL (src của iframe)</label>
              <textarea className="form-textarea" rows={3} value={s('google_map_embed')} onChange={e => set('google_map_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
              <p className="form-hint">Lấy từ Google Maps → Share → Embed a map → Copy src URL trong iframe</p>
            </div>
          </div>
        )}

        {/* SMTP */}
        {tab === 'smtp' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>SMTP Email</h2>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <Field label="SMTP Host" value={s('smtp_host')} onChange={v => set('smtp_host', v)} placeholder="smtp.gmail.com" />
              <Field label="SMTP Port" value={s('smtp_port')} onChange={v => set('smtp_port', v)} placeholder="587" />
              <Field label="SMTP User (email)" value={s('smtp_user')} onChange={v => set('smtp_user', v)} type="email" />
              <Field label="SMTP Password" value={s('smtp_password')} onChange={v => set('smtp_password', v)} type="password" />
              <Field label="Tên người gửi" value={s('smtp_from_name')} onChange={v => set('smtp_from_name', v)} />
              <Field label="Email người gửi" value={s('smtp_from_email')} onChange={v => set('smtp_from_email', v)} type="email" />
            </div>
          </div>
        )}

        {/* SYSTEM */}
        {tab === 'system' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Cài đặt hệ thống</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <input type="checkbox" id="maintenance" checked={s('maintenance_mode') === '1'}
                onChange={e => set('maintenance_mode', e.target.checked ? '1' : '0')} />
              <label htmlFor="maintenance" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--danger)' }}>Bật chế độ bảo trì (maintenance mode)</label>
            </div>
            <Field label="Thông báo bảo trì" value={s('maintenance_message')} onChange={v => set('maintenance_message', v)} />
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Custom CSS (nâng cao)</label>
              <textarea className="form-textarea" rows={6} value={s('custom_css')} onChange={e => set('custom_css', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12 }} />
              <p className="form-hint">CSS tùy chỉnh thêm vào website. Cẩn thận khi chỉnh sửa.</p>
            </div>
          </div>
        )}

        {/* CLOUDINARY */}
        {tab === 'cloudinary' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>☁️ Cloudinary — Lưu trữ ảnh</h2>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Cloud Name</label>
                <input className="form-input" value={s('cloudinary_cloud_name')} onChange={e => set('cloudinary_cloud_name', e.target.value)} placeholder="your-cloud-name" />
                <p className="form-hint">Lấy tại cloudinary.com → Dashboard → Cloud Name</p>
              </div>
              <div className="form-group">
                <label className="form-label">API Key</label>
                <input className="form-input" value={s('cloudinary_api_key')} onChange={e => set('cloudinary_api_key', e.target.value)} placeholder="123456789012345" />
              </div>
              <div className="form-group">
                <label className="form-label">API Secret</label>
                <input className="form-input" value={s('cloudinary_api_secret')} onChange={e => set('cloudinary_api_secret', e.target.value)} placeholder="••••••••••••••••••••••••" />
                <p className="form-hint">Dashboard → Settings → Access Keys → API Secret</p>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Folder (tuỳ chọn)</label>
                <input className="form-input" value={s('cloudinary_folder')} onChange={e => set('cloudinary_folder', e.target.value)} placeholder="webdrop" />
                <p className="form-hint">Thư mục lưu ảnh trên Cloudinary. Mặc định: webdrop</p>
              </div>
            </div>
          </div>
        )}

        {/* INTEGRATIONS */}
        {tab === 'integrations' && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>🔌 Tích hợp bên ngoài</h2>
            <div className="form-group">
              <label className="form-label">Unsplash Access Key</label>
              <input className="form-input" value={s('unsplash_access_key')} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="Dán Access Key từ unsplash.com/developers" />
              <p className="form-hint">Đăng ký miễn phí tại unsplash.com/developers → New Application → copy Access Key. Dùng để tìm kiếm ảnh trong admin.</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: 160, justifyContent: 'center' }}>
          {saving ? 'Đang lưu...' : '✓ Lưu tất cả cài đặt'}
        </button>
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, type = 'text', placeholder = '',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}
