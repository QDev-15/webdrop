import { NextResponse } from 'next/server'
import { CV_COOKIE_NAME_EXPORT as CV_COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(CV_COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return res
}
