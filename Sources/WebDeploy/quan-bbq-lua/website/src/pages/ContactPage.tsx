import Contact from '../components/Contact'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên Hệ — ${settings.site_name}`,
    description: `Thông tin liên hệ, địa chỉ và giờ mở cửa của ${settings.site_name}. Gọi ngay hoặc gửi tin nhắn cho chúng tôi.`,
  })

  return <Contact />
}
