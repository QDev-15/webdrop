export interface PricingPlan {
  tier:     string
  price:    string
  desc:     string
  features: string[]
  cta:      string
  ctaHref:  string
  flow:     string   // mô tả ngắn các bước tiếp theo
  hot?:     boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    tier:    'Starter',
    price:   '1.200.000',
    desc:    'Mẫu + source code. Tự cài đặt với tài liệu hướng dẫn đầy đủ.',
    features: ['Source code đầy đủ', 'Tài liệu hướng dẫn PDF', 'Hỗ trợ qua chat 7 ngày'],
    cta:     'Xem thư viện mẫu →',
    ctaHref: '/templates?type=starter',
    flow:    'Chọn mẫu → thanh toán online → nhận file ZIP ngay',
  },
  {
    tier:    'Standard',
    price:   '2.500.000',
    desc:    'Cài đặt trọn gói. Nhận website hoàn chỉnh, có domain và hosting.',
    features: [
      'Hosting 1 năm (SSD, tại VN)',
      'Tên miền .com hoặc .vn',
      'SSL miễn phí',
      'Điền nội dung theo brief',
      'Tùy chỉnh màu sắc & logo',
      'Hỗ trợ 30 ngày sau bàn giao',
    ],
    cta:     'Chọn mẫu & đặt hàng →',
    ctaHref: '/templates?type=standard',
    flow:    'Chọn mẫu → chúng tôi setup trọn gói trong 3–5 ngày',
    hot:     true,
  },
  {
    tier:    'Premium',
    price:   '12.000.000',
    desc:    'Thiết kế riêng, độc quyền. Không dùng mẫu có sẵn.',
    features: ['Wireframe & thiết kế UI', 'Lập trình theo yêu cầu', 'Bàn giao source code', 'Hỗ trợ 90 ngày'],
    cta:     'Liên hệ tư vấn →',
    ctaHref: '/contact',
    flow:    'Tư vấn miễn phí → ký scope → thiết kế → bàn giao',
  },
]
