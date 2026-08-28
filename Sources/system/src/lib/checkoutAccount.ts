// Helper dùng chung giữa /api/orders (đơn miễn phí, xử lý ngay) và src/lib/orderConfirm.ts
// (đơn có thanh toán, xử lý khi webhook/admin xác nhận) — tránh lặp lại logic gắn Customer/
// CustomerAccount/CvProfile ở 2 nơi khác nhau.

import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { randomUUID } from 'crypto'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { AccountSessionPayload } from '@/lib/auth'

type Db = PrismaClient | Prisma.TransactionClient

function generateCvSlug(name: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30).replace(/-$/, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

/**
 * Trả về customerId để gắn vào Order — ưu tiên tài khoản đang đăng nhập (session), gắn thẳng
 * theo account thay vì match qua email (đáng tin cậy hơn, không phụ thuộc khách gõ đúng email
 * mỗi lần mua). Guest (chưa đăng nhập) giữ nguyên hành vi cũ: tìm-hoặc-tạo Customer theo email.
 */
export async function resolveCustomerId(
  db: Db,
  session: AccountSessionPayload | null,
  info: { name: string; phone: string; email?: string; company?: string }
): Promise<number> {
  if (session) {
    const account = await db.customerAccount.findUnique({ where: { id: session.id }, select: { customerId: true } })
    if (account?.customerId) return account.customerId

    const customer = await db.customer.create({
      data: { name: info.name, phone: info.phone, email: info.email || session.email, company: info.company || null, status: 'active' },
    })
    await db.customerAccount.update({ where: { id: session.id }, data: { customerId: customer.id } })
    return customer.id
  }

  const existing = info.email ? await db.customer.findFirst({ where: { email: info.email } }) : null
  if (existing) return existing.id

  const created = await db.customer.create({
    data: { name: info.name, phone: info.phone, email: info.email || null, company: info.company || null, status: 'active' },
  })
  return created.id
}

/** Đảm bảo CvProfile tồn tại cho 1 tài khoản (idempotent) — dùng khi mua CV lúc đã đăng nhập. */
export async function ensureCvProfileForAccount(db: Db, accountId: number, name: string): Promise<void> {
  const existing = await db.cvProfile.findUnique({ where: { accountId } })
  if (existing) return
  const slug = generateCvSlug(name)
  await db.cvProfile.create({ data: { accountId, slug, templateType: 'classic', data: { create: {} } } })
}

/**
 * Guest mua CV (chưa đăng nhập lúc checkout) — tìm/tạo CustomerAccount theo customerId đã gắn
 * hoặc theo email, kèm mật khẩu tạm hiển thị 1 lần nếu là tài khoản mới hoàn toàn.
 */
export async function createOrReuseGuestCvAccount(
  db: Db, customerId: number, name: string, email: string
): Promise<{ credentialToken: string }> {
  const existing =
    (await db.customerAccount.findFirst({ where: { customerId } })) ??
    (await db.customerAccount.findUnique({ where: { email } }))

  if (existing) {
    if (!existing.customerId) {
      await db.customerAccount.update({ where: { id: existing.id }, data: { customerId } })
    }
    await ensureCvProfileForAccount(db, existing.id, name)
    return { credentialToken: 'EXISTING_USER' }
  }

  const tempPassword = 'WD' + randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  const created = await db.customerAccount.create({
    data: { name, email, password: hashPassword(tempPassword), customerId },
  })
  await ensureCvProfileForAccount(db, created.id, name)
  return { credentialToken: tempPassword }
}
