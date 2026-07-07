import { prisma } from '@/lib/prisma'

// Unsplash chủ yếu index ảnh theo từ khóa tiếng Anh — thay vì gửi nguyên
// câu tiêu đề tiếng Việt (thường trả về 0 hoặc ảnh không liên quan), suy ra
// một cụm từ khóa tiếng Anh từ nội dung tiêu đề để tìm ảnh đúng chủ đề hơn.
const NICHE_KEYWORDS: { match: string[]; query: string }[] = [
  { match: ['nha khoa', 'rang', 'chinh nha', 'implant'], query: 'dental clinic interior' },
  { match: ['spa', 'tham my', 'lam dep'], query: 'spa wellness interior' },
  { match: ['cafe', 'ca phe', 'nha hang', 'quan an'], query: 'cafe restaurant interior' },
  { match: ['shop', 'ban hang', 'san pham', 'cua hang'], query: 'online shop products flatlay' },
  { match: ['agency', 'portfolio'], query: 'creative agency office' },
  { match: ['cv online', 'ung tuyen', 'xin viec', 'resume'], query: 'resume career desk' },
]

const COMBINING_MARKS_RANGE = new RegExp('[̀-ͯ]', 'g')

function stripDiacritics(str: string): string {
  return str.normalize('NFD').replace(COMBINING_MARKS_RANGE, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
}

function guessSearchQuery(title: string): string {
  const normalized = stripDiacritics(title).toLowerCase()
  for (const { match, query } of NICHE_KEYWORDS) {
    if (match.some(k => normalized.includes(k))) return query
  }
  return 'modern website design workspace'
}

async function getUnsplashAccessKey(): Promise<string | null> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'unsplash_access_key' } })
    return row?.value?.trim() || null
  } catch {
    return null
  }
}

// per_page=5 + chọn theo index thay vì luôn lấy kết quả đầu tiên — tránh việc
// nhiều bài viết cùng ngách (cùng suy ra 1 query) bị gán trùng y hệt 1 tấm ảnh.
async function searchUnsplashImage(accessKey: string, query: string, pickIndex: number): Promise<{ url: string; downloadLocation: string | null } | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` }, signal: controller.signal, next: { revalidate: 60 } }
    )
    clearTimeout(timeout)
    if (!res.ok) return null
    const data = await res.json()
    const photos = data?.results || []
    if (photos.length === 0) return null
    const photo = photos[pickIndex % photos.length]
    if (!photo?.urls?.regular) return null
    return { url: photo.urls.regular as string, downloadLocation: (photo.links?.download_location as string) || null }
  } catch {
    return null
  }
}

/** Nếu bài viết chưa có thumbnail, tự tìm 1 ảnh Unsplash phù hợp theo tiêu đề và lưu lại vào DB (chỉ gọi Unsplash 1 lần cho mỗi bài). */
export async function ensurePostThumbnail(post: { id: number; title: string; thumbnail: string | null }): Promise<string | null> {
  if (post.thumbnail) return post.thumbnail

  const accessKey = await getUnsplashAccessKey()
  if (!accessKey) return null

  const query = guessSearchQuery(post.title)
  const result = await searchUnsplashImage(accessKey, query, post.id)
  if (!result) return null

  await prisma.post.update({ where: { id: post.id }, data: { thumbnail: result.url } }).catch(() => {})

  if (result.downloadLocation) {
    fetch(result.downloadLocation, { headers: { Authorization: `Client-ID ${accessKey}` } }).catch(() => {})
  }

  return result.url
}
