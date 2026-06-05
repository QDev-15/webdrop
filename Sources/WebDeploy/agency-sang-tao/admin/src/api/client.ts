const BASE = (() => {
  if (import.meta.env.DEV) return '/api'
  return window.location.origin + '/api'
})()

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export const api = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body: unknown) => request<T>('POST', path, body),
  // POST + suffix URL — bypass IIS/WebDAV block PUT/DELETE on shared hosting
  put:    <T>(path: string, body: unknown) => request<T>('POST', `${path}/update`, body),
  delete: <T>(path: string) => request<T>('POST', `${path}/delete`),
  upload: <T>(path: string, formData: FormData) => request<T>('POST', path, formData),
}

