'use client'
import AdminLayout from '@/components/admin/AdminLayout'
import { useState, useEffect, FormEvent } from 'react'

interface SettingGroup {
  label: string
  key: string
  fields: { key: string; label: string; type?: string; placeholder?: string }[]
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    label: 'Thông tin chung',
    key: 'general',
    fields: [
      { key: 'site_name', label: 'Tên website', placeholder: 'webdrop.vn' },
      { key: 'site_description', label: 'Mô tả ngắn', placeholder: 'Mẫu web đẹp, triển khai trọn gói' },
      { key: 'site_email', label: 'Email liên hệ', type: 'email', placeholder: 'hello@webdrop.vn' },
      { key: 'site_phone', label: 'Số điện thoại', placeholder: '0900 000 000' },
      { key: 'site_address', label: 'Địa chỉ', placeholder: 'TP.HCM, Việt Nam' },
      { key: 'working_hours', label: 'Giờ làm việc', placeholder: '8:00–18:00 · T2–T7' },
    ],
  },
  {
    label: 'Mạng xã hội',
    key: 'social',
    fields: [
      { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/webdrop.vn' },
      { key: 'social_zalo', label: 'Số Zalo', placeholder: '0900000000' },
      { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/@webdrop' },
      { key: 'social_tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@webdrop' },
    ],
  },
  {
    label: 'SEO',
    key: 'seo',
    fields: [
      { key: 'meta_title', label: 'Meta Title', placeholder: 'webdrop.vn — Mẫu web đẹp' },
      { key: 'meta_description', label: 'Meta Description', placeholder: 'Mô tả trang web cho SEO' },
      { key: 'google_analytics_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX' },
    ],
  },
  {
    label: 'SMTP / Email',
    key: 'smtp',
    fields: [
      { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtp.gmail.com' },
      { key: 'smtp_port', label: 'SMTP Port', placeholder: '587' },
      { key: 'smtp_user', label: 'SMTP User', placeholder: 'your@gmail.com' },
      { key: 'smtp_password', label: 'SMTP Password', type: 'password', placeholder: '••••••••' },
      { key: 'smtp_from_name', label: 'Tên người gửi', placeholder: 'webdrop.vn' },
      { key: 'smtp_from_email', label: 'Email gửi', type: 'email', placeholder: 'noreply@webdrop.vn' },
    ],
  },
]

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeGroup, setActiveGroup] = useState('general')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => { if (data.settings) setValues(data.settings) })
      .catch(() => {})
  }, [])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: values }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const currentGroup = SETTING_GROUPS.find(g => g.key === activeGroup)!

  return (
    <AdminLayout title="Cài đặt">
      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Sidebar nav */}
          <div style={{ width: 180, flexShrink: 0 }}>
            {SETTING_GROUPS.map(g => (
              <div
                key={g.key}
                onClick={() => setActiveGroup(g.key)}
                style={{
                  padding: '9px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', marginBottom: 4,
                  background: activeGroup === g.key ? 'var(--accent-light)' : 'transparent',
                  color: activeGroup === g.key ? 'var(--accent)' : 'var(--text-2)',
                  fontWeight: activeGroup === g.key ? 500 : 400,
                  transition: 'all .15s',
                }}
              >
                {g.label}
              </div>
            ))}
          </div>

          {/* Fields */}
          <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px' }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 20, color: 'var(--text)' }}>{currentGroup.label}</div>
            <div className="row g-3">
              {currentGroup.fields.map(f => (
                <div key={f.key} className="col-md-6">
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={values[f.key] || ''}
                    onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 12, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 13, color: 'var(--accent)' }}>✓ Đã lưu thành công</span>}
          <button
            type="submit" disabled={saving}
            style={{ padding: '10px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}
          >
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
