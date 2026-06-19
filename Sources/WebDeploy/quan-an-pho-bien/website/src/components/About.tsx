import { useSite } from '../App'

export default function About() {
  const { settings } = useSite()
  const title = settings.about_title || 'Quán nhỏ, tình lớn — mở từ năm 2008'
  const content = settings.about_content || 'Chúng tôi bắt đầu từ một xe đẩy nhỏ ở góc phố. Hơn 15 năm sau, quán mở rộng nhưng vẫn giữ nguyên công thức: nấu bằng nguyên liệu tươi, ninh nước dùng từ 3 giờ sáng, phục vụ bằng cái tâm của người làm bếp. Mỗi tô phở ra lò là một tô chúng tôi muốn bán cho người thân của mình.'
  const tagline = settings.about_tagline || 'Từ xe đẩy góc phố đến quán ăn quen thuộc của cả khu phố'

  return (
    <div className="sec-pad">
      <div className="row g-4 align-items-center">
        <div className="col-lg-5 reveal">
          <div className="story-img-grid">
            <img
              src={settings.about_image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=70'}
              alt="Quán phở"
              style={{ height: 200, width: '100%', objectFit: 'cover' }}
            />
            <img
              src={settings.about_image_2 || 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=400&q=70'}
              alt="Bếp nấu"
              style={{ height: 200, width: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="col-lg-6 offset-lg-1 reveal reveal-d1">
          <div className="eyebrow">Câu chuyện quán</div>
          <h2 className="sec-title">{title}</h2>
          <p className="sec-sub" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: 20 }}>{content}</p>
          <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(217,119,6,.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💛</span>
            <p style={{ fontSize: 13.5, fontStyle: 'italic', color: 'var(--accent-h)', fontWeight: 400, lineHeight: 1.7, margin: 0 }}>{tagline}</p>
          </div>
          <div className="d-flex gap-4 flex-wrap">
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', letterSpacing: -1, lineHeight: 1 }}>15+</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Năm phục vụ</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', letterSpacing: -1, lineHeight: 1 }}>500+</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Khách mỗi ngày</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', letterSpacing: -1, lineHeight: 1 }}>4.8★</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Google Maps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
