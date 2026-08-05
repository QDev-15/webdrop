import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function AboutPage() {
  useDocumentMeta({
    title: 'Giới thiệu — KidZone Shop Đồ Chơi',
    description: 'KidZone — Câu chuyện thương hiệu đồ chơi trẻ em. Sứ mệnh mang đồ chơi an toàn, chất lượng đến tay mọi gia đình Việt Nam.',
  })

  const values = [
    {
      icon: '🛡️',
      title: 'An toàn tuyệt đối',
      desc: 'Mọi sản phẩm đều vượt qua kiểm định tiêu chuẩn an toàn EN71 và ASTM F963 trước khi đến tay bé. Không compromise với sức khỏe của trẻ.',
    },
    {
      icon: '🧠',
      title: 'Học qua chơi',
      desc: 'Chúng tôi tin rằng mọi đồ chơi đều là cơ hội học hỏi. Mỗi sản phẩm được chọn lọc để kích thích sự phát triển tư duy, sáng tạo và kỹ năng sống.',
    },
    {
      icon: '💚',
      title: 'Thân thiện môi trường',
      desc: 'Ưu tiên sản phẩm từ vật liệu tái chế, đóng gói giảm nhựa và các thương hiệu cam kết phát triển bền vững — vì một thế giới tốt đẹp hơn cho thế hệ sau.',
    },
    {
      icon: '💛',
      title: 'Giá trị thực sự',
      desc: 'Giá cả công bằng với chất lượng — chúng tôi tin rằng mọi gia đình đều có quyền tiếp cận đồ chơi chất lượng mà không phải nặng nề về tài chính.',
    },
  ]

  return (
    <div className="dc-page-wrap">
      {/* Hero */}
      <section className="dc-about-hero">
        <img
          src="https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=1400&auto=format&fit=crop&q=80"
          alt="Trẻ em vui chơi với đồ chơi"
          className="dc-about-hero-img"
          width={1400}
          height={700}
          onError={e => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="dc-about-hero-overlay" aria-hidden="true" />
        <div className="dc-container dc-about-hero-content">
          <h1 className="dc-about-hero-title">Nơi tuổi thơ bắt đầu</h1>
          <p className="dc-about-hero-sub">
            KidZone — hành trình 10 năm mang niềm vui và sự phát triển đến với trẻ em Việt Nam thông qua những món đồ chơi chất lượng, an toàn.
          </p>
          <Link to="/san-pham" className="dc-btn-yellow">
            Khám phá cửa hàng
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="dc-section">
        <div className="dc-container">
          {/* Row 1: Text + Image */}
          <div className="dc-story-row">
            <div className="dc-story-text">
              <div className="dc-eyebrow">Câu chuyện của chúng tôi</div>
              <h2 className="dc-section-title">
                Từ một cửa tiệm nhỏ<br />
                <span>đến 50.000+ gia đình tin tưởng</span>
              </h2>
              <p>
                Năm 2014, KidZone ra đời từ niềm trăn trở của một bà mẹ hai con — làm thế nào để tìm được đồ chơi vừa an toàn, vừa giúp bé học hỏi mà
                không tốn quá nhiều thời gian tìm kiếm?
              </p>
              <p>
                Khởi đầu chỉ với một cửa hàng nhỏ 30m² ở Quận 5, TP.HCM, chúng tôi đã không ngừng lắng nghe các phụ huynh, cộng tác với các chuyên gia
                giáo dục mầm non để tuyển chọn những sản phẩm tốt nhất cho trẻ.
              </p>
              <p>
                Hôm nay, KidZone tự hào phục vụ hơn 50.000 gia đình trên khắp Việt Nam — mỗi sản phẩm đều được kiểm định an toàn theo tiêu chuẩn quốc
                tế trước khi đến tay bé yêu của bạn.
              </p>
            </div>
            <div className="dc-story-img">
              <img
                src="https://images.unsplash.com/photo-1543886151-3bc2b944c718?w=700&auto=format&fit=crop&q=80"
                alt="Cửa hàng KidZone"
                width={700}
                height={500}
                onError={e => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22700%22 height=%22500%22%3E%3Crect width=%22700%22 height=%22500%22 fill=%22%23e0f4fb%22/%3E%3C/svg%3E'
                }}
              />
            </div>
          </div>

          {/* Row 2: Image + Text (reversed) */}
          <div className="dc-story-row dc-story-row-rev">
            <div className="dc-story-img">
              <img
                src="https://images.unsplash.com/photo-1646995477167-a344548ce6b9?w=700&auto=format&fit=crop&q=80"
                alt="Đội ngũ KidZone kiểm định sản phẩm"
                width={700}
                height={500}
                onError={e => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22700%22 height=%22500%22%3E%3Crect width=%22700%22 height=%22500%22 fill=%22%23e0f4fb%22/%3E%3C/svg%3E'
                }}
              />
            </div>
            <div className="dc-story-text">
              <div className="dc-eyebrow">Cam kết của chúng tôi</div>
              <h2 className="dc-section-title">
                An toàn là<br />
                <span>ưu tiên số một</span>
              </h2>
              <p>
                Mỗi sản phẩm tại KidZone đều trải qua quy trình kiểm định nghiêm ngặt: chất liệu không độc hại (BPA-free, chứng nhận EN71), cạnh và
                góc được bo tròn an toàn, chi tiết nhỏ đảm bảo không gây nguy hiểm cho trẻ dưới 3 tuổi.
              </p>
              <p>
                Đội ngũ tư vấn của chúng tôi gồm các chuyên gia giáo dục mầm non với hơn 15 năm kinh nghiệm — luôn sẵn sàng giúp bạn chọn được món
                đồ chơi phù hợp nhất với từng giai đoạn phát triển của bé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="dc-section dc-section-alt">
        <div className="dc-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="dc-eyebrow">Triết lý của chúng tôi</div>
            <h2 className="dc-section-title">Giá trị cốt lõi</h2>
          </div>
          <div className="dc-values-grid">
            {values.map(v => (
              <div key={v.title} className="dc-value-card">
                <div className="dc-value-icon" aria-hidden="true">
                  {v.icon}
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="dc-section">
        <div className="dc-container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '24px' }}>Cùng khám phá bộ sưu tập của chúng tôi</h2>
          <p style={{ marginBottom: '32px', fontSize: '16px', color: 'var(--text-2)' }}>
            Hàng ngàn sản phẩm đồ chơi chất lượng, an toàn đang chờ bé yêu của bạn.
          </p>
          <Link to="/san-pham" className="dc-btn dc-btn-primary">
            Mua sắm ngay
          </Link>
        </div>
      </section>
    </div>
  )
}
