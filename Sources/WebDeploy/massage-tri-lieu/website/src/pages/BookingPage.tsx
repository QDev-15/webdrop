import Booking from '../components/Booking'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function BookingPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Đặt lịch — ${settings.site_name || 'Tâm Thư Massage'}`,
    description: 'Đặt lịch massage trị liệu tại Tâm Thư Massage — chọn dịch vụ, thời gian phù hợp, xác nhận trong vòng 30 phút.',
  })

  return (
    <>
      {/* Page hero */}
      <div className="mrt-page-hero">
        <div className="wd-container">
          <div className="mrt-ph-label">Đặt lịch</div>
          <h1 className="mrt-ph-title">Đặt lịch <em>trải nghiệm</em><br />ngay hôm nay</h1>
          <p className="mrt-ph-sub">
            Chọn thời gian phù hợp — chúng tôi sẽ xác nhận trong vòng 30 phút qua điện thoại.
          </p>
        </div>
      </div>
      <Booking />
    </>
  )
}
