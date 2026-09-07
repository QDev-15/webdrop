import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

type Values = Record<string, string>

const TABS = [
  { id: 'general', label: 'Thông tin chung' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Mạng xã hội' },
  { id: 'footer', label: 'Footer' },
  { id: 'about', label: 'Trang "Về tôi"' },
  { id: 'cloudinary', label: '☁️ Cloudinary' },
  { id: 'integrations', label: '🔌 Tích hợp' },
]

export default function Settings() {
  const [val, setVal] = useState<Values>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    api.get<Values>('/settings').then(setVal).catch(() => setError('Không thể tải cài đặt.')).finally(() => setLoading(false))
  }, [])

  function set(key: string, v: string) {
    setVal(prev => ({ ...prev, [key]: v }))
  }

  async function handleSave() {
    setSaving(true); setError(''); setSuccess('')
    try {
      await api.post('/settings/update', val)
      setSuccess('Đã lưu cài đặt thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Cấu hình thông tin hiển thị trên website</div>
        </div>
        <button className="btn-accent" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="settings-tabs">
        {TABS.map(t => (
          <div key={t.id} className={'settings-tab' + (activeTab === t.id ? ' active' : '')} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 760 }}>
        {activeTab === 'general' && (
          <>
            <div className="form-group">
              <label className="form-label">Tên website</label>
              <input className="form-control" value={val.site_name || ''} onChange={e => set('site_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input className="form-control" value={val.site_tagline || ''} onChange={e => set('site_tagline', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả website</label>
              <textarea className="form-control" rows={3} value={val.site_description || ''} onChange={e => set('site_description', e.target.value)} />
            </div>
            <div className="form-group">
              <ImageField label="Logo" value={val.site_logo || ''} onChange={v => set('site_logo', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" value={val.site_email || ''} onChange={e => set('site_email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input className="form-control" value={val.site_phone || ''} onChange={e => set('site_phone', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input className="form-control" value={val.site_address || ''} onChange={e => set('site_address', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Thời gian phản hồi</label>
              <input className="form-control" value={val.working_hours || ''} onChange={e => set('working_hours', e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'seo' && (
          <>
            <div className="form-group">
              <label className="form-label">Meta title</label>
              <input className="form-control" value={val.meta_title || ''} onChange={e => set('meta_title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Meta description</label>
              <textarea className="form-control" rows={3} value={val.meta_description || ''} onChange={e => set('meta_description', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Meta keywords</label>
              <input className="form-control" value={val.meta_keywords || ''} onChange={e => set('meta_keywords', e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'social' && (
          <>
            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input className="form-control" value={val.social_facebook || ''} onChange={e => set('social_facebook', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input className="form-control" value={val.social_instagram || ''} onChange={e => set('social_instagram', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Youtube</label>
              <input className="form-control" value={val.social_youtube || ''} onChange={e => set('social_youtube', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Pinterest</label>
              <input className="form-control" value={val.social_pinterest || ''} onChange={e => set('social_pinterest', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Số Zalo (chỉ nhập số, không cần href)</label>
              <input className="form-control" value={val.zalo_number || ''} onChange={e => set('zalo_number', e.target.value)} placeholder="0901234567" />
            </div>
          </>
        )}

        {activeTab === 'footer' && (
          <>
            <div className="form-group">
              <label className="form-label">Copyright</label>
              <input className="form-control" value={val.footer_copyright || ''} onChange={e => set('footer_copyright', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả footer</label>
              <textarea className="form-control" rows={3} value={val.footer_description || ''} onChange={e => set('footer_description', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Google Maps embed URL</label>
              <input className="form-control" value={val.map_embed_url || ''} onChange={e => set('map_embed_url', e.target.value)} placeholder="https://maps.google.com/maps?q=...&output=embed" />
              <div className="form-hint">Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ → copy URL trong thuộc tính src.</div>
            </div>
          </>
        )}

        {activeTab === 'about' && (
          <>
            <div className="form-group">
              <label className="form-label">Tên người sáng lập</label>
              <input className="form-control" value={val.about_founder_name || ''} onChange={e => set('about_founder_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Chức danh</label>
              <input className="form-control" value={val.about_founder_role || ''} onChange={e => set('about_founder_role', e.target.value)} />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh đại diện" value={val.about_founder_avatar || ''} onChange={v => set('about_founder_avatar', v)} />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh minh họa (căn bếp)" value={val.about_founder_image || ''} onChange={v => set('about_founder_image', v)} />
            </div>
            <div className="form-group">
              <label className="form-label">Đoạn giới thiệu 1</label>
              <textarea className="form-control" rows={3} value={val.about_intro_p1 || ''} onChange={e => set('about_intro_p1', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Đoạn giới thiệu 2</label>
              <textarea className="form-control" rows={3} value={val.about_intro_p2 || ''} onChange={e => set('about_intro_p2', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Số công thức</label>
                <input className="form-control" value={val.stat_recipes || ''} onChange={e => set('stat_recipes', e.target.value)} placeholder="420+" />
              </div>
              <div className="form-group">
                <label className="form-label">Số quán đã review</label>
                <input className="form-control" value={val.stat_reviews || ''} onChange={e => set('stat_reviews', e.target.value)} placeholder="85+" />
              </div>
              <div className="form-group">
                <label className="form-label">Độc giả/tháng</label>
                <input className="form-control" value={val.stat_readers || ''} onChange={e => set('stat_readers', e.target.value)} placeholder="180k" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Số năm hoạt động</label>
                <input className="form-control" value={val.stat_years || ''} onChange={e => set('stat_years', e.target.value)} placeholder="8" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'cloudinary' && (
          <>
            <div className="form-hint" style={{ marginBottom: 14 }}>Cấu hình Cloudinary để upload ảnh lên cloud thay vì lưu trên server (khuyến nghị cho hosting dung lượng thấp).</div>
            <div className="form-group">
              <label className="form-label">Cloud name</label>
              <input className="form-control" value={val.cloudinary_cloud_name || ''} onChange={e => set('cloudinary_cloud_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input className="form-control" value={val.cloudinary_api_key || ''} onChange={e => set('cloudinary_api_key', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">API Secret</label>
              <input className="form-control" type="password" value={val.cloudinary_api_secret || ''} onChange={e => set('cloudinary_api_secret', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Thư mục lưu ảnh</label>
              <input className="form-control" value={val.cloudinary_folder || ''} onChange={e => set('cloudinary_folder', e.target.value)} placeholder="bep-xanh" />
            </div>
          </>
        )}

        {activeTab === 'integrations' && (
          <>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unsplash Access Key</label>
              <input className="form-control" value={val.unsplash_access_key || ''} onChange={e => set('unsplash_access_key', e.target.value)} />
              <div className="form-hint">Dùng để tìm & chèn ảnh miễn phí từ Unsplash trực tiếp trong các form có trường ảnh.</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
