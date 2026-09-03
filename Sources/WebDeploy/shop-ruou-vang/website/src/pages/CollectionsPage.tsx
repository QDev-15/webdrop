import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CollectionsPage() {
  useDocumentMeta({
    title: 'Bộ sưu tập — Mộc Vang',
    description: 'Khám phá các bộ sưu tập rượu vang được Mộc Vang tuyển chọn theo xuất xứ, dịp dùng và ngân sách.',
  })

  return (
    <>
      <section className="rv-page-hero">
        <div className="rv-page-hero-bg"><img src="https://images.unsplash.com/photo-1567072629554-20e689de2400?w=1600&auto=format&fit=crop&q=80" alt="" /></div>
        <div className="wd-container rv-page-hero-content">
          <div className="rv-eyebrow">Tuyển chọn theo chủ đề</div>
          <h1>Bộ sưu tập rượu vang</h1>
          <p>Mỗi bộ sưu tập được đội ngũ sommelier Mộc Vang tuyển chọn riêng theo xuất xứ, dịp dùng và ngân sách — bấm vào để xem toàn bộ sản phẩm đã được lọc sẵn.</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="rv-bento">
            <Link to="/?collection=vang-phap" className="rv-bento-item big" data-reveal style={{ background: "url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&auto=format&fit=crop&q=80') center/cover" }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(28,18,16,.85),transparent 60%)' }}></div>
              <div style={{ position: 'relative', color: '#fff' }}>
                <h5 style={{ fontSize: 24 }}>Vang Pháp thượng hạng</h5>
                <p style={{ color: 'rgba(255,255,255,.75)' }}>Bordeaux, Médoc, Margaux &amp; hơn thế — 7 nhãn hiệu tuyển chọn</p>
              </div>
            </Link>
            <Link to="/?collection=qua-tang-doanh-nhan" className="rv-bento-item" data-reveal data-delay="1" style={{ background: "url('https://images.unsplash.com/photo-1694481901573-a970f982ac5e?w=700&auto=format&fit=crop&q=80') center/cover" }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(28,18,16,.8),transparent 60%)' }}></div>
              <div style={{ position: 'relative', color: '#fff' }}><h5>Quà tặng doanh nhân</h5></div>
            </Link>
            <Link to="/?collection=vang-sui-le-hoi" className="rv-bento-item" data-reveal data-delay="2" style={{ background: "url('https://images.unsplash.com/photo-1446822775955-c34f483b410b?w=700&auto=format&fit=crop&q=80') center/cover" }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(28,18,16,.8),transparent 60%)' }}></div>
              <div style={{ position: 'relative', color: '#fff' }}><h5>Vang sủi lễ hội</h5></div>
            </Link>
            <Link to="/?collection=tiec-cuoi-su-kien" className="rv-bento-item" data-reveal data-delay="3" style={{ background: "url('https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=700&auto=format&fit=crop&q=80') center/cover" }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(28,18,16,.8),transparent 60%)' }}></div>
              <div style={{ position: 'relative', color: '#fff' }}><h5>Tiệc cưới &amp; sự kiện</h5></div>
            </Link>
            <Link to="/?collection=suu-tam-cao-cap" className="rv-bento-item" data-reveal style={{ background: "url('https://images.unsplash.com/photo-1568930157403-9ad464e5f075?w=700&auto=format&fit=crop&q=80') center/cover" }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(28,18,16,.8),transparent 60%)' }}></div>
              <div style={{ position: 'relative', color: '#fff' }}><h5>Sưu tầm cao cấp</h5></div>
            </Link>
            <Link to="/?collection=duoi-400k" className="rv-bento-item big" data-reveal data-delay="1" style={{ background: "url('https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=900&auto=format&fit=crop&q=80') center/cover" }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(28,18,16,.85),transparent 60%)' }}></div>
              <div style={{ position: 'relative', color: '#fff' }}>
                <h5 style={{ fontSize: 24 }}>Dưới 400K mỗi ngày</h5>
                <p style={{ color: 'rgba(255,255,255,.75)' }}>Vang ngon, giá hợp lý — uống hàng ngày không tiếc tay</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="rv-fullbleed">
        <img src="https://images.unsplash.com/photo-1558138818-34316d616e44?w=1600&auto=format&fit=crop&q=80" alt="Hầm rượu Mộc Vang" />
        <div className="rv-fullbleed-overlay">
          <h3>Không tìm thấy bộ sưu tập phù hợp? Xem toàn bộ 48 nhãn hiệu vang tại danh mục chính.</h3>
        </div>
      </div>

      <section className="sec-pad" style={{ textAlign: 'center' }}>
        <div className="wd-container">
          <Link to="/" className="rv-btn rv-btn-solid">Xem tất cả sản phẩm</Link>
        </div>
      </section>
    </>
  )
}
