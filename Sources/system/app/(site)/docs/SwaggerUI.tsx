'use client'
import Script from 'next/script'

export function SwaggerUI() {
  return (
    <Script
      src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-expect-error SwaggerUIBundle is loaded from CDN
        window.SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
          presets: [
            // @ts-expect-error SwaggerUIBundle is loaded from CDN
            window.SwaggerUIBundle.presets.apis,
          ],
          deepLinking: true,
          displayRequestDuration: true,
          tryItOutEnabled: true,
          persistAuthorization: true,
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 2,
        })
      }}
    />
  )
}
