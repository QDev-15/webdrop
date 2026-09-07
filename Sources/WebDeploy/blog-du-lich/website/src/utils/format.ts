// Chuyển "2026-08-18" -> "18/08/2026"
export function formatDateVN(iso: string): string {
  if (!iso) return ''
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}
