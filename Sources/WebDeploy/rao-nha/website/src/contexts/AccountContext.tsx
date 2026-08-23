import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../api/client'

export interface Account {
  id: number
  name: string
  email: string
  phone: string
  role: string
  avatar: string
  credit_balance: number
  status: string
}

interface AccountContextType {
  account: Account | null
  loading: boolean
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { name: string; email: string; phone: string }) => Promise<void>
  refresh: () => Promise<void>
}

const AccountContext = createContext<AccountContextType | null>(null)

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const acc = await api.get<Account>('/public/accounts/me')
      setAccount(acc)
    } catch {
      setAccount(null)
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    const acc = await api.post<Account>('/public/accounts/register', data)
    setAccount(acc)
  }

  const login = async (email: string, password: string) => {
    const acc = await api.post<Account>('/public/accounts/login', { email, password })
    setAccount(acc)
  }

  const logout = async () => {
    await api.post('/public/accounts/logout', {})
    setAccount(null)
  }

  const updateProfile = async (data: { name: string; email: string; phone: string }) => {
    const acc = await api.post<Account>('/public/accounts/me/update', data)
    setAccount(acc)
  }

  return (
    <AccountContext.Provider value={{ account, loading, register, login, logout, updateProfile, refresh }}>
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within AccountProvider')
  return ctx
}
