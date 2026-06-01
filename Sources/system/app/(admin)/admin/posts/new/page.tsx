import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import PostForm from '@/components/admin/PostForm'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function NewPostPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } }).catch(() => [])
  return (
    <AdminLayout title="Viết bài mới">
      <PostForm mode="new" categories={categories} />
    </AdminLayout>
  )
}
