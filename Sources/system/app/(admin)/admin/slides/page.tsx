import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import { Suspense } from 'react'

const TYPE_LABEL: Record<string, string> = {
  intro: 'Giới thiệu',
  features: 'Tính năng',
  grid: 'Grid ngành',
  pricing: 'Bảng giá',
  testimonial: 'Đánh giá',
}

async function SlidesList() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 fw-600">Hero Slides</h4>
          <p className="text-muted small mb-0">{slides.length} slide · Kéo thả để sắp xếp thứ tự</p>
        </div>
        <Link href="/admin/slides/new" className="btn btn-sm btn-dark">+ Thêm slide</Link>
      </div>

      <div className="card border-0 shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Badge / Loại</th>
              <th>Background</th>
              <th>Trạng thái</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted py-4">Chưa có slide nào</td></tr>
            )}
            {slides.map((s, i) => (
              <tr key={s.id}>
                <td className="text-muted">{i + 1}</td>
                <td>
                  <div className="fw-500 small">{s.badge}</div>
                  <span className="badge bg-light text-dark border small">{TYPE_LABEL[s.type] ?? s.type}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img src={s.bg} alt="" style={{ width: 60, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                    <span className="text-muted small text-truncate" style={{ maxWidth: 200 }}>{s.bg}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${s.status === 'published' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                    {s.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/slides/${s.id}/edit`} className="btn btn-sm btn-outline-secondary">Sửa</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SlidesPage() {
  return (
    <AdminLayout title="Hero Slides">
      <Suspense fallback={<AdminLoadingPage type="table" />}>
        <SlidesList />
      </Suspense>
    </AdminLayout>
  )
}
