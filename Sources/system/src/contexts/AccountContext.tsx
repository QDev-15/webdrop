'use client'
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

export interface Account {
  id: number
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
}

interface AccountContextValue {
  account: Account | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AccountContext = createContext<AccountContextValue | null>(null)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/account/me')
      if (res.ok) {
        const data = await res.json()
        setAccount(data.account)
      } else {
        setAccount(null)
      }
    } catch {
      setAccount(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const logout = useCallback(async () => {
    await fetch('/api/account/logout', { method: 'POST' })
    setAccount(null)
  }, [])

  const value = useMemo(() => ({ account, loading, refresh, logout }), [account, loading, refresh, logout])

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount phải dùng bên trong <AccountProvider>')
  return ctx
}
