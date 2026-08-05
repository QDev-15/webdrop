'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  status: string;
}

export function ArticleForm({ categories, initialData }: { categories: Category[]; initialData?: any }) {
  const router = useRouter();
  const [data, setData] = useState<FormData>(initialData || { title: '', slug: '', content: '', categoryId: categories[0]?.id, status: 'draft' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = initialData ? `/api/admin/help/articles/${initialData.id}` : '/api/admin/help/articles';
      const res = await fetch(url, { method: initialData ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) router.push('/admin/help');
    } catch (error) {
      alert('Error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="Title" required />
      <input type="text" value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} placeholder="Slug" required />
      <select value={data.categoryId} onChange={(e) => setData({ ...data, categoryId: parseInt(e.target.value) })} required>
        {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
      </select>
      <textarea value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })} placeholder="Content" rows={15} required />
      <select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <button type="submit" className="btn btn-primary">Save</button>
    </form>
  );
}
