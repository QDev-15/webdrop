import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  image: string
  alt_text: string
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then(setItems).catch(() => {})
  }, [])

  return (
    <section className="sec-pad" style={{ background: 'var(--bg-2)' }}>
      <div className="wd-container">
        <div className="row align-items-end mb-5">
          <div className="col-md-7" data-reveal>
            <div className="tb-eyebrow">Gallery</div>
            <h2 className="tb-title mb-0">Tác phẩm <em>của chúng tôi</em></h2>
          </div>
          <div className="col-md-5 text-md-end mt-3 mt-md-0" data-reveal data-delay="1">
            <p className="tb-sub mb-0" style={{ marginLeft: 'auto' }}>Mỗi kiểu tóc là một câu chuyện riêng — xem thêm trên trang Instagram của chúng tôi.</p>
          </div>
        </div>
        <div className="tb-gallery-bento" data-reveal>
          {items.map(g => (
            <div className="tb-gb-item" key={g.id}>
              <img src={g.image} alt={g.alt_text} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
