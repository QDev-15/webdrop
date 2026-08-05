'use client'

export function DeleteCategoryForm({ catId }: { catId: number }) {
  return (
    <form method="POST" action={`/api/admin/help/categories/${catId}/delete`} style={{ display: 'inline' }}>
      <button 
        type="submit" 
        onClick={e => { if (!confirm('Xóa danh mục này?')) e.preventDefault() }}
        style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Xóa
      </button>
    </form>
  )
}

export function DeleteArticleForm({ artId }: { artId: number }) {
  return (
    <form method="POST" action={`/api/admin/help/articles/${artId}/delete`} style={{ display: 'inline' }}>
      <button 
        type="submit" 
        onClick={e => { if (!confirm('Xóa bài viết này?')) e.preventDefault() }}
        style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Xóa
      </button>
    </form>
  )
}
