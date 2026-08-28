import { scryptSync, randomBytes, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'wd_session'
const CV_COOKIE_NAME = 'wd_cv_session'
const ACCOUNT_COOKIE_NAME = 'wd_account_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const ACCOUNT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days — tài khoản khách hàng nhớ đăng nhập lâu hơn admin

function getSecret(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET env var is required')
  return s
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = scryptSync(password, salt, 64)
  return timingSafeEqual(derived, Buffer.from(hash, 'hex'))
}

export function createSessionToken(payload: { id: number; email: string; role: string }): string {
  const secret = getSecret()
  const data = Buffer.from(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + COOKIE_MAX_AGE * 1000,
  })).toString('base64url')
  const sig = createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifySessionToken(token: string): { id: number; email: string; role: string } | null {
  const secret = getSecret()
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [data, sig] = parts
  const expected = createHmac('sha256', secret).update(data).digest('base64url')
  const sigBuf = Buffer.from(sig, 'base64url')
  const expectedBuf = Buffer.from(expected, 'base64url')
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function getSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export function getCvSessionCookieOptions() {
  return {
    name: CV_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  }
}

export async function getCvSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(CV_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

// ─── Tài khoản khách hàng công khai (CustomerAccount) — hoàn toàn tách biệt khỏi
// admin `wd_session` và CV cũ `wd_cv_session`. Payload không có `role` (không phân quyền). ───

export interface AccountSessionPayload {
  id: number
  email: string
  phone: string | null
}

export function createAccountSessionToken(payload: AccountSessionPayload): string {
  const secret = getSecret()
  const data = Buffer.from(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + ACCOUNT_COOKIE_MAX_AGE * 1000,
  })).toString('base64url')
  const sig = createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifyAccountSessionToken(token: string): AccountSessionPayload | null {
  const secret = getSecret()
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [data, sig] = parts
  const expected = createHmac('sha256', secret).update(data).digest('base64url')
  const sigBuf = Buffer.from(sig, 'base64url')
  const expectedBuf = Buffer.from(expected, 'base64url')
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function getAccountSessionCookieOptions() {
  return {
    name: ACCOUNT_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: ACCOUNT_COOKIE_MAX_AGE,
    path: '/',
  }
}

export async function getAccountSession(): Promise<AccountSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCOUNT_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAccountSessionToken(token)
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME
export const CV_COOKIE_NAME_EXPORT = CV_COOKIE_NAME
export const ACCOUNT_COOKIE_NAME_EXPORT = ACCOUNT_COOKIE_NAME
