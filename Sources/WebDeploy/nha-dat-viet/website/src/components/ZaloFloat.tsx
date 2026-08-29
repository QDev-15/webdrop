import { useSite } from '../contexts/SiteContext'
import { IconZalo } from './icons'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.zalo_phone || '0909888777'
  return (
    <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" className="ndv-zalo-float" aria-label="Chat Zalo">
      <IconZalo />
    </a>
  )
}
