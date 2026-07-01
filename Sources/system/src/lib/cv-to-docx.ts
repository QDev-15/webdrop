import {
  Document, Packer, Paragraph, TextRun,
  BorderStyle, ShadingType,
  convertInchesToTwip,
} from 'docx'
import type { CvDataType } from '@/types/cv'

// ── helpers ─────────────────────────────────────────────────
const ACCENT  = '1A6B52'  // green
const DARK    = '1A1917'
const MUTED   = '6B6760'
const LIGHT   = 'F5F0E8'

function fmtDate(d?: string): string {
  if (!d) return ''
  if (d.length === 4) return d
  const [y, m] = d.split('-')
  return `${m}/${y}`
}

function levelText(level: string): string {
  const map: Record<string, string> = {
    native:       'Tiếng mẹ đẻ',
    fluent:       'Thông thạo (C1/C2)',
    intermediate: 'Trung cấp (B1/B2)',
    basic:        'Cơ bản (A1/A2)',
  }
  return map[level] ?? level
}

function stars(level: number): string {
  return '★'.repeat(level) + '☆'.repeat(5 - level)
}

// ── section heading ─────────────────────────────────────────
function heading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text, bold: true, size: 22, color: ACCENT, font: 'Calibri' }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 },
    },
    spacing: { before: 280, after: 120 },
  })
}

// ── label + value row ────────────────────────────────────────
function labelVal(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 18, color: MUTED, font: 'Calibri' }),
      new TextRun({ text: value, size: 18, color: DARK, font: 'Calibri' }),
    ],
    spacing: { after: 60 },
  })
}

// ── plain paragraph ──────────────────────────────────────────
function para(text: string, opts: { bold?: boolean; italic?: boolean; muted?: boolean; size?: number; after?: number } = {}): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold:   opts.bold   ?? false,
        italics: opts.italic ?? false,
        size:   opts.size   ?? 18,
        color:  opts.muted  ? MUTED : DARK,
        font:   'Calibri',
      }),
    ],
    spacing: { after: opts.after ?? 60 },
  })
}

// ── divider ──────────────────────────────────────────────────
function divider(): Paragraph {
  return new Paragraph({ text: '', spacing: { after: 80 } })
}

