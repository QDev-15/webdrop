import { Link } from 'react-router-dom'

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  category_slug: string
  category_name: string | null
  author_name: string
  author_avatar: string
  read_time: number
  published_at: string
  data_cat?: string
}

function formatDate(v: string) {
  if (!v) return ''
  const d = new Date(v.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN')
}

export function PostCard({ post, revealAttr }: { post: Post; revealAttr?: boolean }) {
  return (
    <Link
      to={`/bai-viet/${post.slug}`}
      className="bmb-post-card"
      data-reveal={revealAttr === false ? undefined : ''}
      data-cat={post.category_slug}
    >
      <div className="bmb-post-thumb-wrap">
        {post.thumbnail && <img src={post.thumbnail} alt={post.title} loading="lazy" />}
        {post.category_name && <span className="bmb-post-cat">{post.category_name}</span>}
      </div>
      <div className="bmb-post-body">
        <div className="bmb-post-meta">
          <span className="bmb-post-date">{formatDate(post.published_at)}</span>
          <span className="bmb-post-dot"></span>
          <span className="bmb-post-read">{post.read_time} phút đọc</span>
        </div>
        <h3 className="bmb-post-title">{post.title}</h3>
        <p className="bmb-post-excerpt">{post.excerpt}</p>
        <div className="bmb-post-footer">
          {post.author_avatar && <img src={post.author_avatar} className="bmb-post-avatar" alt={`Ảnh đại diện ${post.author_name}`} />}
          <span className="bmb-post-author">{post.author_name}</span>
        </div>
      </div>
    </Link>
  )
}

export default function PostList({ posts, gridId }: { posts: Post[]; gridId?: string }) {
  return (
    <div className="bmb-post-grid" id={gridId}>
      {posts.map(p => <PostCard post={p} key={p.id} />)}
    </div>
  )
}
