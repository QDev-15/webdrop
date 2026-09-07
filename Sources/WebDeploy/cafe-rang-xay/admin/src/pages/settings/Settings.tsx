import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { api } from '../../api/client'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: 'Thông tin chung' },
  { key: 'seo',          label: 'SEO' },
  { key: 'social',       label: 'Mạng xã hội' },
  { key: 'footer',       label: 'Footer' },
  { key: 'contact',      label: 'Liên hệ' },
  { key: 'content',      label: 'Nội dung trang' },
  { key: 'legal',        label: 'Pháp lý' },
  { key: 'smtp',         label: 'SMTP' },
  { key: 'system',       label: 'Nâng cao' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

const sectionLabelStyle: CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '20px 0 10px' }

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
                <label className="form-label">Tên thương hiệu (không kèm "Roastery")</label>
                <input className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} placeholder="Vd: Mộc Rang" />
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Chữ " Roastery" hiển thị cố định sau tên thương hiệu trên toàn site (đúng theo thiết kế gốc).</div>
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
                <label className="form-label">Số Zalo (chỉ số, dùng cho nút Zalo nổi)</label>
                <input className="form-control" value={s.zalo_phone ?? ''} onChange={e => set('zalo_phone', e.target.value)} placeholder="0901234567" />
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ xưởng</label>
                <textarea className="form-control" rows={2} value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Giờ mở cửa</label>
                <input className="form-control" value={s.working_hours ?? ''} onChange={e => set('working_hours', e.target.value)} />
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
                { key: 'facebook',  label: 'Facebook URL' },
                { key: 'instagram', label: 'Instagram URL' },
                { key: 'tiktok',    label: 'TikTok URL' },
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
              <div className="form-group">
                <label className="form-label">Ghi chú giao hàng</label>
                <input className="form-control" value={s.contact_delivery_note ?? ''} onChange={e => set('contact_delivery_note', e.target.value)} placeholder="Vd: Nội thành giao trong ngày · Tỉnh khác qua GHN/GHTK" />
              </div>
            </div>
          )}

          {/* ── Nội dung trang ── */}
          {activeTab === 'content' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Nội dung trang</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Dùng dấu *từ* để in nghiêng/tô màu nhấn. Dùng phím Enter để xuống dòng ở các tiêu đề lớn (giống &lt;br&gt;).</p>

              <div style={sectionLabelStyle}>Trang chủ — Triết lý rang xay</div>
              <div className="form-group"><label className="form-label">Nhãn nhỏ (eyebrow)</label><input className="form-control" value={s.home_intro_eyebrow ?? ''} onChange={e => set('home_intro_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Đoạn dẫn</label><textarea className="form-control" rows={2} value={s.home_intro_lead ?? ''} onChange={e => set('home_intro_lead', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Đoạn văn</label><textarea className="form-control" rows={3} value={s.home_intro_paragraph ?? ''} onChange={e => set('home_intro_paragraph', e.target.value)} /></div>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bước {i} — tiêu đề</label>
                    <input className="form-control" value={s[`home_process${i}_title`] ?? ''} onChange={e => set(`home_process${i}_title`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bước {i} — mô tả</label>
                    <input className="form-control" value={s[`home_process${i}_desc`] ?? ''} onChange={e => set(`home_process${i}_desc`, e.target.value)} />
                  </div>
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang chủ — Thức uống nổi bật &amp; Phương pháp pha chế</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div className="form-group"><label className="form-label">Nhãn nhỏ</label><input className="form-control" value={s.home_drinks_eyebrow ?? ''} onChange={e => set('home_drinks_eyebrow', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.home_drinks_title ?? ''} onChange={e => set('home_drinks_title', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.home_drinks_sub ?? ''} onChange={e => set('home_drinks_sub', e.target.value)} /></div>
                </div>
                <div>
                  <div className="form-group"><label className="form-label">Nhãn nhỏ</label><input className="form-control" value={s.home_brew_eyebrow ?? ''} onChange={e => set('home_brew_eyebrow', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Tiêu đề</label><input className="form-control" value={s.home_brew_title ?? ''} onChange={e => set('home_brew_title', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={s.home_brew_sub ?? ''} onChange={e => set('home_brew_sub', e.target.value)} /></div>
                </div>
              </div>

              <div style={sectionLabelStyle}>Trang chủ — Dải số liệu (Stat bar)</div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Số {i}</label>
                    <input className="form-control" value={s[`stat${i}_num`] ?? ''} onChange={e => set(`stat${i}_num`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Nhãn {i}</label>
                    <input className="form-control" value={s[`stat${i}_label`] ?? ''} onChange={e => set(`stat${i}_label`, e.target.value)} />
                  </div>
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang chủ — Không gian xưởng, Đánh giá, FAQ, CTA cuối trang</div>
              <div className="form-group"><label className="form-label">Không gian — nhãn nhỏ</label><input className="form-control" value={s.home_space_eyebrow ?? ''} onChange={e => set('home_space_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Không gian — tiêu đề</label><input className="form-control" value={s.home_space_title ?? ''} onChange={e => set('home_space_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Không gian — mô tả</label><textarea className="form-control" rows={2} value={s.home_space_sub ?? ''} onChange={e => set('home_space_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Đánh giá — nhãn nhỏ</label><input className="form-control" value={s.home_review_eyebrow ?? ''} onChange={e => set('home_review_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Đánh giá — tiêu đề</label><input className="form-control" value={s.home_review_title ?? ''} onChange={e => set('home_review_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">FAQ — nhãn nhỏ</label><input className="form-control" value={s.home_faq_eyebrow ?? ''} onChange={e => set('home_faq_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">FAQ — tiêu đề</label><input className="form-control" value={s.home_faq_title ?? ''} onChange={e => set('home_faq_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">CTA cuối trang — tiêu đề</label><input className="form-control" value={s.home_fb_title ?? ''} onChange={e => set('home_fb_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">CTA cuối trang — mô tả</label><textarea className="form-control" rows={2} value={s.home_fb_sub ?? ''} onChange={e => set('home_fb_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Thực đơn</div>
              <div className="form-group"><label className="form-label">Nhãn Hero</label><input className="form-control" value={s.menu_hero_tag ?? ''} onChange={e => set('menu_hero_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề Hero</label><input className="form-control" value={s.menu_hero_title ?? ''} onChange={e => set('menu_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả Hero</label><textarea className="form-control" rows={2} value={s.menu_hero_sub ?? ''} onChange={e => set('menu_hero_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Hạt rang mang về — nhãn nhỏ</label><input className="form-control" value={s.menu_retail_eyebrow ?? ''} onChange={e => set('menu_retail_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Hạt rang mang về — tiêu đề</label><input className="form-control" value={s.menu_retail_title ?? ''} onChange={e => set('menu_retail_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Hạt rang mang về — mô tả</label><textarea className="form-control" rows={2} value={s.menu_retail_sub ?? ''} onChange={e => set('menu_retail_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Không gian</div>
              <div className="form-group"><label className="form-label">Nhãn Hero</label><input className="form-control" value={s.space_hero_tag ?? ''} onChange={e => set('space_hero_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề Hero</label><input className="form-control" value={s.space_hero_title ?? ''} onChange={e => set('space_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả Hero</label><textarea className="form-control" rows={2} value={s.space_hero_sub ?? ''} onChange={e => set('space_hero_sub', e.target.value)} /></div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Stat {i} — số</label>
                    <input className="form-control" value={s[`space_stat${i}_num`] ?? ''} onChange={e => set(`space_stat${i}_num`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Stat {i} — nhãn</label>
                    <input className="form-control" value={s[`space_stat${i}_label`] ?? ''} onChange={e => set(`space_stat${i}_label`, e.target.value)} />
                  </div>
                </div>
              ))}
              <div className="form-group"><label className="form-label">Thư viện ảnh — nhãn nhỏ</label><input className="form-control" value={s.space_gallery_eyebrow ?? ''} onChange={e => set('space_gallery_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Thư viện ảnh — tiêu đề</label><input className="form-control" value={s.space_gallery_title ?? ''} onChange={e => set('space_gallery_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">CTA cuối trang — tiêu đề</label><input className="form-control" value={s.space_fb_title ?? ''} onChange={e => set('space_fb_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">CTA cuối trang — mô tả</label><textarea className="form-control" rows={2} value={s.space_fb_sub ?? ''} onChange={e => set('space_fb_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Giới thiệu</div>
              <div className="form-group"><label className="form-label">Nhãn Hero</label><input className="form-control" value={s.about_hero_tag ?? ''} onChange={e => set('about_hero_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề Hero</label><input className="form-control" value={s.about_hero_title ?? ''} onChange={e => set('about_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả Hero</label><textarea className="form-control" rows={2} value={s.about_hero_sub ?? ''} onChange={e => set('about_hero_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Câu chuyện — nhãn nhỏ</label><input className="form-control" value={s.about_eyebrow ?? ''} onChange={e => set('about_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Câu chuyện — đoạn dẫn</label><textarea className="form-control" rows={2} value={s.about_lead ?? ''} onChange={e => set('about_lead', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Câu chuyện — đoạn 1</label><textarea className="form-control" rows={3} value={s.about_paragraph1 ?? ''} onChange={e => set('about_paragraph1', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Câu chuyện — đoạn 2</label><textarea className="form-control" rows={3} value={s.about_paragraph2 ?? ''} onChange={e => set('about_paragraph2', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Hành trình — nhãn nhỏ</label><input className="form-control" value={s.about_timeline_eyebrow ?? ''} onChange={e => set('about_timeline_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Hành trình — tiêu đề</label><input className="form-control" value={s.about_timeline_title ?? ''} onChange={e => set('about_timeline_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Quy trình — nhãn nhỏ</label><input className="form-control" value={s.about_process_eyebrow ?? ''} onChange={e => set('about_process_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Quy trình — tiêu đề</label><input className="form-control" value={s.about_process_title ?? ''} onChange={e => set('about_process_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Quy trình — mô tả</label><textarea className="form-control" rows={2} value={s.about_process_sub ?? ''} onChange={e => set('about_process_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">FAQ — nhãn nhỏ</label><input className="form-control" value={s.about_faq_eyebrow ?? ''} onChange={e => set('about_faq_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">FAQ — tiêu đề</label><input className="form-control" value={s.about_faq_title ?? ''} onChange={e => set('about_faq_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">FAQ — mô tả</label><textarea className="form-control" rows={2} value={s.about_faq_sub ?? ''} onChange={e => set('about_faq_sub', e.target.value)} /></div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 20px' }}>
                Nội dung từng mốc hành trình / bước quy trình / câu hỏi FAQ được quản lý ở các mục riêng trong menu bên trái.
              </p>
              <div className="form-group"><label className="form-label">CTA cuối trang — tiêu đề</label><input className="form-control" value={s.about_fb_title ?? ''} onChange={e => set('about_fb_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">CTA cuối trang — mô tả</label><textarea className="form-control" rows={2} value={s.about_fb_sub ?? ''} onChange={e => set('about_fb_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Liên hệ</div>
              <div className="form-group"><label className="form-label">Nhãn Hero</label><input className="form-control" value={s.contact_hero_tag ?? ''} onChange={e => set('contact_hero_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tiêu đề Hero</label><input className="form-control" value={s.contact_hero_title ?? ''} onChange={e => set('contact_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Mô tả Hero</label><textarea className="form-control" rows={2} value={s.contact_hero_sub ?? ''} onChange={e => set('contact_hero_sub', e.target.value)} /></div>
            </div>
          )}

          {/* ── Pháp lý ── */}
          {activeTab === 'legal' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Pháp lý</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Nội dung HTML — hỗ trợ thẻ &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;.</p>
              <div className="form-group">
                <label className="form-label">Ngày cập nhật lần cuối</label>
                <input className="form-control" value={s.legal_updated ?? ''} onChange={e => set('legal_updated', e.target.value)} style={{ maxWidth: 200 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung Chính sách bảo mật</label>
                <textarea className="form-control" rows={14} value={s.privacy_content ?? ''} onChange={e => set('privacy_content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung Điều khoản sử dụng</label>
                <textarea className="form-control" rows={14} value={s.terms_content ?? ''} onChange={e => set('terms_content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
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
