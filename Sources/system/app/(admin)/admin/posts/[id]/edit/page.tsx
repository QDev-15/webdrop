import { notFound, redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import PostForm from '@/components/admin/PostForm'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const { id } = await params
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: parseInt(id) } }).catch(() => null),
    prisma.category.findMany({ orderBy: { name: 'asc' } }).catch(() => []),
  ])
  if (!post) notFound()

  return (
    <AdminLayout title={`Sửa: ${post.title}`}>
      <PostForm
        mode="edit"
        id={post.id}
        categories={categories}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          thumbnail: post.thumbnail || '',
          categoryId: post.categoryId ? String(post.categoryId) : '',
          status: post.status,
          featured: post.featured,
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
        }}
      />
    </AdminLayout>
  )
}
