const BASE = (() => {
  if (import.meta.env.DEV) return '/api'
  return window.location.origin + '/api'
})()

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method,
    headers: body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body: unknown) => request<T>('POST', path, body),
  // Dùng POST + /update|/delete suffix — tránh IIS/WebDAV block PUT/DELETE
  put:    <T>(path: string, body: unknown) => request<T>('POST', `${path}/update`, body),
  delete: <T>(path: string) => request<T>('POST', `${path}/delete`),
}
