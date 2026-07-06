'use client'
import { useEffect, useState } from 'react'

export interface BankInfo {
  bankName: string
  bankCode: string
  accountNo: string
  accountName: string
}

const FALLBACK: BankInfo = {
  bankName: 'MB Bank',
  bankCode: 'MB',
  accountNo: '0988632841',
  accountName: 'NGUYEN HUU QUYNH',
}

export function useBankInfo(): BankInfo {
  const [bank, setBank] = useState<BankInfo>(FALLBACK)

  useEffect(() => {
    fetch('/api/checkout/bank-info')
      .then(r => r.json())
      .then(data => {
        if (data.bankName && data.accountNo) setBank(data)
      })
      .catch(() => {})
  }, [])

  return bank
}
