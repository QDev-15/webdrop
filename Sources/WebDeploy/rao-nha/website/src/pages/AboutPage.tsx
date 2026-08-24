import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import Counter from '../components/Counter'

interface Testimonial { id: number; name: string; role: string; avatar: string; content: string }

export default function AboutPage() {
  useDocumentMeta({
    title: 'Giới thiệu RaoNhà | Sàn giao dịch bất động sản trực tuyến',
    description: 'RaoNhà là nền tảng kết nối người mua/thuê với chính chủ, môi giới tự do và công ty môi giới trên khắp Việt Nam — minh bạch, an toàn, dễ tiếp cận.',
  })
  const { settings } = useSite()
  const [stories, setStories] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(d => setStories(d.slice(4, 7))).catch(() => {})
  }, [])

  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Về RaoNhà</div>
          <h1 className="sec-title">Nền tảng kết nối <em>giao dịch bất động sản</em></h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>RaoNhà không phải một công ty môi giới — chúng tôi là sàn giao dịch nơi hàng nghìn chính chủ, môi giới tự do và công ty môi giới cùng đăng tin, và người mua/thuê tự do tìm kiếm, so sánh, liên hệ trực tiếp.</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="rn-container">
          <div className="rn-strip" data-reveal>
            <div>
              <div className="eyebrow">Sứ mệnh</div>
              <h3>Minh bạch hóa thị trường bất động sản Việt Nam</h3>
              <p>Chúng tôi tin rằng việc tìm mua, tìm thuê hoặc bán một bất động sản không nên bị giới hạn bởi mạng lưới quen biết hay phụ thuộc hoàn toàn vào một công ty môi giới duy nhất. RaoNhà xây dựng một sàn giao dịch mở, nơi bất kỳ ai — chính chủ, môi giới tự do, hay công ty môi giới — đều có thể đăng tin và tiếp cận hàng trăm nghìn người dùng có nhu cầu thật.</p>
              <p>Mọi tin đăng đều trải qua bước kiểm duyệt nội dung trước khi hiển thị công khai, giúp người tìm kiếm an tâm hơn khi tiếp cận thông tin trên nền tảng.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=900&auto=format&fit=crop&q=80" alt="Thành phố" loading="lazy" />
          </div>

          <div className="rn-strip reverse" data-reveal>
            <div>
              <div className="eyebrow">Cách hoạt động</div>
              <h3>Đăng tin → Kiểm duyệt → Hiển thị công khai</h3>
              <p>Người đăng (chính chủ, môi giới tự do hoặc công ty môi giới) điền thông tin bất động sản, tải ảnh thật và chọn gói tin phù hợp — miễn phí với Tin thường hoặc trả phí để nâng cấp VIP Bạc/Vàng/Kim Cương nhằm tăng khả năng tiếp cận.</p>
              <p>Đội ngũ kiểm duyệt RaoNhà xác minh thông tin cơ bản (số điện thoại, tính hợp lý của nội dung) trước khi tin được hiển thị công khai trong kết quả tìm kiếm, xếp hạng theo gói tin đã chọn.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80" alt="Quy trình làm việc" loading="lazy" />
          </div>

          <div className="rn-strip" data-reveal>
            <div>
              <div className="eyebrow">Cam kết an toàn</div>
              <h3>Bảo vệ người dùng khỏi rủi ro giao dịch</h3>
              <p>RaoNhà khuyến khích người dùng luôn kiểm tra trực tiếp giấy tờ pháp lý, gặp mặt người đăng tin và không chuyển tiền đặt cọc cho bất kỳ ai chưa xác minh được danh tính trước khi có hợp đồng rõ ràng. Chúng tôi cung cấp kênh báo cáo tin đăng nghi vấn và xử lý trong vòng 24 giờ.</p>
              <p>Chuyên mục Tin tức của RaoNhà cũng thường xuyên cập nhật kiến thức pháp lý, kinh nghiệm giao dịch để người dùng tự bảo vệ mình tốt hơn.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=900&auto=format&fit=crop&q=80" alt="An toàn giao dịch" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="rn-statbar sec-pad">
        <div className="rn-container">
          <div className="sec-head center" data-reveal style={{ marginBottom: 40 }}>
            <div className="eyebrow" style={{ color: 'var(--accent-mid)' }}>Quy mô nền tảng</div>
            <h2 className="sec-title" style={{ color: '#fff' }}>RaoNhà bằng <em style={{ color: 'var(--accent-mid)' }}>con số</em></h2>
          </div>
          <div className="rn-stats-grid">
            <div data-reveal><div className="rn-stat-num"><Counter value={parseInt(settings.stat_listings || '12500')} suffix="+" /></div><div className="rn-stat-label">Tin đăng đang hoạt động</div></div>
            <div data-reveal data-reveal-d1><div className="rn-stat-num"><Counter value={parseInt(settings.stat_members || '3200')} suffix="+" /></div><div className="rn-stat-label">Môi giới &amp; chính chủ tham gia</div></div>
            <div data-reveal data-reveal-d2><div className="rn-stat-num"><Counter value={parseInt(settings.stat_areas || '15')} /></div><div className="rn-stat-label">Khu vực tại 3 thành phố lớn</div></div>
            <div data-reveal data-reveal-d3><div className="rn-stat-num"><Counter value={parseInt(settings.stat_visits || '850')} suffix="k" /></div><div className="rn-stat-label">Lượt truy cập mỗi tháng</div></div>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="rn-container">
          <div className="sec-head center" data-reveal>
            <div className="eyebrow">Câu chuyện thực tế</div>
            <h2 className="sec-title">Thành công từ <em>người dùng RaoNhà</em></h2>
            <p className="sec-sub" style={{ margin: '0 auto' }}>Những trải nghiệm thật từ người mua, người bán đã giao dịch qua nền tảng — không phải thương vụ do một đội ngũ agency thực hiện.</p>
          </div>
          <div className="row g-4">
            {stories.map((s, i) => (
              <div className="col-md-4" data-reveal data-reveal-d1={i === 1 || undefined} data-reveal-d2={i === 2 || undefined} key={s.id}>
                <div className="rn-poster-card" style={{ textAlign: 'left' }}>
                  <img src={s.avatar} className="rn-poster-avatar" style={{ margin: '0 0 14px' }} alt={s.name} />
                  <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>{s.content}</p>
                  <div className="rn-poster-name" style={{ marginTop: 12 }}>{s.name}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 13 }}>{s.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)', textAlign: 'center' }}>
        <div className="rn-container">
          <h2 className="sec-title" data-reveal>Sẵn sàng tìm nhà hoặc <em>đăng tin</em>?</h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }} data-reveal>
            <Link to="/bat-dong-san" className="btn-rn btn-rn-primary">Tìm bất động sản</Link>
            <Link to="/dang-tin" className="btn-rn btn-rn-ghost">Đăng tin miễn phí</Link>
          </div>
        </div>
      </section>
    </>
  )
}
