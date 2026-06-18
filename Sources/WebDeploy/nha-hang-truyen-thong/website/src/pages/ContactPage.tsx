import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Contact from '../components/Contact'

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Liên Hệ — Nhà Hàng Ẩm Thực Truyền Thống'
  }, [])

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
