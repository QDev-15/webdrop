import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import ContactClient from './ContactClient'
import { prisma } from '@/lib/prisma'

async function getContactInfo() {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['site_phone', 'site_email', 'site_address', 'social_zalo', 'working_hours'] } },
    })
    const map = Object.fromEntries(rows.map(r => [r.key, r.value ?? '']))
    return {
      address:      map['site_address']  || '',
      phone:        map['site_phone']    || '',
      email:        map['site_email']    || '',
      zalo:         map['social_zalo']   || '',
      workingHours: map['working_hours'] || '8:00–18:00 · T2–T7',
    }
  } catch {
    return { address: '', phone: '', email: '', zalo: '', workingHours: '8:00–18:00 · T2–T7' }
  }
}

export default async function ContactPage() {
  const info = await getContactInfo()

  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        {/* Hero */}
        <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,6vw,60px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Liên hệ</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
              Hãy cùng <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>trao đổi</em>
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: 460, margin: '0 auto' }}>
              Phản hồi trong vòng 2 giờ làm việc (8:00–18:00, Thứ 2–Thứ 7)
            </p>
          </div>
        </section>

        <ContactClient info={info} />
      </div>
      <Footer />
    </>
  )
}
