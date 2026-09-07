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
  { key: 'smtp',         label: 'SMTP' },
  { key: 'system',       label: 'Nâng cao' },
  { key: 'cloudinary',   label: '☁️ Cloudinary' },
  { key: 'integrations', label: '🔌 Tích hợp' },
]

const sectionLabelStyle: CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '20px 0 10px' }

function Field({ id, label, s, set, textarea, rows }: { id: string; label: string; s: SettingsMap; set: (k: string, v: string) => void; textarea?: boolean; rows?: number }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea id={id} className="form-control" rows={rows ?? 2} value={s[id] ?? ''} onChange={e => set(id, e.target.value)} />
      ) : (
        <input id={id} className="form-control" value={s[id] ?? ''} onChange={e => set(id, e.target.value)} />
      )}
    </div>
  )
}

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
              <Field id="site_name" label="Tên website" s={s} set={set} />
              <Field id="site_tagline" label="Tagline" s={s} set={set} />
              <Field id="site_description" label="Mô tả website" s={s} set={set} textarea rows={3} />
              <Field id="site_email" label="Email liên hệ" s={s} set={set} />
              <Field id="site_phone" label="Số điện thoại" s={s} set={set} />
              <Field id="site_address" label="Địa chỉ quán" s={s} set={set} textarea rows={2} />
              <Field id="working_hours" label="Giờ mở cửa" s={s} set={set} />
            </div>
          )}

          {/* ── SEO ── */}
          {activeTab === 'seo' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Tối ưu SEO</h3>
              <Field id="meta_title" label="Tiêu đề trang (Meta Title)" s={s} set={set} />
              <Field id="meta_description" label="Mô tả trang (Meta Description)" s={s} set={set} textarea rows={3} />
              <Field id="meta_keywords" label="Từ khóa (Meta Keywords)" s={s} set={set} />
              <Field id="og_image" label="Ảnh chia sẻ (OG Image URL)" s={s} set={set} />
            </div>
          )}

          {/* ── Mạng xã hội ── */}
          {activeTab === 'social' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Mạng xã hội</h3>
              <Field id="zalo_phone" label="Số Zalo (dùng cho nút Zalo nổi)" s={s} set={set} />
              <Field id="facebook_url" label="Link Facebook" s={s} set={set} />
              <Field id="instagram_url" label="Link Instagram" s={s} set={set} />
              <Field id="tiktok_url" label="Link TikTok" s={s} set={set} />
            </div>
          )}

          {/* ── Footer ── */}
          {activeTab === 'footer' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Footer</h3>
              <Field id="footer_description" label="Mô tả thương hiệu (footer)" s={s} set={set} textarea rows={3} />
              <Field id="footer_copyright" label="Dòng bản quyền" s={s} set={set} />
            </div>
          )}

          {/* ── Liên hệ ── */}
          {activeTab === 'contact' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Liên hệ &amp; Bản đồ</h3>
              <Field id="map_embed" label="Google Maps Embed URL" s={s} set={set} textarea rows={3} />
              <Field id="contact_hero_title" label="Tiêu đề Hero (trang Liên hệ)" s={s} set={set} />
              <Field id="contact_hero_desc" label="Mô tả Hero (trang Liên hệ)" s={s} set={set} textarea rows={2} />
            </div>
          )}

          {/* ── Nội dung trang ── */}
          {activeTab === 'content' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Nội dung trang</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>Dùng dấu *từ* để in nghiêng/tô màu nhấn (vd: "Ngọt ngào *từ từng lớp bánh*").</p>

              <div style={sectionLabelStyle}>Trang chủ — Vì sao chọn Rosette</div>
              <Field id="home_feat_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="home_feat_title" label="Tiêu đề" s={s} set={set} />
              <Field id="home_feat_desc" label="Mô tả" s={s} set={set} textarea />
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <Field id={`home_feat${i}_icon`} label={`Icon ${i}`} s={s} set={set} />
                  <Field id={`home_feat${i}_title`} label={`Tiêu đề ${i}`} s={s} set={set} />
                  <Field id={`home_feat${i}_desc`} label={`Mô tả ${i}`} s={s} set={set} />
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang chủ — Món được yêu thích</div>
              <Field id="home_product_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="home_product_title" label="Tiêu đề" s={s} set={set} />
              <Field id="home_product_desc" label="Mô tả" s={s} set={set} textarea />
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>4 món nổi bật hiển thị tự động — đánh dấu "Nổi bật" cho món ăn ở mục <strong>Món &amp; Đồ uống</strong>.</p>

              <div style={sectionLabelStyle}>Trang chủ — Câu chuyện thương hiệu</div>
              <Field id="home_story_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="home_story_title" label="Tiêu đề" s={s} set={set} />
              <Field id="home_story_text" label="Đoạn văn" s={s} set={set} textarea rows={3} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[1, 2, 3].map(i => (
                  <div key={i}>
                    <Field id={`home_story_stat${i}_num`} label={`Số ${i}`} s={s} set={set} />
                    <Field id={`home_story_stat${i}_label`} label={`Nhãn ${i}`} s={s} set={set} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[1, 2, 3].map(i => <Field key={i} id={`home_story_img${i}`} label={`Ảnh ${i} (URL)`} s={s} set={set} />)}
              </div>

              <div style={sectionLabelStyle}>Trang chủ — Không gian quán (preview)</div>
              <Field id="home_space_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="home_space_title" label="Tiêu đề" s={s} set={set} />
              <Field id="home_space_desc" label="Mô tả" s={s} set={set} textarea />

              <div style={sectionLabelStyle}>Trang chủ — Menu hôm nay</div>
              <Field id="home_menu_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="home_menu_title" label="Tiêu đề" s={s} set={set} />
              <Field id="home_menu_desc" label="Mô tả" s={s} set={set} textarea />

              <div style={sectionLabelStyle}>Trang chủ — FAQ</div>
              <Field id="home_faq_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="home_faq_title" label="Tiêu đề" s={s} set={set} />
              <Field id="home_faq_desc" label="Mô tả" s={s} set={set} textarea />
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} style={{ marginBottom: 12, padding: 12, background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <Field id={`faq${i}_q`} label={`Câu hỏi ${i}`} s={s} set={set} />
                  <Field id={`faq${i}_a`} label={`Trả lời ${i}`} s={s} set={set} textarea />
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang chủ — Đánh giá &amp; CTA</div>
              <Field id="home_testi_eyebrow" label="Nhãn Đánh giá" s={s} set={set} />
              <Field id="home_testi_title" label="Tiêu đề Đánh giá" s={s} set={set} />
              <Field id="home_cta_title" label="Tiêu đề CTA" s={s} set={set} />
              <Field id="home_cta_desc" label="Mô tả CTA" s={s} set={set} textarea />

              <div style={sectionLabelStyle}>Trang chủ — Đặt chỗ trước</div>
              <Field id="home_booking_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="home_booking_title" label="Tiêu đề" s={s} set={set} />
              <Field id="home_booking_desc" label="Mô tả" s={s} set={set} textarea />
              {[1, 2, 3].map(i => <Field key={i} id={`home_booking_feat${i}`} label={`Ưu điểm ${i}`} s={s} set={set} />)}

              <div style={sectionLabelStyle}>Trang Không gian</div>
              <Field id="space_hero_title" label="Tiêu đề Hero" s={s} set={set} />
              <Field id="space_hero_desc" label="Mô tả Hero" s={s} set={set} textarea />
              <Field id="space_areas_eyebrow" label="Nhãn khu vực" s={s} set={set} />
              <Field id="space_areas_title" label="Tiêu đề khu vực" s={s} set={set} />
              <Field id="space_areas_desc" label="Mô tả khu vực" s={s} set={set} textarea />
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Field id={`area${i}_name`} label={`Khu vực ${i} — tên`} s={s} set={set} />
                  <Field id={`area${i}_caption`} label={`Khu vực ${i} — chú thích`} s={s} set={set} />
                  <Field id={`area${i}_desc`} label={`Khu vực ${i} — mô tả`} s={s} set={set} />
                  <Field id={`area${i}_image`} label={`Khu vực ${i} — ảnh URL`} s={s} set={set} />
                </div>
              ))}
              <Field id="gallery_eyebrow" label="Nhãn thư viện ảnh" s={s} set={set} />
              <Field id="gallery_title" label="Tiêu đề thư viện ảnh" s={s} set={set} />
              <Field id="gallery_desc" label="Mô tả thư viện ảnh" s={s} set={set} textarea />
              <Field id="space_cta_title" label="Tiêu đề CTA" s={s} set={set} />
              <Field id="space_cta_desc" label="Mô tả CTA" s={s} set={set} textarea />

              <div style={sectionLabelStyle}>Trang Thực đơn</div>
              <Field id="menu_hero_title" label="Tiêu đề Hero" s={s} set={set} />
              <Field id="menu_hero_desc" label="Mô tả Hero" s={s} set={set} textarea />
              <Field id="menu_note_eyebrow" label="Nhãn ghi chú đặt bánh" s={s} set={set} />
              <Field id="menu_note_title" label="Tiêu đề ghi chú đặt bánh" s={s} set={set} />
              <Field id="menu_note_desc" label="Mô tả ghi chú đặt bánh" s={s} set={set} textarea />

              <div style={sectionLabelStyle}>Trang Giới thiệu</div>
              <Field id="about_hero_title" label="Tiêu đề Hero" s={s} set={set} />
              <Field id="about_hero_desc" label="Mô tả Hero" s={s} set={set} textarea />
              <Field id="about_story_eyebrow" label="Nhãn câu chuyện" s={s} set={set} />
              <Field id="about_story_title" label="Tiêu đề câu chuyện" s={s} set={set} />
              <Field id="about_story_text1" label="Đoạn văn 1" s={s} set={set} textarea rows={3} />
              <Field id="about_story_text2" label="Đoạn văn 2" s={s} set={set} textarea rows={3} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[1, 2, 3].map(i => <Field key={i} id={`about_story_img${i}`} label={`Ảnh ${i} (URL)`} s={s} set={set} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i}>
                    <Field id={`about_stat${i}_num`} label={`Số ${i}`} s={s} set={set} />
                    <Field id={`about_stat${i}_label`} label={`Nhãn ${i}`} s={s} set={set} />
                  </div>
                ))}
              </div>

              <div style={sectionLabelStyle}>Trang Giới thiệu — Đội ngũ</div>
              <Field id="team_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="team_title" label="Tiêu đề" s={s} set={set} />
              <Field id="team_desc" label="Mô tả" s={s} set={set} textarea />
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Field id={`team${i}_name`} label={`Thành viên ${i} — tên`} s={s} set={set} />
                  <Field id={`team${i}_role`} label={`Thành viên ${i} — chức vụ`} s={s} set={set} />
                  <Field id={`team${i}_desc`} label={`Thành viên ${i} — mô tả`} s={s} set={set} />
                  <Field id={`team${i}_avatar`} label={`Thành viên ${i} — ảnh URL`} s={s} set={set} />
                </div>
              ))}

              <div style={sectionLabelStyle}>Trang Giới thiệu — Nguyên liệu</div>
              <Field id="ing_eyebrow" label="Nhãn" s={s} set={set} />
              <Field id="ing_title" label="Tiêu đề" s={s} set={set} />
              <Field id="ing_desc" label="Mô tả" s={s} set={set} textarea />
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr', gap: 12, marginBottom: 12 }}>
                  <Field id={`ing${i}_icon`} label={`Icon ${i}`} s={s} set={set} />
                  <Field id={`ing${i}_title`} label={`Nguyên liệu ${i} — tên`} s={s} set={set} />
                  <Field id={`ing${i}_desc`} label={`Nguyên liệu ${i} — mô tả`} s={s} set={set} />
                </div>
              ))}
              <Field id="about_cta_title" label="Tiêu đề CTA" s={s} set={set} />
              <Field id="about_cta_desc" label="Mô tả CTA" s={s} set={set} textarea />
            </div>
          )}

          {/* ── SMTP ── */}
          {activeTab === 'smtp' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Cấu hình Email (SMTP)</h3>
              <Field id="smtp_host" label="SMTP Host" s={s} set={set} />
              <Field id="smtp_port" label="SMTP Port" s={s} set={set} />
              <Field id="smtp_user" label="SMTP Username" s={s} set={set} />
              <div className="form-group">
                <label className="form-label" htmlFor="smtp_pass">SMTP Password</label>
                <input id="smtp_pass" className="form-control" type="password" value={s.smtp_pass ?? ''} onChange={e => set('smtp_pass', e.target.value)} />
              </div>
              <Field id="smtp_from_name" label="Tên người gửi" s={s} set={set} />
              <Field id="smtp_from_email" label="Email người gửi" s={s} set={set} />
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
              <Field id="items_per_page" label="Số item mỗi trang" s={s} set={set} />
            </div>
          )}

          {/* ── Cloudinary ── */}
          {activeTab === 'cloudinary' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Cloudinary — Lưu trữ ảnh đám mây</h3>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Để trống nếu dùng lưu trữ local (mặc định). Điền thông tin Cloudinary nếu muốn lưu ảnh trên cloud.</p>
              <Field id="cloudinary_cloud_name" label="Cloud Name" s={s} set={set} />
              <Field id="cloudinary_api_key" label="API Key" s={s} set={set} />
              <Field id="cloudinary_api_secret" label="API Secret" s={s} set={set} />
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
