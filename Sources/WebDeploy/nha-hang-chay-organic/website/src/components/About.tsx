import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()

  const tagline = (settings.about_tagline) || 'Từ nông trại organic thẳng đến bàn ăn'
  const content = (settings.about_content) || 'Lá Xanh ra đời từ niềm tin rằng ăn chay không có nghĩa là từ bỏ hương vị. Chúng tôi hợp tác trực tiếp với các nông trại hữu cơ tại Đà Lạt, đảm bảo mỗi nguyên liệu đều sạch, tươi và được trồng theo tiêu chuẩn organic.'
  const image   = (settings.about_image) || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80&auto=format&fit=crop'

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5 align-items-center">
          <div className="col-md-5 reveal">
            <img
              src={image}
              alt={tagline}
              style={{ borderRadius: '16px', width: '100%', height: '420px', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>
          <div className="col-md-7 reveal reveal-d1">
            <div className="eyebrow">Nguồn nguyên liệu</div>
            <h2 className="sec-title">
              {tagline.split('thẳng')[0]}thẳng<br />
              <em>{tagline.includes('thẳng') ? 'đến bàn ăn' : tagline}</em>
            </h2>
            <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '28px' }}>
              {content}
            </p>
            <div className="d-flex gap-4">
              <div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-1px' }}>3+</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Nông trại đối tác</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-1px' }}>6h</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Thu hái đến bàn ăn</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-1px' }}>100%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Có chứng nhận</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
