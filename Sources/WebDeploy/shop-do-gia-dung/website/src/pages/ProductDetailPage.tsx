import { useParams, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCart } from '../contexts/CartContext'
import { useState } from 'react'

function parseGallery(galleryJson: string): string[] {
  if (!galleryJson) return []
  try {
    const parsed = JSON.parse(galleryJson)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products, settings } = useSite()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  const product = products.find(p => p.slug === slug)

  useDocumentMeta({
    title: product?.name || 'Sản phẩm',
    description: String(product?.description || settings.site_description || ''),
  })

  if (!product) {
    return (
      <div className="dg-container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <h1>Không tìm thấy sản phẩm</h1>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image || '',
      price: product.salePrice || product.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/gio-hang')
  }

  return (
    <>
      {/* Page Hero */}
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">{product.categoryName}</p>
          <h1 className="dg-page-hero__title">{product.name}</h1>
        </div>
      </div>

      {/* Product Detail */}
      <main className="dg-container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '80px' }} className="dg-detail-grid">
          {/* Image Gallery */}
          <div className="dg-detail-image-wrap">
            {(() => {
              const galleryStr = typeof product.gallery === 'string' ? product.gallery : ''
              const gallery = parseGallery(galleryStr)
              const hasGallery = gallery.length > 0
              const images = hasGallery ? gallery : [product.image || '']
              const currentImg = images[galleryIndex] || product.image

              return (
                <div>
                  <img src={currentImg} alt={product.name} style={{ width: '100%', borderRadius: '12px', backgroundColor: 'var(--warm)', marginBottom: '12px' }} onError={e => {
                    const img = e.target as HTMLImageElement
                    img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8e5df' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3EHình ảnh không có%3C/text%3E%3C/svg%3E`
                  }} />
                  {hasGallery && images.length > 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)`, gap: '8px' }}>
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryIndex(idx)}
                          style={{
                            padding: 0,
                            border: idx === galleryIndex ? '2px solid var(--accent)' : '1px solid var(--border)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: 'none',
                            aspectRatio: '1',
                          }}
                          title={`Ảnh ${idx + 1}`}
                        >
                          <img src={img} alt={`${product.name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => {
                            const i = e.target as HTMLImageElement
                            i.style.display = 'none'
                          }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Info */}
          <div className="dg-detail-info">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '12px', fontFamily: 'Fraunces' }}>{product.name}</h2>
              {product.rating && <p style={{ color: 'var(--text-2)', marginBottom: '16px' }}>⭐ {product.rating} sao · Đã bán {product.sold || 0}</p>}
            </div>

            {/* Price */}
            <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: 'var(--warm)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <span style={{ fontSize: '32px', fontWeight: '600', color: 'var(--text)' }}>
                  {product.salePrice ? (product.salePrice).toLocaleString('vi-VN') : (product.price).toLocaleString('vi-VN')}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-3)' }}>đ</span>
              </div>
              {product.salePrice && (
                <p style={{ color: 'var(--text-3)', textDecoration: 'line-through' }}>
                  {(product.price).toLocaleString('vi-VN')}đ
                </p>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Chi tiết sản phẩm</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.6', marginBottom: '16px' }}>{product.description}</p>

              {product.material && <p><strong>Chất liệu:</strong> {product.material}</p>}
              {product.colorName && <p><strong>Màu sắc:</strong> {product.colorName}</p>}
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button className="dg-btn dg-btn-primary" onClick={handleAddToCart}>
                {added ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ'}
              </button>
              <button className="dg-btn dg-btn-secondary" onClick={handleBuyNow}>Mua ngay</button>
            </div>

            {/* Support Info */}
            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '4px' }}>Miễn phí vận chuyển</p>
                <p style={{ fontWeight: '600' }}>Từ 500K trở lên</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '4px' }}>Đổi trả</p>
                <p style={{ fontWeight: '600' }}>Trong 30 ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Demo */}
        {(() => {
          const youtubeId = extractYouTubeId((product.video_url as string) || '')
          return youtubeId ? (
            <div style={{ marginBottom: '80px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', fontFamily: 'Fraunces' }}>Video mô tả sản phẩm</h2>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: 'var(--warm)', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                  title="Product video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null
        })()}

        {/* Related Products */}
        <section style={{ marginTop: '80px', borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '32px', fontFamily: 'Fraunces' }}>Sản phẩm cùng danh mục</h2>
          <div className="dg-grid dg-grid--4">
            {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(p => (
              <div key={p.id} className="dg-card">
                <a href={`/san-pham/${p.slug}`} className="dg-card-link">
                  <div className="dg-card-image">
                    <img src={p.image} alt={p.name} onError={e => {
                      const img = e.target as HTMLImageElement
                      img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e8e5df' width='200' height='200'/%3E%3C/svg%3E`
                    }} />
                  </div>
                  <h3 className="dg-card-name">{p.name}</h3>
                  <p className="dg-card-price">{(p.salePrice || p.price).toLocaleString('vi-VN')}đ</p>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
