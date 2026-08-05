import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'Help Center Admin',
};

export default async function AdminHelpPage() {
  const articles = await prisma.helpArticle.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <AdminLayout title="Help Center">
      <div className="admin-page">
        <h1>Help Articles ({articles.length})</h1>
        <a href="/admin/help/articles/new" className="btn btn-primary">+ New Article</a>
        
        <div className="admin-table-wrap" style={{marginTop: '20px'}}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.category.name}</td>
                  <td>{a.status}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
