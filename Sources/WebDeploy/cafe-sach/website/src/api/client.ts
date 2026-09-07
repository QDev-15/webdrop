const BASE = (() => {
  if (import.meta.env.DEV) return '/api'
  // Derive API base from module URL so the app works at any deployment sub-path.
  // Assets live at <site-root>/assets/*, go 2 levels up from this module file.
  const parts = new URL(import.meta.url).pathname.split('/')
  const sitePath = parts.slice(0, -2).join('/')
  return window.location.origin + sitePath + '/api'
})()

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const res = await fetch(BASE + path, {
    method,
    headers,
    credentials: 'include',
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }))
    throw new Error((err as { error?: string }).error || 'Request failed')
  }
  return res.json() as Promise<T>
}

export const api = {
  get:  <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  // Dùng cho danh sách có phân trang — đọc header X-Total-Count thay vì bọc { items, total } trong body
  // (giữ nguyên rule "Public endpoint trả array thuần"). Dùng cho GET /public/products?page=...
  getPaged: async <T>(path: string): Promise<{ data: T; total: number }> => {
    const res = await fetch(BASE + path, { credentials: 'include' })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }))
      throw new Error((err as { error?: string }).error || 'Request failed')
    }
    const total = Number(res.headers.get('X-Total-Count') || '0')
    const data = await res.json() as T
    return { data, total }
  },
}
