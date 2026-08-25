import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zaloPhone = (settings.zalo_phone || settings.site_phone2 || '').replace(/\D/g, '')
  if (!zaloPhone) return null

  return (
    <a href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noopener noreferrer" className="zf">
      <span className="zf-tip">Chat Zalo tư vấn ngay</span>
      <span className="zf-btn">💬</span>
    </a>
  )
}
