/**
 * HERO SLIDER CONFIG
 * ------------------
 * Chỉnh sửa file này để thay đổi nội dung slider trang chủ.
 * Mỗi slide có type riêng, điền đúng field theo type.
 *
 * Types:
 *   'intro'       — Giới thiệu chính: tiêu đề lớn + thống kê + buttons
 *   'features'    — Danh sách tính năng nổi bật + tags
 *   'grid'        — Grid icon + label (ngành nghề, loại template...)
 *   'pricing'     — Bảng giá 3 gói + tags
 *   'testimonial' — Trích dẫn khách hàng + thông tin tác giả
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type TitlePart =
  | { text: string; variant?: 'normal' }
  | { text: string; variant: 'em' }        // in nghiêng xanh
  | { text: string; variant: 'muted' }     // mờ trắng
  | { br: true }                           // xuống dòng

export type ButtonAction =
  | { type: 'scroll'; target: string }     // cuộn đến section #id
  | { type: 'link';   href: string }       // chuyển trang

export interface SlideButton {
  label:   string
  action:  ButtonAction
  variant: 'primary' | 'outline'
}

// ── Slide types ───────────────────────────────────────────────────────────────

export interface IntroSlide {
  type:     'intro'
  bg:       string
  badge:    string
  title:    TitlePart[]
  subtitle: string
  stats:    { value: string; label: string }[]
  buttons:  SlideButton[]
}

export interface FeaturesSlide {
  type:     'features'
  bg:       string
  badge:    string
  title:    TitlePart[]
  features: { icon: string; text: string; highlight?: string }[]
  tags?:    string[]
  buttons:  SlideButton[]
}

export interface GridSlide {
  type:    'grid'
  bg:      string
  badge:   string
  title:   TitlePart[]
  items:   { icon: string; label: string; desc: string }[]
  buttons: SlideButton[]
}

export interface PricingSlide {
  type:   'pricing'
  bg:     string
  badge:  string
  title:  TitlePart[]
  plans:  { name: string; price: string; desc: string; hot?: boolean }[]
  tags?:  string[]
  buttons: SlideButton[]
}

export interface TestimonialSlide {
  type:   'testimonial'
  bg:     string
  badge:  string
  quote:  string
  author: { name: string; role: string; avatar: string }
  buttons: SlideButton[]
}

export type Slide =
  | IntroSlide
  | FeaturesSlide
  | GridSlide
  | PricingSlide
  | TestimonialSlide

// ── Config ────────────────────────────────────────────────────────────────────

export const slides: Slide[] = [

  // ── Slide 1 — Giới thiệu chính ──────────────────────────────────────────
  {
    type:  'intro',
    bg:    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1400&q=60&auto=format&fit=crop',
    badge: 'Website chuyên nghiệp · Triển khai trọn gói',
    title: [
      { text: 'Chọn mẫu đẹp,' },
      { br: true },
      { text: 'tôi ' },
      { text: 'cài đặt', variant: 'em' },
      { text: 'cho bạn.', variant: 'muted' },
    ],
    subtitle: 'Hơn 30 mẫu thiết kế hiện đại cho mọi ngành nghề. Thanh toán xong — website hoàn chỉnh trong 3–5 ngày làm việc, không cần biết kỹ thuật.',
    stats: [
      { value: '127+', label: 'Khách hàng' },
      { value: '30+',  label: 'Mẫu thiết kế' },
      { value: '3–5',  label: 'Ngày bàn giao' },
      { value: '4.9 ★', label: 'Đánh giá trung bình' },
    ],
    buttons: [
      { label: 'Xem mẫu thiết kế →', variant: 'primary', action: { type: 'scroll', target: 'templates' } },
      { label: 'Cách hoạt động',      variant: 'outline', action: { type: 'scroll', target: 'how' } },
    ],
  },

  // ── Slide 2 — Tại sao chọn webdrop ──────────────────────────────────────
  {
    type:  'features',
    bg:    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=60&auto=format&fit=crop',
    badge: 'Tại sao chọn webdrop.store',
    title: [
      { text: 'Không chỉ là' },
      { br: true },
      { text: 'template', variant: 'em' },
      { text: '— là dịch vụ.', variant: 'muted' },
    ],
    features: [
      { icon: '⚡', text: 'Bàn giao trong', highlight: '3–5 ngày làm việc', },
      { icon: '🎨', text: 'Hơn 30 mẫu hiện đại,',  highlight: 'responsive' },
      { icon: '🔧', text: 'Hosting, domain, SSL —', highlight: 'tất cả trong một gói' },
      { icon: '🛡️', text: 'Hoàn tiền 100% trong 7 ngày nếu không hài lòng' },
    ],
    tags: ['SEO chuẩn', 'PageSpeed 90+', 'Hỗ trợ tiếng Việt', 'Gói duy trì hàng tháng'],
    buttons: [
      { label: 'Xem quy trình →', variant: 'primary', action: { type: 'scroll', target: 'how' } },
      { label: 'Xem bảng giá',    variant: 'outline', action: { type: 'scroll', target: 'pricing' } },
    ],
  },

  // ── Slide 3 — Ngành nghề ─────────────────────────────────────────────────
  {
    type:  'grid',
    bg:    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=60&auto=format&fit=crop',
    badge: '30+ mẫu thiết kế sẵn có',
    title: [
      { text: 'Mẫu cho' },
      { br: true },
      { text: 'mọi ngành', variant: 'em' },
      { text: 'nghề.', variant: 'muted' },
    ],
    items: [
      { icon: '🏢', label: 'Giới thiệu công ty',  desc: 'Chuyên nghiệp, tối ưu chuyển đổi' },
      { icon: '💼', label: 'Portfolio cá nhân',   desc: 'Showcase công việc ấn tượng' },
      { icon: '🍜', label: 'Nhà hàng & F&B',      desc: 'Menu, đặt bàn, địa chỉ' },
      { icon: '✍️', label: 'Blog cá nhân',        desc: 'Viết bài, phân loại, SEO' },
      { icon: '💆', label: 'Spa & Làm đẹp',       desc: 'Dịch vụ, đặt lịch, đội ngũ' },
      { icon: '💬', label: 'Forum & Community',   desc: 'Q&A, thảo luận, thành viên' },
    ],
    buttons: [
      { label: 'Xem tất cả mẫu →', variant: 'primary', action: { type: 'scroll', target: 'templates' } },
    ],
  },

  // ── Slide 4 — Bảng giá ──────────────────────────────────────────────────
  {
    type:  'pricing',
    bg:    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1400&q=60&auto=format&fit=crop',
    badge: 'Giá minh bạch, không phát sinh',
    title: [
      { text: 'Phù hợp với' },
      { br: true },
      { text: 'mọi ngân sách', variant: 'em' },
      { text: '.', variant: 'muted' },
    ],
    plans: [
      { name: 'Starter',  price: '1.200.000đ', desc: 'Mẫu + source code, tự cài theo hướng dẫn' },
      { name: 'Standard', price: '2.500.000đ', desc: 'Cài đặt trọn gói · Hosting · Domain · Nội dung', hot: true },
      { name: 'Premium',  price: '12.000.000đ', desc: 'Thiết kế custom độc quyền theo yêu cầu' },
    ],
    tags: ['Hosting 1 năm included', 'Hoàn tiền 7 ngày', 'Hỗ trợ 30 ngày'],
    buttons: [
      { label: 'Xem chi tiết bảng giá →', variant: 'primary', action: { type: 'scroll', target: 'pricing' } },
      { label: 'Xem mẫu trước',           variant: 'outline', action: { type: 'scroll', target: 'templates' } },
    ],
  },

  // ── Slide 5 — Testimonial ────────────────────────────────────────────────
  {
    type:  'testimonial',
    bg:    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=60&auto=format&fit=crop',
    badge: '127 khách hàng đã tin tưởng',
    quote: 'Tôi không biết gì về website nhưng chỉ cần điền form brief là xong. 4 ngày sau có website đẹp hơn tôi tưởng tượng. Khách hàng hỏi "ai làm web cho bạn vậy?"',
    author: {
      name:   'Nguyễn Lan Anh',
      role:   'Chủ Spa Lavender · Hà Nội · Gói Standard',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop&crop=face',
    },
    buttons: [
      { label: 'Đặt hàng ngay →',    variant: 'primary', action: { type: 'scroll', target: 'templates' } },
      { label: 'Xem thêm đánh giá', variant: 'outline', action: { type: 'scroll', target: 'reviews' } },
    ],
  },

]
