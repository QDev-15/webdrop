import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  const body = await req.json()
  const { name, role } = body

  const updateData: { name?: string; role?: UserRole } = {}
  if (name?.trim()) updateData.name = name.trim()

  if (role === 'superadmin') {
    updateData.role = UserRole.superadmin
  } else if (role === 'user') {
    if (id === session.id) {
      return NextResponse.json({ error: 'Không thể tự hạ cấp tài khoản đang đăng nhập' }, { status: 400 })
    }
    const superadminCount = await prisma.user.count({ where: { role: UserRole.superadmin } })
    if (superadminCount <= 1) {
      return NextResponse.json({ error: 'Phải có ít nhất 1 superadmin trong hệ thống' }, { status: 400 })
    }
    updateData.role = UserRole.user
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Không có thông tin để cập nhật' }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json(user)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  if (id === session.id) {
    return NextResponse.json({ error: 'Không thể xóa tài khoản đang đăng nhập' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } })
  if (!target) return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 })

  if (target.role === UserRole.superadmin) {
    const superadminCount = await prisma.user.count({ where: { role: UserRole.superadmin } })
    if (superadminCount <= 1) {
      return NextResponse.json({ error: 'Phải có ít nhất 1 superadmin trong hệ thống' }, { status: 400 })
    }
  }

  try {
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2025') return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi xóa người dùng' }, { status: 500 })
  }
}
