import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import { Suspense } from 'react'
import HowItWorksReorder from './HowItWorksReorder'

async function PackageList() {
  const packages = await prisma.howItWorksPackage.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { steps: { orderBy: { sortOrder: 'asc' } } },
  })

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 fw-600">Quy Trình</h4>
          <p className="text-muted small mb-0">{packages.length} gói dịch vụ · Kéo để sắp xếp thứ tự hiển thị</p>
        </div>
        <Link href="/admin/how-it-works/new"
          style={{ padding: '8px 18px', background: 'var(--text)', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
          + Thêm gói
        </Link>
      </div>

      {packages.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>Chưa có gói nào</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Tạo gói đầu tiên để hiển thị trên trang Quy Trình</div>
          <Link href="/admin/how-it-works/new"
            style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}>
            Tạo gói đầu tiên
          </Link>
        </div>
      ) : (
        <HowItWorksReorder initialPackages={packages.map(p => ({
          id: p.id, name: p.name, icon: p.icon ?? '📦', tagline: p.tagline ?? '',
          price: p.price ?? '', hot: p.hot, status: p.status, stepsCount: p.steps.length,
          suitable: p.suitable,
        }))} />
      )}
    </div>
  )
}

export default function HowItWorksAdminPage() {
  return (
    <AdminLayout title="Quy Trình">
      <Suspense fallback={<AdminLoadingPage type="table" />}>
        <PackageList />
      </Suspense>
    </AdminLayout>
  )
}
