import { useSite } from '../App'

export default function About() {
  const { settings } = useSite()

  return (
    <>
      {/* CÂU CHUYỆN */}
      <section className="sec-pad sec-surface" style={{ paddingTop: 0 }}>
        <div className="csa-container">
          <div className="csa-strip" data-reveal>
            <div>
              <img
                className="csa-strip-img"
                src={settings['about_story_image'] || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop'}
                alt="Chồng sách cũ và tách cà phê trên bàn gỗ tại Lặng Trang"
                loading="lazy"
              />
            </div>
            <div className="csa-strip-text">
              <div className="csa-eyebrow">{settings['about_story_eyebrow'] || 'Câu chuyện của chúng tôi'}</div>
              <h2>{settings['about_story_title'] || 'Bắt đầu từ một kệ sách nhỏ'}</h2>
              <p>{settings['about_story_text_1'] || 'Lặng Trang ra đời năm 2019, từ một kệ sách nhỏ đặt trong góc một quán cà phê thuê lại.'}</p>
              <p>{settings['about_story_text_2'] || 'Từ vài chục cuốn sách cũ ban đầu, kệ sách lớn dần thành thư viện mini hơn 1.500 đầu sách hôm nay.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRIẾT LÝ KHÔNG GIAN */}
      <section className="sec-pad sec-bg">
        <div className="csa-container">
          <div className="csa-strip reverse" data-reveal>
            <div>
              <img
                className="csa-strip-img"
                src={settings['about_philosophy_image'] || 'https://images.unsplash.com/photo-1524578271613-d550eede1f5a?w=800&q=80&auto=format&fit=crop'}
                alt="Kệ sách cao trong không gian yên tĩnh của Lặng Trang"
                loading="lazy"
              />
            </div>
            <div className="csa-strip-text">
              <div className="csa-eyebrow">{settings['about_philosophy_eyebrow'] || 'Triết lý không gian'}</div>
              <h2>{settings['about_philosophy_title'] || 'Tri thức cần sự tĩnh lặng'}</h2>
              <p>{settings['about_philosophy_text_1'] || 'Chúng tôi tin rằng đọc sách và làm việc tập trung đều cần một điều kiện cơ bản: sự yên tĩnh.'}</p>
              <p>{settings['about_philosophy_text_2'] || 'Mỗi chi tiết trong không gian đều được cân nhắc để giảm thiểu sự xao động.'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
