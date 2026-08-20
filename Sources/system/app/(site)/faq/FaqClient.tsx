'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FaqGroup {
  group: string
  items: Array<{ q: string; a: string }>
}

const FALLBACK_GROUPS: FaqGroup[] = [
  {
    group: 'Gói Template',
    items: [
      { q: 'Gói Template là gì?', a: 'Gói Template là file HTML/CSS/JS thuần dùng Bootstrap 5.3. Bạn nhận file ZIP, mở thẳng trên trình duyệt là chạy — không cần server, không cần build, không cần kỹ thuật.' },
      { q: 'Có demo trước khi mua không?', a: 'Có. Tất cả 31+ template đều có link demo live. Xem thử trên máy và điện thoại trước khi quyết định.' },
      { q: 'Template có responsive không?', a: 'Có. Tất cả template đều responsive từ 320px (điện thoại nhỏ) đến 4K màn hình lớn. Test kỹ trên Chrome, Safari, Firefox.' },
      { q: 'Tôi có thể chỉnh màu sắc, font chữ không?', a: 'Dễ dàng. Mọi template dùng CSS Custom Properties (biến CSS) — chỉ cần thay giá trị trong :root là đổi toàn bộ giao diện. Có hướng dẫn chi tiết đính kèm.' },
      { q: 'Mua xong nhận được gì?', a: 'File ZIP gồm: tất cả file HTML/CSS/JS, thư mục assets (ảnh, icon), và hướng dẫn chỉnh nội dung. Download ngay sau khi thanh toán được xác nhận.' },
      { q: 'Giá template bao nhiêu?', a: 'Template 1 trang: 199.000–499.000đ. Template multi-page (4–6 trang): 499.000–999.000đ. Admin template: 699.000–1.499.000đ. Bundle 5 template tiết kiệm 30–40%.' },
    ],
  },
  {
    group: 'Gói Web cơ bản',
    items: [
      { q: 'Gói Web cơ bản khác Gói Template thế nào?', a: 'Gói Web cơ bản là website đầy đủ: giao diện React đẹp + backend PHP + cơ sở dữ liệu SQLite + trang quản trị admin. Chúng tôi cài đặt, điền nội dung, setup hosting trọn gói — bạn nhận website hoàn chỉnh sau 3–5 ngày.' },
      { q: 'Hosting yêu cầu gì?', a: 'PHP (khuyến nghị 8.0+) và SQLite (pdo_sqlite extension). Hỗ trợ cả Linux hosting (cPanel/Apache) và Windows hosting (Plesk/IIS). Nếu chưa có hosting, chúng tôi tư vấn gói phù hợp.' },
      { q: 'Tự deploy được không?', a: 'Được. Nhận file deploy.zip → giải nén → upload lên public_html → sửa config.php (2 dòng) → xong. Database tự tạo lần đầu khi truy cập. Có hướng dẫn cài đặt chi tiết kèm theo.' },
      { q: 'Quản lý nội dung website như thế nào?', a: 'Trang quản trị tại yoursite.com/admin — quản lý bài viết, trang, banner, form liên hệ, và cài đặt chung (tên site, logo, mạng xã hội, SMTP...) không cần chỉnh code.' },
      { q: 'Có thể đổi sang MySQL không?', a: 'Có. Chỉ đổi 1 dòng DB_TYPE trong config.php và điền thông tin kết nối. File schema.sql đi kèm để tạo bảng trên MySQL hoặc PostgreSQL.' },
      { q: 'Giá Gói Web cơ bản bao nhiêu?', a: 'Từ 3.000.000đ. Xem bảng giá chi tiết tại trang /pricing. Cài đặt hosting + domain tính riêng 500.000–1.000.000đ (1 lần).' },
    ],
  },
  {
    group: 'Gói Theo Yêu cầu',
    items: [
      { q: 'Gói Theo Yêu cầu phù hợp với ai?', a: 'Doanh nghiệp cần thiết kế riêng biệt, tính năng đặc thù theo nghiệp vụ, hoặc dự án quy mô lớn. Không dùng mẫu có sẵn — thiết kế độc quyền từ đầu theo brief của bạn.' },
      { q: 'Quy trình làm việc ra sao?', a: 'Phase 1: Trao đổi brief → Wireframe → Thiết kế UI → Khách duyệt (có thể chỉnh đến khi ưng). Phase 2: Lập trình → Test → Deploy → Bàn giao. Ký checklist scope trước khi bắt đầu để tránh phát sinh.' },
      { q: 'Thời gian hoàn thành bao lâu?', a: 'Landing page custom: 5–7 ngày. Website 5–10 trang: 2–4 tuần. Hệ thống phức tạp (đặt hàng, CRM nhỏ...): 1–3 tháng. Thời gian xác nhận sau khi trao đổi scope.' },
      { q: 'Có bàn giao source code không?', a: 'Có, nếu muốn. Source code tính thêm 20–30% giá trị dự án. Mặc định bàn giao bản build deploy sẵn (không cần build tool để chạy).' },
      { q: 'Giá khởi điểm bao nhiêu?', a: 'Từ 20.000.000đ tùy scope. Website brochure custom UI: 20–40 triệu. Website + hệ thống quản lý: 40–80 triệu. Hệ thống phức tạp: 80 triệu+. Liên hệ để nhận báo giá chính xác.' },
    ],
  },
  {
    group: 'Thanh toán & Bảo hành',
    items: [
      { q: 'Thanh toán như thế nào?', a: 'Chuyển khoản ngân hàng. Sau khi chuyển khoản, gửi ảnh xác nhận qua Zalo — xác nhận và xử lý trong 2 giờ làm việc (8:00–18:00, Thứ 2–Thứ 7).' },
      { q: 'Chính sách hoàn tiền?', a: 'Hoàn tiền 100% trong 7 ngày nếu sản phẩm không đúng mô tả hoặc có lỗi nghiêm trọng không thể fix. Không áp dụng nếu bạn đã tải về và chỉnh sửa file.' },
      { q: 'Có hỗ trợ sau bàn giao không?', a: 'Gói Template: hỗ trợ qua chat 7 ngày. Gói Web cơ bản: hỗ trợ kỹ thuật miễn phí 30 ngày. Gói Theo Yêu cầu: hỗ trợ 90 ngày. Sau đó có gói bảo trì tháng từ 1.000.000đ.' },
      { q: 'Liên hệ hỗ trợ qua đâu?', a: 'Zalo là nhanh nhất — phản hồi trong giờ làm việc. Số Zalo và email xem trong phần Liên hệ ở cuối trang. Giờ hỗ trợ: 8:00–18:00, Thứ 2–Thứ 7.' },
    ],
  },
]

export default function FaqClient() {
  const [faqGroups, setFaqGroups] = useState<FaqGroup[]>(FALLBACK_GROUPS)
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => {
        setFaqGroups(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch FAQ:', err)
        setLoading(false)
      })
  }, [])

  return (
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
  )
}
