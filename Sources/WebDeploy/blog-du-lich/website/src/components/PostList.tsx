import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { formatDateVN } from '../utils/format'

export interface PostCardData {
  id: number
  title: string
  slug: string
  thumbnail: string
  excerpt: string
  read_time: number
  published_date: string
  category_name?: string | null
  category_slug?: string | null
  tag_class?: string | null
}

interface Props {
  posts: PostCardData[]
  revealOffset?: number
}

const TAG_LABELS: Record<string, string> = {
  domestic: 'Trong nước',
  intl: 'Quốc tế',
  tips: 'Mẹo du lịch',
  stay: 'Review lưu trú',
  food: 'Ẩm thực',
}

export default function PostList({ posts, revealOffset = 0 }: Props) {
  const { settings } = useSite()
  const authorName = settings.author_name || 'Tác giả'
  const authorAvatar = settings.author_avatar || ''

  return (
    <div className="bdl-post-grid">
      {posts.map((post, i) => {
        const idx = (i + revealOffset) % 3
        const revealProps: Record<string, string> = {}
        if (idx === 1) revealProps['data-reveal-d1'] = ''
        if (idx === 2) revealProps['data-reveal-d2'] = ''
        return (
          <Link to={`/bai-viet/${post.slug}`} className="bdl-post-card" data-reveal="" {...revealProps} key={post.id}>
            <div className="bdl-post-thumb">
              {post.tag_class && <span className={`bdl-stamp-tag ${post.tag_class}`}>{TAG_LABELS[post.tag_class] ?? post.category_name}</span>}
              {post.thumbnail && <img src={post.thumbnail} alt={post.title} loading="lazy" />}
            </div>
            <div className="bdl-post-body">
              <div className="bdl-post-meta">
                <span className="bdl-post-date">{formatDateVN(post.published_date)}</span>
                <span className="bdl-post-dot"></span>
                <span className="bdl-post-read">{post.read_time} phút đọc</span>
              </div>
              <h3 className="bdl-post-title">{post.title}</h3>
              <p className="bdl-post-excerpt">{post.excerpt}</p>
              <div className="bdl-post-foot">
                {authorAvatar && <img className="bdl-post-av" src={authorAvatar} alt={`Ảnh đại diện ${authorName}`} />}
                <span className="bdl-post-author">{authorName}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
