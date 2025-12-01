import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi } from '@/api/auth'
import { User } from '@/types/user'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const userData = await authApi.getMe()
      setUser(userData)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser()
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = () => {
    window.location.href = authApi.getGoogleAuthUrl()
  }

  const logout = async () => {
    try {
      await authApi.logout()
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
