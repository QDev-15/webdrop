import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

// Cache layout settings for 60 seconds to avoid duplicate DB queries
// This single query serves both generateMetadata() and RootLayout()
export const getCachedLayoutSettings = unstable_cache(
  async () => {
    try {
      const rows = await prisma.setting.findMany({
        where: {
          key: {
            in: [
              'site_favicon',
              'meta_title',
              'meta_description',
              'google_analytics_id',
              'gtm_id',
              'zalo_oa_id',
              'zalo_chat_enabled',
            ],
          },
        },
      })

      return Object.fromEntries(rows.map(r => [r.key, r.value?.trim() || '']))
    } catch {
      return {}
    }
  },
  ['layout-settings'],
  { revalidate: 60 }
)

export async function getLayoutSettings() {
  return getCachedLayoutSettings()
}
