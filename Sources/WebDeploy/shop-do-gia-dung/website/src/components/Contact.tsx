import { useSite } from '../contexts/SiteContext'

interface ContactItem {
  icon: string
  title: string
  value: string
  href?: string
}

export default function Contact() {
  const { settings } = useSite()

  const items: ContactItem[] = []

  if (settings.site_phone) {
    items.push({
      icon: '📞',
      title: 'Điện thoại',
      value: String(settings.site_phone),
      href: `tel:${settings.site_phone}`,
    })
  }
  if (settings.site_email) {
    items.push({
      icon: '✉️',
      title: 'Email',
      value: String(settings.site_email),
      href: `mailto:${settings.site_email}`,
    })
  }
  if (settings.site_address) {
    items.push({
      icon: '📍',
      title: 'Địa chỉ',
      value: String(settings.site_address),
    })
  }
  if (settings.working_hours) {
    items.push({
      icon: '⏰',
      title: 'Giờ làm việc',
      value: String(settings.working_hours),
    })
  }

  return (
    <div className="dg-contact-items">
      {items.map((item, i) => (
        <div className="dg-contact-item" key={i}>
          <div className="dg-contact-item__icon">{item.icon}</div>
          <div>
            <p className="dg-contact-item__title">{item.title}</p>
            {item.href ? (
              <a href={item.href} className="dg-contact-item__value" style={{ color: 'var(--accent)' }}>
                {item.value}
              </a>
            ) : (
              <p className="dg-contact-item__value">{item.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
