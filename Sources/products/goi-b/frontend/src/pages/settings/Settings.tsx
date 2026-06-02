import { useEffect, useState, FormEvent } from 'react'
import { api } from '../../api/client'

type SettingsGroup = Record<string, Record<string, string>>

const FIELDS: { group: string; label: string; key: string; type?: string }[] = [
  // general
  { group: 'general', label: 'Tên website', key: 'site_name' },
  { group: 'general', label: 'Mô tả ngắn', key: 'site_description' },
  { group: 'general', label: 'Email liên hệ', key: 'site_email', type: 'email' },
  { group: 'general', label: 'Số điện thoại', key: 'site_phone' },
  { group: 'general', label: 'Địa chỉ', key: 'site_address' },
  // seo
  { group: 'seo', label: 'Meta Title mặc định', key: 'meta_title' },
  { group: 'seo', label: 'Meta Description mặc định', key: 'meta_description' },
  { group: 'seo', label: 'Google Analytics ID', key: 'google_analytics_id' },
  // social
  { group: 'social', label: 'Facebook', key: 'social_facebook' },
  { group: 'social', label: 'YouTube', key: 'social_youtube' },
  { group: 'social', label: 'Instagram', key: 'social_instagram' },
  { group: 'social', label: 'Zalo', key: 'social_zalo' },
]

const GROUP_LABELS: Record<string, string> = {
  general: 'Thông tin chung',
  seo: 'SEO',
  social: 'Mạng xã hội',
}

export default function Settings() {
  const [data, setData]   = useState<SettingsGroup>({})
  const [loading, setLoad] = useState(true)
  const [busy, setBusy]   = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    api.get<SettingsGroup>('/settings').then(setData).catch(() => {}).finally(() => setLoad(false))
  }, [])

  function get(group: string, key: string) { return data[group]?.[key] ?? '' }
  function set(group: string, key: string, val: string) {
    setData(d => ({ ...d, [group]: { ...d[group], [key]: val } }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true)
    try {
      await api.post('/settings', data)
      setToast('Đã lưu cài đặt'); setTimeout(() => setToast(''), 3000)
    } catch (err: unknown) {
      setToast('E:' + (err instanceof Error ? err.message : 'Lỗi')); setTimeout(() => setToast(''), 3000)
    } finally { setBusy(false) }
  }

  const groups = [...new Set(FIELDS.map(f => f.group))]

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-hd"><h2>Cài đặt</h2></div>
      <form onSubmit={submit}>
        {groups.map(group => (
          <div className="admin-card" style={{ marginBottom: 16 }} key={group}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{GROUP_LABELS[group] || group}</div>
            <div className="row g-3">
              {FIELDS.filter(f => f.group === group).map(f => (
                <div className="col-12" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-input"
                    type={f.type || 'text'}
                    value={get(f.group, f.key)}
                    onChange={e => set(f.group, f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn-accent" type="submit" disabled={busy}>
          {busy ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </form>
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.startsWith('E:') ? 'toast-error' : 'toast-success'}`}>
            {toast.replace(/^E:/, '')}
          </div>
        </div>
      )}
    </div>
  )
}
