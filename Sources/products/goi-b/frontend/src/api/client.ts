const BASE = '/api'

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }
  if (body !== undefined) opts.body = JSON.stringify(body)

  const res = await fetch(BASE + path, opts)
  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(json?.error || `Lỗi ${res.status}`)
  }
  return json?.data ?? json
}

// Multipart upload (media)
export async function upload(path: string, formData: FormData) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error || `Lỗi ${res.status}`)
  return json?.data ?? json
}

export const api = {
  get:    <T>(path: string)                   => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown)    => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown)    => request<T>('PUT',    path, body),
  delete: <T>(path: string)                   => request<T>('DELETE', path),
}
