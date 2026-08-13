import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Setting {
  grp: string
  key: string
  value: string
}

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, Setting[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.get<Setting[]>('/settings')
      const grouped = data.reduce((acc, s) => {
        if (!acc[s.grp]) acc[s.grp] = []
        acc[s.grp].push(s)
        return acc
      }, {} as Record<string, Setting[]>)
      setSettings(grouped)
      setError('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleChange = (grp: string, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [grp]: prev[grp].map(s => s.key === key ? { ...s, value } : s)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const updates = Object.values(settings).flat()
      await api.put('/settings', updates)
      setSuccess('Cập nhật cài đặt thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Đang tải...</div>

  const groups = [
    { key: 'general', label: '🌍 Thông tin chung' },
    { key: 'seo', label: '🔍 SEO' },
    { key: 'social', label: '📱 Mạng xã hội' },
    { key: 'footer', label: '📝 Footer' },
    { key: 'about', label: 'ℹ️ Về chúng tôi' },
    { key: 'integrations', label: '🔗 Tích hợp' },
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Cài đặt</div>
          <div className="page-sub">Quản lý thông tin và cài đặt website</div>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ color: 'var(--accent)', padding: '12px', background: '#e8f4ef', borderRadius: '8px', marginBottom: '16px' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {groups.map(group => {
          const items = settings[group.key] || []
          if (!items.length) return null
          return (
            <div key={group.key} className="form-card">
              <h3 style={{ marginBottom: '18px', fontSize: '16px', fontWeight: 600 }}>{group.label}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map(item => (
                  <div key={item.key}>
                    <label className="form-label">{item.key}</label>
                    {item.key.includes('description') || item.key === 'copyright' ? (
                      <textarea
                        className="form-control"
                        value={item.value}
                        onChange={e => handleChange(group.key, item.key, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <input
                        className="form-control"
                        value={item.value}
                        onChange={e => handleChange(group.key, item.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button type="submit" className="btn-accent">Lưu cài đặt</button>
          <button type="button" onClick={load} className="btn-ghost">Tải lại</button>
        </div>
      </form>
    </>
  )
}
