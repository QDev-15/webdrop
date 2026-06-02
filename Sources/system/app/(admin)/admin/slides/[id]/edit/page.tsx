import { notFound } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SlideForm from '../../SlideForm'
import { prisma } from '@/lib/prisma'

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) notFound()

  const slide = await prisma.heroSlide.findUnique({ where: { id } })
  if (!slide) notFound()

  return (
    <AdminLayout title="Sửa slide">
      <SlideForm slide={slide} />
    </AdminLayout>
  )
}
