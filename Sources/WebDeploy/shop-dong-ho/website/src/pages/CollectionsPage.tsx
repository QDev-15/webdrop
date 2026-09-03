import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import ProductCard from '../components/ProductCard'

// bo-suu-tap.html gốc — 4 khối bộ sưu tập TĨNH (không phải bảng riêng trong DB), mỗi khối là
// 1 banner ảnh + filter cố định lấy 4 sản phẩm khớp tiêu chí, link "Xem toàn bộ" trỏ sang
// /san-pham với đúng query string tương ứng.
interface Block {
  key: string
  tag: string
  title: string
  desc: string
  image: string
  link: string
  fetchQuery: (categoryIdOf: (slug: string) => number | undefined) => string
}

const BLOCKS: Block[] = [
  {
    key: 'co-dien-da',
    tag: 'Bộ sưu tập', title: 'Cổ điển da bò Ý',
    desc: 'Dây da mềm mại, mặt số tối giản — vẻ đẹp vượt thời gian cho phong cách công sở và dạo phố.',
    image: 'https://images.unsplash.com/photo-1580287017488-706e4d7598a1?w=1400&auto=format&fit=crop&q=80',
    link: '/san-pham?style=co-dien&material=da',
    fetchQuery: () => 'style=co-dien&material=da&per_page=4',
  },
  {
    key: 'the-thao',
    tag: 'Bộ sưu tập', title: 'Thể thao năng động',
    desc: 'Chống nước tốt, dây cao su bền bỉ — đồng hành cùng mọi hoạt động vận động hằng ngày.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1400&auto=format&fit=crop&q=80',
    link: '/san-pham?style=the-thao',
    fetchQuery: () => 'style=the-thao&per_page=4',
  },
  {
    key: 'nu-sang-trong',
    tag: 'Bộ sưu tập', title: 'Nữ sang trọng',
    desc: 'Thiết kế tinh xảo, đính đá lấp lánh — tôn lên vẻ đẹp thanh lịch trong từng khoảnh khắc.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1400&auto=format&fit=crop&q=80',
    link: '/san-pham?category=nu&style=sang-trong',
    fetchQuery: catId => {
      const id = catId('nu')
      return `style=sang-trong&per_page=4${id ? `&category_ids=${id}` : ''}`
    },
  },
  {
    key: 'gioi-han',
    tag: 'Limited Edition', title: 'Phiên bản giới hạn 2026',
    desc: 'Số lượng có hạn, kèm giấy chứng nhận số thứ tự riêng và bảo hành mở rộng 5 năm.',
    image: 'https://images.unsplash.com/photo-1637160151663-a410315e4e75?w=1400&auto=format&fit=crop&q=80',
    link: '/san-pham?limited=1',
    fetchQuery: () => 'limited=1&per_page=4',
  },
]

function CollectionBlock({ block, categoryIdOf }: { block: Block; categoryIdOf: (slug: string) => number | undefined }) {
  const [items, setItems] = useState<Product[]>([])
  useEffect(() => {
    api.get<Product[]>(`/public/products?${block.fetchQuery(categoryIdOf)}`).then(setItems).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="dh-collection-block" data-reveal>
      <div className="dh-collection-banner">
        <img src={block.image} alt={block.title} />
        <div className="dh-collection-info">
          <div className="tag">{block.tag}</div>
          <h2>{block.title}</h2>
          <p>{block.desc}</p>
          <Link to={block.link} className="dh-btn dh-btn-solid">Xem toàn bộ</Link>
        </div>
      </div>
      <div className="dh-prod-grid">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  const { categories } = useSite()
  useDocumentMeta({
    title: 'Bộ sưu tập — MERIDIAN',
    description: 'Các bộ sưu tập đồng hồ chính hãng nổi bật tại MERIDIAN: Cổ điển da bò Ý, Thể thao, Sang trọng nữ, Phiên bản giới hạn 2026.',
  })

  const categoryIdOf = (slug: string) => categories.find(c => c.slug === slug)?.id

  return (
    <>
      <section className="dh-catalog-header">
        <div className="dh-container">
          <div className="dh-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Bộ sưu tập</span></div>
          <h1>Bộ sưu tập nổi bật</h1>
          <p>Những bộ sưu tập được tuyển chọn kỹ lưỡng theo phong cách và chất liệu</p>
        </div>
      </section>

      <section className="dh-sec">
        <div className="dh-container">
          {BLOCKS.map(b => <CollectionBlock key={b.key} block={b} categoryIdOf={categoryIdOf} />)}
        </div>
      </section>
    </>
  )
}
