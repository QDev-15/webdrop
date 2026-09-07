const TIMELINE = [
  { year: 'Năm đầu tiên', title: 'Chiếc máy rang 1kg đầu tiên', text: 'Bắt đầu rang thử nghiệm tại nhà, mang mẫu đến từng quán quen để xin góp ý.' },
  { year: 'Năm thứ 2–3', title: 'Kết nối trực tiếp với nông trại', text: 'Đến tận nơi tại Cầu Đất và Khe Sanh, xây dựng quan hệ thu mua trực tiếp, bỏ qua thương lái trung gian.' },
  { year: 'Năm thứ 4–5', title: 'Mở xưởng rang có không gian pha chế', text: 'Chuyển sang địa điểm hiện tại — xưởng rang mở, khách có thể ngồi lại và quan sát toàn bộ quy trình.' },
  { year: 'Hiện tại', title: '120kg hạt rang mỗi tuần', text: 'Phục vụ khách lẻ tại quán và hơn 15 quán cà phê đối tác đặt hạt rang định kỳ mỗi tháng.' },
]

const ROAST_STEPS = [
  { icon: '🌾', name: 'Chọn lô hạt xanh', desc: 'Kiểm tra độ ẩm, tỉ lệ lỗi hạt, và nếm thử (cupping) hạt xanh trước khi quyết định thu mua cả lô.' },
  { icon: '🔥', name: 'Xây dựng profile rang', desc: 'Mỗi vùng nguyên liệu có một đường cong nhiệt độ riêng, được ghi lại và điều chỉnh qua nhiều lần rang thử.' },
  { icon: '📋', name: 'Cupping kiểm định', desc: 'Mỗi mẻ rang đều được cupping trước khi đóng gói — chỉ những mẻ đạt chuẩn mới được đưa ra bán.' },
  { icon: '📦', name: 'Đóng gói có van khí', desc: 'Túi zip có van thoát khí một chiều, ghi rõ ngày rang và vùng trồng trên từng bao bì.' },
]

export default function About() {
  return (
    <>
      {/* CÂU CHUYỆN THƯƠNG HIỆU */}
      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <div className="crx-intro-row">
            <div data-reveal>
              <div className="crx-eyebrow">Khởi đầu</div>
              <p className="crx-intro-lead">Chúng tôi bắt đầu chỉ vì <em>không tìm được</em> một ly cà phê single-origin Việt Nam đúng nghĩa trong thành phố.</p>
            </div>
            <div data-reveal data-reveal-d1>
              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.85, fontWeight: 300, marginBottom: 16 }}>Năm đó, sau nhiều chuyến đi tìm hiểu vùng nguyên liệu tại Cầu Đất (Đà Lạt), Khe Sanh (Quảng Trị) và Sơn La, chúng tôi nhận ra Việt Nam có những lô hạt Arabica chất lượng rất cao — nhưng phần lớn bị trộn lẫn và rang công nghiệp, làm mất đi đặc trưng vùng miền.</p>
              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.85, fontWeight: 300 }}>Từ đó, xưởng rang nhỏ của chúng tôi ra đời — với một chiếc máy rang trống công suất 1kg đặt trong một căn nhà thuê nhỏ. Sau nhiều năm, chúng tôi vẫn giữ nguyên cách làm ấy, chỉ mở rộng quy mô đủ để phục vụ nhiều khách hàng hơn mà không đánh đổi chất lượng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="crx-sec-pad" style={{ background: 'var(--roast-light)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Hành trình</div>
            <h2 className="crx-sec-title">Từ căn nhà thuê nhỏ <em>đến xưởng rang hôm nay</em></h2>
          </div>
          <div className="crx-timeline" data-reveal data-reveal-d1>
            {TIMELINE.map(t => (
              <div className="crx-tl-item" key={t.year}>
                <div className="crx-tl-dot"></div>
                <div className="crx-tl-year">{t.year}</div>
                <div className="crx-tl-title">{t.title}</div>
                <div className="crx-tl-text">{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUY TRÌNH CHỌN HẠT / RANG */}
      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Quy trình</div>
            <h2 className="crx-sec-title">Chọn hạt kỹ tính, <em>rang có kiểm soát</em></h2>
            <p className="crx-sec-sub crx-mx-auto">Ba bước cố định cho mọi lô hạt trước khi lên kệ hoặc pha thành ly cà phê phục vụ khách.</p>
          </div>
          <div className="crx-roast-scroll" data-reveal data-reveal-d1>
            {ROAST_STEPS.map(s => (
              <div className="crx-roast-card" key={s.name}>
                <div className="crx-roast-icon">{s.icon}</div>
                <div className="crx-roast-name">{s.name}</div>
                <div className="crx-roast-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
