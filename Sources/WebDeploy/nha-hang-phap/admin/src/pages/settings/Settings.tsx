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
  { id: 'chef',         label: 'Bếp trưởng' },
  { id: 'wine',         label: 'Rượu vang' },
  { id: 'reservation',  label: 'Đặt bàn' },
  { id: 'smtp',         label: 'SMTP' },
  { id: 'system',       label: 'Nâng cao' },
  { id: 'cloudinary',   label: 'Cloudinary' },
  { id: 'integrations', label: 'Tích hợp' },
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
          <div className="page-sub">Cấu hình website Le Bistro Français</div>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Tab list */}
        <div style={{ width: 180, flexShrink: 0 }}>
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
        <div style={{ flex: 1 }}>

          {/* Thông tin chung */}
          {tab === 'general' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Thông tin chung</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Tên nhà hàng" value={s('site_name')} onChange={v => set('site_name', v)} />
                <Field label="Slogan / Tagline" value={s('site_tagline')} onChange={v => set('site_tagline', v)} />
                <Field label="Email" value={s('site_email')} onChange={v => set('site_email', v)} type="email" />
                <Field label="Số điện thoại" value={s('site_phone')} onChange={v => set('site_phone', v)} />
                <Field label="Địa chỉ" value={s('site_address')} onChange={v => set('site_address', v)} />
                <Field label="Giờ mở cửa" value={s('working_hours')} onChange={v => set('working_hours', v)} />
                <Field label="Số Zalo" value={s('zalo_phone')} onChange={v => set('zalo_phone', v)} />
                <Field label="Năm thành lập" value={s('since_year')} onChange={v => set('since_year', v)} />
                <Field label="Thành phố" value={s('city')} onChange={v => set('city', v)} />
              </div>
              <SaveBtn onClick={() => save(['site_name','site_tagline','site_email','site_phone','site_address','working_hours','zalo_phone','since_year','city'])} saving={saving} />
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
                <FieldArea label="Tagline footer" value={s('footer_tagline')} onChange={v => set('footer_tagline', v)} rows={2} />
                <Field label="Copyright" value={s('footer_copyright')} onChange={v => set('footer_copyright', v)} />
              </div>
              <SaveBtn onClick={() => save(['footer_tagline','footer_copyright'])} saving={saving} />
            </div>
          )}

          {/* Liên hệ */}
          {tab === 'contact' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Liên hệ</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Địa chỉ (trang liên hệ)" value={s('contact_address')} onChange={v => set('contact_address', v)} />
                <FieldArea label="Google Maps Embed URL" value={s('contact_map_embed')} onChange={v => set('contact_map_embed', v)} rows={3}
                  placeholder="<iframe src='https://www.google.com/maps/embed?...'></iframe>" />
              </div>
              <SaveBtn onClick={() => save(['contact_address','contact_map_embed'])} saving={saving} />
            </div>
          )}

          {/* About */}
          {tab === 'about' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Phần giới thiệu (L'Art de Recevoir)</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Tiêu đề section" value={s('about_title')} onChange={v => set('about_title', v)} />
                <FieldArea label="Mô tả" value={s('about_description')} onChange={v => set('about_description', v)} rows={3} />
              </div>
              <SaveBtn onClick={() => save(['about_title','about_description'])} saving={saving} />
            </div>
          )}

          {/* Chef */}
          {tab === 'chef' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Bếp trưởng (Le Chef)</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Tên bếp trưởng" value={s('chef_name')} onChange={v => set('chef_name', v)} />
                <Field label="Chức danh" value={s('chef_title')} onChange={v => set('chef_title', v)} />
                <Field label="URL ảnh bếp trưởng" value={s('chef_image')} onChange={v => set('chef_image', v)} />
                <FieldArea label="Tiểu sử (đoạn 1)" value={s('chef_bio_1')} onChange={v => set('chef_bio_1', v)} rows={3} />
                <FieldArea label="Tiểu sử (đoạn 2 / trích dẫn)" value={s('chef_bio_2')} onChange={v => set('chef_bio_2', v)} rows={3} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <Field label="Số năm kinh nghiệm" value={s('chef_years_exp')} onChange={v => set('chef_years_exp', v)} />
                  <Field label="Số giải thưởng" value={s('chef_awards')} onChange={v => set('chef_awards', v)} />
                  <Field label="Số món đặc trưng" value={s('chef_signature_dishes')} onChange={v => set('chef_signature_dishes', v)} />
                </div>
              </div>
              <SaveBtn onClick={() => save(['chef_name','chef_title','chef_image','chef_bio_1','chef_bio_2','chef_years_exp','chef_awards','chef_signature_dishes'])} saving={saving} />
            </div>
          )}

          {/* Wine */}
          {tab === 'wine' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Hầm rượu (La Cave à Vins)</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <FieldArea label="Mô tả hầm rượu" value={s('wine_description')} onChange={v => set('wine_description', v)} rows={3} />
              </div>
              <SaveBtn onClick={() => save(['wine_description'])} saving={saving} />
            </div>
          )}

          {/* Reservation */}
          {tab === 'reservation' && (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Đặt bàn</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <FieldArea label="Ghi chú đặt bàn" value={s('reservation_note')} onChange={v => set('reservation_note', v)} rows={2} />
                <Field label="Giá Menu Dégustation (VND)" value={s('degustation_price')} onChange={v => set('degustation_price', v)} />
              </div>
              <SaveBtn onClick={() => save(['reservation_note','degustation_price'])} saving={saving} />
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
