const services = ['Mẫu thiết kế', 'Cài đặt trọn gói', 'Thiết kế custom', 'Gói duy trì', 'Hosting & Domain']
const resources = ['Hướng dẫn chọn mẫu', 'Blog & Tips', 'FAQ', 'Showcase']
const company = ['Về chúng tôi', 'Liên hệ', 'Chính sách', 'Điều khoản']

export default function Footer() {
  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo">web<span>drop</span>.vn</div>
            <p className="ft-desc">Nền tảng mẫu website chuyên nghiệp và dịch vụ triển khai trọn gói dành cho doanh nghiệp Việt Nam.</p>
            <div className="ft-socials">
              {['fb','zl','in','yt'].map(s => <div key={s} className="ft-soc">{s}</div>)}
            </div>
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Dịch vụ</div>
            <div className="ft-links">{services.map(s => <a key={s} href="#">{s}</a>)}</div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Tài nguyên</div>
            <div className="ft-links">{resources.map(s => <a key={s} href="#">{s}</a>)}</div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Công ty</div>
            <div className="ft-links">{company.map(s => <a key={s} href="#">{s}</a>)}</div>
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
                    <div><div className="ft-c-label">{label}</div><div className="ft-c-val">{val}</div></div>
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
              {['Chính sách bảo mật','Điều khoản sử dụng','Chính sách hoàn tiền'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
