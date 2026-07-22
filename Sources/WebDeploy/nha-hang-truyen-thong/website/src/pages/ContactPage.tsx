import Header from '../components/Header'
import Footer from '../components/Footer'
import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  useDocumentMeta({
    title: 'Liên Hệ — Nhà Hàng Ẩm Thực Truyền Thống',
    description: 'Liên hệ Nhà Hàng Ẩm Thực Truyền Thống — địa chỉ, số điện thoại, giờ mở cửa. Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn.',
  })

  return (
    <>
      <Header />
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Liên hệ</div>
          <h1 className="ph-title">Chúng tôi luôn <em>lắng nghe</em></h1>
          <p className="ph-sub">Hãy ghé thăm hoặc gọi cho chúng tôi — đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn.</p>
        </div>
      </section>
      <Contact />
      <Footer />
    </>
  )
}
