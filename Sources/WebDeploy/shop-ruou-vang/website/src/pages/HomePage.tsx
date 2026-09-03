import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Testimonial } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'
import ProductsPage from './ProductsPage'

const COLLECTIONS = [
  { collection: 'vang-phap', label: '7 nhãn hiệu', title: 'Vang Pháp thượng hạng', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&auto=format&fit=crop&q=80' },
  { collection: 'qua-tang-doanh-nhan', label: 'Quà tặng', title: 'Set quà doanh nhân', image: 'https://images.unsplash.com/photo-1694481901573-a970f982ac5e?w=700&auto=format&fit=crop&q=80' },
  { collection: 'vang-sui-le-hoi', label: '8 nhãn hiệu', title: 'Vang sủi lễ hội', image: 'https://images.unsplash.com/photo-1446822775955-c34f483b410b?w=700&auto=format&fit=crop&q=80' },
  { collection: 'suu-tam-cao-cap', label: 'Hiếm & lâu năm', title: 'Sưu tầm cao cấp', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=700&auto=format&fit=crop&q=80' },
  { collection: 'duoi-400k', label: 'Giá tốt', title: 'Dưới 400K mỗi ngày', image: 'https://images.unsplash.com/photo-1568930157403-9ad464e5f075?w=700&auto=format&fit=crop&q=80' },
]

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const step = Math.ceil(value / 60)
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + step, value)
      setDisplay(cur)
      if (cur >= value) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [value])
  return (
    <div data-reveal>
      <div className="rv-stat-num">{display}{suffix}</div>
      <div className="rv-stat-label">{label}</div>
    </div>
  )
}

export default function HomePage() {
  const { settings } = useSite()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useDocumentMeta({
    title: settings.meta_title || 'Mộc Vang — Rượu Vang Nhập Khẩu Chính Hãng',
    description: settings.meta_description || 'Mộc Vang — cửa hàng rượu vang nhập khẩu chính hãng: vang đỏ, vang trắng, vang sủi, vang hồng & set quà tặng từ Pháp, Ý, Chile, Tây Ban Nha, Úc, Argentina, Mỹ.',
  })

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  return (
    <>
      <HeroSlider />

      <section className="rv-trust">
        <div className="wd-container rv-trust-grid">
          <div className="rv-trust-item" data-reveal>
            <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z" /><path d="m9 12 2 2 4-4" /></svg></div>
            <div><strong>Hàng chính hãng 100%</strong><span>Chứng từ nhập khẩu đầy đủ</span></div>
          </div>
          <div className="rv-trust-item" data-reveal data-delay="1">
            <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="1.8" /><circle cx="18.5" cy="18.5" r="1.8" /></svg></div>
            <div><strong>Giao nhanh 2 giờ</strong><span>Nội thành Hà Nội, TP.HCM</span></div>
          </div>
          <div className="rv-trust-item" data-reveal data-delay="2">
            <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg></div>
            <div><strong>Đổi trả trong 24h</strong><span>Nếu vỡ, lỗi vận chuyển</span></div>
          </div>
          <div className="rv-trust-item" data-reveal data-delay="3">
            <div className="rv-trust-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-8h3Z" /><path d="M3 19a2 2 0 0 0 2 2h1v-8H3Z" /></svg></div>
            <div><strong>Tư vấn sommelier</strong><span>Miễn phí trước khi mua</span></div>
          </div>
        </div>
      </section>

      <ProductsPage />

      <section className="sec-pad" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="rv-sec-head" data-reveal>
            <div className="rv-eyebrow">Gợi ý cho bạn</div>
            <h2 className="rv-sec-title">Bộ sưu tập <span>nổi bật</span></h2>
          </div>
          <div className="rv-hscroll" data-reveal data-delay="1">
            {COLLECTIONS.map(c => (
              <Link key={c.collection} to={`/?collection=${c.collection}`} className="rv-collection-card">
                <img src={c.image} alt={c.title} loading="lazy" />
                <div className="rv-collection-overlay"><span>{c.label}</span><h4>{c.title}</h4></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="wd-container">
          <div className="rv-strip" data-reveal>
            <div className="rv-strip-img"><img src="https://images.unsplash.com/photo-1472352327492-9765783b74e1?w=800&auto=format&fit=crop&q=80" alt="Nhập khẩu trực tiếp từ nhà làm rượu" loading="lazy" /></div>
            <div className="rv-strip-body">
              <div className="rv-strip-num">01</div>
              <h3>Nhập khẩu trực tiếp<br />từ nhà làm rượu</h3>
              <p>Mộc Vang làm việc trực tiếp với hơn 40 nhà rượu (château, cantina, bodega, viña) tại 7 quốc gia — không qua trung gian, đảm bảo giá tốt và nguồn gốc minh bạch cho từng chai.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5" /></svg> Chứng từ nhập khẩu (C/O, tem phụ) đầy đủ mỗi lô hàng</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6 9 17l-5-5" /></svg> Vận chuyển container lạnh xuyên suốt hành trình</li>
              </ul>
            </div>
          </div>
          <div className="rv-strip reverse" data-reveal>
            <div className="rv-strip-body">
              <div className="rv-strip-num">02</div>
              <h3>Bảo quản chuẩn<br />hầm rượu 16°C</h3>
              <p>Toàn bộ kho lưu trữ được kiểm soát nhiệt độ 14–16°C, độ ẩm 65–75% theo tiêu chuẩn cellar quốc tế — giữ trọn hương vị nguyên bản đến tay khách hàng.</p>
              <Link to="/ve-chung-toi" className="rv-btn rv-btn-outline" style={{ marginTop: 6 }}>Xem quy trình đầy đủ →</Link>
            </div>
            <div className="rv-strip-img"><img src="https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&auto=format&fit=crop&q=80" alt="Hầm rượu bảo quản 16 độ C" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section className="rv-statbar">
        <div className="wd-container rv-stats-grid">
          <Stat value={200} suffix="+" label="Nhãn hiệu vang" />
          <Stat value={7} suffix="" label="Quốc gia xuất xứ" />
          <Stat value={12800} suffix="+" label="Khách hàng đã phục vụ" />
          <Stat value={10} suffix="+" label="Năm kinh nghiệm" />
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="rv-sec-head center" data-reveal>
            <div className="rv-eyebrow">Khách hàng nói gì</div>
            <h2 className="rv-sec-title">Được tin dùng bởi <span>hàng ngàn khách</span></h2>
          </div>
          <div className="rv-testi-list" style={{ maxWidth: 820, margin: '0 auto' }}>
            {testimonials.map((t, i) => (
              <div className="rv-testi-item" data-reveal data-delay={String(Math.min(i, 3))} key={t.id}>
                <div className="rv-testi-avatar"><img src={t.author_avatar} alt={`Khách hàng ${t.author_name}`} loading="lazy" /></div>
                <div>
                  <div className="rv-testi-stars">{'★'.repeat(t.rating)}</div>
                  <p className="rv-testi-quote">&quot;{t.content}&quot;</p>
                  <div className="rv-testi-name">{t.author_name}</div>
                  <div className="rv-testi-role">{t.author_role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
