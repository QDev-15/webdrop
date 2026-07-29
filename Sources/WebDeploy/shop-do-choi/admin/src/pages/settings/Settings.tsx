import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import PaymentSettingsTab from '../../components/PaymentSettingsTab'

interface Settings {
  [key: string]: string
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({})
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const tabs = [
    { id: 'general', name: 'Chung' },
    { id: 'seo', name: 'SEO' },
    { id: 'social', name: 'Mạng xã hội' },
    { id: 'contact', name: 'Liên hệ' },
    { id: 'shop', name: 'Cửa hàng' },
    { id: 'payment', name: '💳 Thanh toán' },
  ]

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get<Settings>('/public/settings')
        setSettings(data)
      } catch (err) {
        console.error('Lỗi tải cài đặt:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/admin/settings', settings)
      setMessage('✓ Đã lưu cài đặt')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('✗ Lỗi lưu cài đặt')
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string, value: string) => {
    setSettings(s => ({ ...s, [key]: value }))
  }

  const val = (key: string) => settings[key] || ''

  if (loading) return <div className="admin-page"><p>Đang tải...</p></div>

  return (
    <div className="admin-page">
      <h1>Cài đặt</h1>

      {message && (
        <div style={{
          padding: 12, marginBottom: 20, borderRadius: 8,
          background: message.startsWith('✓') ? '#dcfce7' : '#fee2e2',
          color: message.startsWith('✓') ? '#166534' : '#991b1b'
        }}>
          {message}
        </div>
      )}

      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="admin-form" style={{ marginTop: 24 }}>
        {activeTab === 'general' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Tên cửa hàng</label>
              <input type="text" value={settings.site_name || ''} onChange={e => set('site_name', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Tagline (Khẩu hiệu)</label>
              <input type="text" value={settings.site_tagline || ''} onChange={e => set('site_tagline', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Mô tả</label>
              <textarea rows={3} value={settings.site_description || ''} onChange={e => set('site_description', e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'seo' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Meta Title (tiêu đề tìm kiếm)</label>
              <input type="text" value={settings.meta_title || ''} onChange={e => set('meta_title', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Meta Description (mô tả tìm kiếm)</label>
              <textarea rows={2} value={settings.meta_description || ''} onChange={e => set('meta_description', e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'social' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Facebook URL</label>
              <input type="url" value={settings.social_facebook || ''} onChange={e => set('social_facebook', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Instagram URL</label>
              <input type="url" value={settings.social_instagram || ''} onChange={e => set('social_instagram', e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>TikTok URL</label>
              <input type="url" value={settings.social_tiktok || ''} onChange={e => set('social_tiktok', e.target.value)} placeholder="https://tiktok.com/..." />
            </div>
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Địa chỉ</label>
              <input type="text" value={settings.site_address || ''} onChange={e => set('site_address', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Điện thoại</label>
              <input type="tel" value={settings.site_phone || ''} onChange={e => set('site_phone', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Email</label>
              <input type="email" value={settings.site_email || ''} onChange={e => set('site_email', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Giờ làm việc</label>
              <input type="text" value={settings.working_hours || ''} onChange={e => set('working_hours', e.target.value)} placeholder="Thứ 2–7: 9h–20h; CN: 10h–18h" />
            </div>
          </>
        )}

        {activeTab === 'shop' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Phí vận chuyển (đ)</label>
              <input type="number" value={settings.shipping_fee || ''} onChange={e => set('shipping_fee', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Miễn phí ship từ (đ)</label>
              <input type="number" value={settings.free_shipping_threshold || ''} onChange={e => set('free_shipping_threshold', e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          marginTop: 24,
          padding: '12px 32px',
          background: 'var(--accent, #16a34a)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer'
        }}
      >
        {saving ? 'Đang lưu...' : '✓ Lưu cài đặt'}
      </button>
    </div>
  )
}