// ════════════════════════════════════════════════════════════
export async function buildCvDocx(data: CvDataType): Promise<Buffer> {
  const children: Paragraph[] = []

  // ── Name & title ──────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: data.fullName ?? '', bold: true, size: 52, color: DARK, font: 'Calibri' })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.jobTitle ?? '', size: 26, color: ACCENT, font: 'Calibri' })],
      spacing: { after: 160 },
    }),
  )

  // ── Contact info ──────────────────────────────────────────
  const contacts: string[] = []
  if (data.email)    contacts.push(`✉ ${data.email}`)
  if (data.phone)    contacts.push(`📞 ${data.phone}`)
  if (data.location) contacts.push(`📍 ${data.location}`)
  if (data.website)  contacts.push(`🌐 ${data.website}`)
  if (data.linkedin) contacts.push(`in ${data.linkedin}`)
  if (data.github)   contacts.push(`⌥ ${data.github}`)

  if (contacts.length) {
    children.push(
      new Paragraph({
        children: contacts.map((c, i) => [
          new TextRun({ text: c, size: 17, color: MUTED, font: 'Calibri' }),
          ...(i < contacts.length - 1 ? [new TextRun({ text: '   ·   ', size: 17, color: 'CCCCCC', font: 'Calibri' })] : []),
        ]).flat(),
        spacing: { after: 60 },
        shading: { type: ShadingType.SOLID, color: LIGHT },
        border: {
          top:    { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DF' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E8E5DF' },
          left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        },
      }),
    )
  }

  // ── Summary ───────────────────────────────────────────────
  if (data.summary) {
    children.push(
      heading('GIỚI THIỆU BẢN THÂN'),
      para(data.summary, { after: 80 }),
    )
  }

  // ── Experience ────────────────────────────────────────────
  if (data.experience?.length) {
    children.push(heading('KINH NGHIỆM LÀM VIỆC'))
    for (const exp of data.experience) {
      const period = exp.isCurrent
        ? `${fmtDate(exp.startDate)} – Hiện tại`
        : `${fmtDate(exp.startDate)} – ${fmtDate(exp.endDate)}`

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role ?? '', bold: true, size: 20, color: DARK, font: 'Calibri' }),
            new TextRun({ text: '   ', size: 20, font: 'Calibri' }),
            new TextRun({ text: period, size: 16, color: MUTED, font: 'Calibri', italics: true }),
          ],
          spacing: { after: 40 },
        }),
        para(exp.company ?? '', { bold: true, muted: true, size: 17, after: 60 }),
        ...(exp.description ? [para(exp.description, { after: 120 })] : [divider()]),
      )
    }
  }

  // ── Education ─────────────────────────────────────────────
  if (data.education?.length) {
    children.push(heading('HỌC VẤN'))
    for (const edu of data.education) {
      const period = `${edu.startDate ?? ''} – ${edu.endDate ?? ''}`
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree ?? ''} ${edu.field ?? ''}`.trim(), bold: true, size: 20, color: DARK, font: 'Calibri' }),
            new TextRun({ text: `   ${period}`, size: 16, color: MUTED, italics: true, font: 'Calibri' }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.school ?? '', size: 17, color: MUTED, font: 'Calibri' }),
            ...(edu.gpa ? [new TextRun({ text: `   GPA: ${edu.gpa}`, size: 16, color: MUTED, font: 'Calibri' })] : []),
          ],
          spacing: { after: 120 },
        }),
      )
    }
  }

  // ── Skills ────────────────────────────────────────────────
  if (data.skills?.length) {
    children.push(heading('KỸ NĂNG'))

    // Group by category
    const groups: Record<string, typeof data.skills> = {}
    for (const sk of data.skills) {
      const cat = sk.category || 'Khác'
      if (!groups[cat]) groups[cat] = []
      groups[cat]!.push(sk)
    }

    for (const [cat, items] of Object.entries(groups)) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cat + ': ', bold: true, size: 18, color: MUTED, font: 'Calibri' }),
            ...items!.map((sk, i) => [
              new TextRun({ text: sk.name, size: 18, color: DARK, font: 'Calibri' }),
              new TextRun({ text: ` ${stars(sk.level ?? 0)}`, size: 14, color: ACCENT, font: 'Calibri' }),
              ...(i < items!.length - 1 ? [new TextRun({ text: '   ', size: 18, font: 'Calibri' })] : []),
            ]).flat(),
          ],
          spacing: { after: 80 },
        }),
      )
    }
  }

  // ── Projects ──────────────────────────────────────────────
  if (data.projects?.length) {
    children.push(heading('DỰ ÁN NỔI BẬT'))
    for (const p of data.projects) {
      children.push(
        para(p.name ?? '', { bold: true, size: 19, after: 40 }),
        ...(p.description ? [para(p.description, { after: 60 })] : []),
        ...(p.tech?.length
          ? [para(`Công nghệ: ${p.tech.join(', ')}`, { italic: true, muted: true, size: 16, after: 120 })]
          : [divider()]),
      )
    }
  }

  // ── Certifications ────────────────────────────────────────
  if (data.certifications?.length) {
    children.push(heading('CHỨNG CHỈ'))
    for (const c of data.certifications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: c.name ?? '', bold: true, size: 18, color: DARK, font: 'Calibri' }),
            ...(c.date ? [new TextRun({ text: `   ${fmtDate(c.date)}`, size: 16, color: MUTED, italics: true, font: 'Calibri' })] : []),
          ],
          spacing: { after: 40 },
        }),
        ...(c.issuer ? [para(c.issuer, { muted: true, size: 16, after: 100 })] : []),
      )
    }
  }

  // ── Languages ─────────────────────────────────────────────
  if (data.languages?.length) {
    children.push(heading('NGOẠI NGỮ'))
    for (const l of data.languages) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: l.language ?? '', bold: true, size: 18, color: DARK, font: 'Calibri' }),
            new TextRun({ text: `   —   ${levelText(l.level ?? '')}`, size: 17, color: MUTED, font: 'Calibri' }),
          ],
          spacing: { after: 80 },
        }),
      )
    }
  }

  // ── Build document ────────────────────────────────────────
  const doc = new Document({
    creator: 'webdrop.store CV Builder',
    title:   `CV — ${data.fullName ?? ''}`,
    sections: [{
      properties: {
        page: {
          margin: {
            top:    convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left:   convertInchesToTwip(0.9),
            right:  convertInchesToTwip(0.9),
          },
        },
      },
      children,
    }],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}
