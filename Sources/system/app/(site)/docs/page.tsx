import type { Metadata } from 'next'
import { SwaggerUI } from './SwaggerUI'

export const metadata: Metadata = {
  title: 'API Docs — webdrop.vn',
  description: 'Interactive API documentation for webdrop.vn',
  robots: { index: false, follow: false },
}

export default function DocsPage() {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
      <style>{`
        body { margin: 0; }
        #swagger-ui { padding-top: 62px; min-height: 100vh; }
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #1a6b52; }
      `}</style>
      <div id="swagger-ui" />
      <SwaggerUI />
    </>
  )
}
