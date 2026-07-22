import Reservation from '../components/Reservation'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ReservationPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Đặt Bàn — ${settings.site_name}`,
    description: `Đặt bàn nhanh chóng tại ${settings.site_name} — 4 phòng VIP, sức chứa 200+ chỗ ngồi. Xác nhận trong 15 phút.`,
  })

  return <Reservation />
}
