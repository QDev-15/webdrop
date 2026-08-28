import { NextRequest, NextResponse } from 'next/server'
import { createElement } from 'react'
import { prisma } from '@/lib/prisma'
import { getAccountSession } from '@/lib/auth'
import { buildCvDocx } from '@/lib/cv-to-docx'
import type { CvDataType } from '@/types/cv'

export const dynamic = 'force-dynamic'
// Keeps react-dom/server out of the browser bundle — loaded only at runtime on the server
export const runtime = 'nodejs'

function buildCvData(row: Record<string, unknown>): CvDataType {
  return {
    fullName:       (row.fullName  as string)  ?? '',
    jobTitle:       (row.jobTitle  as string)  ?? '',
    avatarUrl:      (row.avatarUrl as string | null) ?? null,
    summary:        (row.summary   as string)  ?? '',
    email:          (row.email     as string)  ?? '',
    phone:          (row.phone     as string)  ?? '',
    location:       (row.location  as string)  ?? '',
    website:        (row.website   as string)  ?? '',
    linkedin:       (row.linkedin  as string)  ?? '',
    github:         (row.github    as string)  ?? '',
    experience:     (row.experience     as CvDataType['experience'])     ?? [],
    education:      (row.education      as CvDataType['education'])      ?? [],
    skills:         (row.skills         as CvDataType['skills'])         ?? [],
    projects:       (row.projects       as CvDataType['projects'])       ?? [],
    certifications: (row.certifications as CvDataType['certifications']) ?? [],
    languages:      (row.languages      as CvDataType['languages'])      ?? [],
  }
}

function wrapHtml(body: string, name: string, autoPrint = false): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV — ${name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }
    @media print {
      html, body { margin: 0; }
      @page { margin: 0; size: A4; }
    }
  </style>
</head>
<body>
${body}
${autoPrint ? `<script>window.addEventListener('load', function() { setTimeout(function() { window.print(); }, 800); });<\/script>` : ''}
</body>
</html>`
}

export async function GET(req: NextRequest) {
  const session = await getAccountSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const format = req.nextUrl.searchParams.get('format') ?? 'html'
  if (!['html', 'pdf', 'docx'].includes(format)) {
    return NextResponse.json({ error: 'format phải là html, pdf hoặc docx' }, { status: 400 })
  }

  const profile = await prisma.cvProfile.findUnique({
    where: { accountId: session.id },
    include: { data: true },
  })
  if (!profile || !profile.data) {
    return NextResponse.json({ error: 'Chưa có dữ liệu CV' }, { status: 404 })
  }

  const cvData = buildCvData(profile.data as unknown as Record<string, unknown>)
  const fullName = cvData.fullName || 'CV'
  // ASCII fallback (strips non-ASCII) + RFC 5987 UTF-8 encoded filename for browsers that support it
  const fileBase   = `CV-${fullName.replace(/\s+/g, '-')}`
  const fileAscii  = fileBase.replace(/[^\x20-\x7E]/g, '').replace(/[^\w\-. ]/g, '') || 'CV'
  const fileEnc    = encodeURIComponent(fileBase)

  function disposition(ext: string, inline = false): string {
    if (inline) return 'inline'
    return `attachment; filename="${fileAscii}.${ext}"; filename*=UTF-8''${fileEnc}.${ext}`
  }

  // ── DOCX ────────────────────────────────────────────────────
  if (format === 'docx') {
    const buffer = await buildCvDocx(cvData)
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': disposition('docx'),
      },
    })
  }

  // ── HTML / PDF — dynamic import keeps react-dom/server off the browser bundle ──
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { default: CvPreview }   = await import('@/components/cv/CvPreview')

  const body = renderToStaticMarkup(
    createElement(CvPreview, { data: cvData, templateType: profile.templateType, isPrint: true })
  )

  if (format === 'html') {
    return new Response(wrapHtml(body, fullName, false), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': disposition('html'),
      },
    })
  }

  // PDF: open new tab, auto-print → user saves as PDF
  return new Response(wrapHtml(body, fullName, true), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline',
    },
  })
}
