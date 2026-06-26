const PILLARS = [
  {
    num: '01',
    title: 'Kết nối tâm trí — cơ thể',
    desc: 'Pilates đòi hỏi sự tập trung hoàn toàn. Mỗi chuyển động có chủ đích, giúp bạn nhận thức sâu hơn về cơ thể của mình.',
  },
  {
    num: '02',
    title: 'Core strength thật sự',
    desc: 'Chúng tôi tập trung vào cơ sâu — không phải cơ biểu diễn. Kết quả là cột sống khỏe mạnh, tư thế đúng và ít đau lưng hơn.',
  },
  {
    num: '03',
    title: 'Cá nhân hóa lộ trình',
    desc: 'Không lớp học đại trà. Mỗi học viên được đánh giá ban đầu để thiết kế chương trình phù hợp với mục tiêu và thể trạng.',
  },
]

const STATS = [
  { value: '8+', label: 'Năm kinh nghiệm' },
  { value: '500+', label: 'Học viên' },
  { value: '12', label: 'Máy Reformer Pilates' },
  { value: '98%', label: 'Hài lòng sau 1 tháng' },
]

export default function About() {
  return (
    <section className="ps-about sec-pad">
      <div className="wd-container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5">
            <div className="ps-about-img-wrap reveal-left">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=720&q=80&auto=format&fit=crop"
                alt="About Balance Pilates Studio"
                className="ps-about-img"
              />
              <div className="ps-about-img-badge reveal">
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 28, lineHeight: 1 }}>Est.</div>
                <div style={{ fontWeight: 700, color: 'var(--green-accent)', fontSize: 38, lineHeight: 1 }}>2016</div>
                <div style={{ color: 'var(--text-2)', fontSize: 12, marginTop: 4 }}>Studio chuyên nghiệp</div>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="reveal">
              <div className="ps-eyebrow">Về chúng tôi</div>
              <h2 className="ps-sec-title">Không chỉ là nơi tập luyện —<br />là nơi thay đổi.</h2>
              <p className="ps-sec-sub">Balance Pilates Studio được thành lập từ 2016 với sứ mệnh mang pilates chuẩn quốc tế đến Việt Nam. Chúng tôi tin rằng sức khỏe thực sự đến từ bên trong — từ sự kết nối giữa tâm trí, cơ thể và hơi thở.</p>
            </div>

            <div className="ps-about-pillars reveal reveal-d1">
              {PILLARS.map(p => (
                <div key={p.num} className="ps-about-pillar">
                  <div className="ps-pillar-num">{p.num}</div>
                  <div>
                    <div className="ps-pillar-title">{p.title}</div>
                    <p className="ps-pillar-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ps-stats-row reveal reveal-d2">
              {STATS.map(s => (
                <div key={s.label} className="ps-stat-item">
                  <div className="ps-stat-value">{s.value}</div>
                  <div className="ps-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
