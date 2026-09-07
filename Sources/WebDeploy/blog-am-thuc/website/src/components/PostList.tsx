import { Link } from 'react-router-dom'
import { Post } from '../contexts/SiteContext'
import { formatDate, formatSaved } from '../utils'

export function postLink(post: Post): string {
  return post.type === 'recipe' ? `/cong-thuc-nau-an/${post.slug}` : `/bai-viet/${post.slug}`
}

// bam-post-card — dùng cho grid bài viết mới nhất (index.html) + grid chuyên mục (chuyen-muc.html)
export function PostCard({ post }: { post: Post }) {
  return (
    <Link to={postLink(post)} className="bam-post-card">
      <div className="bam-post-thumb-wrap">
        {post.category_name && <span className="bam-post-cat">{post.category_name}</span>}
        <img src={post.image} alt={post.title} loading="lazy" />
      </div>
      <div className="bam-post-body">
        <div className="bam-post-meta">
          <span>{formatDate(post.published_at)}</span>
          <span>{post.read_minutes} phút đọc</span>
        </div>
        <h3 className="bam-post-title">{post.title}</h3>
        <p className="bam-post-excerpt">{post.excerpt}</p>
      </div>
    </Link>
  )
}

// bam-recipe-card — dùng cho hscroll "Công thức đang hot" (index.html) + "Công thức liên quan"
export function RecipeCard({ post }: { post: Post }) {
  return (
    <Link to={postLink(post)} className="bam-recipe-card">
      <div className="bam-recipe-thumb">
        {post.difficulty && <span className="bam-recipe-difficulty">{post.difficulty}</span>}
        <img src={post.image} alt={post.title} loading="lazy" />
      </div>
      <div className="bam-recipe-body">
        <div className="bam-recipe-title">{post.title}</div>
        <div className="bam-recipe-stats">
          <span><i className="bi bi-clock" />{post.cook_time || post.prep_time}</span>
          <span><i className="bi bi-bookmark" />{formatSaved(post.saved_count)} lưu</span>
        </div>
      </div>
    </Link>
  )
}

export default function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="bam-post-grid">
      {posts.map(p => <PostCard key={p.id} post={p} />)}
    </div>
  )
}
