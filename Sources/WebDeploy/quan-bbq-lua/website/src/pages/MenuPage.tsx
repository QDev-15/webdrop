import Menu from '../components/Menu'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function MenuPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Thực Đơn — ${settings.site_name}`,
    description: `Thực đơn BBQ than hoa đa dạng tại ${settings.site_name}: bò Wagyu, hải sản, sườn heo, gà nướng — thịt tươi chọn lọc mỗi sáng.`,
  })

  return <Menu />
}
