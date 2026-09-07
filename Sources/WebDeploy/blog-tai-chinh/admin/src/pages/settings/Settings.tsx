import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { key: 'general',      label: 'Thông tin chung' },
  { key: 'seo',          label: 'SEO' },
  { key: 'social',       label: 'Mạng xã hội' },
  { key: 'footer',       label: 'Footer' },
  { key: 'contact',      label: 'Liên hệ' },
  { key: 'about',        label: 'Về tôi' },
  { key: 'content',      label: 'Nội dung trang' },
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
                <label className="form-label" htmlFor="site_name">Tên website</label>
                <input id="site_name" className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="nav_logo_prefix">Logo — chữ đầu (trắng)</label>
                  <input id="nav_logo_prefix" className="form-control" value={s.nav_logo_prefix ?? ''} onChange={e => set('nav_logo_prefix', e.target.value)} placeholder="La Bàn" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="nav_logo_accent">Logo — chữ nhấn (màu accent)</label>
                  <input id="nav_logo_accent" className="form-control" value={s.nav_logo_accent ?? ''} onChange={e => set('nav_logo_accent', e.target.value)} placeholder="Tài Chính" />
                </div>
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
                <label className="form-label" htmlFor="site_address">Địa chỉ</label>
                <input id="site_address" className="form-control" value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
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
            </div>
          )}

          {/* ── Mạng xã hội ── */}
          {activeTab === 'social' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Mạng xã hội</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="social_facebook">Facebook URL</label>
                <input id="social_facebook" className="form-control" value={s.social_facebook ?? ''} onChange={e => set('social_facebook', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_youtube">YouTube URL</label>
                <input id="social_youtube" className="form-control" value={s.social_youtube ?? ''} onChange={e => set('social_youtube', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_tiktok">TikTok URL</label>
                <input id="social_tiktok" className="form-control" value={s.social_tiktok ?? ''} onChange={e => set('social_tiktok', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_zalo">Số Zalo (chỉ số, dùng cho nút Zalo nổi)</label>
                <input id="social_zalo" className="form-control" value={s.social_zalo ?? ''} onChange={e => set('social_zalo', e.target.value)} placeholder="0987654321" />
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
            </div>
          )}

          {/* ── Liên hệ ── */}
          {activeTab === 'contact' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Liên hệ &amp; Bản đồ</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="contact_response_time">Thời gian phản hồi</label>
                <input id="contact_response_time" className="form-control" value={s.contact_response_time ?? ''} onChange={e => set('contact_response_time', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact_disclaimer">Ghi chú miễn trừ trách nhiệm</label>
                <textarea id="contact_disclaimer" className="form-control" rows={3} value={s.contact_disclaimer ?? ''} onChange={e => set('contact_disclaimer', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="map_embed">Google Maps Embed URL</label>
                <textarea id="map_embed" className="form-control" rows={2} value={s.map_embed ?? ''} onChange={e => set('map_embed', e.target.value)} placeholder="https://maps.google.com/maps?q=...&output=embed" />
              </div>
            </div>
          )}

          {/* ── Về tôi ── */}
          {activeTab === 'about' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Trang Về tôi</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Dùng dấu *từ* để in nghiêng/nhấn màu accent (vd: "Từ ngân hàng đến *trang viết*").</p>

              <div className="form-group"><label className="form-label" htmlFor="about_name">Tên hiển thị</label><input id="about_name" className="form-control" value={s.about_name ?? ''} onChange={e => set('about_name', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_tag">Nhãn (eyebrow)</label><input id="about_tag" className="form-control" value={s.about_tag ?? ''} onChange={e => set('about_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_intro">Đoạn giới thiệu ngắn (dưới H1)</label><textarea id="about_intro" className="form-control" rows={2} value={s.about_intro ?? ''} onChange={e => set('about_intro', e.target.value)} /></div>
              <div className="form-group"><ImageField label="Ảnh chân dung" value={s.about_photo ?? ''} onChange={v => set('about_photo', v)} /></div>

              <div style={sectionLabelStyle}>Câu chuyện của tôi</div>
              <div className="form-group"><label className="form-label" htmlFor="about_story_tag">Nhãn</label><input id="about_story_tag" className="form-control" value={s.about_story_tag ?? ''} onChange={e => set('about_story_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story_title">Tiêu đề</label><input id="about_story_title" className="form-control" value={s.about_story_title ?? ''} onChange={e => set('about_story_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story_p1">Đoạn văn 1</label><textarea id="about_story_p1" className="form-control" rows={3} value={s.about_story_p1 ?? ''} onChange={e => set('about_story_p1', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story_p2">Đoạn văn 2</label><textarea id="about_story_p2" className="form-control" rows={3} value={s.about_story_p2 ?? ''} onChange={e => set('about_story_p2', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Dải số liệu (Stat bar)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label" htmlFor="stat_years_experience">Số năm kinh nghiệm</label><input id="stat_years_experience" className="form-control" value={s.stat_years_experience ?? ''} onChange={e => set('stat_years_experience', e.target.value)} /></div>
                <div className="form-group"><label className="form-label" htmlFor="stat_years_active">Số năm hoạt động</label><input id="stat_years_active" className="form-control" value={s.stat_years_active ?? ''} onChange={e => set('stat_years_active', e.target.value)} /></div>
                <div className="form-group"><label className="form-label" htmlFor="stat_monthly_readers_num">Độc giả/tháng (số)</label><input id="stat_monthly_readers_num" className="form-control" value={s.stat_monthly_readers_num ?? ''} onChange={e => set('stat_monthly_readers_num', e.target.value)} /></div>
                <div className="form-group"><label className="form-label" htmlFor="stat_monthly_readers_suffix">Độc giả/tháng (hậu tố)</label><input id="stat_monthly_readers_suffix" className="form-control" value={s.stat_monthly_readers_suffix ?? ''} onChange={e => set('stat_monthly_readers_suffix', e.target.value)} placeholder="k" /></div>
                <div className="form-group"><label className="form-label" htmlFor="stat_newsletter_num">Người theo dõi bản tin (số)</label><input id="stat_newsletter_num" className="form-control" value={s.stat_newsletter_num ?? ''} onChange={e => set('stat_newsletter_num', e.target.value)} /></div>
                <div className="form-group"><label className="form-label" htmlFor="stat_newsletter_suffix">Người theo dõi bản tin (hậu tố)</label><input id="stat_newsletter_suffix" className="form-control" value={s.stat_newsletter_suffix ?? ''} onChange={e => set('stat_newsletter_suffix', e.target.value)} placeholder="k" /></div>
              </div>

              <div style={sectionLabelStyle}>3 giá trị theo đuổi</div>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`about_value${i}_title`}>Giá trị {i} — tiêu đề</label>
                    <input id={`about_value${i}_title`} className="form-control" value={s[`about_value${i}_title`] ?? ''} onChange={e => set(`about_value${i}_title`, e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor={`about_value${i}_desc`}>Giá trị {i} — mô tả</label>
                    <input id={`about_value${i}_desc`} className="form-control" value={s[`about_value${i}_desc`] ?? ''} onChange={e => set(`about_value${i}_desc`, e.target.value)} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '8px 0 0' }}>Từng mốc thời gian được quản lý ở mục <strong>Hành trình</strong> riêng trong menu Nội dung.</p>
            </div>
          )}

          {/* ── Nội dung trang ── */}
          {activeTab === 'content' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Nội dung trang</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Dùng dấu *từ* để in nghiêng/nhấn màu accent (vd: "Bài viết *nổi bật*").</p>

              <div style={sectionLabelStyle}>Trang chủ — Bài viết nổi bật</div>
              <div className="form-group"><label className="form-label" htmlFor="home_bento_tag">Nhãn</label><input id="home_bento_tag" className="form-control" value={s.home_bento_tag ?? ''} onChange={e => set('home_bento_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_bento_title">Tiêu đề</label><input id="home_bento_title" className="form-control" value={s.home_bento_title ?? ''} onChange={e => set('home_bento_title', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — 6 chuyên mục</div>
              <div className="form-group"><label className="form-label" htmlFor="home_category_tag">Nhãn</label><input id="home_category_tag" className="form-control" value={s.home_category_tag ?? ''} onChange={e => set('home_category_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_category_title">Tiêu đề</label><input id="home_category_title" className="form-control" value={s.home_category_title ?? ''} onChange={e => set('home_category_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_category_sub">Mô tả</label><textarea id="home_category_sub" className="form-control" rows={2} value={s.home_category_sub ?? ''} onChange={e => set('home_category_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Bài viết mới nhất</div>
              <div className="form-group"><label className="form-label" htmlFor="home_latest_tag">Nhãn</label><input id="home_latest_tag" className="form-control" value={s.home_latest_tag ?? ''} onChange={e => set('home_latest_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_latest_title">Tiêu đề</label><input id="home_latest_title" className="form-control" value={s.home_latest_title ?? ''} onChange={e => set('home_latest_title', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Công cụ tính toán (2 khối)</div>
              <div className="form-group"><label className="form-label" htmlFor="home_tool1_tag">Khối 1 — Nhãn</label><input id="home_tool1_tag" className="form-control" value={s.home_tool1_tag ?? ''} onChange={e => set('home_tool1_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_tool1_title">Khối 1 — Tiêu đề</label><input id="home_tool1_title" className="form-control" value={s.home_tool1_title ?? ''} onChange={e => set('home_tool1_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_tool1_desc">Khối 1 — Mô tả</label><textarea id="home_tool1_desc" className="form-control" rows={2} value={s.home_tool1_desc ?? ''} onChange={e => set('home_tool1_desc', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_tool2_tag">Khối 2 — Nhãn</label><input id="home_tool2_tag" className="form-control" value={s.home_tool2_tag ?? ''} onChange={e => set('home_tool2_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_tool2_title">Khối 2 — Tiêu đề</label><input id="home_tool2_title" className="form-control" value={s.home_tool2_title ?? ''} onChange={e => set('home_tool2_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_tool2_desc">Khối 2 — Mô tả</label><textarea id="home_tool2_desc" className="form-control" rows={2} value={s.home_tool2_desc ?? ''} onChange={e => set('home_tool2_desc', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Đánh giá &amp; FAQ &amp; CTA</div>
              <div className="form-group"><label className="form-label" htmlFor="home_testi_tag">Nhãn đánh giá</label><input id="home_testi_tag" className="form-control" value={s.home_testi_tag ?? ''} onChange={e => set('home_testi_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_testi_title">Tiêu đề đánh giá</label><input id="home_testi_title" className="form-control" value={s.home_testi_title ?? ''} onChange={e => set('home_testi_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_faq_tag">Nhãn FAQ</label><input id="home_faq_tag" className="form-control" value={s.home_faq_tag ?? ''} onChange={e => set('home_faq_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_faq_title">Tiêu đề FAQ</label><input id="home_faq_title" className="form-control" value={s.home_faq_title ?? ''} onChange={e => set('home_faq_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_cta_title">Tiêu đề CTA đăng ký bản tin</label><input id="home_cta_title" className="form-control" value={s.home_cta_title ?? ''} onChange={e => set('home_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_cta_sub">Mô tả CTA</label><textarea id="home_cta_sub" className="form-control" rows={2} value={s.home_cta_sub ?? ''} onChange={e => set('home_cta_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Chuyên mục</div>
              <div className="form-group"><label className="form-label" htmlFor="category_page_title">Tiêu đề</label><input id="category_page_title" className="form-control" value={s.category_page_title ?? ''} onChange={e => set('category_page_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="category_page_sub">Mô tả</label><textarea id="category_page_sub" className="form-control" rows={2} value={s.category_page_sub ?? ''} onChange={e => set('category_page_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="category_trending_tag">Nhãn "Đọc nhiều nhất tuần này"</label><input id="category_trending_tag" className="form-control" value={s.category_trending_tag ?? ''} onChange={e => set('category_trending_tag', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Công cụ tính toán</div>
              <div className="form-group"><label className="form-label" htmlFor="tools_page_tag">Nhãn</label><input id="tools_page_tag" className="form-control" value={s.tools_page_tag ?? ''} onChange={e => set('tools_page_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="tools_page_title">Tiêu đề</label><input id="tools_page_title" className="form-control" value={s.tools_page_title ?? ''} onChange={e => set('tools_page_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="tools_page_sub">Mô tả</label><textarea id="tools_page_sub" className="form-control" rows={2} value={s.tools_page_sub ?? ''} onChange={e => set('tools_page_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="tools_disclaimer">Ghi chú miễn trừ trách nhiệm</label><textarea id="tools_disclaimer" className="form-control" rows={3} value={s.tools_disclaimer ?? ''} onChange={e => set('tools_disclaimer', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Liên hệ</div>
              <div className="form-group"><label className="form-label" htmlFor="contact_page_tag">Nhãn</label><input id="contact_page_tag" className="form-control" value={s.contact_page_tag ?? ''} onChange={e => set('contact_page_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="contact_page_title">Tiêu đề</label><input id="contact_page_title" className="form-control" value={s.contact_page_title ?? ''} onChange={e => set('contact_page_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="contact_page_sub">Mô tả</label><textarea id="contact_page_sub" className="form-control" rows={2} value={s.contact_page_sub ?? ''} onChange={e => set('contact_page_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Về tôi — Hành trình &amp; Giá trị &amp; CTA</div>
              <div className="form-group"><label className="form-label" htmlFor="about_timeline_tag">Nhãn hành trình</label><input id="about_timeline_tag" className="form-control" value={s.about_timeline_tag ?? ''} onChange={e => set('about_timeline_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_timeline_title">Tiêu đề hành trình</label><input id="about_timeline_title" className="form-control" value={s.about_timeline_title ?? ''} onChange={e => set('about_timeline_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_value_tag">Nhãn giá trị</label><input id="about_value_tag" className="form-control" value={s.about_value_tag ?? ''} onChange={e => set('about_value_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_value_title">Tiêu đề giá trị</label><input id="about_value_title" className="form-control" value={s.about_value_title ?? ''} onChange={e => set('about_value_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_cta_title">Tiêu đề CTA cuối trang</label><input id="about_cta_title" className="form-control" value={s.about_cta_title ?? ''} onChange={e => set('about_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_cta_sub">Mô tả CTA cuối trang</label><textarea id="about_cta_sub" className="form-control" rows={2} value={s.about_cta_sub ?? ''} onChange={e => set('about_cta_sub', e.target.value)} /></div>
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
