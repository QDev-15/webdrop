import { useSite } from '../contexts/SiteContext'

export default function AgentCard({ className = 'mb-4' }: { className?: string }) {
  const { settings } = useSite()
  const salesPhone = (settings.site_phone2 || settings.zalo_phone || '').replace(/\D/g, '')
  const officeName = settings.sales_office_name || 'Phòng Kinh doanh dự án'
  const avatar = settings.sales_agent_avatar || ''
  const siteName = settings.site_name || 'Green Valley Residence'
  const developer = settings.developer_name || ''

  return (
    <div className={`gvr-card gvr-card-solid gvr-agent-card ${className}`}>
      {avatar && <img className="gvr-agent-avatar" src={avatar} alt={officeName} />}
      <div>
        <div className="gvr-agent-name">{officeName}</div>
        <div className="gvr-agent-role">{siteName}{developer ? ` — ${developer}` : ''}</div>
        {salesPhone && (
          <div className="gvr-agent-actions">
            <a href={`tel:${salesPhone}`} className="gvr-agent-btn call" title="Gọi ngay">📞</a>
            <a href={`https://zalo.me/${salesPhone}`} target="_blank" rel="noopener noreferrer" className="gvr-agent-btn zalo" title="Chat Zalo">💬</a>
          </div>
        )}
      </div>
    </div>
  )
}
