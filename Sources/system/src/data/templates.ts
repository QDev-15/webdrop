export interface Template {
  slug:        string
  name:        string
  category:    string
  price:       string
  image:       string
  badge?:      string
  demoUrl?:    string
  hasWebsite?: boolean
  description?: string
  salesCount?:  number
}

export const templates: Template[] = [
  {
    slug: 'cong-ty-dich-vu-pro',
    name: 'Công ty dịch vụ Pro',
    category: 'Giới thiệu',
    price: '2.500.000đ',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop',
    badge: 'Bán chạy',
    demoUrl: 'https://demo.webdrop.vn/agency-web/',
  },
  {
    slug: 'portfolio-toi',
    name: 'Portfolio tối',
    category: 'Cá nhân',
    price: '2.000.000đ',
    image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=600&q=80&auto=format&fit=crop',
    badge: 'Mới',
  },
  {
    slug: 'nha-hang-cafe',
    name: 'Nhà hàng & Cafe',
    category: 'F&B',
    price: '3.000.000đ',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop',
    demoUrl: 'https://demo.webdrop.vn/restaurant/',
  },
  {
    slug: 'blog-ca-nhan',
    name: 'Blog cá nhân',
    category: 'Blog',
    price: '1.800.000đ',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80&auto=format&fit=crop',
  },
  {
    slug: 'spa-lam-dep',
    name: 'Spa & Làm đẹp',
    category: 'Beauty',
    price: '2.800.000đ',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop',
    badge: 'Mới',
    demoUrl: 'https://demo.webdrop.vn/spa-beauty/',
  },
  {
    slug: 'forum-cong-dong',
    name: 'Forum cộng đồng',
    category: 'Community',
    price: '4.500.000đ',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop',
  },
]

export const categories = ['Tất cả', 'Giới thiệu', 'Cá nhân', 'Blog', 'F&B', 'Community', 'Beauty']
