import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  sort_order: number
}

export default function Gallery({ preview = false, full = false }: { preview?: boolean; full?: boolean }) {
  const [corners, setCorners] = useState<GalleryItem[]>([])
  const [moments, setMoments] = useState<GalleryItem[]>([])

  useEffect(() => {
    Promise.all([
      api.get<GalleryItem[]>('/public/gallery?category=khong-gian'),
      api.get<GalleryItem[]>('/public/gallery?category=khoanh-khac'),
    ]).then(([c, m]) => {
      setCorners(c)
      setMoments(m)
    }).catch(() => {/* dùng danh sách rỗng */})
  }, [])

  if (preview) {
    const featured = corners.slice(0, 3)
    return (
      <section className="sec-pad sec-bg">
        <div className="csa-container">
          <div className="csa-sec-head center" data-reveal>
            <div className="csa-eyebrow center">Không gian đọc</div>
            <h2 className="csa-sec-title">Mỗi góc nhỏ, <em>một cách chậm lại</em></h2>
            <p className="csa-sec-sub">Từ góc cửa sổ đầy nắng đến thư viện mini yên tĩnh — chọn nơi phù hợp với việc bạn đang làm.</p>
          </div>
          <div className="csa-corner-featured" data-reveal data-reveal-d1>
            {featured.map(item => (
              <a href="/khong-gian" className="csa-corner" key={item.id}>
                <img className="csa-corner-img" src={item.image} alt={item.title} loading="lazy" />
                <div className="csa-corner-name">{item.title}</div>
                <div className="csa-corner-desc">{item.description}</div>
              </a>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <a href="/khong-gian" className="csa-btn csa-btn-accent">Khám phá toàn bộ không gian</a>
          </div>
        </div>
      </section>
    )
  }

  if (full) {
    return (
      <>
        <section className="sec-pad sec-surface" style={{ paddingTop: 0 }}>
          <div className="csa-container">
            <div className="csa-corner-grid" data-reveal>
              {corners.map(item => (
                <a href="/lien-he" className="csa-corner" key={item.id}>
                  <img className="csa-corner-img" src={item.image} alt={item.title} loading="lazy" />
                  <div className="csa-corner-name">{item.title}</div>
                  <div className="csa-corner-desc">{item.description}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="sec-pad sec-bg">
          <div className="csa-container">
            <div className="csa-sec-head center" data-reveal>
              <div className="csa-eyebrow center">Hình ảnh không gian</div>
              <h2 className="csa-sec-title">Từng khoảnh khắc <em>tại Lặng Trang</em></h2>
            </div>
            <div className="csa-gallery" data-reveal data-reveal-d1>
              {moments.map(item => (
                <figure key={item.id}>
                  <img src={item.image} alt={item.description} loading="lazy" />
                  <figcaption>{item.description}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  return null
}
