import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  getUser,
  isAuthenticated,
  onAuthStateChange,
  register,
  restoreSession,
  signIn as authenticate,
  signOut as clearAuth,
  type RegisterUser
} from '@lib/auth'
import type { UsersResponse } from '@lib/db.types'

interface AuthContextValue {
  user: UsersResponse | null
  loading: boolean
  error: unknown
  register: (input: RegisterUser) => Promise<UsersResponse>
  login: (email: string, password: string) => Promise<UsersResponse>
  signIn: (email: string, password: string) => Promise<UsersResponse>
  signOut: () => void
  logout: () => void
  getUser: () => UsersResponse | null
  isAuthenticated: () => boolean
  onAuthStateChange: (
    listener: (authenticated: boolean, user: UsersResponse | null) => void
  ) => () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let active = true
    const unsubscribe = onAuthStateChange((_authenticated, currentUser) => {
      if (active) setUser(currentUser)
    })

    void restoreSession()
      .then((restoredUser) => {
        if (active) {
          setUser(restoredUser)
          setError(null)
        }
      })
      .catch((restoreError: unknown) => {
        if (active) {
          setUser(getUser())
          setError(restoreError)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    const authenticatedUser = await authenticate(email, password)
    setUser(authenticatedUser)
    return authenticatedUser
  }, [])

  const signOut = useCallback(() => {
    clearAuth()
    setUser(null)
    setError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      register,
      login,
      signIn: login,
      signOut,
      logout: signOut,
      getUser,
      isAuthenticated,
      onAuthStateChange
    }),
    [user, loading, error, login, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
