import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: 'Công nghệ hiện đại',
    text: 'Thiết bị X-quang kỹ thuật số, máy trám xoay, máy siêu âm Piezotome.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Phù hợp mọi lứa tuổi',
    text: 'Từ bé nhỏ 1 tuổi, học sinh, người đi làm đến ông bà lớn tuổi.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'An toàn — tiệt trùng',
    text: 'Quy trình tiệt trùng chuẩn Bộ Y tế, dụng cụ dùng một lần hoặc hấp autoclave.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    title: 'Mở cửa 7 ngày / tuần',
    text: 'Từ 8:00 đến 20:00 cả thứ 2 đến chủ nhật — linh hoạt theo lịch khách hàng.',
  },
]

export default function About() {
  const { settings } = useSite()

  const s1Title  = settings.about_strip1_title      || 'Không gian ấm áp, thân thiện như ở nhà'
  const s1Text   = settings.about_strip1_text       || 'Sunrise được xây dựng với mong muốn xóa bỏ nỗi lo "sợ đi nha sĩ".'
  const s1Num    = settings.about_strip1_badge_num  || '15.000+'
  const s1Label  = settings.about_strip1_badge_label|| 'Lượt khám mỗi năm'
  const s1Img    = settings.about_strip1_image      || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80&auto=format&fit=crop'

  const s2Title  = settings.about_strip2_title      || 'Chăm sóc tận tâm, minh bạch chi phí'
  const s2Text   = settings.about_strip2_text       || 'Mỗi phác đồ điều trị đều được tư vấn kỹ, giải thích rõ chi phí trước khi thực hiện.'
  const s2Num    = settings.about_strip2_badge_num  || '98%'
  const s2Label  = settings.about_strip2_badge_label|| 'Khách hàng hài lòng'
  const s2Img    = settings.about_strip2_image      || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop'

  return (
    <>
      {/* Feature Icons */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="sr-feat-row">
            {FEATURES.map((f, i) => (
              <div key={i} className="sr-feat-item" data-reveal data-delay={String(i + 1)}>
                <div className="sr-feat-icon">{f.icon}</div>
                <div className="sr-feat-title">{f.title}</div>
                <div className="sr-feat-text">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strip 1 */}
      <section className="sr-strip">
        <div className="wd-container">
          <div className="sr-strip-row">
            <div className="sr-strip-media" data-reveal>
              <div className="sr-strip-img">
                <img src={s1Img} alt="Không gian phòng khám" loading="lazy" />
              </div>
              <div className="sr-strip-badge">
                <div className="sr-strip-badge-num">{s1Num}</div>
                <div className="sr-strip-badge-label">{s1Label}</div>
              </div>
            </div>
            <div className="sr-strip-content" data-reveal data-delay="1">
              <div className="sr-eyebrow">Về chúng tôi</div>
              <h2 className="sr-sec-title" dangerouslySetInnerHTML={{ __html: s1Title }} />
              <p className="sr-sec-sub">{s1Text}</p>
              <ul className="sr-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Không gian sáng, thoáng, thân thiện với trẻ nhỏ
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Bác sĩ nhẹ nhàng, kiên nhẫn với mọi lứa tuổi
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Khu vui chơi cho bé trong khi cha mẹ khám bệnh
                </li>
              </ul>
              <div style={{ marginTop: '28px' }}>
                <Link to="/dat-lich" className="sr-btn sr-btn-primary">Đặt lịch khám</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strip 2 */}
      <section className="sr-strip" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="sr-strip-row sr-strip-rev">
            <div className="sr-strip-media" data-reveal>
              <div className="sr-strip-img">
                <img src={s2Img} alt="Bác sĩ tư vấn" loading="lazy" />
              </div>
              <div className="sr-strip-badge">
                <div className="sr-strip-badge-num">{s2Num}</div>
                <div className="sr-strip-badge-label">{s2Label}</div>
              </div>
            </div>
            <div className="sr-strip-content" data-reveal data-delay="1">
              <div className="sr-eyebrow">Cam kết của chúng tôi</div>
              <h2 className="sr-sec-title" dangerouslySetInnerHTML={{ __html: s2Title }} />
              <p className="sr-sec-sub">{s2Text}</p>
              <ul className="sr-strip-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Báo giá chi tiết trước khi bắt đầu điều trị
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Không phát sinh chi phí bất ngờ trong quá trình điều trị
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Hỗ trợ trả góp 0% qua thẻ tín dụng
                </li>
              </ul>
              <div style={{ marginTop: '28px' }}>
                <Link to="/lien-he" className="sr-btn sr-btn-ghost">Liên hệ tư vấn</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
