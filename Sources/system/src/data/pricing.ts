export interface PricingPlan {
  tier: string
  price: string
  desc: string
  features: string[]
  cta: string
  hot?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    tier: 'Starter',
    price: '1.200.000',
    desc: 'Mẫu + source code. Tự cài đặt với tài liệu hướng dẫn đầy đủ.',
    features: ['Source code đầy đủ', 'Tài liệu hướng dẫn PDF', 'Hỗ trợ qua chat 7 ngày'],
    cta: 'Chọn gói này',
  },
  {
    tier: 'Standard',
    price: '2.500.000',
    desc: 'Cài đặt trọn gói. Nhận website hoàn chỉnh, có domain và hosting.',
    features: [
      'Hosting 1 năm (SSD, tại VN)',
      'Tên miền .com hoặc .vn',
      'SSL miễn phí',
      'Điền nội dung theo brief',
      'Tùy chỉnh màu sắc & logo',
      'Hỗ trợ 30 ngày sau bàn giao',
    ],
    cta: 'Đặt mua ngay',
    hot: true,
  },
  {
    tier: 'Premium',
    price: '12.000.000',
    desc: 'Thiết kế riêng, độc quyền. Không dùng mẫu có sẵn.',
    features: ['Wireframe & thiết kế UI', 'Lập trình theo yêu cầu', 'Bàn giao source code', 'Hỗ trợ 90 ngày'],
    cta: 'Liên hệ tư vấn',
  },
]
