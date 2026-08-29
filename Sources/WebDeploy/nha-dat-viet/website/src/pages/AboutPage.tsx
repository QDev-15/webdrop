import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useApiList } from '../hooks/useApiList'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import StatBar from '../components/StatBar'
import type { Agent } from '../types'

const CORE_VALUES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    title: 'Minh bạch',
    desc: 'Công khai đầy đủ thông tin pháp lý, giá cả, tình trạng giao dịch — không đăng tin ảo, không giấu giếm.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    title: 'Tận tâm',
    desc: 'Luôn đặt lợi ích khách hàng lên hàng đầu, đồng hành từ tìm kiếm đến sau khi giao dịch hoàn tất.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg>,
    title: 'Chuyên nghiệp',
    desc: 'Đội ngũ được đào tạo bài bản về pháp lý và kỹ năng tư vấn, cập nhật thị trường liên tục.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    title: 'Hiệu quả',
    desc: 'Ứng dụng công cụ số hóa (tính vay, lọc tìm kiếm) giúp khách hàng ra quyết định nhanh và chính xác hơn.',
  },
]

const DEALS = [
  { tag: 'Bình Thạnh', title: 'Căn hộ 3PN Vinhomes Central Park', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80', desc: 'Hỗ trợ khách hàng bán thành công trong 18 ngày với giá thương lượng tăng 3% so với giá chào ban đầu, hoàn tất sang tên sổ hồng chỉ sau 20 ngày.' },
  { tag: 'Phú Nhuận', title: 'Nhà phố mặt tiền Phan Xích Long', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&auto=format&fit=crop&q=80', desc: 'Kết nối thành công giữa chủ nhà cần bán gấp và nhà đầu tư đang tìm mặt bằng kinh doanh, hoàn tất đặt cọc chỉ sau buổi xem nhà đầu tiên.' },
  { tag: 'Quận 7', title: 'Biệt thự đơn lập Phú Mỹ Hưng', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&auto=format&fit=crop&q=80', desc: 'Tư vấn khách hàng nước ngoài hoàn tất thủ tục mua nhà theo đúng quy định pháp luật, hỗ trợ phiên dịch và làm việc với ngân hàng trong suốt quá trình.' },
]

export default function AboutPage() {
  useDocumentMeta({
    title: 'Giới thiệu Nhà Đất Việt — Sàn giao dịch bất động sản TP.HCM',
    description: 'Nhà Đất Việt thành lập 2017, hơn 9 năm hoạt động trong lĩnh vực môi giới bất động sản tại TP.HCM với hơn 860 giao dịch thành công. Tìm hiểu đội ngũ và giá trị cốt lõi của chúng tôi.',
  })
  const { settings } = useSite()
  const { items: agents } = useApiList<Agent>('/public/agents')
  const bannerImg = settings.banner_about || 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1600&auto=format&fit=crop&q=80'

  return (
    <>
      <section className="ndv-page-header" style={{ backgroundImage: `url('${bannerImg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="ndv-container ndv-page-header-in">
          <div className="ndv-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Giới thiệu</span></div>
          <h1>Về {settings.site_name || 'Nhà Đất Việt'}</h1>
          <p>Đồng hành cùng khách hàng tìm đúng bất động sản phù hợp — minh bạch, tận tâm, chuyên nghiệp.</p>
        </div>
      </section>

      {/* Câu chuyện */}
      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-strip" data-reveal="">
            <div className="ndv-strip-img"><img src={settings.about_story_image} alt={`Văn phòng ${settings.site_name || 'Nhà Đất Việt'}`} loading="lazy" /></div>
            <div className="ndv-strip-content">
              <div className="ndv-eyebrow">Câu chuyện của chúng tôi</div>
              <h3 style={{ fontSize: 26 }}>{settings.about_story_title}</h3>
              <p>{settings.about_story_text1}</p>
              <p style={{ marginTop: 14 }}>{settings.about_story_text2}</p>
            </div>
          </div>
        </div>
      </section>

      <StatBar items={[
        { value: Number(settings.stat_listings || 1250), suffix: '+', label: 'Tin đăng đã xử lý' },
        { value: Number(settings.stat_deals || 860), suffix: '+', label: 'Giao dịch thành công' },
        { value: Number(settings.stat_agents_count || 20), suffix: '+', label: 'Chuyên viên tư vấn' },
        { value: Number(settings.stat_experience_years || 9), suffix: '', label: 'Năm kinh nghiệm' },
      ]} />

      {/* Giá trị cốt lõi */}
      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-sec-head-center ndv-text-center" style={{ margin: '0 auto 48px', maxWidth: 640 }} data-reveal="">
            <div className="ndv-eyebrow" style={{ justifyContent: 'center' }}>Giá trị cốt lõi</div>
            <h2 className="ndv-title">Điều làm nên <em>{settings.site_name || 'Nhà Đất Việt'}</em></h2>
          </div>
          <div className="ndv-feature-row">
            {CORE_VALUES.map((v, i) => (
              <div className="ndv-feature-item" key={v.title} data-reveal="" data-delay={i > 0 ? Math.min(i, 3) : undefined}>
                <div className="ndv-feature-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Đội ngũ */}
      <section className="ndv-sec ndv-bg-alt">
        <div className="ndv-container">
          <div className="ndv-sec-head-center ndv-text-center" style={{ margin: '0 auto 40px', maxWidth: 640 }} data-reveal="">
            <div className="ndv-eyebrow" style={{ justifyContent: 'center' }}>Đội ngũ</div>
            <h2 className="ndv-title">Chuyên viên tư vấn <em>giàu kinh nghiệm</em></h2>
          </div>
          <div className="ndv-team-grid">
            {agents.map(a => (
              <div className="ndv-team-card" key={a.id} data-reveal="">
                <div className="ndv-team-avatar"><img src={a.avatar} alt={a.name} loading="lazy" /></div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{a.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>{a.title}</p>
                <a href={`tel:${a.phone.replace(/\s/g, '')}`} className="ndv-btn ndv-btn-ghost ndv-btn-sm ndv-btn-block">{a.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thương vụ đã môi giới thành công */}
      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-sec-head-center ndv-text-center" style={{ margin: '0 auto 40px', maxWidth: 640 }} data-reveal="">
            <div className="ndv-eyebrow" style={{ justifyContent: 'center' }}>Thành tích</div>
            <h2 className="ndv-title">Thương vụ đã <em>môi giới thành công</em></h2>
          </div>
          <div className="ndv-deal-row">
            {DEALS.map((d, i) => (
              <div className="ndv-deal-card" key={d.title} data-reveal="" data-delay={i > 0 ? Math.min(i, 3) : undefined}>
                <div className="ndv-deal-img"><img src={d.img} alt={d.title} loading="lazy" /></div>
                <div className="ndv-deal-body">
                  <span className="ndv-deal-tag">{d.tag}</span>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ndv-sec-sm">
        <div className="ndv-container">
          <div className="ndv-cta-band" data-reveal="">
            <div>
              <h3>Muốn hợp tác cùng {settings.site_name || 'Nhà Đất Việt'}?</h3>
              <p>Ký gửi bất động sản hoặc tìm cơ hội nghề nghiệp trong lĩnh vực môi giới cùng chúng tôi.</p>
            </div>
            <div className="ndv-cta-band-actions">
              <Link to="/lien-he" className="ndv-btn ndv-btn-primary">Liên hệ ngay</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
