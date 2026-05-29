const steps = [
  { num: '01', title: 'Chọn mẫu yêu thích', desc: 'Duyệt qua hơn 30 mẫu theo ngành nghề. Xem live demo trực tiếp, không cần cài đặt gì.' },
  { num: '02', title: 'Thanh toán & điền brief', desc: 'Đặt hàng online. Nhận form điền thông tin: logo, nội dung, màu sắc, phong cách mong muốn.' },
  { num: '03', title: 'Chúng tôi triển khai', desc: 'Setup hosting, domain, SSL. Cài mẫu, điền nội dung, tùy chỉnh màu và logo theo brand.' },
  { num: '04', title: 'Nhận website hoàn chỉnh', desc: 'Xem link preview, chỉnh sửa tối đa 2 vòng, bàn giao. Website live trong 3–5 ngày làm việc.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Quy trình</div>
          <h2 className="sec-title">Đơn giản từ <em>đầu đến cuối</em></h2>
          <p className="sec-sub">Bạn chỉ cần cung cấp nội dung. Chúng tôi lo toàn bộ phần kỹ thuật còn lại.</p>
        </div>
        <div className="row g-5 align-items-center">
          <div className="col-md-6 reveal reveal-d1">
            {steps.map(s => (
              <div key={s.num} className="how-step">
                <div className="hs-num">{s.num}</div>
                <div>
                  <div className="hs-title">{s.title}</div>
                  <div className="hs-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-6 reveal reveal-d2">
            <div className="rounded-4 overflow-hidden position-relative border" style={{ borderColor: 'var(--border)', aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format&fit=crop"
                alt="Triển khai website" className="w-100 h-100 object-fit-cover d-block" loading="lazy"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(26,107,82,.15) 0%,transparent 60%)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
