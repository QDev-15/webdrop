const BASE = '/api/public'

export async function get<T>(path: string): Promise<T> {
  const res  = await fetch(BASE + path, { credentials: 'include' })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error || `Lỗi ${res.status}`)
  return json?.data ?? json
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error || `Lỗi ${res.status}`)
  return json?.data ?? json
}
