'use client'
import { useState } from 'react'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import Link from 'next/link'

const faqGroups = [
  {
    group: 'Mua template (Gói A)',
    items: [
      { q: 'Template có cần server để chạy không?', a: 'Không. Template Gói A là HTML/CSS/JS thuần — chỉ cần mở file index.html trên trình duyệt là chạy. Không cần server, không cần build.' },
      { q: 'Tôi có thể chỉnh màu sắc, font chữ không?', a: 'Có. Mọi template dùng CSS custom properties (biến CSS). Bạn chỉ cần thay đổi giá trị trong `:root` để áp dụng toàn bộ. Hướng dẫn đi kèm.' },
      { q: 'Template có responsive không?', a: 'Có. Tất cả template đều responsive từ 320px (điện thoại nhỏ) đến 4K. Test trên Chrome, Safari, Firefox.' },
      { q: 'Mua xong nhận file gì?', a: 'File ZIP chứa: các file HTML, CSS, JS, thư mục assets (ảnh placeholder), và file README hướng dẫn chỉnh nội dung.' },
      { q: 'Có demo trước khi mua không?', a: 'Có. Mỗi template đều có link demo live. Bạn xem thử trên thiết bị của mình trước khi quyết định.' },
    ],
  },
  {
    group: 'Website Gói B (React + PHP)',
    items: [
      { q: 'Hosting yêu cầu gì?', a: 'Hosting cần hỗ trợ PHP và SQLite (pdo_sqlite extension). Hầu hết hosting Việt Nam có sẵn. Nếu cần, chúng tôi tư vấn hosting phù hợp.' },
      { q: 'Deploy như thế nào?', a: 'Upload file build lên hosting qua FTP/cPanel. Lần đầu chạy, hệ thống tự seed data mặc định vào SQLite. Không cần config thêm.' },
      { q: 'Có thể đổi sang MySQL không?', a: 'Có. Chỉ cần đổi cấu hình trong config.php. Schema SQL đi kèm để tạo bảng trên MySQL/PostgreSQL.' },
      { q: 'Admin có thể chỉnh nội dung không?', a: 'Có. Admin dashboard tại /admin cho phép quản lý nội dung, bài viết, form liên hệ và cài đặt website.' },
    ],
  },
  {
    group: 'Gói C (Custom)',
    items: [
      { q: 'Quy trình làm việc thế nào?', a: 'Phase 1: Wireframe → Design → Khách duyệt. Phase 2: Phát triển → Test → Deploy → Bàn giao. Có checklist scope trước khi bắt đầu.' },
      { q: 'Bao lâu hoàn thành?', a: 'Tùy scope. Landing page custom: 5–7 ngày. Website 5–10 trang: 2–4 tuần. Hệ thống phức tạp: 1–3 tháng.' },
      { q: 'Có nhận source code không?', a: 'Có. Source code tính thêm 20–30% giá trị dự án. Mặc định bàn giao bản build deploy sẵn.' },
    ],
  },
  {
    group: 'Hỗ trợ & Bảo hành',
    items: [
      { q: 'Có hỗ trợ sau bàn giao không?', a: 'Có. Hỗ trợ sửa lỗi phát sinh miễn phí trong 30 ngày. Sau đó có gói bảo trì tháng từ 1.000.000đ.' },
      { q: 'Chính sách hoàn tiền?', a: 'Hoàn tiền 100% trong 7 ngày nếu template không đúng như mô tả hoặc có lỗi nghiêm trọng không thể fix.' },
      { q: 'Liên hệ hỗ trợ qua đâu?', a: 'Zalo: 0901 234 567 (phản hồi nhanh nhất). Email: hello@webdrop.vn. Thứ 2–Thứ 7, 8:00–18:00.' },
    ],
  },
]

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,5vw,60px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>FAQ</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
              Câu hỏi <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>thường gặp</em>
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.4)', maxWidth: 440, margin: '0 auto' }}>
              Không tìm thấy câu trả lời? <Link href="/contact" style={{ color: '#4ade80', textDecoration: 'none' }}>Liên hệ trực tiếp →</Link>
            </p>
          </div>
        </section>

        <section className="sec-pad">
          <div className="wd-container" style={{ maxWidth: 780 }}>
            {faqGroups.map(group => (
              <div key={group.group} style={{ marginBottom: 48 }}>
                <h2 className="reveal" style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid var(--accent-light)', color: 'var(--accent)' }}>
                  {group.group}
                </h2>
                {group.items.map((item, i) => {
                  const key = `${group.group}-${i}`
                  const isOpen = openItem === key
                  return (
                    <div key={i} className="reveal" style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <button onClick={() => setOpenItem(isOpen ? null : key)}
                        style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: isOpen ? 'var(--accent)' : 'var(--text)' }}>{item.q}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', transition: 'transform .25s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
                      </button>
                      {isOpen && <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75, paddingBottom: 16 }}>{item.a}</p>}
                    </div>
                  )
                })}
              </div>
            ))}

            <div className="reveal" style={{ textAlign: 'center', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 14, padding: '28px', marginTop: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Chưa tìm thấy câu trả lời?</div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, marginBottom: 16 }}>Chúng tôi sẵn sàng giải đáp mọi thắc mắc qua Zalo hoặc email.</p>
              <Link href="/contact" style={{ padding: '11px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                Liên hệ ngay →
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
