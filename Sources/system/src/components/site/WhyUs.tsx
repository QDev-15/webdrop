const DEFAULT_ITEMS = [
  { num: '01', icon: '⚡', title: 'Nhanh chóng', desc: 'Bàn giao trong 3–5 ngày làm việc, không kéo dài hàng tháng như agency truyền thống' },
  { num: '02', icon: '💎', title: 'Chất lượng cao', desc: 'Mẫu thiết kế bởi chuyên gia, responsive hoàn toàn, PageSpeed 90+, chuẩn SEO' },
  { num: '03', icon: '🛡️', title: 'An tâm tuyệt đối', desc: 'Hỗ trợ 30 ngày sau bàn giao' },
  { num: '04', icon: '📈', title: 'Đồng hành lâu dài', desc: 'Gói duy trì hàng tháng, gia hạn hosting, cập nhật nội dung — mọi thứ bạn cần' },
]

interface Props {
  eyebrow?: string; title?: string; titleEm?: string; subtitle?: string
  image?: string; caption?: string; captionSub?: string
  items?: { num: string; icon: string; title: string; desc: string }[]
}

export default function WhyUs({ eyebrow, title, titleEm, subtitle, image, caption, captionSub, items }: Props) {
  const itemsData = (items && items.length > 0) ? items : DEFAULT_ITEMS
  return (
    <section id="why" className="sec-pad position-relative" style={{ background: 'var(--dark2)' }}>
      <div className="wd-container">
        <div className="text-center sec-dark reveal mb-5">
          <div className="eyebrow">{eyebrow || 'Tại sao chọn chúng tôi'}</div>
          <h2 className="sec-title">{title || 'Không cần biết'} <em>{titleEm || 'kỹ thuật'}</em></h2>
          <p className="sec-sub">{subtitle || 'Chúng tôi lo toàn bộ. Bạn chỉ cần cung cấp nội dung và nhận website.'}</p>
        </div>
        <div className="rounded-3 overflow-hidden mb-4 reveal" style={{ height: 220, position: 'relative' }}>
          <img src={image || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop'} alt="Team làm việc" className="w-100 h-100 object-fit-cover d-block" loading="lazy" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(12,11,9,.7) 0%,rgba(12,11,9,.2) 60%,transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 24, left: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: '-.4px' }}>{caption || 'Đội ngũ chuyên nghiệp, tận tâm'}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginTop: 4, fontWeight: 300 }}>{captionSub || 'Hỗ trợ trực tiếp qua Zalo — không chatbot'}</div>
          </div>
        </div>
        <div className="why-grid reveal">
          {itemsData.map((item, i) => (
            <div key={item.num} className="why-item">
              {i < itemsData.length - 1 && <div className="wi-sep" />}
              <div className="wi-num">{item.num}</div>
              <div className="wi-icon">{item.icon}</div>
              <div className="wi-title">{item.title}</div>
              <div className="wi-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
