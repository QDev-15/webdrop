import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import HeroSlider from '../components/HeroSlider'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  const { products } = useSite()
  const { addItem } = useCart()
  useDocumentMeta({ title: 'KidZone — Shop Đồ Chơi Trẻ Em Chất Lượng Cao', description: 'Hơn 500 loại đồ chơi an toàn, chất lượng cho bé từ 0–12 tuổi. Miễn phí vận chuyển, đổi trả 30 ngày.' })

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  // Group products by theme
  const themes = ['ban-chay', 'do-choi-giao-duc', 'hang-moi', 'dang-giam']
  const themeLabels: Record<string, string> = {
    'ban-chay': 'Bán chạy nhất',
    'do-choi-giao-duc': 'Đồ chơi giáo dục',
    'hang-moi': 'Hàng mới về',
    'dang-giam': 'Đang giảm giá'
  }

  const getSectionProducts = (theme: string) => {
    return products.filter(p => p.theme && p.theme.includes(theme)).slice(0, 12)
  }

  const handleAddCart = (product: typeof products[0]) => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
    })
  }

  return (
    <div className="dc-page-wrap">
      <HeroSlider />

      {/* Sections by theme */}
      {themes.map(theme => {
        const sectionProducts = getSectionProducts(theme)
        if (sectionProducts.length === 0) return null
        return (
          <section key={theme} className="dc-section" data-reveal style={{ padding: '48px 0' }}>
            <div className="dc-container">
              <h2 className="dc-section-title">{themeLabels[theme]}</h2>
              <div className="dc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                {sectionProducts.map(product => (
                  <div key={product.id} className="dc-prod-card" style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', transition: 'all .2s' }}>
                    <Link to={`/san-pham/${product.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: '#f5f5f5' }}>
                        <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        {product.price_sale && <span style={{ position: 'absolute', top: 8, right: 8, background: 'var(--accent)', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>-{Math.round((1 - (product.price_sale / product.price)) * 100)}%</span>}
                      </div>
                      <div style={{ padding: 12 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, lineHeight: 1.2 }}>{product.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>
                            {fmt(product.price_sale || product.price)}
                          </span>
                          {product.price_sale && <span style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'line-through' }}>{fmt(product.price)}</span>}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleAddCart(product)}
                      style={{ width: '100%', padding: '8px 12px', background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link to={`/san-pham?theme=${theme}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                  Xem tất cả ({sectionProducts.length}+) →
                </Link>
              </div>
            </div>
          </section>
        )
      })}

      {/* Collections */}
      <section className="dc-section" data-reveal style={{ padding: '64px 0', background: 'var(--warm)' }}>
        <div className="dc-container">
          <h2 className="dc-section-title">Bộ sưu tập</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { name: 'Hàng hot tuần', desc: 'Sản phẩm bán chạy nhất tuần này' },
              { name: 'Giáo dục & Phát triển', desc: 'Đồ chơi giúp bé học tập, sáng tạo' },
              { name: 'An toàn cho bé', desc: 'Sản phẩm đã kiểm chứng chất lượng, an toàn' }
            ].map((col, i) => (
              <div key={i} style={{ padding: 32, background: 'white', borderRadius: 12, textAlign: 'center' }}>
                <h3 style={{ marginBottom: 8 }}>{col.name}</h3>
                <p style={{ color: 'var(--text-2)', marginBottom: 20, fontSize: 14 }}>{col.desc}</p>
                <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Khám phá →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="dc-section" data-reveal style={{ padding: '64px 0' }}>
        <div className="dc-container">
          <h2 className="dc-section-title">Tại sao chọn KidZone?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { icon: '✓', title: 'Chất lượng đảm bảo', desc: 'Tất cả sản phẩm được kiểm định an toàn' },
              { icon: '🚚', title: 'Giao hàng nhanh', desc: 'Miễn phí ship từ 300k, giao trong 2–3 ngày' },
              { icon: '↩️', title: 'Đổi trả dễ dàng', desc: 'Đổi trả 30 ngày nếu không hài lòng' },
              { icon: '💰', title: 'Giá hợp lý', desc: 'Giá tốt nhất thị trường, ưu đãi thường xuyên' }
            ].map((item, i) => (
              <div key={i} style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="dc-section" data-reveal style={{ padding: '64px 0', background: 'var(--warm)' }}>
        <div className="dc-container">
          <h2 className="dc-section-title">Đánh giá từ khách hàng</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Nguyễn Hoa', rating: 5, text: 'Đồ chơi chất lượng, bé rất thích. Giao hàng nhanh, đóng gói cẩn thận.' },
              { name: 'Trần Minh', rating: 5, text: 'Shop phục vụ tốt, sản phẩm nhiều. Giá cạnh tranh so với các shop khác.' },
              { name: 'Lê Vân', rating: 5, text: 'Rất hài lòng với dịch vụ. Sẽ tiếp tục mua và giới thiệu cho bạn bè.' }
            ].map((testi, i) => (
              <div key={i} style={{ padding: 20, background: 'white', borderRadius: 12 }}>
                <div style={{ marginBottom: 12 }}>{'⭐'.repeat(testi.rating)}</div>
                <p style={{ marginBottom: 12, fontStyle: 'italic' }}>"{testi.text}"</p>
                <p style={{ fontWeight: 600 }}>— {testi.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
