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
  { key: 'content',      label: 'Nội dung trang' },
  { key: 'smtp',         label: 'SMTP' },
  { key: 'system',       label: 'Nâng cao' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

const sectionLabelStyle: CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '24px 0 10px' }

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
                <label className="form-label" htmlFor="site_name">Tên quán</label>
                <input id="site_name" className="form-control" value={s.site_name ?? ''} onChange={e => set('site_name', e.target.value)} />
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
                <ImageField label="Logo" value={s.site_logo ?? ''} onChange={v => set('site_logo', v)} />
              </div>
              <div className="form-group">
                <ImageField label="Favicon" value={s.site_favicon ?? ''} onChange={v => set('site_favicon', v)} />
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
                <label className="form-label" htmlFor="site_address">Địa chỉ quán</label>
                <textarea id="site_address" className="form-control" rows={2} value={s.site_address ?? ''} onChange={e => set('site_address', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="working_hours">Giờ mở cửa</label>
                <input id="working_hours" className="form-control" value={s.working_hours ?? ''} onChange={e => set('working_hours', e.target.value)} />
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
                <input id="social_facebook" className="form-control" value={s.social_facebook ?? ''} onChange={e => set('social_facebook', e.target.value)} placeholder="https://facebook.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_instagram">Instagram URL</label>
                <input id="social_instagram" className="form-control" value={s.social_instagram ?? ''} onChange={e => set('social_instagram', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="social_tiktok">TikTok URL</label>
                <input id="social_tiktok" className="form-control" value={s.social_tiktok ?? ''} onChange={e => set('social_tiktok', e.target.value)} placeholder="https://tiktok.com/@..." />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="zalo_phone">Số Zalo (chỉ số, dùng cho nút Zalo nổi)</label>
                <input id="zalo_phone" className="form-control" value={s.zalo_phone ?? ''} onChange={e => set('zalo_phone', e.target.value)} placeholder="0901234567" />
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
                <label className="form-label" htmlFor="map_embed">Google Maps Embed URL</label>
                <textarea id="map_embed" className="form-control" rows={3} value={s.map_embed ?? ''} onChange={e => set('map_embed', e.target.value)} placeholder="https://maps.google.com/maps?q=...&output=embed" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact_intro_title">Tiêu đề trang Liên hệ</label>
                <input id="contact_intro_title" className="form-control" value={s.contact_intro_title ?? ''} onChange={e => set('contact_intro_title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact_intro_text">Mô tả trang Liên hệ</label>
                <textarea id="contact_intro_text" className="form-control" rows={2} value={s.contact_intro_text ?? ''} onChange={e => set('contact_intro_text', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Nội dung trang ── */}
          {activeTab === 'content' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Nội dung trang</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Dùng dấu *từ* để tô màu nhấn trong tiêu đề (vd: "Bốn lý do *chọn quay lại*").</p>

              <div style={sectionLabelStyle}>Trang chủ — Vì sao chọn</div>
              <div className="form-group"><label className="form-label" htmlFor="home_features_eyebrow">Nhãn</label><input id="home_features_eyebrow" className="form-control" value={s.home_features_eyebrow ?? ''} onChange={e => set('home_features_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_features_title">Tiêu đề</label><input id="home_features_title" className="form-control" value={s.home_features_title ?? ''} onChange={e => set('home_features_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_features_sub">Mô tả</label><textarea id="home_features_sub" className="form-control" rows={2} value={s.home_features_sub ?? ''} onChange={e => set('home_features_sub', e.target.value)} /></div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '0 0 12px' }}>Từng mục quản lý ở <strong>Vì sao chọn / Giá trị / Tiện ích</strong> trong menu Trang chủ.</p>

              <div style={sectionLabelStyle}>Trang chủ — Menu nổi bật</div>
              <div className="form-group"><label className="form-label" htmlFor="home_menu_eyebrow">Nhãn</label><input id="home_menu_eyebrow" className="form-control" value={s.home_menu_eyebrow ?? ''} onChange={e => set('home_menu_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_menu_title">Tiêu đề</label><input id="home_menu_title" className="form-control" value={s.home_menu_title ?? ''} onChange={e => set('home_menu_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_menu_sub">Mô tả</label><textarea id="home_menu_sub" className="form-control" rows={2} value={s.home_menu_sub ?? ''} onChange={e => set('home_menu_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Triết lý pha chế (câu chuyện)</div>
              <div className="form-group"><label className="form-label" htmlFor="home_story_badge">Nhãn</label><input id="home_story_badge" className="form-control" value={s.home_story_badge ?? ''} onChange={e => set('home_story_badge', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_story_title">Tiêu đề</label><input id="home_story_title" className="form-control" value={s.home_story_title ?? ''} onChange={e => set('home_story_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_story_text">Đoạn văn</label><textarea id="home_story_text" className="form-control" rows={3} value={s.home_story_text ?? ''} onChange={e => set('home_story_text', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_story_list">Danh sách gạch đầu dòng (mỗi dòng 1 mục)</label><textarea id="home_story_list" className="form-control" rows={3} value={s.home_story_list ?? ''} onChange={e => set('home_story_list', e.target.value)} /></div>
              <div className="form-group"><ImageField label="Ảnh minh họa" value={s.home_story_image ?? ''} onChange={v => set('home_story_image', v)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Không gian quán (preview)</div>
              <div className="form-group"><label className="form-label" htmlFor="home_space_eyebrow">Nhãn</label><input id="home_space_eyebrow" className="form-control" value={s.home_space_eyebrow ?? ''} onChange={e => set('home_space_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_space_title">Tiêu đề</label><input id="home_space_title" className="form-control" value={s.home_space_title ?? ''} onChange={e => set('home_space_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_space_sub">Mô tả</label><textarea id="home_space_sub" className="form-control" rows={2} value={s.home_space_sub ?? ''} onChange={e => set('home_space_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — Đánh giá &amp; FAQ (tiêu đề section)</div>
              <div className="form-group"><label className="form-label" htmlFor="home_testi_eyebrow">Nhãn Đánh giá</label><input id="home_testi_eyebrow" className="form-control" value={s.home_testi_eyebrow ?? ''} onChange={e => set('home_testi_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_testi_title">Tiêu đề Đánh giá</label><input id="home_testi_title" className="form-control" value={s.home_testi_title ?? ''} onChange={e => set('home_testi_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_faq_eyebrow">Nhãn FAQ</label><input id="home_faq_eyebrow" className="form-control" value={s.home_faq_eyebrow ?? ''} onChange={e => set('home_faq_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_faq_title">Tiêu đề FAQ</label><input id="home_faq_title" className="form-control" value={s.home_faq_title ?? ''} onChange={e => set('home_faq_title', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang chủ — CTA cuối trang</div>
              <div className="form-group"><label className="form-label" htmlFor="home_cta_eyebrow">Nhãn</label><input id="home_cta_eyebrow" className="form-control" value={s.home_cta_eyebrow ?? ''} onChange={e => set('home_cta_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_cta_title">Tiêu đề</label><input id="home_cta_title" className="form-control" value={s.home_cta_title ?? ''} onChange={e => set('home_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="home_cta_text">Mô tả</label><textarea id="home_cta_text" className="form-control" rows={2} value={s.home_cta_text ?? ''} onChange={e => set('home_cta_text', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><ImageField label="Ảnh 1" value={s.home_cta_image1 ?? ''} onChange={v => set('home_cta_image1', v)} /></div>
                <div className="form-group"><ImageField label="Ảnh 2" value={s.home_cta_image2 ?? ''} onChange={v => set('home_cta_image2', v)} /></div>
              </div>

              <div style={sectionLabelStyle}>Trang Thực đơn</div>
              <div className="form-group"><label className="form-label" htmlFor="menu_page_title">Tiêu đề trang</label><input id="menu_page_title" className="form-control" value={s.menu_page_title ?? ''} onChange={e => set('menu_page_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="menu_page_sub">Mô tả trang</label><textarea id="menu_page_sub" className="form-control" rows={2} value={s.menu_page_sub ?? ''} onChange={e => set('menu_page_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="menu_beans_tag">Banner mua hạt — nhãn</label><input id="menu_beans_tag" className="form-control" value={s.menu_beans_tag ?? ''} onChange={e => set('menu_beans_tag', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="menu_beans_title">Banner mua hạt — tiêu đề</label><input id="menu_beans_title" className="form-control" value={s.menu_beans_title ?? ''} onChange={e => set('menu_beans_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="menu_beans_text">Banner mua hạt — mô tả</label><textarea id="menu_beans_text" className="form-control" rows={2} value={s.menu_beans_text ?? ''} onChange={e => set('menu_beans_text', e.target.value)} /></div>
              <div className="form-group"><ImageField label="Banner mua hạt — ảnh" value={s.menu_beans_image ?? ''} onChange={v => set('menu_beans_image', v)} /></div>

              <div style={sectionLabelStyle}>Trang Không gian</div>
              <div className="form-group"><label className="form-label" htmlFor="space_page_title">Tiêu đề trang</label><input id="space_page_title" className="form-control" value={s.space_page_title ?? ''} onChange={e => set('space_page_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="space_page_sub">Mô tả trang</label><textarea id="space_page_sub" className="form-control" rows={2} value={s.space_page_sub ?? ''} onChange={e => set('space_page_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="space_area_eyebrow">Nhãn khu vực</label><input id="space_area_eyebrow" className="form-control" value={s.space_area_eyebrow ?? ''} onChange={e => set('space_area_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="space_area_title">Tiêu đề khu vực</label><input id="space_area_title" className="form-control" value={s.space_area_title ?? ''} onChange={e => set('space_area_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="space_area_sub">Mô tả khu vực</label><textarea id="space_area_sub" className="form-control" rows={2} value={s.space_area_sub ?? ''} onChange={e => set('space_area_sub', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="amenity_eyebrow">Nhãn Tiện ích</label><input id="amenity_eyebrow" className="form-control" value={s.amenity_eyebrow ?? ''} onChange={e => set('amenity_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="amenity_title">Tiêu đề Tiện ích</label><input id="amenity_title" className="form-control" value={s.amenity_title ?? ''} onChange={e => set('amenity_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="gallery_eyebrow">Nhãn Thư viện ảnh</label><input id="gallery_eyebrow" className="form-control" value={s.gallery_eyebrow ?? ''} onChange={e => set('gallery_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="gallery_title">Tiêu đề Thư viện ảnh</label><input id="gallery_title" className="form-control" value={s.gallery_title ?? ''} onChange={e => set('gallery_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="space_cta_eyebrow">Nhãn CTA cuối trang</label><input id="space_cta_eyebrow" className="form-control" value={s.space_cta_eyebrow ?? ''} onChange={e => set('space_cta_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="space_cta_title">Tiêu đề CTA cuối trang</label><input id="space_cta_title" className="form-control" value={s.space_cta_title ?? ''} onChange={e => set('space_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="space_cta_text">Mô tả CTA cuối trang</label><textarea id="space_cta_text" className="form-control" rows={2} value={s.space_cta_text ?? ''} onChange={e => set('space_cta_text', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><ImageField label="Ảnh CTA 1" value={s.space_cta_image1 ?? ''} onChange={v => set('space_cta_image1', v)} /></div>
                <div className="form-group"><ImageField label="Ảnh CTA 2" value={s.space_cta_image2 ?? ''} onChange={v => set('space_cta_image2', v)} /></div>
              </div>

              <div style={sectionLabelStyle}>Trang Giới thiệu — Hero</div>
              <div className="form-group"><label className="form-label" htmlFor="about_page_title">Tiêu đề trang</label><input id="about_page_title" className="form-control" value={s.about_page_title ?? ''} onChange={e => set('about_page_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_page_sub">Mô tả trang</label><textarea id="about_page_sub" className="form-control" rows={2} value={s.about_page_sub ?? ''} onChange={e => set('about_page_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Giới thiệu — Câu chuyện thương hiệu</div>
              <div className="form-group"><label className="form-label" htmlFor="about_story1_badge">Nhãn</label><input id="about_story1_badge" className="form-control" value={s.about_story1_badge ?? ''} onChange={e => set('about_story1_badge', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story1_title">Tiêu đề</label><input id="about_story1_title" className="form-control" value={s.about_story1_title ?? ''} onChange={e => set('about_story1_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story1_text">Nội dung (2 đoạn cách nhau bằng dòng trống)</label><textarea id="about_story1_text" className="form-control" rows={5} value={s.about_story1_text ?? ''} onChange={e => set('about_story1_text', e.target.value)} /></div>
              <div className="form-group"><ImageField label="Ảnh minh họa" value={s.about_story1_image ?? ''} onChange={v => set('about_story1_image', v)} /></div>

              <div style={sectionLabelStyle}>Trang Giới thiệu — Triết lý specialty coffee</div>
              <div className="form-group"><label className="form-label" htmlFor="about_story2_badge">Nhãn</label><input id="about_story2_badge" className="form-control" value={s.about_story2_badge ?? ''} onChange={e => set('about_story2_badge', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story2_title">Tiêu đề</label><input id="about_story2_title" className="form-control" value={s.about_story2_title ?? ''} onChange={e => set('about_story2_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story2_text">Đoạn văn</label><textarea id="about_story2_text" className="form-control" rows={3} value={s.about_story2_text ?? ''} onChange={e => set('about_story2_text', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_story2_list">Danh sách gạch đầu dòng (mỗi dòng 1 mục)</label><textarea id="about_story2_list" className="form-control" rows={3} value={s.about_story2_list ?? ''} onChange={e => set('about_story2_list', e.target.value)} /></div>
              <div className="form-group"><ImageField label="Ảnh minh họa" value={s.about_story2_image ?? ''} onChange={v => set('about_story2_image', v)} /></div>

              <div style={sectionLabelStyle}>Trang Giới thiệu — Giá trị / Hành trình / Đội ngũ (tiêu đề section)</div>
              <div className="form-group"><label className="form-label" htmlFor="about_values_eyebrow">Nhãn Giá trị cốt lõi</label><input id="about_values_eyebrow" className="form-control" value={s.about_values_eyebrow ?? ''} onChange={e => set('about_values_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_values_title">Tiêu đề Giá trị cốt lõi</label><input id="about_values_title" className="form-control" value={s.about_values_title ?? ''} onChange={e => set('about_values_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_timeline_eyebrow">Nhãn Hành trình</label><input id="about_timeline_eyebrow" className="form-control" value={s.about_timeline_eyebrow ?? ''} onChange={e => set('about_timeline_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_timeline_title">Tiêu đề Hành trình</label><input id="about_timeline_title" className="form-control" value={s.about_timeline_title ?? ''} onChange={e => set('about_timeline_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_team_eyebrow">Nhãn Đội ngũ</label><input id="about_team_eyebrow" className="form-control" value={s.about_team_eyebrow ?? ''} onChange={e => set('about_team_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_team_title">Tiêu đề Đội ngũ</label><input id="about_team_title" className="form-control" value={s.about_team_title ?? ''} onChange={e => set('about_team_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_team_sub">Mô tả Đội ngũ</label><textarea id="about_team_sub" className="form-control" rows={2} value={s.about_team_sub ?? ''} onChange={e => set('about_team_sub', e.target.value)} /></div>

              <div style={sectionLabelStyle}>Trang Giới thiệu — CTA cuối trang</div>
              <div className="form-group"><label className="form-label" htmlFor="about_cta_eyebrow">Nhãn</label><input id="about_cta_eyebrow" className="form-control" value={s.about_cta_eyebrow ?? ''} onChange={e => set('about_cta_eyebrow', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_cta_title">Tiêu đề</label><input id="about_cta_title" className="form-control" value={s.about_cta_title ?? ''} onChange={e => set('about_cta_title', e.target.value)} /></div>
              <div className="form-group"><label className="form-label" htmlFor="about_cta_text">Mô tả</label><textarea id="about_cta_text" className="form-control" rows={2} value={s.about_cta_text ?? ''} onChange={e => set('about_cta_text', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><ImageField label="Ảnh CTA 1" value={s.about_cta_image1 ?? ''} onChange={v => set('about_cta_image1', v)} /></div>
                <div className="form-group"><ImageField label="Ảnh CTA 2" value={s.about_cta_image2 ?? ''} onChange={v => set('about_cta_image2', v)} /></div>
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
