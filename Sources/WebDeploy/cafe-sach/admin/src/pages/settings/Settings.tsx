import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsData = Record<string, string>

const TABS = [
  { id: 'general',      label: 'Thông tin chung' },
  { id: 'seo',          label: 'SEO' },
  { id: 'social',       label: 'Mạng xã hội' },
  { id: 'footer',       label: 'Footer' },
  { id: 'contact',      label: 'Liên hệ' },
  { id: 'about',        label: 'Giới thiệu' },
  { id: 'smtp',         label: 'SMTP' },
  { id: 'system',       label: 'Nâng cao' },
  { id: 'cloudinary',   label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [data, setData]     = useState<SettingsData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [tab, setTab]         = useState('general')
  const [msg, setMsg]         = useState('')
  const [err, setErr]         = useState('')

  useEffect(() => {
    api.get<SettingsData>('/settings')
      .then(setData)
      .catch(() => setErr('Không tải được cài đặt.'))
      .finally(() => setLoading(false))
  }, [])

  function s(key: string) { return data[key] ?? '' }
  function set(key: string, val: string) { setData(d => ({ ...d, [key]: val })) }

  async function save(keys: string[]) {
    setSaving(true); setMsg(''); setErr('')
    const payload: SettingsData = {}
    keys.forEach(k => { payload[k] = data[k] ?? '' })
    try {
      await api.post('/settings', payload)
      setMsg('Đã lưu thành công!')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setErr('Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Cấu hình website Lặng Trang — Cà Phê Sách</div>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Tab list */}
        <div style={{ width: 190, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: '10px 14px', textAlign: 'left', borderRadius: 8,
                  background: tab === t.id ? 'var(--accent-light)' : 'transparent',
                  color: tab === t.id ? 'var(--accent)' : 'var(--text-2)',
                  fontWeight: tab === t.id ? 600 : 400,
                  border: 'none', cursor: 'pointer', fontSize: 13,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Thông tin chung */}
          {tab === 'general' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Thông tin chung</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Tên quán" value={s('site_name')} onChange={v => set('site_name', v)} />
                <Field label="Slogan / Tagline" value={s('site_tagline')} onChange={v => set('site_tagline', v)} />
                <FieldArea label="Mô tả ngắn" value={s('site_description')} onChange={v => set('site_description', v)} rows={3} />
                <Field label="Email" value={s('site_email')} onChange={v => set('site_email', v)} type="email" />
                <Field label="Số điện thoại" value={s('site_phone')} onChange={v => set('site_phone', v)} />
                <Field label="Số Zalo (không dấu cách)" value={s('zalo_phone')} onChange={v => set('zalo_phone', v)} />
                <Field label="Địa chỉ" value={s('site_address')} onChange={v => set('site_address', v)} />
                <Field label="Giờ mở cửa" value={s('working_hours')} onChange={v => set('working_hours', v)} />
              </div>
              <SaveBtn onClick={() => save(['site_name','site_tagline','site_description','site_email','site_phone','zalo_phone','site_address','working_hours'])} saving={saving} />
            </div>
          )}

          {/* SEO */}
          {tab === 'seo' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>SEO</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Meta Title" value={s('meta_title')} onChange={v => set('meta_title', v)} />
                <FieldArea label="Meta Description" value={s('meta_description')} onChange={v => set('meta_description', v)} rows={3} />
                <Field label="Meta Keywords" value={s('meta_keywords')} onChange={v => set('meta_keywords', v)} />
              </div>
              <SaveBtn onClick={() => save(['meta_title','meta_description','meta_keywords'])} saving={saving} />
            </div>
          )}

          {/* Mạng xã hội */}
          {tab === 'social' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Mạng xã hội</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Facebook URL" value={s('facebook')} onChange={v => set('facebook', v)} />
                <Field label="Instagram URL" value={s('instagram')} onChange={v => set('instagram', v)} />
                <Field label="YouTube URL" value={s('youtube')} onChange={v => set('youtube', v)} />
                <Field label="TikTok URL" value={s('tiktok')} onChange={v => set('tiktok', v)} />
                <Field label="Zalo URL" value={s('zalo')} onChange={v => set('zalo', v)} />
              </div>
              <SaveBtn onClick={() => save(['facebook','instagram','youtube','tiktok','zalo'])} saving={saving} />
            </div>
          )}

          {/* Footer */}
          {tab === 'footer' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Footer</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <FieldArea label="Mô tả footer" value={s('footer_description')} onChange={v => set('footer_description', v)} rows={3} />
                <Field label="Copyright" value={s('footer_copyright')} onChange={v => set('footer_copyright', v)} />
              </div>
              <SaveBtn onClick={() => save(['footer_description','footer_copyright'])} saving={saving} />
            </div>
          )}

          {/* Liên hệ */}
          {tab === 'contact' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Liên hệ</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Địa chỉ (trang liên hệ)" value={s('contact_address')} onChange={v => set('contact_address', v)} />
                <FieldArea label="Google Maps Embed URL" value={s('contact_map_embed')} onChange={v => set('contact_map_embed', v)} rows={3}
                  placeholder="https://maps.google.com/maps?q=...&output=embed" />
              </div>
              <SaveBtn onClick={() => save(['contact_address','contact_map_embed'])} saving={saving} />
            </div>
          )}

          {/* Giới thiệu */}
          {tab === 'about' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Câu chuyện của chúng tôi</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Eyebrow" value={s('about_story_eyebrow')} onChange={v => set('about_story_eyebrow', v)} />
                <Field label="Tiêu đề" value={s('about_story_title')} onChange={v => set('about_story_title', v)} />
                <FieldArea label="Đoạn 1" value={s('about_story_text_1')} onChange={v => set('about_story_text_1', v)} rows={3} />
                <FieldArea label="Đoạn 2" value={s('about_story_text_2')} onChange={v => set('about_story_text_2', v)} rows={3} />
                <Field label="URL ảnh minh họa" value={s('about_story_image')} onChange={v => set('about_story_image', v)} />
              </div>
              <SaveBtn onClick={() => save(['about_story_eyebrow','about_story_title','about_story_text_1','about_story_text_2','about_story_image'])} saving={saving} />

              <h3 style={{ margin: '28px 0 20px' }}>Triết lý không gian</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Eyebrow" value={s('about_philosophy_eyebrow')} onChange={v => set('about_philosophy_eyebrow', v)} />
                <Field label="Tiêu đề" value={s('about_philosophy_title')} onChange={v => set('about_philosophy_title', v)} />
                <FieldArea label="Đoạn 1" value={s('about_philosophy_text_1')} onChange={v => set('about_philosophy_text_1', v)} rows={3} />
                <FieldArea label="Đoạn 2" value={s('about_philosophy_text_2')} onChange={v => set('about_philosophy_text_2', v)} rows={3} />
                <Field label="URL ảnh minh họa" value={s('about_philosophy_image')} onChange={v => set('about_philosophy_image', v)} />
              </div>
              <SaveBtn onClick={() => save(['about_philosophy_eyebrow','about_philosophy_title','about_philosophy_text_1','about_philosophy_text_2','about_philosophy_image'])} saving={saving} />

              <h3 style={{ margin: '28px 0 20px' }}>Trích dẫn triết lý</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <FieldArea label="Nội dung trích dẫn" value={s('quote_content')} onChange={v => set('quote_content', v)} rows={3} />
                <Field label="Tác giả" value={s('quote_author')} onChange={v => set('quote_author', v)} />
                <Field label="Vai trò / Thời gian" value={s('quote_role')} onChange={v => set('quote_role', v)} />
              </div>
              <SaveBtn onClick={() => save(['quote_content','quote_author','quote_role'])} saving={saving} />

              <h3 style={{ margin: '28px 0 20px' }}>Số liệu thống kê</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Field label="Năm thành lập" value={s('stat_founded_year')} onChange={v => set('stat_founded_year', v)} />
                <Field label="Số đầu sách" value={s('stat_books_count')} onChange={v => set('stat_books_count', v)} />
                <Field label="Năm hoạt động" value={s('stat_years_active')} onChange={v => set('stat_years_active', v)} />
                <Field label="Giờ mở cửa/ngày" value={s('stat_hours_per_day')} onChange={v => set('stat_hours_per_day', v)} />
                <Field label="Chỗ ngồi yên tĩnh" value={s('stat_seats_count')} onChange={v => set('stat_seats_count', v)} />
                <Field label="Buổi CLB đọc sách/năm" value={s('stat_club_sessions_per_year')} onChange={v => set('stat_club_sessions_per_year', v)} />
              </div>
              <SaveBtn onClick={() => save(['stat_founded_year','stat_books_count','stat_years_active','stat_hours_per_day','stat_seats_count','stat_club_sessions_per_year'])} saving={saving} />
            </div>
          )}

          {/* SMTP */}
          {tab === 'smtp' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Cấu hình SMTP</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="SMTP Host" value={s('smtp_host')} onChange={v => set('smtp_host', v)} />
                <Field label="SMTP Port" value={s('smtp_port')} onChange={v => set('smtp_port', v)} />
                <Field label="SMTP Username" value={s('smtp_user')} onChange={v => set('smtp_user', v)} />
                <Field label="SMTP Password" value={s('smtp_pass')} onChange={v => set('smtp_pass', v)} type="password" />
                <Field label="Tên người gửi" value={s('smtp_from_name')} onChange={v => set('smtp_from_name', v)} />
                <Field label="Email người gửi" value={s('smtp_from_email')} onChange={v => set('smtp_from_email', v)} type="email" />
              </div>
              <SaveBtn onClick={() => save(['smtp_host','smtp_port','smtp_user','smtp_pass','smtp_from_name','smtp_from_email'])} saving={saving} />
            </div>
          )}

          {/* System */}
          {tab === 'system' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Nâng cao</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Chế độ bảo trì</label>
                  <select className="form-control" value={s('maintenance_mode')} onChange={e => set('maintenance_mode', e.target.value)}>
                    <option value="0">Bình thường</option>
                    <option value="1">Bảo trì (ẩn website)</option>
                  </select>
                </div>
                <Field label="Google Analytics ID (G-XXXXXXXX)" value={s('analytics_id')} onChange={v => set('analytics_id', v)} />
              </div>
              <SaveBtn onClick={() => save(['maintenance_mode','analytics_id'])} saving={saving} />
            </div>
          )}

          {/* Cloudinary */}
          {tab === 'cloudinary' && (
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>Cloudinary</h3>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
                Dùng Cloudinary để lưu ảnh trên cloud thay vì server hosting. <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Đăng ký miễn phí →</a>
              </p>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Cloud Name" value={s('cloudinary_cloud_name')} onChange={v => set('cloudinary_cloud_name', v)} />
                <Field label="API Key" value={s('cloudinary_api_key')} onChange={v => set('cloudinary_api_key', v)} />
                <Field label="API Secret" value={s('cloudinary_api_secret')} onChange={v => set('cloudinary_api_secret', v)} type="password" />
                <Field label="Upload Preset (unsigned)" value={s('cloudinary_upload_preset')} onChange={v => set('cloudinary_upload_preset', v)} />
              </div>
              <SaveBtn onClick={() => save(['cloudinary_cloud_name','cloudinary_api_key','cloudinary_api_secret','cloudinary_upload_preset'])} saving={saving} />
            </div>
          )}

          {/* Integrations */}
          {tab === 'integrations' && (
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>Tích hợp</h3>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
                API keys cho các dịch vụ bên thứ ba.
              </p>
              <div style={{ display: 'grid', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Unsplash Access Key</label>
                  <input type="text" className="form-control"
                    value={s('unsplash_access_key')}
                    onChange={e => set('unsplash_access_key', e.target.value)}
                    placeholder="BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY" />
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
                    Dùng để tìm kiếm ảnh từ Unsplash trong admin. <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Đăng ký key →</a>
                  </div>
                </div>
              </div>
              <SaveBtn onClick={() => save(['unsplash_access_key'])} saving={saving} />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function FieldArea({ label, value, onChange, rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-control" value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
    </div>
  )
}

function SaveBtn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)', marginTop: 20 }}>
      <button className="btn-accent" onClick={onClick} disabled={saving}>
        {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </button>
    </div>
  )
}
