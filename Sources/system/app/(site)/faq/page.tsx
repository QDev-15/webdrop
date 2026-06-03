import Link from 'next/link'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import FaqClient from './FaqClient'

export const metadata = { title: 'FAQ — Câu hỏi thường gặp | webdrop.vn' }

export default function FAQPage() {
  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,5vw,60px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>FAQ</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
              Câu hỏi <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>thường gặp</em>
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.4)', maxWidth: 440, margin: '0 auto' }}>
              Không tìm thấy câu trả lời? <Link href="/contact" style={{ color: '#4ade80', textDecoration: 'none' }}>Liên hệ trực tiếp →</Link>
            </p>
          </div>
        </section>
        <FaqClient />
      </div>
      <Footer />
    </>
  )
}
