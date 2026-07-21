import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function LienHePage() {
  useDocumentMeta({
    title: 'Liên hệ — Nha Khoa Chỉnh Nha Sài Gòn',
    description: 'Liên hệ Nha Khoa Chỉnh Nha Sài Gòn để được tư vấn về niềng răng, chỉnh nha công nghệ số. Chúng tôi phản hồi trong 30 phút.',
  })
  return (
    <>
      <div className="cn-page-hero">
        <div className="wd-container">
          <div className="cn-ph-badge">Liên hệ</div>
          <h1 className="cn-ph-title">Liên hệ & <em>Đặt lịch</em></h1>
          <p className="cn-ph-sub">Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc về niềng răng và chỉnh nha. Phản hồi trong 30 phút.</p>
        </div>
      </div>
      <Contact />
    </>
  )
}
