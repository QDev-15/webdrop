import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()
  const s = settings

  const images = [
    s.about_image_1 || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format&fit=crop',
    s.about_image_2 || 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&q=80&auto=format&fit=crop',
    s.about_image_3 || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80&auto=format&fit=crop',
    s.about_image_1 || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format&fit=crop',
  ]

  const contentParts = (s.about_content || '').split('\n\n')

  return (
    <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
      <div className="wd-container">
        <div className="row g-5 align-items-center">
          <div className="col-md-6 order-md-2 reveal">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  style={{ borderRadius: 14, width: '100%', height: 200, objectFit: 'cover', marginTop: i % 2 === 1 ? 24 : 0 }}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
          <div className="col-md-6 order-md-1 sec-dark reveal reveal-d1">
            <div className="eyebrow">Câu chuyện</div>
            <h2 className="sec-title">{s.about_title || '15 năm gìn giữ hương vị truyền thống'}</h2>
            {contentParts.length > 0
              ? contentParts.map((p, i) => (
                  <p key={i} style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.8, marginBottom: 16 }}>{p}</p>
                ))
              : (
                <>
                  <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.8, marginBottom: 16 }}>
                    Từ năm 2009, nhà hàng đã trở thành điểm đến quen thuộc của người yêu ẩm thực Việt. Mỗi công thức đều được lưu giữ và hoàn thiện qua nhiều thế hệ.
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.8, marginBottom: 28 }}>
                    Nguyên liệu được tuyển chọn mỗi sáng từ chợ đầu mối. Đầu bếp nấu theo trái tim — không bột ngọt, không chất bảo quản.
                  </p>
                </>
              )
            }
            <div className="d-flex gap-4">
              <div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: -1 }}>{s.about_years || '15+'}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Năm kinh nghiệm</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: -1 }}>{s.about_dishes || '60+'}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Món ăn đặc sắc</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: -1 }}>{s.about_reviews || '380+'}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Đánh giá 5 sao</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
