import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type Settings = Record<string, string>

const TABS = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'about',        label: 'Giới thiệu' },
  { id: 'reservation',  label: 'Đặt bàn' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'smtp',         label: 'SMTP Email' },
  { id: 'system',       label: 'Nâng cao' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<Settings>('/settings')
      .then(data => setSettings(data))
      .catch(() => setMsg({ type: 'error', text: 'Khong tai duoc cai dat.' }))
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null); setSaving(true)
    try {
      await api.post('/settings/update', settings)
      setMsg({ type: 'success', text: 'Da luu cai dat thanh cong!' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Luu that bai.' })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cai dat he thong</div>
          <div className="page-sub">Quan ly thong tin va cau hinh website</div>
        </div>
        <button onClick={handleSave} className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : 'Luu cai dat'}</button>
      </div>

      {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 16 }}>{msg.text}</div>}

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Tab sidebar */}
        <div style={{ width: 180, flexShrink: 0 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: tab === t.id ? 'var(--accent-light)' : 'transparent', color: tab === t.id ? 'var(--accent)' : 'var(--text-2)', fontWeight: tab === t.id ? 600 : 400, fontSize: 13, border: 'none', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSave} className="card">
            {tab === 'general' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Thong tin chung</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Ten website</label>
                    <input type="text" className="form-control" value={settings['site_name'] ?? ''} onChange={e => set('site_name', e.target.value)} placeholder="Fine Dining Cao Cap" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Mo ta website</label>
                    <textarea className="form-control" value={settings['site_description'] ?? ''} onChange={e => set('site_description', e.target.value)} placeholder="Mo ta ngan ve nha hang" rows={2} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Logo</label>
                    <ImageField value={settings['site_logo'] ?? ''} onChange={v => set('site_logo', v)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Favicon</label>
                    <ImageField value={settings['site_favicon'] ?? ''} onChange={v => set('site_favicon', v)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email lien he</label>
                    <input type="email" className="form-control" value={settings['site_email'] ?? ''} onChange={e => set('site_email', e.target.value)} placeholder="info@finedining.vn" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">So dien thoai chinh</label>
                    <input type="text" className="form-control" value={settings['site_phone'] ?? ''} onChange={e => set('site_phone', e.target.value)} placeholder="0901 234 567" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">So dien thoai phu</label>
                    <input type="text" className="form-control" value={settings['site_phone_2'] ?? ''} onChange={e => set('site_phone_2', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gio mo cua</label>
                    <input type="text" className="form-control" value={settings['working_hours'] ?? ''} onChange={e => set('working_hours', e.target.value)} placeholder="Thu Ba den Chu Nhat · 18:00 - 23:00" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Dia chi</label>
                    <input type="text" className="form-control" value={settings['site_address'] ?? ''} onChange={e => set('site_address', e.target.value)} placeholder="15 Le Thanh Ton, Quan 1, TP. Ho Chi Minh" />
                  </div>
                </div>
              </>
            )}

            {tab === 'about' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Thong tin gioi thieu</div>
                <div className="form-group">
                  <label className="form-label">Tieu de phan gioi thieu</label>
                  <input type="text" className="form-control" value={settings['about_title'] ?? ''} onChange={e => set('about_title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tagline</label>
                  <input type="text" className="form-control" value={settings['about_tagline'] ?? ''} onChange={e => set('about_tagline', e.target.value)} placeholder="Am thuc cao cap · Tu 2018" />
                </div>
                <div className="form-group">
                  <label className="form-label">Noi dung gioi thieu</label>
                  <textarea className="form-control" value={settings['about_content'] ?? ''} onChange={e => set('about_content', e.target.value)} rows={5} />
                </div>
                <div className="form-group">
                  <label className="form-label">Anh gioi thieu</label>
                  <ImageField value={settings['about_image'] ?? ''} onChange={v => set('about_image', v)} />
                </div>
              </>
            )}

            {tab === 'reservation' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Cài đặt Đặt bàn</div>

                {/* Section nội dung hiển thị */}
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-light)' }}>Nội dung hiển thị trên website</div>
                <div className="form-group">
                  <label className="form-label">Mô tả section Đặt bàn</label>
                  <textarea className="form-control" value={settings['reservation_section_subtitle'] ?? ''} onChange={e => set('reservation_section_subtitle', e.target.value)} rows={3} placeholder="Không gian yên tĩnh, riêng tư — nơi mỗi bữa ăn trở thành ký ức đẹp..." />
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Đoạn mô tả ngắn hiển thị dưới tiêu đề "Trải nghiệm đỉnh cao" trong section đặt bàn.</div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', margin: '20px 0 12px', paddingBottom: 8, borderBottom: '1px solid var(--border-light)' }}>Cài đặt vận hành</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <input type="checkbox" id="reservation_enabled" checked={(settings['reservation_enabled'] ?? '1') === '1'} onChange={e => set('reservation_enabled', e.target.checked ? '1' : '0')} style={{ width: 16, height: 16 }} />
                  <label htmlFor="reservation_enabled" style={{ fontSize: 13, cursor: 'pointer' }}>Bật tính năng đặt bàn</label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Số khách tối đa / đặt</label>
                    <input type="number" className="form-control" value={settings['max_guests'] ?? '6'} onChange={e => set('max_guests', e.target.value)} min={1} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đặt trước tối thiểu (giờ)</label>
                    <input type="number" className="form-control" value={settings['advance_booking_hours'] ?? '24'} onChange={e => set('advance_booking_hours', e.target.value)} min={1} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Giờ phục vụ</label>
                    <input type="text" className="form-control" value={settings['open_hours_text'] ?? ''} onChange={e => set('open_hours_text', e.target.value)} placeholder="Thứ Ba đến Chủ nhật · 18:00 - 23:00" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Chính sách huỷ</label>
                    <textarea className="form-control" value={settings['cancellation_policy'] ?? ''} onChange={e => set('cancellation_policy', e.target.value)} rows={2} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Dress Code</label>
                    <input type="text" className="form-control" value={settings['dress_code'] ?? ''} onChange={e => set('dress_code', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {tab === 'seo' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>SEO & Meta</div>
                <div className="form-group">
                  <label className="form-label">Tieu de trang (Meta Title)</label>
                  <input type="text" className="form-control" value={settings['meta_title'] ?? ''} onChange={e => set('meta_title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mo ta trang (Meta Description)</label>
                  <textarea className="form-control" value={settings['meta_description'] ?? ''} onChange={e => set('meta_description', e.target.value)} rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tu khoa (Meta Keywords)</label>
                  <input type="text" className="form-control" value={settings['meta_keywords'] ?? ''} onChange={e => set('meta_keywords', e.target.value)} placeholder="nha hang cao cap, fine dining, ..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Anh OG (Open Graph)</label>
                  <ImageField value={settings['og_image'] ?? ''} onChange={v => set('og_image', v)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Google Analytics ID</label>
                  <input type="text" className="form-control" value={settings['google_analytics_id'] ?? ''} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
                </div>
              </>
            )}

            {tab === 'social' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Mang xa hoi</div>
                {[
                  ['Facebook', 'social_facebook', 'https://facebook.com/finedining'],
                  ['Instagram', 'social_instagram', 'https://instagram.com/finedining'],
                  ['YouTube', 'social_youtube', 'https://youtube.com/...'],
                  ['TikTok', 'social_tiktok', 'https://tiktok.com/@...'],
                  ['Zalo', 'social_zalo', 'https://zalo.me/0901234567'],
                ].map(([label, key, ph]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input type="url" className="form-control" value={settings[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={ph} />
                  </div>
                ))}
              </>
            )}

            {tab === 'footer' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Footer</div>
                <div className="form-group">
                  <label className="form-label">Ban quyen (Copyright)</label>
                  <input type="text" className="form-control" value={settings['footer_copyright'] ?? ''} onChange={e => set('footer_copyright', e.target.value)} placeholder="Copyright 2026 Fine Dining Cao Cap" />
                </div>
                <div className="form-group">
                  <label className="form-label">Mo ta footer</label>
                  <textarea className="form-control" value={settings['footer_description'] ?? ''} onChange={e => set('footer_description', e.target.value)} rows={2} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" id="footer_show_social" checked={(settings['footer_show_social'] ?? '1') === '1'} onChange={e => set('footer_show_social', e.target.checked ? '1' : '0')} style={{ width: 16, height: 16 }} />
                  <label htmlFor="footer_show_social" style={{ fontSize: 13, cursor: 'pointer' }}>Hien thi lien ket mang xa hoi</label>
                </div>
              </>
            )}

            {tab === 'contact' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Form lien he</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <input type="checkbox" id="contact_form_enabled" checked={(settings['contact_form_enabled'] ?? '1') === '1'} onChange={e => set('contact_form_enabled', e.target.checked ? '1' : '0')} style={{ width: 16, height: 16 }} />
                  <label htmlFor="contact_form_enabled" style={{ fontSize: 13, cursor: 'pointer' }}>Bat form lien he</label>
                </div>
                <div className="form-group">
                  <label className="form-label">Email nhan thong bao</label>
                  <input type="email" className="form-control" value={settings['contact_email_receiver'] ?? ''} onChange={e => set('contact_email_receiver', e.target.value)} placeholder="info@finedining.vn" />
                </div>
                <div className="form-group">
                  <label className="form-label">Google Maps Embed</label>
                  <textarea className="form-control" value={settings['google_map_embed'] ?? ''} onChange={e => set('google_map_embed', e.target.value)} placeholder="<iframe ...></iframe>" rows={4} />
                </div>
              </>
            )}

            {tab === 'smtp' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Cai dat SMTP Email</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">SMTP Host</label>
                    <input type="text" className="form-control" value={settings['smtp_host'] ?? ''} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SMTP Port</label>
                    <input type="number" className="form-control" value={settings['smtp_port'] ?? '587'} onChange={e => set('smtp_port', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SMTP User</label>
                    <input type="email" className="form-control" value={settings['smtp_user'] ?? ''} onChange={e => set('smtp_user', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SMTP Password</label>
                    <input type="password" className="form-control" value={settings['smtp_password'] ?? ''} onChange={e => set('smtp_password', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ten nguoi gui</label>
                    <input type="text" className="form-control" value={settings['smtp_from_name'] ?? ''} onChange={e => set('smtp_from_name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email nguoi gui</label>
                    <input type="email" className="form-control" value={settings['smtp_from_email'] ?? ''} onChange={e => set('smtp_from_email', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {tab === 'system' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Cai dat nang cao</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <input type="checkbox" id="maintenance_mode" checked={(settings['maintenance_mode'] ?? '0') === '1'} onChange={e => set('maintenance_mode', e.target.checked ? '1' : '0')} style={{ width: 16, height: 16 }} />
                  <label htmlFor="maintenance_mode" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--danger)' }}>Bat che do bao tri (website se hien thong bao)</label>
                </div>
                <div className="form-group">
                  <label className="form-label">Thong bao bao tri</label>
                  <textarea className="form-control" value={settings['maintenance_message'] ?? ''} onChange={e => set('maintenance_message', e.target.value)} rows={2} />
                </div>
              </>
            )}

            {tab === 'cloudinary' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Cloudinary Upload</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Cau hinh Cloudinary de luu tru anh tren cloud thay vi hosting. Lay API keys tai cloudinary.com.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Cloud Name</label>
                    <input type="text" className="form-control" value={settings['cloudinary_cloud_name'] ?? ''} onChange={e => set('cloudinary_cloud_name', e.target.value)} placeholder="your-cloud-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload Folder</label>
                    <input type="text" className="form-control" value={settings['cloudinary_folder'] ?? ''} onChange={e => set('cloudinary_folder', e.target.value)} placeholder="nha-hang-cao-cap" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">API Key</label>
                    <input type="text" className="form-control" value={settings['cloudinary_api_key'] ?? ''} onChange={e => set('cloudinary_api_key', e.target.value)} placeholder="123456789012345" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">API Secret</label>
                    <input type="password" className="form-control" value={settings['cloudinary_api_secret'] ?? ''} onChange={e => set('cloudinary_api_secret', e.target.value)} placeholder="your-api-secret" />
                  </div>
                </div>
              </>
            )}

            {tab === 'integrations' && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Tich hop API</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Cau hinh API keys cho cac dich vu tich hop. Lay Unsplash Access Key tai unsplash.com/developers.</p>
                <div className="form-group">
                  <label className="form-label">Unsplash Access Key</label>
                  <input type="text" className="form-control" value={settings['unsplash_access_key'] ?? ''} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="your-unsplash-access-key" />
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Dung de tim va chon anh tu Unsplash trong cac form quan ly anh.</div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : 'Luu cai dat'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
