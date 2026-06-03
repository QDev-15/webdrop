import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// Parse format "Tên link|/url" mỗi dòng
function parseLinks(raw: string): { label: string; href: string }[] {
  return raw.split('\n')
    .map(line => line.trim()).filter(Boolean)
    .map(line => {
      const sep = line.indexOf('|')
      if (sep === -1) return null
      const label = line.slice(0, sep).trim()
      const href  = line.slice(sep + 1).trim()
      return label && href ? { label, href } : null
    })
    .filter(Boolean) as { label: string; href: string }[]
}

const DEFAULT_SERVICES = [
  { label: 'Thư viện mẫu',      href: '/templates' },
  { label: 'Gói Template',       href: '/pricing#goi-template' },
  { label: 'Gói Web cơ bản',     href: '/pricing#goi-web-co-ban' },
  { label: 'Gói Theo Yêu cầu',   href: '/pricing#goi-theo-yeu-cau' },
  { label: 'Quy trình làm việc', href: '/how-it-works' },
]
const DEFAULT_RESOURCES = [
  { label: 'Hướng dẫn chọn mẫu', href: '/faq' },
  { label: 'Blog & Tips',         href: '/blog' },
  { label: 'FAQ',                 href: '/faq' },
]
const DEFAULT_COMPANY = [
  { label: 'Về chúng tôi',       href: '/about' },
  { label: 'Liên hệ',            href: '/contact' },
  { label: 'Chính sách bảo mật', href: '/policies/privacy' },
  { label: 'Điều khoản',         href: '/policies/terms' },
]

async function getSettings() {
  try {
    const rows = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'site_name', 'site_description', 'site_phone', 'site_email',
            'site_address', 'working_hours',
            'social_facebook', 'social_zalo', 'social_youtube',
            'social_tiktok', 'social_instagram',
            'footer_services', 'footer_resources', 'footer_company',
            'footer_map_url', 'footer_legal', 'footer_copyright',
          ],
        },
      },
    })
    return Object.fromEntries(rows.map(r => [r.key, r.value ?? '']))
  } catch {
    return {}
  }
}

export default async function Footer() {
  const s = await getSettings()

  const siteName = s['site_name']        || 'webdrop.vn'
  const siteDesc = s['site_description'] || 'Nền tảng mẫu website chuyên nghiệp và dịch vụ triển khai trọn gói dành cho doanh nghiệp Việt Nam.'
  const phone    = s['site_phone']       || ''
  const email    = s['site_email']       || ''
  const address  = s['site_address']     || 'Hà Nội, Việt Nam'
  const hours    = s['working_hours']    || '8:00–18:00 · Thứ 2–Thứ 7'

  // Danh sách link footer: đọc từ DB, fallback về default nếu chưa cấu hình
  const services  = s['footer_services']  ? parseLinks(s['footer_services'])  : DEFAULT_SERVICES
  const resources = s['footer_resources'] ? parseLinks(s['footer_resources']) : DEFAULT_RESOURCES
  const company   = s['footer_company']   ? parseLinks(s['footer_company'])   : DEFAULT_COMPANY

  // Google Maps embed URL: ưu tiên URL từ DB, fallback tự sinh từ địa chỉ
  const mapSrc = s['footer_map_url']?.trim()
    || `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`

  // Chân trang
  const legalLinks = s['footer_legal']
    ? parseLinks(s['footer_legal'])
    : [
        { label: 'Chính sách bảo mật',  href: '/policies/privacy' },
        { label: 'Điều khoản sử dụng',  href: '/policies/terms' },
        { label: 'Chính sách hoàn tiền', href: '/policies/refund' },
      ]
  const copyrightSuffix = s['footer_copyright'] || 'Made in Vietnam 🇻🇳'

  const socials = [
    s['social_facebook']  && { key: 'fb', label: 'Facebook',  href: s['social_facebook'] },
    s['social_zalo']      && { key: 'zl', label: 'Zalo',      href: `https://zalo.me/${s['social_zalo'].replace(/\s/g, '')}` },
    s['social_youtube']   && { key: 'yt', label: 'YouTube',   href: s['social_youtube'] },
    s['social_tiktok']    && { key: 'tt', label: 'TikTok',    href: s['social_tiktok'] },
    s['social_instagram'] && { key: 'in', label: 'Instagram', href: s['social_instagram'] },
  ].filter(Boolean) as { key: string; label: string; href: string }[]

  const contactItems = [
    address  && { icon: '📍', label: 'Địa chỉ',           val: address },
    phone    && { icon: '📱', label: 'Zalo / Điện thoại', val: phone },
    email    && { icon: '✉️', label: 'Email',              val: email },
    hours    && { icon: '🕐', label: 'Giờ hỗ trợ',        val: hours },
  ].filter(Boolean) as { icon: string; label: string; val: string }[]

  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          {/* Brand */}
          <div className="col-md-4 reveal">
            <div className="ft-logo">web<span>drop</span>.vn</div>
            <p className="ft-desc">{siteDesc}</p>
            {socials.length > 0 && (
              <div className="ft-socials">
                {socials.map(({ key, label, href }) => (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="ft-soc" title={label}>{key}</a>
                ))}
              </div>
            )}
          </div>

          {/* Dịch vụ */}
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Dịch vụ</div>
            <div className="ft-links">
              {services.map(s => <Link key={s.label} href={s.href}>{s.label}</Link>)}
            </div>
          </div>

          {/* Tài nguyên */}
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Tài nguyên</div>
            <div className="ft-links">
              {resources.map(r => <Link key={r.label} href={r.href}>{r.label}</Link>)}
            </div>
          </div>

          {/* Công ty */}
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Công ty</div>
            <div className="ft-links">
              {company.map(c => <Link key={c.label} href={c.href}>{c.label}</Link>)}
            </div>
          </div>
        </div>
      </div>

      {/* Map + Contact */}
      <div className="ft-map-strip">
        <div className="wd-container">
          <div className="row g-4 py-4 align-items-center">
            <div className="col reveal">
              <div className="ft-col-title mb-3">Liên hệ trực tiếp</div>
              <div className="d-flex flex-column gap-2">
                {contactItems.map(({ icon, label, val }) => (
                  <div key={label} className="d-flex gap-2 align-items-start">
                    <div className="ft-c-icon">{icon}</div>
                    <div>
                      <div className="ft-c-label">{label}</div>
                      <div className="ft-c-val">{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-auto reveal reveal-d2">
              <div className="ft-map" style={{ width: 260 }}>
                <iframe
                  src={mapSrc}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ ${address}`}
                />
                <div className="ft-map-pin" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">© {year} {siteName} · {copyrightSuffix}</div>
            <div className="ft-legal d-flex gap-4">
              {legalLinks.map(l => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
