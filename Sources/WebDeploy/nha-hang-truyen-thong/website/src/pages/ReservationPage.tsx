import Header from '../components/Header'
import Footer from '../components/Footer'
import Reservation from '../components/Reservation'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ReservationPage() {
  useDocumentMeta({
    title: 'Đặt Bàn — Nhà Hàng Ẩm Thực Truyền Thống',
    description: 'Đặt bàn trước để có chỗ ngồi đẹp nhất tại Nhà Hàng Ẩm Thực Truyền Thống. Xác nhận qua điện thoại trong vòng 30 phút.',
  })

  return (
    <>
      <Header />
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Đặt bàn trước</div>
          <h1 className="ph-title">Giữ chỗ để <em>thưởng thức</em></h1>
          <p className="ph-sub">Đặt bàn trước để có chỗ ngồi đẹp nhất. Xác nhận qua điện thoại trong vòng 30 phút.</p>
        </div>
      </section>
      <Reservation />
      <Footer />
    </>
  )
}
