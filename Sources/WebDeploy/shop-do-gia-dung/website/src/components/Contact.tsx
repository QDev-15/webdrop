import { useSite } from '../contexts/SiteContext'

// Component hiển thị khối thông tin liên hệ (điện thoại/email/địa chỉ/giờ làm việc),
// đọc dữ liệu động từ useSite(). Hiện KHÔNG được import ở ContactPage.tsx/Footer.tsx
// (2 nơi đó tự render thông tin liên hệ inline) — để sẵn làm component tái sử dụng
// cho các trang khác trong tương lai (vd trang "Giới thiệu" muốn nhúng lại khối này).
// Dùng đúng class dg-contact-* đã định nghĩa sẵn trong template.css (mục 17).

export default function Contact() {
  const { settings } = useSite()

  const items = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 5a2 2 0 012-2h3l2 5-2.5 1.5a11 11 0 005 5L14 14l5 2v3a2 2 0 01-2 2A16 16 0 013 5z" />
        </svg>
      ),
      title: 'Điện thoại',
      value: String(settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'),
      href: `tel:${settings.site_phone || ''}`,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" />
        </svg>
      ),
      title: 'Email',
      value: String(settings.site_email || '[EMAIL]'),
      href: `mailto:${settings.site_email || ''}`,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: 'Địa chỉ',
      value: String(settings.site_address || '[ĐỊA CHỈ]'),
      href: undefined,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Giờ làm việc',
      value: String(settings.working_hours || '[GIỜ LÀM VIỆC]'),
      href: undefined,
    },
  ]

  return (
    <div className="dg-contact-items">
      {items.map(item => (
        <div className="dg-contact-item" key={item.title}>
          <div className="dg-contact-item__icon">{item.icon}</div>
          <div>
            <p className="dg-contact-item__title">{item.title}</p>
            {item.href ? (
              <a className="dg-contact-item__value" href={item.href}>{item.value}</a>
            ) : (
              <p className="dg-contact-item__value">{item.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
