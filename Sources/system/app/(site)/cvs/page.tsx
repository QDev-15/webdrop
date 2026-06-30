import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/site/NavBar'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import CvsTemplateGrid from './CvsTemplateGrid'

export const metadata: Metadata = {
  title: 'Mẫu CV Online — webdrop.store',
  description: 'Tạo CV chuyên nghiệp online, chia sẻ link cho nhà tuyển dụng, export PDF/DOCX. Chỉ 59,000đ trọn gói 10 mẫu thiết kế.',
}

export default function CvsPage() {
  return (
    <>
      <NavBar />
      <RevealObserver />
      <main>
        {/* Hero */}
        <section style={{ background: '#0c0b09', padding: 'clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,80px)', textAlign: 'center' }}>
            <div className="reveal" style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#4ade80', background: 'rgba(74,222,128,.1)', padding: '5px 14px', borderRadius: 20, marginBottom: 20 }}>
              CV Online
            </div>
            <h1 className="reveal reveal-d1" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1.15 }}>
              CV chuyên nghiệp,<br />
              <em style={{ color: '#4ade80', fontStyle: 'normal' }}>gửi link thay vì file</em>
            </h1>
            <p className="reveal reveal-d2" style={{ fontSize: 17, color: 'rgba(255,255,255,.6)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Lưu CV online, cập nhật bất cứ lúc nào. Chia sẻ link cho nhà tuyển dụng — không còn gửi file đính kèm lỗi thời.
            </p>
            <div className="reveal reveal-d3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
              {['✓ 10 mẫu thiết kế', '✓ Export PDF / DOCX', '✓ Link chia sẻ riêng', '✓ Cập nhật không giới hạn'].map(f => (
                <span key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', gap: 4 }}>{f}</span>
              ))}
            </div>
            <div className="reveal reveal-d3" style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/checkout/cv" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#1a6b52', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                Đăng ký ngay
                <span style={{ background: 'rgba(255,255,255,.18)', padding: '2px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>59,000đ</span>
              </Link>
              <Link href="/cv-manager" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '14px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.75)', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Đăng nhập CV Manager →
              </Link>
            </div>
            <div className="reveal reveal-d3" style={{ marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>
              Trọn gói tất cả 10 mẫu · Đã có tài khoản?{' '}
              <Link href="/cv-manager" style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'underline' }}>Vào CV Manager</Link>
            </div>
          </div>
        </section>

        {/* Templates grid */}
        <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#faf9f7' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,80px)' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="reveal" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1a6b52', marginBottom: 12 }}>10 mẫu thiết kế</div>
              <h2 className="reveal reveal-d1" style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: '#1a1917', margin: '0 0 12px' }}>
                Chọn mẫu <em style={{ color: '#1a6b52', fontStyle: 'italic', fontWeight: 300 }}>phù hợp bạn</em>
              </h2>
              <p className="reveal reveal-d2" style={{ fontSize: 15, color: '#6b6760', maxWidth: 520, margin: '0 auto' }}>
                Tất cả đều dùng cùng dữ liệu — bạn có thể đổi mẫu bất cứ lúc nào mà không cần nhập lại. Nhấn <strong>Xem demo</strong> để xem trước từng mẫu.
              </p>
            </div>

            <CvsTemplateGrid />
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: 'clamp(60px,8vw,100px) 0', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,80px)' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 className="reveal" style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: '#1a1917', margin: '0 0 12px' }}>
                Chỉ 3 bước để có CV online
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
              {[
                { num: '01', title: 'Đăng ký & thanh toán', desc: 'Điền thông tin, chuyển khoản 59,000đ. Nhận tài khoản ngay trên màn hình thanh toán.' },
                { num: '02', title: 'Điền CV & chọn mẫu', desc: 'Đăng nhập CV Manager, điền thông tin theo từng mục, chọn 1 trong 10 mẫu thiết kế.' },
                { num: '03', title: 'Chia sẻ link & export', desc: 'Copy link gửi cho nhà tuyển dụng, hoặc export PDF/DOCX khi cần nộp file.' },
              ].map(step => (
                <div key={step.num} className="reveal" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#e8f4ef', marginBottom: 12 }}>{step.num}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1917', marginBottom: 8 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.7 }}>{step.desc}</div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ textAlign: 'center', marginTop: 56 }}>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href="/checkout/cv" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 36px', background: '#1a6b52', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                  Bắt đầu tạo CV ngay — 59,000đ
                </Link>
                <Link href="/cv-manager" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '14px 24px', background: 'transparent', border: '1px solid #e8e5df', color: '#6b6760', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Đã có tài khoản →
                </Link>
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: '#a09d97' }}>🛡️ Hoàn tiền 100% trong 7 ngày nếu không hài lòng</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
