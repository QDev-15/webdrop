import { Link } from 'react-router-dom'

interface CollectionBlock {
  eyebrow: string
  title: string
  emphasis: string
  desc: string
  image: string
  alt: string
  ctaTo: string
}

const BLOCKS: CollectionBlock[] = [
  {
    eyebrow: 'Vừa ra mắt',
    title: 'Drop',
    emphasis: '001',
    desc: 'Bộ sưu tập giới hạn mở màn mùa Thu Đông — thiết kế độc quyền lấy cảm hứng từ văn hóa đường phố, số lượng chỉ 200 đôi mỗi mẫu. Nhanh tay trước khi hết hàng.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập Drop 001 — sneaker giới hạn',
    ctaTo: '/san-pham?cat=sneaker',
  },
  {
    eyebrow: 'Hiệu suất cao',
    title: 'Dòng',
    emphasis: 'Thể Thao',
    desc: 'Công nghệ đệm khí tiên tiến, form giày ôm chân tối ưu cho từng bước chạy — được nhiều vận động viên tin dùng trong tập luyện hằng ngày.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập thể thao chuyên nghiệp',
    ctaTo: '/san-pham?cat=chay-bo',
  },
  {
    eyebrow: 'Sản xuất giới hạn',
    title: 'Bộ Sưu Tập',
    emphasis: 'Colorway',
    desc: 'Những phối màu độc quyền không lặp lại, sản xuất số lượng giới hạn dành riêng cho tín đồ sneaker thực thụ muốn nổi bật giữa đám đông.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    alt: 'Bộ sưu tập phối màu đặc biệt',
    ctaTo: '/san-pham',
  },
]

export default function CollectionPage() {
  return (
    <>
      <div className="gd-page-header">
        <div className="gd-container">
          <nav className="gd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Bộ sưu tập</span>
          </nav>
          <h1 className="gd-page-title">Bộ Sưu Tập</h1>
          <p className="gd-page-count">Mỗi bộ sưu tập là một câu chuyện riêng — từ đường phố đến sân đấu</p>
        </div>
      </div>

      <main>
        <section className="gd-sec">
          <div className="gd-container">
            {BLOCKS.map((b, i) => (
              <div className={`gd-split-row${i % 2 === 1 ? ' reverse' : ''}`} key={b.title + b.emphasis} data-reveal>
                <div className="gd-split-media">
                  <img src={b.image} alt={b.alt} loading="lazy" />
                </div>
                <div className="gd-split-content">
                  <div className="gd-eyebrow">{b.eyebrow}</div>
                  <h2 className="gd-sec-title">{b.title} <em>{b.emphasis}</em></h2>
                  <p>{b.desc}</p>
                  <Link to={b.ctaTo} className="gd-btn gd-btn-primary">Khám phá ngay <i className="bi bi-arrow-right ms-1" /></Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
