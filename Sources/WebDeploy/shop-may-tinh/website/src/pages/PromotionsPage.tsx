import { Link } from 'react-router-dom'

const PROMOS = [
  {
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    tag: '-15%', tagBg: 'linear-gradient(135deg,#6d5ef8,#22d3ee)', tagColor: '#fff',
    title: 'Flash Sale PC Gaming',
    desc: 'Giảm 15% cho các cấu hình PC Gaming dựng sẵn — số lượng có hạn.',
  },
  {
    image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=500&auto=format&fit=crop&q=80',
    tag: 'Combo', tagBg: 'var(--cyan)', tagColor: '#0f1029',
    title: 'Combo Laptop + Phụ Kiện',
    desc: 'Mua laptop tặng ngay chuột và balo chống sốc trị giá đến 800.000đ.',
  },
  {
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=500&auto=format&fit=crop&q=80',
    tag: 'Sinh viên', tagBg: 'var(--accent)', tagColor: '#fff',
    title: 'Ưu Đãi Sinh Viên',
    desc: 'Giảm thêm 5% cho sinh viên khi xuất trình thẻ sinh viên còn hiệu lực.',
  },
]

export default function PromotionsPage() {
  return (
    <>
      <div className="mt-page-header" style={{ paddingBottom: 52 }}>
        <div className="mt-container">
          <nav className="mt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Khuyến mãi</span>
          </nav>
          <h1 className="mt-page-title">Khuyến Mãi</h1>
          <p className="mt-page-count" style={{ fontSize: 16 }}>Những ưu đãi đang diễn ra — đừng bỏ lỡ</p>
        </div>
      </div>

      <main>
        <section className="mt-sec">
          <div className="mt-container">
            <div className="row g-4">
              {PROMOS.map((p, i) => (
                <div className="col-md-4" data-reveal data-delay={String(i)} key={p.title}>
                  <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.3)' }}>
                    <div style={{ aspectRatio: '4/3', position: 'relative' }}>
                      <img src={p.image} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 14, left: 14, background: p.tagBg, color: p.tagColor, fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 999 }}>{p.tag}</div>
                    </div>
                    <div style={{ padding: 24 }}>
                      <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>{p.desc}</p>
                      <Link to="/san-pham" className="mt-btn mt-btn-outline">Mua ngay <i className="bi bi-arrow-right ms-1" /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
