import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useProperties } from '../hooks/useProperties'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'
import PropertyCard from '../components/PropertyCard'
import StatBar from '../components/StatBar'
import TestimonialsList from '../components/TestimonialsList'
import FaqAccordion from '../components/FaqAccordion'
import { DISTRICTS } from '../data/propertyMeta'
import { useApiList } from '../hooks/useApiList'
import type { Testimonial, Faq } from '../types'
import {
  IconPin, IconShield, IconPhone as IconSupport, IconArea as IconLoan, IconCheck as IconData,
} from '../components/icons'

type HomeTab = 'hot' | 'moi' | 'gia-tot'

export default function HomePage() {
  useDocumentMeta({
    title: 'Nhà Đất Việt — Sàn giao dịch bất động sản TP.HCM | Mua bán, cho thuê nhà đất',
    description: 'Nhà Đất Việt — sàn môi giới bất động sản tổng hợp TP.HCM: căn hộ, nhà phố, đất nền, biệt thự, shophouse. Tìm đúng nhà, an cư lạc nghiệp cùng đội ngũ tư vấn tận tâm.',
  })

  const { settings } = useSite()
  const { properties } = useProperties()
  const { items: testimonials } = useApiList<Testimonial>('/public/testimonials')
  const { items: faqs } = useApiList<Faq>('/public/faqs')
  const [tab, setTab] = useState<HomeTab>('hot')

  const districtCounts = useMemo(() => {
    const map: Record<string, number> = {}
    properties.forEach(p => { map[p.district] = (map[p.district] || 0) + 1 })
    return map
  }, [properties])

  const tabList = useMemo(() => {
    let list = [...properties]
    if (tab === 'hot') list = list.filter(p => p.badge === 'hot' || p.badge === 'moi')
    else if (tab === 'moi') list.sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime())
    else if (tab === 'gia-tot') list.sort((a, b) => (a.price / (a.price_unit.includes('tháng') ? 1e6 : 1e9)) - (b.price / (b.price_unit.includes('tháng') ? 1e6 : 1e9)))
    return list.slice(0, 6)
  }, [properties, tab])

  return (
    <>
      <HeroSlider />

      {/* Khu vực nổi bật */}
      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-sec-head" data-reveal="">
            <div>
              <div className="ndv-eyebrow">Khu vực</div>
              <h2 className="ndv-title">Tìm theo <em>khu vực</em> bạn quan tâm</h2>
            </div>
          </div>
          <div className="ndv-chip-scroll" data-reveal="" data-delay="1">
            {DISTRICTS.map(d => (
              <Link key={d.code} to={`/bat-dong-san?district=${d.code}`} className="ndv-district-chip">
                <IconPin /> {d.name} <span style={{ color: 'var(--text-3)' }}>({districtCounts[d.code] || 0})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nổi bật / Mới đăng / Giá tốt */}
      <section className="ndv-sec ndv-bg-alt">
        <div className="ndv-container">
          <div className="ndv-sec-head" data-reveal="">
            <div>
              <div className="ndv-eyebrow">Tin đăng</div>
              <h2 className="ndv-title">Bất động sản <em>đáng chú ý</em></h2>
              <p className="ndv-sub">Chọn lọc từ hơn 40 tin đăng đang có trên hệ thống {settings.site_name || 'Nhà Đất Việt'}.</p>
            </div>
            <div className="ndv-tabs" data-reveal="" data-delay="1">
              <button className={'ndv-tab' + (tab === 'hot' ? ' active' : '')} onClick={() => setTab('hot')}>Nổi bật</button>
              <button className={'ndv-tab' + (tab === 'moi' ? ' active' : '')} onClick={() => setTab('moi')}>Mới đăng</button>
              <button className={'ndv-tab' + (tab === 'gia-tot' ? ' active' : '')} onClick={() => setTab('gia-tot')}>Giá tốt</button>
            </div>
          </div>
          <div className="ndv-prop-grid">
            {tabList.map(p => <PropertyCard key={p.id} p={p} />)}
          </div>
          <div className="ndv-text-center" style={{ marginTop: 36 }} data-reveal="">
            <Link to="/bat-dong-san" className="ndv-btn ndv-btn-ghost">Xem tất cả bất động sản →</Link>
          </div>
        </div>
      </section>

      <StatBar items={[
        { value: Number(settings.stat_listings || 1250), suffix: '+', label: 'Tin đăng đã xử lý' },
        { value: Number(settings.stat_deals || 860), suffix: '+', label: 'Giao dịch thành công' },
        { value: Number(settings.stat_experience_years || 9), suffix: '', label: 'Năm kinh nghiệm' },
        { value: Number(settings.stat_satisfaction_percent || 98), suffix: '%', label: 'Khách hàng hài lòng' },
      ]} />

      {/* Vì sao chọn chúng tôi */}
      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-sec-head-center ndv-text-center" style={{ margin: '0 auto 48px', maxWidth: 640 }} data-reveal="">
            <div className="ndv-eyebrow" style={{ justifyContent: 'center' }}>Vì sao chọn chúng tôi</div>
            <h2 className="ndv-title">Đồng hành cùng bạn từ <em>tìm kiếm</em> đến bàn giao</h2>
          </div>
          <div className="ndv-feature-row">
            <div className="ndv-feature-item" data-reveal="">
              <div className="ndv-feature-icon"><IconShield /></div>
              <h3>Pháp lý minh bạch</h3>
              <p>Mọi tin đăng đều kiểm tra sổ đỏ/sổ hồng, tình trạng quy hoạch trước khi giới thiệu khách hàng.</p>
            </div>
            <div className="ndv-feature-item" data-reveal="" data-delay="1">
              <div className="ndv-feature-icon"><IconSupport /></div>
              <h3>Tư vấn tận tâm</h3>
              <p>Đội ngũ môi giới giàu kinh nghiệm, đồng hành cùng khách hàng xem nhà thực tế đến khi ký hợp đồng.</p>
            </div>
            <div className="ndv-feature-item" data-reveal="" data-delay="2">
              <div className="ndv-feature-icon"><IconLoan /></div>
              <h3>Hỗ trợ vay nhanh</h3>
              <p>Công cụ tính vay trả góp ngay trên trang chi tiết, kết nối sẵn ngân hàng đối tác hỗ trợ thủ tục.</p>
            </div>
            <div className="ndv-feature-item" data-reveal="" data-delay="3">
              <div className="ndv-feature-icon"><IconData /></div>
              <h3>Dữ liệu cập nhật</h3>
              <p>Tin đăng được cập nhật thường xuyên về giá, tình trạng giao dịch — không đăng tin ảo, tin đã bán.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quy trình giao dịch */}
      <section className="ndv-sec ndv-bg-alt">
        <div className="ndv-container">
          <div className="ndv-sec-head-center ndv-text-center" style={{ margin: '0 auto 56px', maxWidth: 640 }} data-reveal="">
            <div className="ndv-eyebrow" style={{ justifyContent: 'center' }}>Quy trình</div>
            <h2 className="ndv-title">Giao dịch nhà đất <em>đơn giản</em> hơn bao giờ hết</h2>
          </div>

          {[
            { num: 1, img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80', title: 'Tìm kiếm & liên hệ tư vấn', desc: 'Lọc bất động sản theo giá, khu vực, loại hình phù hợp. Liên hệ trực tiếp môi giới phụ trách để được tư vấn chi tiết, minh bạch mọi thông tin trước khi đi xem nhà.', alt: 'Tìm kiếm và liên hệ tư vấn' },
            { num: 2, img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=80', title: 'Xem nhà thực tế', desc: 'Môi giới sắp xếp lịch xem nhà theo giờ thuận tiện, cung cấp đầy đủ hồ sơ pháp lý để khách hàng đối chiếu, kiểm tra hiện trạng trước khi quyết định.', alt: 'Xem nhà thực tế', reverse: true },
            { num: 3, img: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&auto=format&fit=crop&q=80', title: 'Đặt cọc & ký hợp đồng', desc: 'Hỗ trợ soạn thảo hợp đồng đặt cọc, kết nối phòng công chứng và ngân hàng nếu khách hàng cần vay vốn — đảm bảo quyền lợi hai bên rõ ràng.', alt: 'Đặt cọc và ký hợp đồng' },
            { num: 4, img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=80', title: 'Hoàn tất & bàn giao', desc: 'Đồng hành đến bước sang tên, thanh toán và bàn giao nhà — hỗ trợ sau giao dịch nếu khách hàng cần tư vấn thêm về thủ tục hành chính.', alt: 'Hoàn tất và bàn giao', reverse: true },
          ].map(s => (
            <div key={s.num} className={'ndv-strip' + (s.reverse ? ' reverse' : '')} data-reveal="">
              <div className="ndv-strip-img"><img src={s.img} alt={s.alt} loading="lazy" /></div>
              <div className="ndv-strip-content">
                <span className="ndv-strip-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-sec-head-center ndv-text-center" style={{ margin: '0 auto 40px', maxWidth: 640 }} data-reveal="">
            <div className="ndv-eyebrow" style={{ justifyContent: 'center' }}>Khách hàng nói gì</div>
            <h2 className="ndv-title">Trải nghiệm thực tế từ <em>khách hàng</em></h2>
          </div>
          <TestimonialsList items={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="ndv-sec ndv-bg-alt">
        <div className="ndv-container">
          <div className="ndv-sec-head-center ndv-text-center" style={{ margin: '0 auto 40px', maxWidth: 640 }} data-reveal="">
            <div className="ndv-eyebrow" style={{ justifyContent: 'center' }}>Câu hỏi thường gặp</div>
            <h2 className="ndv-title">Giải đáp thắc mắc về <em>giao dịch BĐS</em></h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* CTA band */}
      <section className="ndv-sec-sm">
        <div className="ndv-container">
          <div className="ndv-cta-band" data-reveal="">
            <div>
              <h3>Bạn đang cần tư vấn bất động sản?</h3>
              <p>Đội ngũ {settings.site_name || 'Nhà Đất Việt'} sẵn sàng hỗ trợ {settings.working_hours || 'Thứ 2 - Chủ nhật: 8:00 - 20:00'}.</p>
            </div>
            <div className="ndv-cta-band-actions">
              <a href={`tel:${(settings.site_phone || '1900 6789').replace(/\s/g, '')}`} className="ndv-btn ndv-btn-primary">Gọi hotline {settings.site_phone || '1900 6789'}</a>
              <Link to="/lien-he" className="ndv-btn ndv-btn-outline-dark">Gửi yêu cầu tư vấn</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
