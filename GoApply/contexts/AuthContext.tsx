"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserProfile } from '@/models/user'
import { api } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await api.getCurrentUser(token)
          if (response?.success) {
            setUser(response.data.user)
            setIsAuthenticated(true)
          } else {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem('token')
          }
        } 
        else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])



  const signOut = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}