import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CollectionPage() {
  useDocumentMeta({ title: 'Bộ sưu tập — KidZone Shop Đồ Chơi' })

  const collections = [
    {
      slug: 'do-choi-giao-duc',
      name: 'Đồ chơi giáo dục',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
      description: 'Khám phá bộ sưu tập đồ chơi giáo dục được thiết kế để phát triển kỹ năng và trí tuệ của trẻ.',
      productCount: 7,
      ageRange: '0–9 tuổi',
    },
    {
      slug: 'xe-mo-hinh',
      name: 'Xe & Mô hình',
      image: 'https://images.unsplash.com/photo-1594787318286-3d835c1cab83?w=800&auto=format&fit=crop&q=80',
      description: 'Tập hợp các mô hình xe đẹp và chi tiết từ thương hiệu uy tín, phù hợp cho các bé thích sưu tầm.',
      productCount: 9,
      ageRange: '3–12 tuổi',
    },
    {
      slug: 'lego-xep-hinh',
      name: 'Lego & Xếp hình',
      image: 'https://images.unsplash.com/photo-1543269865-cbdf26cecb46?w=800&auto=format&fit=crop&q=80',
      description: 'Bộ sưu tập xếp hình và lego đa dạng, giúp trẻ phát triển sáng tạo và tư duy không gian.',
      productCount: 12,
      ageRange: '4–14 tuổi',
    },
  ]

  return (
    <div className="dc-page-wrap">
      <div className="dc-page-hero">
        <div className="dc-container">
          <h1>Bộ sưu tập đồ chơi</h1>
          <p>Được tuyển chọn theo chủ đề, phù hợp từng lứa tuổi</p>
        </div>
      </div>

      <section className="dc-section">
        <div className="dc-container">
          <div className="dc-collection-grid">
            {collections.map(collection => (
              <article key={collection.slug} className="dc-collection-card">
                <Link to={`/san-pham?category=${collection.slug}`} className="dc-collection-img-link">
                  <div className="dc-collection-img-wrap">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      width={800}
                      height={600}
                      onError={e => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect width=%22800%22 height=%22600%22 fill=%22%23e0f4fb%22/%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                </Link>
                <div className="dc-collection-body">
                  <div className="dc-eyebrow">Khám phá</div>
                  <h2>{collection.name}</h2>
                  <p className="dc-collection-desc">{collection.description}</p>
                  <div className="dc-collection-meta">
                    <span>{collection.productCount} sản phẩm</span>
                    <span className="dc-meta-sep">·</span>
                    <span>{collection.ageRange}</span>
                  </div>
                  <Link to={`/san-pham?category=${collection.slug}`} className="dc-collection-cta">
                    Xem bộ sưu tập →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
