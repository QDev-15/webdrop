import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.site_zalo || settings.social_zalo || ''
  const href = zalo ? `https://zalo.me/${zalo}` : '#'

  return (
    <a href={href} className="zalo-float" aria-label="Liên hệ Zalo" rel="noopener noreferrer" target="_blank">
      <div className="zalo-float-pulse" aria-hidden="true"></div>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
        alt="Zalo"
        width={30}
        height={30}
      />
    </a>
  )
}
