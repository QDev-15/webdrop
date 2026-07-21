import Booking from '../components/Booking'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Đặt lịch — ${settings.site_name || 'Nha khoa'}`, description: `Đặt lịch khám và tư vấn Implant tại ${settings.site_name || 'nha khoa'}.` })
  const phone = settings.site_phone || '028 3800 5566'
  const address = settings.site_address || '258 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM'
  const hours = settings.working_hours || 'T2–T7: 8:00–20:00 | CN: 9:00–17:00'

  return (
    <>
      {/* Page Header */}
      <section className="ft-page-header">
        <div className="wd-container">
          <div className="ft-ph-inner">
            <div className="ft-eyebrow ft-eyebrow-light">Đặt lịch hẹn</div>
            <h1 className="ft-ph-title">Tư vấn <em>miễn phí</em> cùng chuyên gia</h1>
            <p className="ft-ph-sub">Điền thông tin bên dưới — chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 2 giờ làm việc.</p>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="ft-booking-panel" data-reveal>
                <h2 className="ft-panel-title">Đặt lịch tư vấn</h2>
                <p className="ft-panel-sub">Tư vấn miễn phí với bác sĩ chuyên khoa Implant — không mất phí, không ràng buộc.</p>
                <Booking />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="ft-booking-info" data-reveal>
                <h3 className="ft-bi-title">Thông tin liên hệ</h3>

                <div className="ft-bi-item">
                  <div className="ft-bi-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="1.8"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <div className="ft-bi-label">Hotline đặt lịch</div>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="ft-bi-value">{phone}</a>
                  </div>
                </div>

                <div className="ft-bi-item">
                  <div className="ft-bi-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="1.8"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <div className="ft-bi-label">Địa chỉ</div>
                    <div className="ft-bi-value">{address}</div>
                  </div>
                </div>

                <div className="ft-bi-item">
                  <div className="ft-bi-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="1.8"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <div className="ft-bi-label">Giờ làm việc</div>
                    <div className="ft-bi-value">{hours}</div>
                  </div>
                </div>

                <div className="ft-bi-highlight">
                  <div className="ft-bih-icon">✦</div>
                  <div>
                    <div className="ft-bih-title">Tư vấn hoàn toàn miễn phí</div>
                    <div className="ft-bih-desc">Chụp CT 3D, phân tích ca lâm sàng và lập kế hoạch điều trị — tất cả miễn phí cho lần đầu.</div>
                  </div>
                </div>

                <div className="ft-bi-highlight">
                  <div className="ft-bih-icon">◈</div>
                  <div>
                    <div className="ft-bih-title">Không ràng buộc</div>
                    <div className="ft-bih-desc">Bạn có toàn quyền quyết định sau khi nghe tư vấn — không áp lực, không ép buộc.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
