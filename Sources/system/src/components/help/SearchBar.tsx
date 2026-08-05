'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/help?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="help-search-bar">
      <input
        type="text"
        placeholder="Tìm kiếm bài viết..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="hsb-input"
        autoComplete="off"
      />
      <button type="submit" className="hsb-button" aria-label="Tìm kiếm">
        🔍
      </button>
    </form>
  );
}
