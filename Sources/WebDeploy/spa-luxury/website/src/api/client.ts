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
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body: unknown) => request<T>('POST', path, body),
  // POST + suffix URL — bypass IIS/WebDAV block PUT/DELETE trên shared hosting
  put:    <T>(path: string, body: unknown) => request<T>('POST', `${path}/update`, body),
  delete: <T>(path: string) => request<T>('POST', `${path}/delete`),
  upload: <T>(path: string, formData: FormData) => request<T>('POST', path, formData),
}

export function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  return fetch(BASE + path, { credentials: 'include', ...options }).then(res => {
    if (!res.ok) throw new Error('API error')
    return res.json() as Promise<T>
  })
}
