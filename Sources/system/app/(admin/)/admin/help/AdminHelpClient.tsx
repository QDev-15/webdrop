'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  status: string;
  category: { name: string };
  createdAt: Date;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminHelpClient({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const [search, setSearch] = useState('');
  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <h1>Help Articles</h1>
      <Link href="/admin/help/articles/new" className="btn btn-primary">
        + New Article
      </Link>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control"
      />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.category.name}</td>
                <td>{a.status}</td>
                <td>
                  <Link
                    href={`/admin/help/articles/${a.id}/edit`}
                    className="btn btn-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
