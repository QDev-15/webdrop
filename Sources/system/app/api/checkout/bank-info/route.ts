import { NextResponse } from 'next/server'
import { getSepayBankInfo } from '@/lib/sepay'

export async function GET() {
  const bank = await getSepayBankInfo()
  return NextResponse.json(bank)
}
