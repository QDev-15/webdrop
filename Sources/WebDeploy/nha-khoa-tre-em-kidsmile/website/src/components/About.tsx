import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Settings {
  stat_patients?: string
  stat_years?: string
  stat_satisfaction?: string
  stat_doctors?: string
}

const USP_ITEMS = [
  {
    icon: '🪄',
    title: 'Kỹ thuật không đau',
    text: 'Công nghệ gây tê nhẹ nhàng, thao tác nhanh gọn — bé hầu như không cảm nhận được cảm giác khó chịu.',
  },
  {
    icon: '🎪',
    title: 'Không gian như công viên',
    text: 'Phòng chờ đầy màu sắc, khu vui chơi và phim hoạt hình giúp bé quên đi cảm giác lo lắng.',
  },
  {
    icon: '🩺',
    title: 'Bác sĩ chuyên khoa Nhi',
    text: 'Đội ngũ được đào tạo chuyên sâu về tâm lý trẻ nhỏ, giao tiếp gần gũi, kiên nhẫn với từng bé.',
  },
  {
    icon: '🎁',
    title: 'Phần thưởng sau khám',
    text: 'Mỗi bé đều nhận được huy hiệu "Chiến binh dũng cảm" và quà nhỏ sau mỗi lần khám răng.',
  },
]

const GALLERY_ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=75&auto=format&fit=crop',
    alt: 'Khu vui chơi đầy màu sắc tại phòng khám KidSmile',
    cap: 'Khu vui chơi chờ khám',
  },
  {
    src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&q=75&auto=format&fit=crop',
    alt: 'Bé được bác sĩ nhi khoa khám răng nhẹ nhàng',
    cap: 'Phòng khám thân thiện',
  },
  {
    src: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=500&q=75&auto=format&fit=crop',
    alt: 'Bé cười vui vẻ sau khi khám răng tại KidSmile',
    cap: 'Nụ cười sau buổi khám',
  },
  {
    src: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=500&q=75&auto=format&fit=crop',
    alt: 'Ghế khám răng trang trí ngộ nghĩnh cho trẻ em',
    cap: 'Ghế khám hình thú ngộ nghĩnh',
  },
  {
    src: 'https://images.unsplash.com/photo-1591343395902-1adf7dd6d556?w=500&q=75&auto=format&fit=crop',
    alt: 'Quầy nhận quà sau khi bé khám răng xong',
    cap: 'Góc nhận quà "Chiến binh dũng cảm"',
  },
  {
    src: 'https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=500&q=75&auto=format&fit=crop',
    alt: 'Đội ngũ bác sĩ và bé tại phòng khám KidSmile',
    cap: 'Đồng hành cùng bé mỗi ngày',
  },
]

export default function About() {
  const [s, setS] = useState<Settings>({})

  useEffect(() => {
    api.get<Settings>('/public/settings').then(setS).catch(() => {})
  }, [])

  return (
    <>
      {/* USP Section */}
      <section className="ks-usp-bg ks-sec-pad" aria-label="Lý do chọn KidSmile">
        <div className="wd-container">
          <div className="ks-text-center" data-reveal>
            <span className="ks-eyebrow">Vì sao cha mẹ chọn KidSmile</span>
            <h2 className="ks-title">
              Trải nghiệm khám răng <strong>khác biệt</strong><br />dành riêng cho bé
            </h2>
            <p className="ks-sub ks-mx-auto">
              Mỗi chi tiết tại KidSmile đều được thiết kế để bé cảm thấy an toàn, thoải mái và vui vẻ trong suốt buổi khám.
            </p>
          </div>
          <div className="ks-usp-grid">
            {USP_ITEMS.map((item, i) => (
              <div className="ks-usp-item" key={i} data-reveal data-delay={i > 0 ? String(i) : undefined}>
                <div className="ks-usp-icon" aria-hidden="true">{item.icon}</div>
                <div className="ks-usp-title">{item.title}</div>
                <div className="ks-usp-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat Bar */}
      <section className="ks-stat-bg ks-sec-pad-sm" aria-label="Thống kê KidSmile">
        <div className="wd-container">
          <div className="ks-stat-grid">
            <div data-reveal>
              <div className="ks-stat-num">{s.stat_patients || '8.000+'}</div>
              <div className="ks-stat-label">Bé đã khám tại KidSmile</div>
            </div>
            <div data-reveal data-delay="1">
              <div className="ks-stat-num">{s.stat_years || '9'}</div>
              <div className="ks-stat-label">Năm kinh nghiệm nha khoa Nhi</div>
            </div>
            <div data-reveal data-delay="2">
              <div className="ks-stat-num">{s.stat_satisfaction || '98%'}</div>
              <div className="ks-stat-label">Phụ huynh hài lòng</div>
            </div>
            <div data-reveal data-delay="3">
              <div className="ks-stat-num">{s.stat_doctors || '12'}</div>
              <div className="ks-stat-label">Bác sĩ chuyên khoa Nhi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="ks-gallery-bg ks-sec-pad" aria-label="Không gian KidSmile">
        <div className="wd-container">
          <div className="ks-text-center mb-4" data-reveal>
            <span className="ks-eyebrow">Không gian KidSmile</span>
            <h2 className="ks-title">Nơi bé <strong>vui chơi</strong> trước khi <em>khám răng</em></h2>
            <p className="ks-sub ks-mx-auto">Vuốt ngang để khám phá không gian đầy màu sắc tại phòng khám của chúng tôi.</p>
          </div>
        </div>
        <div className="wd-container">
          <div className="ks-gallery-scroll" data-reveal role="list" aria-label="Ảnh không gian phòng khám">
            {GALLERY_ITEMS.map((item, i) => (
              <div className="ks-gallery-item" key={i} role="listitem">
                <img src={item.src} alt={item.alt} loading="lazy" />
                <div className="ks-gallery-cap">{item.cap}</div>
              </div>
            ))}
          </div>
          <div className="ks-gallery-hint" aria-hidden="true">← Vuốt để xem thêm →</div>
        </div>
      </section>
    </>
  )
}
