import Link from 'next/link'

const services = [
  { label: 'Mẫu thiết kế', href: '/templates' },
  { label: 'Cài đặt trọn gói', href: '/pricing#goi-b' },
  { label: 'Thiết kế custom', href: '/pricing#goi-c' },
  { label: 'Gói duy trì', href: '/pricing#duy-tri' },
  { label: 'Hosting & Domain', href: '/contact' },
]
const resources = [
  { label: 'Hướng dẫn chọn mẫu', href: '/faq' },
  { label: 'Blog & Tips', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Showcase', href: '/templates' },
]
const company = [
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Liên hệ', href: '/contact' },
  { label: 'Chính sách bảo mật', href: '/policies/privacy' },
  { label: 'Điều khoản', href: '/policies/terms' },
]

export default function Footer() {
  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo">web<span>drop</span>.vn</div>
            <p className="ft-desc">Nền tảng mẫu website chuyên nghiệp và dịch vụ triển khai trọn gói dành cho doanh nghiệp Việt Nam.</p>
            <div className="ft-socials">
              {[
                { s: 'fb', href: 'https://facebook.com/webdrop.vn' },
                { s: 'zl', href: 'https://zalo.me/webdrop' },
                { s: 'in', href: 'https://instagram.com/webdrop.vn' },
                { s: 'yt', href: 'https://youtube.com/@webdrop' },
              ].map(({ s, href }) => (
                <a key={s} href={href} target="_blank" rel="noopener noreferrer" className="ft-soc">{s}</a>
              ))}
            </div>
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Dịch vụ</div>
            <div className="ft-links">
              {services.map(s => <Link key={s.label} href={s.href}>{s.label}</Link>)}
            </div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Tài nguyên</div>
            <div className="ft-links">
              {resources.map(r => <Link key={r.label} href={r.href}>{r.label}</Link>)}
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Công ty</div>
            <div className="ft-links">
              {company.map(c => <Link key={c.label} href={c.href}>{c.label}</Link>)}
            </div>
          </div>
        </div>
      </div>

      <div className="ft-map-strip">
        <div className="wd-container">
          <div className="row g-4 py-4 align-items-center">
            <div className="col reveal">
              <div className="ft-col-title mb-3">Liên hệ trực tiếp</div>
              <div className="d-flex flex-column gap-2">
                {[
                  ['📍', 'Địa chỉ', 'Tây Hồ, Hà Nội, Việt Nam'],
                  ['📱', 'Zalo / Điện thoại', '0901 234 567'],
                  ['✉️', 'Email', 'hello@webdrop.vn'],
                  ['🕐', 'Giờ hỗ trợ', '8:00 – 18:00 · Thứ 2 – Thứ 7'],
                ].map(([icon, label, val]) => (
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.7!2d105.836!3d21.066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sTay%20Ho%2C%20Hanoi!5e0!3m2!1sen!2svn!4v1234567890"
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ"
                />
                <div className="ft-map-pin" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">© 2026 webdrop.vn · Made in Vietnam 🇻🇳</div>
            <div className="ft-legal d-flex gap-4">
              <Link href="/policies/privacy">Chính sách bảo mật</Link>
              <Link href="/policies/terms">Điều khoản sử dụng</Link>
              <Link href="/policies/refund">Chính sách hoàn tiền</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
