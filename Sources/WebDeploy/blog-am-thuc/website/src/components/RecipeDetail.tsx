import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { Post } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { formatDate, parseIngredients, parseSteps } from '../utils'
import { RecipeCard } from './PostList'

interface FullRecipe extends Post {
  ingredients: string
  steps: string
  tip: string
}

export default function RecipeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [recipe, setRecipe] = useState<FullRecipe | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true); setNotFound(false)
    const req = slug
      ? api.get<FullRecipe>(`/public/posts/${slug}`)
      : api.get<FullRecipe>('/public/latest-recipe')
    req
      .then(r => {
        setRecipe(r)
        return api.get<Post[]>(`/public/posts?type=recipe&exclude=${r.slug}&sort=saved&limit=4`)
      })
      .then(setRelated)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: recipe ? `${recipe.title} — Bếp Xanh` : 'Công thức nấu ăn — Bếp Xanh',
    description: recipe?.excerpt,
  })

  if (loading) return <div className="bam-container" style={{ paddingTop: 150, paddingBottom: 80 }}>Đang tải...</div>
  if (notFound || !recipe) {
    return (
      <div className="bam-container" style={{ paddingTop: 150, paddingBottom: 80, textAlign: 'center' }}>
        <h1 className="bam-page-title">Chưa có công thức nào</h1>
        <p style={{ marginTop: 16 }}><Link to="/chuyen-muc" className="bam-btn bam-btn-primary">Xem chuyên mục</Link></p>
      </div>
    )
  }

  const ingredients = parseIngredients(recipe.ingredients)
  const steps = parseSteps(recipe.steps)

  return (
    <>
      <section className="bam-sec" style={{ paddingTop: 130 }}>
        <div className="bam-container">
          <div className="bam-breadcrumb" style={{ color: 'var(--text-3)', marginBottom: 26 }}>
            <Link to="/" style={{ color: 'var(--text-2)' }}>Trang chủ</Link> / {' '}
            {recipe.category_name && <>
              <Link to={`/chuyen-muc?tab=${recipe.category_slug}`} style={{ color: 'var(--text-2)' }}>{recipe.category_name}</Link> / {' '}
            </>}
            {recipe.title}
          </div>

          <div className="bam-recipe-hero" data-reveal>
            <div>
              <div className="bam-recipe-badges">
                {recipe.category_name && <span className="bam-badge bam-badge-cat">{recipe.category_name}</span>}
                {recipe.difficulty && <span className="bam-badge bam-badge-diff">Độ khó: {recipe.difficulty}</span>}
              </div>
              <h1 className="bam-recipe-hero-title">{recipe.title}</h1>
              <p className="bam-recipe-hero-desc">{recipe.excerpt}</p>
              {recipe.author_name && (
                <div className="bam-recipe-author">
                  {recipe.author_avatar && <img src={recipe.author_avatar} alt={`Ảnh đại diện tác giả ${recipe.author_name}`} />}
                  <div>
                    <div className="bam-recipe-author-name">{recipe.author_name}</div>
                    <div className="bam-recipe-author-date">Cập nhật {formatDate(recipe.published_at)}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="bam-recipe-hero-img">
              <img src={recipe.image} alt={recipe.title} loading="lazy" />
            </div>
          </div>

          <div className="bam-quickfacts" data-reveal data-reveal-d1>
            <div className="bam-qf-item"><div className="bam-qf-icon">⏱️</div><div className="bam-qf-val">{recipe.prep_time || '—'}</div><div className="bam-qf-label">Chuẩn bị</div></div>
            <div className="bam-qf-item"><div className="bam-qf-icon">🔥</div><div className="bam-qf-val">{recipe.cook_time || '—'}</div><div className="bam-qf-label">Thời gian nấu</div></div>
            <div className="bam-qf-item"><div className="bam-qf-icon">🍽️</div><div className="bam-qf-val">{recipe.servings || '—'}</div><div className="bam-qf-label">Khẩu phần</div></div>
            <div className="bam-qf-item"><div className="bam-qf-icon">📊</div><div className="bam-qf-val">{recipe.difficulty || '—'}</div><div className="bam-qf-label">Độ khó</div></div>
          </div>

          <div className="bam-recipe-body-layout">
            <div className="bam-ingredients-box" data-reveal>
              <div className="bam-ingredients-title">Nguyên liệu</div>
              <div className="bam-ingredients-servings">Cho {recipe.servings || 'nhiều người'}</div>
              {ingredients.map((ing, i) => (
                <div key={i} className="bam-ing-item">
                  <i className="bi bi-check-circle-fill" />
                  <span><span className="bam-ing-qty">{ing.qty}</span>{ing.name}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="bam-steps">
                {steps.map((step, i) => (
                  <div key={i} className="bam-step">
                    <div className="bam-step-num">{i + 1}</div>
                    <div>
                      <div className="bam-step-title">{step.title}</div>
                      <p className="bam-step-desc">{step.desc}</p>
                      {step.image && (
                        <div className="bam-step-img"><img src={step.image} alt={step.title} loading="lazy" /></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {recipe.tip && (
                <div className="bam-tip-box">
                  <i className="bi bi-lightbulb-fill" />
                  <p><strong>Mẹo từ Bếp Xanh:</strong> {recipe.tip}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bam-sec-sm" style={{ background: 'var(--accent-light)' }}>
          <div className="bam-container">
            <div className="bam-sec-head" data-reveal>
              <div className="bam-eyebrow">Có thể bạn cũng thích</div>
              <h2 className="bam-sec-title">Công thức <em>liên quan</em></h2>
            </div>
            <div className="bam-hscroll" data-reveal data-reveal-d1>
              {related.map(r => <RecipeCard key={r.id} post={r} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
