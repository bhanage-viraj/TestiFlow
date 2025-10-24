'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken')
      console.log('Initializing auth with token:', !!storedToken)
      
      if (storedToken) {
        setToken(storedToken)
        try {
          const userData = await apiClient.getCurrentUser()
          console.log('Initial user data:', userData)
          setUser(userData)
        } catch (error) {
          console.error('Failed to fetch user on init:', error)
          // Token is invalid, clear it
          localStorage.removeItem('authToken')
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/auth/login')
  }, [router])

  const refreshUser = useCallback(async () => {
    if (!token) return

    try {
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        // Token is invalid, logout
        logout()
      }
    }
  }, [token, logout])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      console.log('Attempting login with:', { email })
      
      const response = await apiClient.login({ email, password })
      console.log('Login response:', response)
      
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken)
        setToken(response.accessToken)
        
        // Fetch user data after successful login
        const userData = await apiClient.getCurrentUser()
        console.log('User data:', userData)
        setUser(userData)
        
        toast.success('Welcome back!')
        router.push('/dashboard')
      } else {
        throw new Error('No access token received')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Login failed')
      } else {
        toast.error('An unexpected error occurred')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      await apiClient.signup({ name, email, password })
      
      toast.success('Account created successfully! Please log in.')
      router.push('/auth/login?signup=success')
    } catch (error) {
      console.error('Signup error:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Signup failed')
      } else {
        toast.error('An unexpected error occurred')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
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