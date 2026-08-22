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
                <label className="form-label" htmlFor="site_name">Tên đầy đủ (footer, SEO)</label>
                <input id="site_name" className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nav_logo_name">Tên hiển thị trên logo (nav)</label>
                <input id="nav_logo_name" className="form-control" value={s.nav_logo_name ?? ''} onChange={e => set('nav_logo_name', e.target.value)} placeholder="Khánh Linh" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="site_tagline">Tagline</label>
                <input id="site_tagline" className="form-control" value={s.site_tagline ?? ''} onChange={e => set('site_tagline', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="site_description">Mô tả website</label>
                <textarea id="site_description" className="form-control" rows={3} value={s.site_description ?? ''} onChange={e => set('site_description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="site_email">Email liên hệ</label>
                <input id="site_email" className="form-control" type="email" value={s.site_email ?? ''} onChange={e => set('site_email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="site_phone">Số điện thoại</label>
                <input id="site_phone" className="form-control" value={s.site_phone ?? ''} onChange={e => set('site_phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="site_address">Địa điểm</label>
                <input id="site_address" className="form-control" value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="availability_status">Trạng thái nhận dự án</label>
                <input id="availability_status" className="form-control" value={s.availability_status ?? ''} onChange={e => set('availability_status', e.target.value)} placeholder="Đang nhận dự án mới cho Q4/2026" />
              </div>
            </div>
          )}

          {/* ── SEO ── */}
          {activeTab === 'seo' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Tối ưu SEO</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="meta_title">Tiêu đề trang (Meta Title)</label>
                <input id="meta_title" className="form-control" value={s.meta_title ?? ''} onChange={e => set('meta_title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="meta_description">Mô tả trang (Meta Description)</label>
                <textarea id="meta_description" className="form-control" rows={3} value={s.meta_description ?? ''} onChange={e => set('meta_description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="meta_keywords">Từ khóa (Meta Keywords)</label>
                <input id="meta_keywords" className="form-control" value={s.meta_keywords ?? ''} onChange={e => set('meta_keywords', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="og_image">Ảnh chia sẻ (OG Image URL)</label>
                <input id="og_image" className="form-control" value={s.og_image ?? ''} onChange={e => set('og_image', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Mạng xã hội ── */}
          {activeTab === 'social' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Mạng xã hội</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="zalo_phone">Số Zalo (chỉ số, dùng cho nút Zalo nổi)</label>
                <input id="zalo_phone" className="form-control" value={s.zalo_phone ?? ''} onChange={e => set('zalo_phone', e.target.value)} placeholder="0902345678" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_linkedin">LinkedIn URL</label>
                <input id="social_linkedin" className="form-control" value={s.social_linkedin ?? ''} onChange={e => set('social_linkedin', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_behance">Behance URL</label>
                <input id="social_behance" className="form-control" value={s.social_behance ?? ''} onChange={e => set('social_behance', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_dribbble">Dribbble URL</label>
                <input id="social_dribbble" className="form-control" value={s.social_dribbble ?? ''} onChange={e => set('social_dribbble', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_facebook">Facebook URL</label>
                <input id="social_facebook" className="form-control" value={s.social_facebook ?? ''} onChange={e => set('social_facebook', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          {activeTab === 'footer' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Footer</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="footer_description">Mô tả thương hiệu (footer)</label>
                <textarea id="footer_description" className="form-control" rows={3} value={s.footer_description ?? ''} onChange={e => set('footer_description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="footer_copyright">Dòng bản quyền</label>
                <input id="footer_copyright" className="form-control" value={s.footer_copyright ?? ''} onChange={e => set('footer_copyright', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="footer_tagline">Dòng phụ (dưới bản quyền)</label>
                <input id="footer_tagline" className="form-control" value={s.footer_tagline ?? ''} onChange={e => set('footer_tagline', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Liên hệ ── */}
          {activeTab === 'contact' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Liên hệ &amp; Bản đồ</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="map_embed">Google Maps Embed URL</label>
                <textarea id="map_embed" className="form-control" rows={3} value={s.map_embed ?? ''} onChange={e => set('map_embed', e.target.value)} placeholder="https://maps.google.com/maps?q=...&output=embed" />
              </div>
            </div>
          )}

          {/* ── Nội dung trang ── */}
          {activeTab === 'content' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Nội dung trang</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Dùng dấu *từ* để in nghiêng/tô màu gradient nhấn (vd: "Từ nghiên cứu người dùng đến *giao diện production-ready.*").</p>

              <div style={sectionLabelStyle}>Trang chủ — Giới thiệu</div>
              <div className="form-group"><label className="form-label" htmlFor="home_intro_eyebrow">Nhãn (eyebrow)</label><input id="home_intro_eyebrow" className="form-control" value={s.home_intro_eyebrow ?? ''} onChange={e => set('home_intro_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_intro_title">Tiêu đề</label><input id="home_intro_title" className="form-control" value={s.home_intro_title ?? ''} onChange={e => set('home_intro_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_intro_text1">Đoạn văn 1</label><textarea id="home_intro_text1" className="form-control" rows={2} value={s.home_intro_text1 ?? ''} onChange={e => set('home_intro_text1', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_intro_text2">Đoạn văn 2</label><textarea id="home_intro_text2" className="form-control" rows={2} value={s.home_intro_text2 ?? ''} onChange={e => set('home_intro_text2', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_intro_image">Ảnh (URL)</label><input id="home_intro_image" className="form-control" value={s.home_intro_image ?? ''} onChange={e => set('home_intro_image', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_intro_tags">Thẻ chuyên môn (mỗi dòng 1 thẻ)</label><textarea id="home_intro_tags" className="form-control" rows={4} value={s.home_intro_tags ?? ''} onChange={e => set('home_intro_tags', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Dự án nổi bật</div>
              <div className="form-group"><label className="form-label" htmlFor="home_projects_eyebrow">Nhãn</label><input id="home_projects_eyebrow" className="form-control" value={s.home_projects_eyebrow ?? ''} onChange={e => set('home_projects_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_projects_title">Tiêu đề</label><input id="home_projects_title" className="form-control" value={s.home_projects_title ?? ''} onChange={e => set('home_projects_title', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Dải số liệu (Stat bar)</div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`stat${i}_number`}>Số {i}</label>
                    <input id={`stat${i}_number`} className="form-control" value={s[`stat${i}_number`] ?? ''} onChange={e => set(`stat${i}_number`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`stat${i}_suffix`}>Hậu tố</label>
                    <input id={`stat${i}_suffix`} className="form-control" value={s[`stat${i}_suffix`] ?? ''} onChange={e => set(`stat${i}_suffix`, e.target.value)} placeholder="+" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`stat${i}_label`}>Nhãn</label>
                    <input id={`stat${i}_label`} className="form-control" value={s[`stat${i}_label`] ?? ''} onChange={e => set(`stat${i}_label`, e.target.value)} />
                  </div>
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang chủ — Khách hàng nói gì (teaser)</div>
              <div className="form-group"><label className="form-label" htmlFor="home_testi_eyebrow">Nhãn</label><input id="home_testi_eyebrow" className="form-control" value={s.home_testi_eyebrow ?? ''} onChange={e => set('home_testi_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_testi_title">Tiêu đề</label><input id="home_testi_title" className="form-control" value={s.home_testi_title ?? ''} onChange={e => set('home_testi_title', e.target.value)} /></div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 20px' }}>3 đánh giá đầu (theo thứ tự hiển thị) trong mục <strong>Đánh giá</strong> sẽ hiển thị ở đây.</p>

              <div style={sectionLabelStyle}>Trang Dự án — Hero</div>
              <div className="form-group"><label className="form-label" htmlFor="projects_hero_eyebrow">Nhãn</label><input id="projects_hero_eyebrow" className="form-control" value={s.projects_hero_eyebrow ?? ''} onChange={e => set('projects_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="projects_hero_title">Tiêu đề</label><input id="projects_hero_title" className="form-control" value={s.projects_hero_title ?? ''} onChange={e => set('projects_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="projects_hero_sub">Mô tả</label><textarea id="projects_hero_sub" className="form-control" rows={2} value={s.projects_hero_sub ?? ''} onChange={e => set('projects_hero_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Dịch vụ — Hero</div>
              <div className="form-group"><label className="form-label" htmlFor="services_hero_eyebrow">Nhãn</label><input id="services_hero_eyebrow" className="form-control" value={s.services_hero_eyebrow ?? ''} onChange={e => set('services_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="services_hero_title">Tiêu đề</label><input id="services_hero_title" className="form-control" value={s.services_hero_title ?? ''} onChange={e => set('services_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="services_hero_sub">Mô tả</label><textarea id="services_hero_sub" className="form-control" rows={2} value={s.services_hero_sub ?? ''} onChange={e => set('services_hero_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Dịch vụ — 6 dịch vụ (icon row)</div>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`feat${i}_icon`}>Icon {i}</label>
                    <input id={`feat${i}_icon`} className="form-control" value={s[`feat${i}_icon`] ?? ''} onChange={e => set(`feat${i}_icon`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`feat${i}_title`}>Tiêu đề {i}</label>
                    <input id={`feat${i}_title`} className="form-control" value={s[`feat${i}_title`] ?? ''} onChange={e => set(`feat${i}_title`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`feat${i}_desc`}>Mô tả {i}</label>
                    <input id={`feat${i}_desc`} className="form-control" value={s[`feat${i}_desc`] ?? ''} onChange={e => set(`feat${i}_desc`, e.target.value)} />
                  </div>
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang Dịch vụ — Bảng giá &amp; FAQ &amp; CTA</div>
              <div className="form-group"><label className="form-label" htmlFor="pricing_sub">Ghi chú dưới tiêu đề bảng giá</label><textarea id="pricing_sub" className="form-control" rows={2} value={s.pricing_sub ?? ''} onChange={e => set('pricing_sub', e.target.value)} /></div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 20px' }}>Từng gói giá được quản lý ở mục <strong>Bảng giá</strong> riêng trong menu Nội dung.</p>
              <div className="form-group"><label className="form-label" htmlFor="faq_eyebrow">Nhãn FAQ</label><input id="faq_eyebrow" className="form-control" value={s.faq_eyebrow ?? ''} onChange={e => set('faq_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="faq_title">Tiêu đề FAQ</label><input id="faq_title" className="form-control" value={s.faq_title ?? ''} onChange={e => set('faq_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="faq_sub">Mô tả FAQ</label><textarea id="faq_sub" className="form-control" rows={2} value={s.faq_sub ?? ''} onChange={e => set('faq_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="cta_services_eyebrow">Nhãn CTA cuối trang</label><input id="cta_services_eyebrow" className="form-control" value={s.cta_services_eyebrow ?? ''} onChange={e => set('cta_services_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="cta_services_title">Tiêu đề CTA cuối trang</label><input id="cta_services_title" className="form-control" value={s.cta_services_title ?? ''} onChange={e => set('cta_services_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="cta_services_sub">Mô tả CTA cuối trang</label><textarea id="cta_services_sub" className="form-control" rows={2} value={s.cta_services_sub ?? ''} onChange={e => set('cta_services_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Về tôi — Hero &amp; Tiểu sử</div>
              <div className="form-group"><label className="form-label" htmlFor="about_hero_eyebrow">Nhãn Hero</label><input id="about_hero_eyebrow" className="form-control" value={s.about_hero_eyebrow ?? ''} onChange={e => set('about_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_hero_title">Tiêu đề Hero</label><input id="about_hero_title" className="form-control" value={s.about_hero_title ?? ''} onChange={e => set('about_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_hero_sub">Mô tả Hero</label><textarea id="about_hero_sub" className="form-control" rows={2} value={s.about_hero_sub ?? ''} onChange={e => set('about_hero_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_bio_eyebrow">Nhãn câu chuyện</label><input id="about_bio_eyebrow" className="form-control" value={s.about_bio_eyebrow ?? ''} onChange={e => set('about_bio_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_bio_title">Tiêu đề câu chuyện</label><input id="about_bio_title" className="form-control" value={s.about_bio_title ?? ''} onChange={e => set('about_bio_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_bio_text1">Đoạn văn 1</label><textarea id="about_bio_text1" className="form-control" rows={3} value={s.about_bio_text1 ?? ''} onChange={e => set('about_bio_text1', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_bio_text2">Đoạn văn 2</label><textarea id="about_bio_text2" className="form-control" rows={3} value={s.about_bio_text2 ?? ''} onChange={e => set('about_bio_text2', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_bio_image">Ảnh chân dung (URL)</label><input id="about_bio_image" className="form-control" value={s.about_bio_image ?? ''} onChange={e => set('about_bio_image', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label" htmlFor="about_bio_badge_number">Số badge (vd 6 năm)</label><input id="about_bio_badge_number" className="form-control" value={s.about_bio_badge_number ?? ''} onChange={e => set('about_bio_badge_number', e.target.value)} /></div>
                <div className="form-group"><label className="form-label" htmlFor="about_bio_badge_label">Nhãn badge</label><input id="about_bio_badge_label" className="form-control" value={s.about_bio_badge_label ?? ''} onChange={e => set('about_bio_badge_label', e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label" htmlFor="about_tags">Thẻ giá trị (mỗi dòng 1 thẻ)</label><textarea id="about_tags" className="form-control" rows={3} value={s.about_tags ?? ''} onChange={e => set('about_tags', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_cv_link">Link tải CV/Portfolio PDF</label><input id="about_cv_link" className="form-control" value={s.about_cv_link ?? ''} onChange={e => set('about_cv_link', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Về tôi — Hành trình &amp; Kỹ năng</div>
              <div className="form-group"><label className="form-label" htmlFor="timeline_eyebrow">Nhãn Hành trình</label><input id="timeline_eyebrow" className="form-control" value={s.timeline_eyebrow ?? ''} onChange={e => set('timeline_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="timeline_title">Tiêu đề Hành trình</label><input id="timeline_title" className="form-control" value={s.timeline_title ?? ''} onChange={e => set('timeline_title', e.target.value)} /></div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 12px' }}>Từng mốc thời gian được quản lý ở mục <strong>Hành trình</strong> riêng trong menu Nội dung.</p>
              <div className="form-group"><label className="form-label" htmlFor="skills_eyebrow">Nhãn Kỹ năng</label><input id="skills_eyebrow" className="form-control" value={s.skills_eyebrow ?? ''} onChange={e => set('skills_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="skills_title">Tiêu đề Kỹ năng</label><input id="skills_title" className="form-control" value={s.skills_title ?? ''} onChange={e => set('skills_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="skills_desc">Mô tả Kỹ năng</label><textarea id="skills_desc" className="form-control" rows={2} value={s.skills_desc ?? ''} onChange={e => set('skills_desc', e.target.value)} /></div>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`skillgroup${i}_label`}>Nhóm {i} — nhãn</label>
                    <input id={`skillgroup${i}_label`} className="form-control" value={s[`skillgroup${i}_label`] ?? ''} onChange={e => set(`skillgroup${i}_label`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`skillgroup${i}_items`}>Nhóm {i} — công cụ (mỗi dòng 1 mục)</label>
                    <textarea id={`skillgroup${i}_items`} className="form-control" rows={2} value={s[`skillgroup${i}_items`] ?? ''} onChange={e => set(`skillgroup${i}_items`, e.target.value)} />
                  </div>
                </div>
              ))}
              <div className="form-group"><label className="form-label" htmlFor="testi_full_eyebrow">Nhãn Đánh giá</label><input id="testi_full_eyebrow" className="form-control" value={s.testi_full_eyebrow ?? ''} onChange={e => set('testi_full_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="testi_full_title">Tiêu đề Đánh giá</label><input id="testi_full_title" className="form-control" value={s.testi_full_title ?? ''} onChange={e => set('testi_full_title', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Liên hệ</div>
              <div className="form-group"><label className="form-label" htmlFor="contact_hero_eyebrow">Nhãn Hero</label><input id="contact_hero_eyebrow" className="form-control" value={s.contact_hero_eyebrow ?? ''} onChange={e => set('contact_hero_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="contact_hero_title">Tiêu đề Hero</label><input id="contact_hero_title" className="form-control" value={s.contact_hero_title ?? ''} onChange={e => set('contact_hero_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="contact_hero_sub">Mô tả Hero</label><textarea id="contact_hero_sub" className="form-control" rows={2} value={s.contact_hero_sub ?? ''} onChange={e => set('contact_hero_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="contact_info_title">Tiêu đề khối thông tin liên hệ</label><input id="contact_info_title" className="form-control" value={s.contact_info_title ?? ''} onChange={e => set('contact_info_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="map_section_eyebrow">Nhãn bản đồ</label><input id="map_section_eyebrow" className="form-control" value={s.map_section_eyebrow ?? ''} onChange={e => set('map_section_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="map_section_title">Tiêu đề bản đồ</label><input id="map_section_title" className="form-control" value={s.map_section_title ?? ''} onChange={e => set('map_section_title', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Case Study — CTA cuối trang</div>
              <div className="form-group"><label className="form-label" htmlFor="cta_project_title">Tiêu đề CTA (câu hỏi, phần in đậm nối tự động)</label><input id="cta_project_title" className="form-control" value={s.cta_project_title ?? ''} onChange={e => set('cta_project_title', e.target.value)} /></div>
            </div>
          )}

          {/* ── Pháp lý ── */}
          {activeTab === 'legal' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Pháp lý</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Nội dung HTML — hỗ trợ thẻ &lt;h4&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;.</p>
              <div className="form-group">
                <label className="form-label" htmlFor="legal_updated">Ngày cập nhật lần cuối</label>
                <input id="legal_updated" className="form-control" value={s.legal_updated ?? ''} onChange={e => set('legal_updated', e.target.value)} style={{ maxWidth: 200 }} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="privacy_content">Nội dung Chính sách bảo mật</label>
                <textarea id="privacy_content" className="form-control" rows={14} value={s.privacy_content ?? ''} onChange={e => set('privacy_content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="terms_content">Nội dung Điều khoản sử dụng</label>
                <textarea id="terms_content" className="form-control" rows={14} value={s.terms_content ?? ''} onChange={e => set('terms_content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
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
                  <label className="form-label" htmlFor={f.key}>{f.label}</label>
                  <input id={f.key} className="form-control" type={f.type} value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Nâng cao ── */}
          {activeTab === 'system' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Cài đặt hệ thống</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="maintenance_mode">Chế độ bảo trì</label>
                <select id="maintenance_mode" className="form-control" value={s.maintenance_mode ?? '0'} onChange={e => set('maintenance_mode', e.target.value)}>
                  <option value="0">Tắt (hoạt động bình thường)</option>
                  <option value="1">Bật (hiển thị trang bảo trì)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="items_per_page">Số item mỗi trang</label>
                <input id="items_per_page" className="form-control" type="number" value={s.items_per_page ?? '20'} onChange={e => set('items_per_page', e.target.value)} />
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
                  <label className="form-label" htmlFor={f.key}>{f.label}</label>
                  <input id={f.key} className="form-control" value={s[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Tích hợp ── */}
          {activeTab === 'integrations' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Tích hợp bên thứ ba</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="unsplash_access_key">Unsplash Access Key</label>
                <input
                  id="unsplash_access_key"
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
