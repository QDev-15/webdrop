import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

interface SiteSettings {
  site_name: string
  site_tagline: string
  site_phone: string
  site_email: string
  site_address: string
  working_hours: string
  zalo_number: string
  facebook: string
  instagram: string
  tiktok: string
  zalo: string
  footer_desc: string
  footer_copy: string
  map_embed: string
  contact_note: string
  meta_title: string
  meta_description: string
  stat_meats: string
  stat_seats: string
  stat_years: string
  stat_rating: string
  hero_badge: string
  hero_title: string
  hero_sub: string
  about_title: string
  about_desc: string
  cta_title: string
  cta_sub: string
  [key: string]: string
}

interface SiteContextValue {
  settings: SiteSettings
  loading: boolean
}

const defaultSettings: SiteSettings = {
  site_name: 'BBQ Lửa Hồng',
  site_tagline: 'Thịt nướng than hoa tươi ngon, không gian sôi động',
  site_phone: '0901 234 567',
  site_email: 'info@bbqluahong.vn',
  site_address: '123 Đường BBQ, Phường 5, Quận 3, TP.HCM',
  working_hours: 'T2–T6: 17:00–23:00 | T7: 11:00–23:00 | CN: 11:00–22:00',
  zalo_number: '0901234567',
  facebook: '#',
  instagram: '#',
  tiktok: '#',
  zalo: '#',
  footer_desc: 'Thịt nướng than hoa tươi ngon, không gian sôi động, ẩm thực BBQ đích thực.',
  footer_copy: '© 2026 BBQ Lửa Hồng · Made in Vietnam 🇻🇳',
  map_embed: '',
  contact_note: 'Cuối tuần và ngày lễ đặt trước ít nhất 1 ngày để đảm bảo có bàn.',
  meta_title: 'BBQ Lửa Hồng — Thịt Nướng Than Hoa Đích Thực',
  meta_description: 'Thịt tươi chọn lọc mỗi sáng, than hoa âm ỉ, gia vị ướp bí truyền.',
  stat_meats: '60',
  stat_seats: '200',
  stat_years: '8',
  stat_rating: '4.9',
  hero_badge: 'Than hoa thật — Hương vị thật',
  hero_title: 'Nướng cùng lửa hồng, no cùng bạn bè.',
  hero_sub: 'Thịt tươi chọn lọc mỗi sáng, than hoa âm ỉ, gia vị ướp bí truyền — mỗi bữa BBQ là một buổi tụ họp đáng nhớ.',
  about_title: '8 năm than hoa — chưa một lần thỏa hiệp chất lượng',
  about_desc: 'Mở cửa từ 2016, BBQ Lửa Hồng trở thành địa điểm quen thuộc của hàng nghìn gia đình và nhóm bạn Sài Gòn.',
  cta_title: 'Sẵn sàng cho bữa BBQ hoàn hảo?',
  cta_sub: 'Đặt bàn ngay hôm nay — đặc biệt cuối tuần và ngày lễ nên đặt sớm để có bàn đẹp nhất.',
}

const SiteContext = createContext<SiteContextValue>({ settings: defaultSettings, loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SiteSettings>('/public/settings')
      .then(data => setSettings({ ...defaultSettings, ...data }))
      .catch(() => { /* use defaults */ })
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
