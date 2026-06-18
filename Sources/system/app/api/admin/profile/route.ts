import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, hashPassword, verifyPassword } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  if (!user) return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 })

  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, currentPassword, newPassword } = body

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 })

  const updateData: { name?: string; password?: string } = {}

  if (name !== undefined) {
    if (!name.trim()) return NextResponse.json({ error: 'Tên không được để trống' }, { status: 400 })
    if (name.trim().length > 100) return NextResponse.json({ error: 'Tên quá dài (tối đa 100 ký tự)' }, { status: 400 })
    updateData.name = name.trim()
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Vui lòng nhập mật khẩu hiện tại' }, { status: 400 })
    }
    if (!verifyPassword(currentPassword, user.password)) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải ít nhất 6 ký tự' }, { status: 400 })
    }
    updateData.password = hashPassword(newPassword)
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Không có thông tin để cập nhật' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: session.id }, data: updateData })
  return NextResponse.json({ ok: true })
}
