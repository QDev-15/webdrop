import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type SettingsMap = Record<string, string>

const TABS = [
  { id: 'general', label: '🏠 Chung' },
  { id: 'contact', label: '📱 Liên hệ' },
  { id: 'seo', label: '🌐 SEO' },
  { id: 'social', label: '📢 Mạng xã hội' },
  { id: 'design', label: '🖼️ Giao diện' },
  { id: 'cloudinary', label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
] as const

type TabId = typeof TABS[number]['id']

export default function Settings() {
  const [data, setData] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<SettingsMap>('/settings')
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setData(prev => ({ ...prev, [key]: value }))
    setMsg(null)
  }

  function val(key: string) {
    return data[key] ?? ''
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setSaving(true)
    try {
      await api.post('/settings/update', data)
      setMsg({ type: 'success', text: 'Đã lưu cài đặt thành công!' })
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Lưu thất bại.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý thông tin và cấu hình website</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              whiteSpace: 'nowrap',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {msg && (
        <div style={{
          padding: '10px 16px', borderRadius: 8, fontSize: 13, marginBottom: 20,
          background: msg.type === 'success' ? 'var(--accent-light)' : '#fff0f0',
          color: msg.type === 'success' ? 'var(--accent)' : 'var(--danger)',
          border: `1px solid ${msg.type === 'success' ? '#c3e6d8' : '#fdd'}`,
        }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="card" style={{ maxWidth: 720 }}>

          {/* Tab: Chung */}
          {activeTab === 'general' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <SectionTitle>Thông tin chung</SectionTitle>
              <FieldGroup>
                <FormField label="Tên website">
                  <input className="form-control" value={val('site_name')} onChange={e => set('site_name', e.target.value)} placeholder="Spa Luxury" />
                </FormField>
                <FormField label="Slogan">
                  <input className="form-control" value={val('site_tagline')} onChange={e => set('site_tagline', e.target.value)} placeholder="Nơi thư giãn hoàn hảo" />
                </FormField>
              </FieldGroup>
              <SectionTitle>Hero Section</SectionTitle>
              <FormField label="Tiêu đề Hero">
                <input className="form-control" value={val('hero_title')} onChange={e => set('hero_title', e.target.value)} placeholder="Trải nghiệm thư giãn đỉnh cao" />
              </FormField>
              <FormField label="Mô tả Hero">
                <textarea className="form-control" rows={3} value={val('hero_subtitle')} onChange={e => set('hero_subtitle', e.target.value)} placeholder="Mô tả ngắn về dịch vụ..." />
              </FormField>
              <FormField label="Huy hiệu Hero (Badge)">
                <input className="form-control" value={val('hero_badge')} onChange={e => set('hero_badge', e.target.value)} placeholder="✦ Trải nghiệm đẳng cấp" />
              </FormField>
              <SectionTitle>Thống kê nổi bật</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Số liệu 1">
                  <input className="form-control" value={val('stat1_num')} onChange={e => set('stat1_num', e.target.value)} placeholder="500+" />
                </FormField>
                <FormField label="Nhãn số liệu 1">
                  <input className="form-control" value={val('stat1_label')} onChange={e => set('stat1_label', e.target.value)} placeholder="Khách hàng hài lòng" />
                </FormField>
                <FormField label="Số liệu 2">
                  <input className="form-control" value={val('stat2_num')} onChange={e => set('stat2_num', e.target.value)} placeholder="10+" />
                </FormField>
                <FormField label="Nhãn số liệu 2">
                  <input className="form-control" value={val('stat2_label')} onChange={e => set('stat2_label', e.target.value)} placeholder="Năm kinh nghiệm" />
                </FormField>
                <FormField label="Số liệu 3">
                  <input className="form-control" value={val('stat3_num')} onChange={e => set('stat3_num', e.target.value)} placeholder="50+" />
                </FormField>
                <FormField label="Nhãn số liệu 3">
                  <input className="form-control" value={val('stat3_label')} onChange={e => set('stat3_label', e.target.value)} placeholder="Chuyên viên trị liệu" />
                </FormField>
                <FormField label="Số liệu 4">
                  <input className="form-control" value={val('stat4_num')} onChange={e => set('stat4_num', e.target.value)} placeholder="100%" />
                </FormField>
                <FormField label="Nhãn số liệu 4">
                  <input className="form-control" value={val('stat4_label')} onChange={e => set('stat4_label', e.target.value)} placeholder="Nguyên liệu tự nhiên" />
                </FormField>
              </div>
              <SectionTitle>Section CTA</SectionTitle>
              <FormField label="Tiêu đề CTA">
                <input className="form-control" value={val('cta_title')} onChange={e => set('cta_title', e.target.value)} placeholder="Đặt lịch ngay hôm nay" />
              </FormField>
              <FormField label="Mô tả CTA">
                <input className="form-control" value={val('cta_subtitle')} onChange={e => set('cta_subtitle', e.target.value)} placeholder="Ưu đãi đặc biệt dành cho khách mới" />
              </FormField>
              <SectionTitle>Footer</SectionTitle>
              <FormField label="Mô tả footer">
                <textarea className="form-control" rows={3} value={val('footer_desc')} onChange={e => set('footer_desc', e.target.value)} placeholder="Giới thiệu ngắn về spa trong footer..." />
              </FormField>
            </div>
          )}

          {/* Tab: Liên hệ */}
          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <SectionTitle>Thông tin liên hệ</SectionTitle>
              <FormField label="Số điện thoại">
                <input className="form-control" value={val('site_phone')} onChange={e => set('site_phone', e.target.value)} placeholder="0909 123 456" />
              </FormField>
              <FormField label="Email">
                <input className="form-control" type="email" value={val('site_email')} onChange={e => set('site_email', e.target.value)} placeholder="info@spaluxury.vn" />
              </FormField>
              <FormField label="Địa chỉ">
                <input className="form-control" value={val('site_address')} onChange={e => set('site_address', e.target.value)} placeholder="123 Đường ABC, Quận 1, TP.HCM" />
              </FormField>
              <FormField label="Giờ làm việc">
                <input className="form-control" value={val('working_hours')} onChange={e => set('working_hours', e.target.value)} placeholder="Thứ 2 – Chủ nhật: 9:00 – 21:00" />
              </FormField>
              <FormField label="Zalo">
                <input className="form-control" value={val('social_zalo')} onChange={e => set('social_zalo', e.target.value)} placeholder="0909123456" />
              </FormField>
            </div>
          )}

          {/* Tab: SEO */}
          {activeTab === 'seo' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <SectionTitle>Tối ưu tìm kiếm (SEO)</SectionTitle>
              <FormField label="Meta Title">
                <input className="form-control" value={val('meta_title')} onChange={e => set('meta_title', e.target.value)} placeholder="Spa Luxury - Trải nghiệm thư giãn đỉnh cao" />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Nên từ 50–60 ký tự</div>
              </FormField>
              <FormField label="Meta Description">
                <textarea className="form-control" rows={4} value={val('meta_description')} onChange={e => set('meta_description', e.target.value)} placeholder="Mô tả ngắn về website xuất hiện trên Google..." />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Nên từ 150–160 ký tự</div>
              </FormField>
            </div>
          )}

          {/* Tab: Mạng xã hội */}
          {activeTab === 'social' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <SectionTitle>Mạng xã hội</SectionTitle>
              <FormField label="Facebook">
                <input className="form-control" value={val('social_facebook')} onChange={e => set('social_facebook', e.target.value)} placeholder="https://facebook.com/spaluxury" />
              </FormField>
              <FormField label="Instagram">
                <input className="form-control" value={val('social_instagram')} onChange={e => set('social_instagram', e.target.value)} placeholder="https://instagram.com/spaluxury" />
              </FormField>
              <FormField label="YouTube">
                <input className="form-control" value={val('social_youtube')} onChange={e => set('social_youtube', e.target.value)} placeholder="https://youtube.com/@spaluxury" />
              </FormField>
            </div>
          )}

          {/* Tab: Giao diện */}
          {activeTab === 'design' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <SectionTitle>Ảnh nền</SectionTitle>
              <FormField label="Ảnh nền Hero">
                <ImageField value={val('hero_bg_image')} onChange={v => set('hero_bg_image', v)} placeholder="URL ảnh nền hero section" />
              </FormField>
              <FormField label="Ảnh nền CTA">
                <ImageField value={val('cta_bg_image')} onChange={v => set('cta_bg_image', v)} placeholder="URL ảnh nền CTA section" />
              </FormField>
            </div>
          )}

          {/* Tab: Cloudinary */}
          {activeTab === 'cloudinary' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <SectionTitle>Cloudinary — lưu trữ ảnh đám mây</SectionTitle>
              <div style={{ padding: '12px 16px', background: 'var(--warm)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                Lấy thông tin tại <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>cloudinary.com/console</a>. Để trống nếu dùng upload local.
              </div>
              <FormField label="Cloud Name">
                <input className="form-control" value={val('cloudinary_cloud_name')} onChange={e => set('cloudinary_cloud_name', e.target.value)} placeholder="my-cloud-name" />
              </FormField>
              <FormField label="API Key">
                <input className="form-control" value={val('cloudinary_api_key')} onChange={e => set('cloudinary_api_key', e.target.value)} placeholder="123456789012345" />
              </FormField>
              <FormField label="API Secret">
                <input className="form-control" type="password" value={val('cloudinary_api_secret')} onChange={e => set('cloudinary_api_secret', e.target.value)} placeholder="••••••••••••••••" />
              </FormField>
            </div>
          )}

          {/* Tab: Tích hợp */}
          {activeTab === 'integrations' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <SectionTitle>Tích hợp bên thứ ba</SectionTitle>
              <FormField label="Unsplash Access Key">
                <input className="form-control" value={val('unsplash_access_key')} onChange={e => set('unsplash_access_key', e.target.value)} placeholder="Nhập Unsplash Access Key" />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                  Đăng ký tại <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>unsplash.com/developers</a> để tìm ảnh miễn phí trong admin.
                </div>
              </FormField>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: 8, borderBottom: '1px solid var(--border-light)' }}>
      {children}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {children}
    </div>
  )
}
