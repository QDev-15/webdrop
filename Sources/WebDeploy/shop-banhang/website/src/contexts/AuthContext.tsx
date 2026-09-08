import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SessionUser {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: SessionUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<SessionUser>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try { setUser(await api.get<SessionUser>('/auth/me')) }
    catch { setUser(null) }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const u = await api.post<SessionUser>('/auth/login', { email, password })
    setUser(u)
    return u
  }

  const logout = async () => {
    await api.post('/auth/logout', {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
