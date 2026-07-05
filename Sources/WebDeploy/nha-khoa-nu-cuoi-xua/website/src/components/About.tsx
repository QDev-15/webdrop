import { useSite } from '../contexts/SiteContext'

const FEATURES = [
  { icon: '🏛️', title: 'Truyền thống & hiện đại', desc: 'Kết hợp tiểu thuật chính xác của y học hiện đại với sự ấm áp chăm sóc truyền thống.' },
  { icon: '🔬', title: 'Công nghệ tiên tiến', desc: 'Trang bị hệ thống X-quang kỹ thuật số, máy scan 3D và các thiết bị nha khoa thế hệ mới.' },
  { icon: '❤️', title: 'Tận tâm từng bệnh nhân', desc: 'Mỗi khách hàng đều được thăm khám cá nhân hóa, giải thích rõ ràng trước khi điều trị.' },
  { icon: '🛡️', title: 'An toàn tiệt trùng tuyệt đối', desc: 'Quy trình khử trùng khép kín đạt chuẩn quốc tế, đảm bảo an toàn tuyệt đối cho mọi bệnh nhân.' },
]

export default function About() {
  const { settings } = useSite()

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div style={{ marginBottom: '52px' }} data-reveal>
          <div className="nc-eyebrow">Về chúng tôi</div>
          <h2 className="nc-title">Nơi răng đẹp gặp <span>phong cách retro</span></h2>
          <p className="nc-sub">
            {settings.story_text || 'Nụ Cười Xưa Nha Khoa ra đời với mong muốn mang lại trải nghiệm nha khoa khác biệt — nơi sự chuyên nghiệp hòa quyện cùng không khí ấm áp, thân thuộc của một phòng khám phong cách vintage.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="nc-feat-row" data-reveal data-delay={String(i + 1)}>
              <div className="nc-feat-icon">{f.icon}</div>
              <h3 className="nc-feat-title">{f.title}</h3>
              <p className="nc-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
