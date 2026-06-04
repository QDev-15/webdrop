const BASE = import.meta.env.DEV ? '/api' : (window.location.origin + '/api')

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(BASE + path, {
    method,
    headers,
    credentials: 'include',
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Loi khong xac dinh' }))
    throw new Error((err as { error?: string }).error ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

export const api = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body: unknown) => request<T>('POST', path, body),
  // POST to suffix /update and /delete — bypass IIS/WebDAV shared hosting
  put:    <T>(path: string, body: unknown) => request<T>('POST', `${path}/update`, body),
  delete: <T>(path: string) => request<T>('POST', `${path}/delete`),
}
