import { Link } from 'react-router-dom'

interface CollectionBlock {
  eyebrow: string
  title: string
  emphasis: string
  desc: string
  image: string
  alt: string
  reverse?: boolean
}

const BLOCKS: CollectionBlock[] = [
  {
    eyebrow: 'Dòng chủ lực',
    title: 'Dòng',
    emphasis: 'Da Thật',
    desc: 'Da bò thật 100%, thuộc da tự nhiên, chế tác thủ công bởi nghệ nhân lành nghề — dòng sản phẩm chủ lực làm nên tên tuổi thương hiệu.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    alt: 'Dòng da thật cao cấp — túi xách nữ',
  },
  {
    eyebrow: 'Số lượng giới hạn',
    title: 'Bộ Sưu Tập',
    emphasis: 'Giới Hạn',
    desc: 'Sản xuất số lượng giới hạn, mỗi chiếc túi mang một mã số riêng biệt — dành cho những khách hàng yêu thích sự khác biệt.',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80',
    alt: 'Dòng giới hạn — thiết kế độc bản',
    reverse: true,
  },
  {
    eyebrow: 'Thanh lịch',
    title: 'Dòng',
    emphasis: 'Công Sở',
    desc: 'Thiết kế tối giản, tinh tế, phù hợp môi trường công sở hiện đại — form dáng thanh lịch, dễ phối cùng mọi trang phục.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    alt: 'Dòng công sở — thanh lịch tối giản',
  },
]

export default function CollectionPage() {
  return (
    <>
      <section className="ts-page-header">
        <div className="ts-container">
          <h1>Bộ sưu tập</h1>
          <div className="ts-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span className="current">Bộ sưu tập</span>
          </div>
        </div>
      </section>

      <section className="ts-sec">
        <div className="ts-container">
          {BLOCKS.map((b, i) => (
            <div
              key={b.emphasis}
              data-reveal
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center',
                paddingTop: i === 0 ? undefined : 72,
                paddingBottom: i === BLOCKS.length - 1 ? undefined : 72,
                borderBottom: i === BLOCKS.length - 1 ? undefined : '1px solid var(--border)',
              }}
            >
              <div style={{ order: b.reverse ? 2 : undefined, borderRadius: 2, overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src={b.image} alt={b.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ order: b.reverse ? 1 : undefined }}>
                <div className="ts-eyebrow">{b.eyebrow}</div>
                <h2 className="ts-sec-title">{b.title} <em>{b.emphasis}</em></h2>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 460, marginBottom: 24 }}>{b.desc}</p>
                <Link to="/san-pham" className="ts-btn solid">Khám phá ngay</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
