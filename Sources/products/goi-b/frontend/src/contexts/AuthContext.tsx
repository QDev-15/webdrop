import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

interface User { id: number; name: string; email: string; role: string }
interface AuthCtx {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Kiểm tra session khi load lần đầu
  useEffect(() => {
    api.get<User>('/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const u = await api.post<User>('/auth/login', { email, password })
    setUser(u)
  }

  async function logout() {
    await api.post('/auth/logout', {}).catch(() => {})
    setUser(null)
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
