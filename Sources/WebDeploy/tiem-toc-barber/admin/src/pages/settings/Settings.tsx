import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: '💈 Thông tin chung' },
  { key: 'hero',         label: '🖼 Trang chủ Hero' },
  { key: 'booking',      label: '📅 Đặt lịch' },
  { key: 'seo',          label: '🔍 SEO & Meta' },
  { key: 'social',       label: '📱 Mạng xã hội' },
  { key: 'footer',       label: '📄 Footer' },
  { key: 'contact',      label: '☎ Liên hệ' },
  { key: 'smtp',         label: '📧 SMTP' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integration',  label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')
  const [tab, setTab]           = useState('general')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(s => setSettings(s))
      .catch(() => setError('Không thể tải cài đặt.'))
      .finally(() => setLoading(false))
  }, [])

  const set = (key: string, val: string) => setSettings(s => ({ ...s, [key]: val }))
  const get = (key: string) => settings[key] ?? ''

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setSaved(false); setError('')
    try {
      await api.post('/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu cài đặt.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt website</div>
          <div className="page-sub">Quản lý thông tin và nội dung trang</div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-accent">
          {saving ? 'Đang lưu...' : '💾 Lưu cài đặt'}
        </button>
      </div>

      {saved && <div className="alert alert-success">Lưu cài đặt thành công!</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? 'var(--accent)' : 'var(--text-2)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 14px', borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all .15s',
            }}
          >{t.label}</button>
        ))}
      </div>

      <form onSubmit={handleSave} className="card">
        {tab === 'general' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên tiệm tóc</label>
              <input className="form-control" value={get('site_name')} onChange={e => set('site_name', e.target.value)} placeholder="Barber & Style" />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline / Slogan</label>
              <input className="form-control" value={get('site_tagline')} onChange={e => set('site_tagline', e.target.value)} placeholder="Premium Barber Shop" />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input className="form-control" value={get('site_phone')} onChange={e => set('site_phone', e.target.value)} placeholder="0901 234 567" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={get('site_email')} onChange={e => set('site_email', e.target.value)} placeholder="hello@tiemtoc.vn" />
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input className="form-control" value={get('site_address')} onChange={e => set('site_address', e.target.value)} placeholder="Số nhà, Tên đường, Phường, Quận, TP" />
            </div>
            <div className="form-group">
              <label className="form-label">Giờ làm việc</label>
              <input className="form-control" value={get('working_hours')} onChange={e => set('working_hours', e.target.value)} placeholder="Thứ 2 – Thứ 6: 8:00 – 20:00 | Thứ 7: 8:00 – 21:00 | Chủ nhật: 9:00 – 19:00" />
            </div>
            <div className="form-group">
              <label className="form-label">Số Zalo</label>
              <input className="form-control" value={get('zalo_number')} onChange={e => set('zalo_number', e.target.value)} placeholder="0901234567" />
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Thống kê hiển thị trên trang chủ</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['stat_customers', 'Số khách hàng'], ['stat_years', 'Năm kinh nghiệm'], ['stat_stylists', 'Số stylist'], ['stat_satisfaction', 'Tỷ lệ hài lòng (%)']].map(([k, l]) => (
                  <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{l}</label>
                    <input className="form-control" value={get(k)} onChange={e => set(k, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'hero' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Badge trên Hero (VD: "Premium Barber Shop")</label>
              <input className="form-control" value={get('hero_badge')} onChange={e => set('hero_badge', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Dòng tiêu đề chính</label>
              <input className="form-control" value={get('hero_title_1')} onChange={e => set('hero_title_1', e.target.value)} placeholder="PHONG CÁCH" />
            </div>
            <div className="form-group">
              <label className="form-label">Dòng tiêu đề italic (màu vàng)</label>
              <input className="form-control" value={get('hero_title_em')} onChange={e => set('hero_title_em', e.target.value)} placeholder="& Đẳng cấp" />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả Hero</label>
              <textarea className="form-control" rows={3} value={get('hero_subtitle') || get('hero_desc')} onChange={e => set('hero_subtitle', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ảnh Hero (URL)</label>
              <input className="form-control" value={get('hero_image')} onChange={e => set('hero_image', e.target.value)} placeholder="https://..." />
              {get('hero_image') && <img src={get('hero_image')} alt="hero preview" style={{ marginTop: 8, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />}
            </div>
          </div>
        )}

        {tab === 'booking' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Ghi chú xác nhận đặt lịch</label>
              <textarea className="form-control" rows={2} value={get('booking_confirm_note')} onChange={e => set('booking_confirm_note', e.target.value)} placeholder="Chúng tôi xác nhận lịch hẹn qua Zalo trong vòng 15 phút." />
            </div>
            <div className="form-group">
              <label className="form-label">Mã khuyến mãi khách mới</label>
              <input className="form-control" value={get('booking_promo_code')} onChange={e => set('booking_promo_code', e.target.value)} placeholder="NEWCUT" />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả ưu đãi</label>
              <textarea className="form-control" rows={2} value={get('booking_promo_desc') || get('booking_promo_percent')} onChange={e => set('booking_promo_desc', e.target.value)} placeholder="Giảm 15% cho lần đặt lịch đầu tiên." />
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Meta Title</label>
              <input className="form-control" value={get('meta_title')} onChange={e => set('meta_title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Meta Description</label>
              <textarea className="form-control" rows={3} value={get('meta_description')} onChange={e => set('meta_description', e.target.value)} />
            </div>
          </div>
        )}

        {tab === 'social' && (
          <div style={{ display: 'grid', gap: 16 }}>
            {[['facebook_url', 'Facebook URL'], ['instagram_url', 'Instagram URL'], ['tiktok_url', 'TikTok URL'], ['zalo_url', 'Zalo URL']].map(([k, l]) => (
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <input className="form-control" value={get(k)} onChange={e => set(k, e.target.value)} placeholder="https://..." />
              </div>
            ))}
          </div>
        )}

        {tab === 'footer' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tagline footer</label>
              <textarea className="form-control" rows={3} value={get('footer_tagline')} onChange={e => set('footer_tagline', e.target.value)} placeholder="Tiệm tóc phong cách barber Mỹ — nơi kỹ thuật gặp nghệ thuật." />
            </div>
          </div>
        )}

        {tab === 'contact' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Google Maps Embed URL</label>
              <textarea className="form-control" rows={3} value={get('map_embed_url') || get('map_embed')} onChange={e => set('map_embed_url', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
            </div>
          </div>
        )}

        {tab === 'smtp' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="alert alert-info">Cấu hình SMTP để gửi email thông báo khi có liên hệ hoặc đặt lịch mới.</div>
            <div className="form-group">
              <label className="form-label">SMTP Host</label>
              <input className="form-control" value={get('smtp_host')} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">SMTP Port</label>
              <input className="form-control" value={get('smtp_port')} onChange={e => set('smtp_port', e.target.value)} placeholder="587" />
            </div>
            <div className="form-group">
              <label className="form-label">SMTP User</label>
              <input className="form-control" value={get('smtp_user')} onChange={e => set('smtp_user', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">SMTP Password</label>
              <input className="form-control" type="password" value={get('smtp_pass')} onChange={e => set('smtp_pass', e.target.value)} />
            </div>
          </div>
        )}

        {tab === 'cloudinary' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="alert alert-info">Điền thông tin Cloudinary để upload ảnh lên cloud. Nếu để trống, ảnh sẽ được lưu local.</div>
            {[['cloudinary_cloud_name', 'Cloud Name'], ['cloudinary_api_key', 'API Key'], ['cloudinary_api_secret', 'API Secret']].map(([k, l]) => (
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <input className="form-control" value={get(k)} onChange={e => set(k, e.target.value)} type={k.includes('secret') ? 'password' : 'text'} />
              </div>
            ))}
          </div>
        )}

        {tab === 'integration' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="alert alert-info">Unsplash Access Key cho phép tìm kiếm ảnh miễn phí từ Unsplash trong admin.</div>
            <div className="form-group">
              <label className="form-label">Unsplash Access Key</label>
              <input className="form-control" value={get('unsplash_access_key')} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="Lấy tại unsplash.com/developers" />
            </div>
          </div>
        )}

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button type="submit" disabled={saving} className="btn-accent">
            {saving ? 'Đang lưu...' : '💾 Lưu cài đặt'}
          </button>
        </div>
      </form>
    </div>
  )
}
