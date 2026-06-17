import { useSite } from '../App'

export default function About() {
  const { settings } = useSite()
  const title = settings.about_title || 'Người đứng sau mỗi món ăn'
  const content = settings.about_content || 'Bếp trưởng có hơn 15 năm học nghề và làm việc tại Tokyo — từ nhà hàng izakaya nhỏ ở Shinjuku đến nhà hàng 2 sao Michelin ở Ginza. Mang triết lý "mỗi nguyên liệu là một câu chuyện" về Việt Nam.'
  const image = settings.about_image || 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=700&q=80&auto=format&fit=crop&crop=faces,center'

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 reveal">
            <div className="eyebrow">Bếp trưởng & Câu chuyện</div>
            <h2 className="sec-title">{title.split(' ').slice(0, 3).join(' ')}<br /><em>{title.split(' ').slice(3).join(' ')}</em></h2>
            <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '24px' }}>
              {content}
            </p>
            <ul className="award-list mb-4">
              <li>Giải thưởng Bếp trưởng Nhật Bản xuất sắc</li>
              <li>Top 10 nhà hàng Nhật uy tín nhất TP.HCM</li>
              <li>Được giới thiệu trên các tạp chí ẩm thực hàng đầu</li>
              <li>Chứng chỉ Itamae — Thợ thủ công sushi truyền thống Nhật Bản</li>
            </ul>
            <a href="/sushi-bar" className="btn-accent">Trải nghiệm Sushi Bar</a>
          </div>
          <div className="col-lg-6 reveal reveal-d1">
            <img src={image} alt="Bếp trưởng Nhật Bản" className="chef-img" />
          </div>
        </div>
      </div>
    </section>
  )
}
