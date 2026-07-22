import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function MenuPage() {
  useDocumentMeta({
    title: 'Thực Đơn — Nhà Hàng Ẩm Thực Truyền Thống',
    description: 'Hơn 70 món ăn gia truyền: khai vị, món chính, tráng miệng, đồ uống. Chế biến mỗi ngày từ nguyên liệu tươi sạch, không bột ngọt, không chất bảo quản.',
  })

  return (
    <>
      <Header />
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Thực đơn</div>
          <h1 className="ph-title">Hơn 70 món ăn <em>gia truyền</em></h1>
          <p className="ph-sub">Tất cả được chế biến mỗi ngày từ nguyên liệu tươi sạch, không bột ngọt, không chất bảo quản.</p>
        </div>
      </section>
      <Menu />
      <section className="cta-sec">
        <div className="wd-container" style={{ position: 'relative' }}>
          <h2 className="cta-title">Sẵn sàng thưởng thức?</h2>
          <p className="cta-sub">Đặt bàn trước để có chỗ ngồi tốt nhất — đặc biệt vào cuối tuần.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/dat-ban" className="btn-white">Đặt bàn ngay →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
