import { useState, useEffect } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: 'Thông tin chung' },
  { key: 'seo',          label: 'SEO' },
  { key: 'social',       label: 'Mạng xã hội' },
  { key: 'footer',       label: 'Footer' },
  { key: 'contact',      label: 'Liên hệ' },
  { key: 'stats',        label: 'Thống kê' },
  { key: 'content',      label: 'Nội dung trang' },
  { key: 'legal',        label: 'Pháp lý' },
  { key: 'smtp',         label: 'SMTP' },
  { key: 'system',       label: 'Nâng cao' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

const sectionLabelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '20px 0 10px' }

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [s, setS] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setS)
      .catch(() => setError('Không tải được cài đặt.'))
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setS(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    try {
      await api.post('/settings/update', s)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu cài đặt')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải cài đặt...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt hệ thống</div>
          <div className="page-sub">Quản lý thông tin và nội dung website</div>
        </div>
      </div>

      <div className="settings-tabs" style={{ flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`settings-tab${activeTab === t.key ? ' active' : ''}`}
            style={{ background: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {saved && <div className="alert alert-success">Đã lưu cài đặt thành công!</div>}

      <form onSubmit={handleSave}>
        <div className="card">

          {/* ── Thông tin chung ── */}
          {activeTab === 'general' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Thông tin chung</h3>
              <div className="form-group">
                <label className="form-label">Tên website</label>
                <input className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Logo — phần đầu (Mark)</label>
                  <input className="form-control" value={s.site_logo_prefix ?? ''} onChange={e => set('site_logo_prefix', e.target.value)} placeholder="Mark" />
                </div>
                <div className="form-group">
                  <label className="form-label">Logo — phần nhấn màu (co)</label>
                  <input className="form-control" value={s.site_logo_suffix ?? ''} onChange={e => set('site_logo_suffix', e.target.value)} placeholder="co" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input className="form-control" value={s.site_tagline ?? ''} onChange={e => set('site_tagline', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả website</label>
                <textarea className="form-control" rows={3} value={s.site_description ?? ''} onChange={e => set('site_description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email liên hệ</label>
                <input className="form-control" type="email" value={s.site_email ?? ''} onChange={e => set('site_email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input className="form-control" value={s.site_phone ?? ''} onChange={e => set('site_phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ (mỗi dòng 1 phần — vd: Toà nhà / Số nhà / Quận-Thành phố)</label>
                <textarea className="form-control" rows={3} value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Giờ làm việc (mỗi dòng 1 khung giờ)</label>
                <textarea className="form-control" rows={3} value={s.working_hours ?? ''} onChange={e => set('working_hours', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── SEO ── */}
          {activeTab === 'seo' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Tối ưu SEO</h3>
              <div className="form-group">
                <label className="form-label">Tiêu đề trang (Meta Title)</label>
                <input className="form-control" value={s.meta_title ?? ''} onChange={e => set('meta_title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả trang (Meta Description)</label>
                <textarea className="form-control" rows={3} value={s.meta_description ?? ''} onChange={e => set('meta_description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Từ khóa (Meta Keywords)</label>
                <input className="form-control" value={s.meta_keywords ?? ''} onChange={e => set('meta_keywords', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Ảnh chia sẻ (OG Image URL)</label>
                <input className="form-control" value={s.og_image ?? ''} onChange={e => set('og_image', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Mạng xã hội ── */}
          {activeTab === 'social' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Mạng xã hội</h3>
              {[
                { key: 'facebook', label: 'Facebook URL' },
                { key: 'twitter',  label: 'X (Twitter) URL' },
                { key: 'linkedin', label: 'LinkedIn URL' },
                { key: 'zalo',     label: 'Số Zalo (chỉ số, dùng cho zalo.me/...)' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input className="form-control" value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          {activeTab === 'footer' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Footer</h3>
              <div className="form-group">
                <label className="form-label">Mô tả thương hiệu (footer)</label>
                <textarea className="form-control" rows={3} value={s.footer_description ?? ''} onChange={e => set('footer_description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Dòng bản quyền</label>
                <input className="form-control" value={s.footer_copyright ?? ''} onChange={e => set('footer_copyright', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Liên hệ ── */}
          {activeTab === 'contact' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Liên hệ &amp; Bản đồ</h3>
              <div className="form-group">
                <label className="form-label">Google Maps Embed URL</label>
                <textarea className="form-control" rows={3} value={s.map_embed ?? ''} onChange={e => set('map_embed', e.target.value)} placeholder="https://maps.google.com/maps?q=...&output=embed" />
              </div>
            </div>
          )}

          {/* ── Thống kê ── */}
          {activeTab === 'stats' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Thống kê (dải số liệu)</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>Dùng chung cho dải số liệu ở Trang chủ (có hiệu ứng đếm số) và trang Về chúng tôi.</p>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Số {i}</label>
                    <input className="form-control" value={s[`stat${i}_number`] ?? ''} onChange={e => set(`stat${i}_number`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Hậu tố</label>
                    <input className="form-control" value={s[`stat${i}_suffix`] ?? ''} onChange={e => set(`stat${i}_suffix`, e.target.value)} placeholder="%, +" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Nhãn</label>
                    <input className="form-control" value={s[`stat${i}_label`] ?? ''} onChange={e => set(`stat${i}_label`, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Nội dung trang ── */}
          {activeTab === 'content' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Nội dung trang</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Có thể dùng thẻ &lt;em&gt;...&lt;/em&gt; để in nghiêng/tô màu nhấn một phần tiêu đề.</p>

              <div style={sectionLabelStyle}>Trang chủ — Dịch vụ chính</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.home_services_eyebrow ?? ''} onChange={e => set('home_services_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.home_services_title ?? ''} onChange={e => set('home_services_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.home_services_sub ?? ''} onChange={e => set('home_services_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Quy trình làm việc</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.home_process_eyebrow ?? ''} onChange={e => set('home_process_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.home_process_title ?? ''} onChange={e => set('home_process_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.home_process_sub ?? ''} onChange={e => set('home_process_sub', e.target.value)} /></div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bước {i} — tiêu đề</label>
                    <input className="form-control" value={s[`process${i}_title`] ?? ''} onChange={e => set(`process${i}_title`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bước {i} — mô tả</label>
                    <input className="form-control" value={s[`process${i}_desc`] ?? ''} onChange={e => set(`process${i}_desc`, e.target.value)} />
                  </div>
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang chủ — Đánh giá khách hàng</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.home_testimonials_eyebrow ?? ''} onChange={e => set('home_testimonials_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.home_testimonials_title ?? ''} onChange={e => set('home_testimonials_title', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — CTA</div>
              <div className="form-group"><label className="form-label">Tiêu đề CTA</label><input className="form-control" value={s.home_cta_title ?? ''} onChange={e => set('home_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả CTA</label><textarea className="form-control" rows={2} value={s.home_cta_sub ?? ''} onChange={e => set('home_cta_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Chữ nút CTA</label><input className="form-control" value={s.home_cta_button ?? ''} onChange={e => set('home_cta_button', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Về chúng tôi — Hero</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.about_hero_eyebrow ?? ''} onChange={e => set('about_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.about_hero_title ?? ''} onChange={e => set('about_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.about_hero_sub ?? ''} onChange={e => set('about_hero_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Về chúng tôi — Câu chuyện (2 mục)</div>
              {[1, 2].map(i => (
                <div key={i} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <div className="form-group"><label className="form-label">Mục {i} — Nhãn</label><input className="form-control" value={s[`about_story${i}_label`] ?? ''} onChange={e => set(`about_story${i}_label`, e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Mục {i} — Tiêu đề</label><input className="form-control" value={s[`about_story${i}_title`] ?? ''} onChange={e => set(`about_story${i}_title`, e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Mục {i} — Nội dung</label><textarea className="form-control" rows={3} value={s[`about_story${i}_desc`] ?? ''} onChange={e => set(`about_story${i}_desc`, e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Mục {i} — Ảnh (URL)</label><input className="form-control" value={s[`about_story${i}_image`] ?? ''} onChange={e => set(`about_story${i}_image`, e.target.value)} /></div>
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang Về chúng tôi — Giá trị cốt lõi (4 mục)</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.about_values_eyebrow ?? ''} onChange={e => set('about_values_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.about_values_title ?? ''} onChange={e => set('about_values_title', e.target.value)} /></div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Icon</label>
                    <input className="form-control" value={s[`value${i}_icon`] ?? ''} onChange={e => set(`value${i}_icon`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Giá trị {i} — tiêu đề</label>
                    <input className="form-control" value={s[`value${i}_title`] ?? ''} onChange={e => set(`value${i}_title`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Giá trị {i} — mô tả</label>
                    <input className="form-control" value={s[`value${i}_desc`] ?? ''} onChange={e => set(`value${i}_desc`, e.target.value)} />
                  </div>
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang Về chúng tôi — CTA</div>
              <div className="form-group"><label className="form-label">Tiêu đề CTA</label><input className="form-control" value={s.about_cta_title ?? ''} onChange={e => set('about_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả CTA</label><textarea className="form-control" rows={2} value={s.about_cta_sub ?? ''} onChange={e => set('about_cta_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Chữ nút CTA</label><input className="form-control" value={s.about_cta_button ?? ''} onChange={e => set('about_cta_button', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Dịch vụ — Hero</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.services_hero_eyebrow ?? ''} onChange={e => set('services_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.services_hero_title ?? ''} onChange={e => set('services_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.services_hero_sub ?? ''} onChange={e => set('services_hero_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Dịch vụ — Bảng giá (tiêu đề khối)</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.pricing_eyebrow ?? ''} onChange={e => set('pricing_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.pricing_title ?? ''} onChange={e => set('pricing_title', e.target.value)} /></div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 20px' }}>
                Từng gói giá (tên, giá, tính năng...) nay được quản lý ở mục <strong>Bảng giá</strong> riêng trong menu Nội dung.
              </p>

              <div style={sectionLabelStyle}>Trang Dịch vụ — CTA</div>
              <div className="form-group"><label className="form-label">Tiêu đề CTA</label><input className="form-control" value={s.services_cta_title ?? ''} onChange={e => set('services_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả CTA</label><textarea className="form-control" rows={2} value={s.services_cta_sub ?? ''} onChange={e => set('services_cta_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Chữ nút CTA</label><input className="form-control" value={s.services_cta_button ?? ''} onChange={e => set('services_cta_button', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Đội ngũ</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.team_hero_eyebrow ?? ''} onChange={e => set('team_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.team_hero_title ?? ''} onChange={e => set('team_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.team_hero_sub ?? ''} onChange={e => set('team_hero_sub', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Eyebrow — Ban lãnh đạo</label><input className="form-control" value={s.team_leadership_eyebrow ?? ''} onChange={e => set('team_leadership_eyebrow', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Tiêu đề — Ban lãnh đạo</label><input className="form-control" value={s.team_leadership_title ?? ''} onChange={e => set('team_leadership_title', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Eyebrow — Đội tư vấn</label><input className="form-control" value={s.team_consultants_eyebrow ?? ''} onChange={e => set('team_consultants_eyebrow', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Tiêu đề — Đội tư vấn</label><input className="form-control" value={s.team_consultants_title ?? ''} onChange={e => set('team_consultants_title', e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Tiêu đề CTA</label><input className="form-control" value={s.team_cta_title ?? ''} onChange={e => set('team_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả CTA</label><textarea className="form-control" rows={2} value={s.team_cta_sub ?? ''} onChange={e => set('team_cta_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Chữ nút CTA</label><input className="form-control" value={s.team_cta_button ?? ''} onChange={e => set('team_cta_button', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Liên hệ</div>
              <div className="form-group"><label className="form-label">Eyebrow</label><input className="form-control" value={s.contact_hero_eyebrow ?? ''} onChange={e => set('contact_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.contact_hero_title ?? ''} onChange={e => set('contact_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.contact_hero_sub ?? ''} onChange={e => set('contact_hero_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Ô tư vấn miễn phí — Tiêu đề</label><input className="form-control" value={s.contact_free_consult_title ?? ''} onChange={e => set('contact_free_consult_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Ô tư vấn miễn phí — Mô tả</label><textarea className="form-control" rows={2} value={s.contact_free_consult_desc ?? ''} onChange={e => set('contact_free_consult_desc', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Ô tư vấn miễn phí — Chữ link</label><input className="form-control" value={s.contact_free_consult_button ?? ''} onChange={e => set('contact_free_consult_button', e.target.value)} /></div>
            </div>
          )}

          {/* ── Pháp lý ── */}
          {activeTab === 'legal' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Pháp lý</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Nội dung HTML — hỗ trợ thẻ &lt;h2&gt;, &lt;p&gt;.</p>
              <div className="form-group">
                <label className="form-label">Nội dung Chính sách bảo mật</label>
                <textarea className="form-control" rows={12} value={s.privacy_content ?? ''} onChange={e => set('privacy_content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung Điều khoản sử dụng</label>
                <textarea className="form-control" rows={12} value={s.terms_content ?? ''} onChange={e => set('terms_content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
              </div>
            </div>
          )}

          {/* ── SMTP ── */}
          {activeTab === 'smtp' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Cấu hình Email (SMTP)</h3>
              {[
                { key: 'smtp_host',       label: 'SMTP Host',       type: 'text' },
                { key: 'smtp_port',       label: 'SMTP Port',       type: 'number' },
                { key: 'smtp_user',       label: 'SMTP Username',   type: 'text' },
                { key: 'smtp_pass',       label: 'SMTP Password',   type: 'password' },
                { key: 'smtp_from_name',  label: 'Tên người gửi',   type: 'text' },
                { key: 'smtp_from_email', label: 'Email người gửi', type: 'email' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input className="form-control" type={f.type} value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Nâng cao ── */}
          {activeTab === 'system' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Cài đặt hệ thống</h3>
              <div className="form-group">
                <label className="form-label">Chế độ bảo trì</label>
                <select className="form-control" value={s.maintenance_mode ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                  <option value="0">Tắt (hoạt động bình thường)</option>
                  <option value="1">Bật (hiển thị trang bảo trì)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Số item mỗi trang</label>
                <input className="form-control" type="number" value={s.items_per_page ?? '20'} onChange={e => set('items_per_page', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Cloudinary ── */}
          {activeTab === 'cloudinary' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Cloudinary — Lưu trữ ảnh đám mây</h3>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Để trống nếu dùng lưu trữ local (mặc định). Điền thông tin Cloudinary nếu muốn lưu ảnh trên cloud.</p>
              {[
                { key: 'cloudinary_cloud_name', label: 'Cloud Name' },
                { key: 'cloudinary_api_key',    label: 'API Key' },
                { key: 'cloudinary_api_secret', label: 'API Secret' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input className="form-control" value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Tích hợp ── */}
          {activeTab === 'integrations' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Tích hợp bên thứ ba</h3>
              <div className="form-group">
                <label className="form-label">Unsplash Access Key</label>
                <input
                  className="form-control"
                  value={s.unsplash_access_key ?? ''}
                  onChange={e => set('unsplash_access_key', e.target.value)}
                  placeholder="BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY"
                />
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>
                  Lấy key tại <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a>. Key mặc định đã được cài sẵn.
                </div>
              </div>
            </div>
          )}

        </div>

        <div style={{ marginTop: 20 }}>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : '💾 Lưu cài đặt'}
          </button>
        </div>
      </form>
    </div>
  )
}
