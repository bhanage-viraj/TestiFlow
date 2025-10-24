'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DebugPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await apiClient.login({ email, password })
      setResult({ type: 'login', data: response })
    } catch (error) {
      setResult({ type: 'login', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testGetUser = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getCurrentUser()
      setResult({ type: 'getUser', data: response })
    } catch (error) {
      setResult({ type: 'getUser', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testGetSpaces = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getSpaces()
      setResult({ type: 'getSpaces', data: response })
    } catch (error) {
      setResult({ type: 'getSpaces', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testCreateSpace = async () => {
    setLoading(true)
    try {
      const response = await apiClient.createSpace({
        name: 'Test Space',
        redirectUrl: 'https://example.com'
      })
      setResult({ type: 'createSpace', data: response })
    } catch (error) {
      setResult({ type: 'createSpace', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
            <Button onClick={testLogin} disabled={loading}>
              {loading ? 'Testing...' : 'Test Login'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test API Calls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testGetUser} disabled={loading} className="w-full">
              {loading ? 'Testing...' : 'Test Get User'}
            </Button>
            <Button onClick={testGetSpaces} disabled={loading} className="w-full">
              {loading ? 'Testing...' : 'Test Get Spaces'}
            </Button>
            <Button onClick={testCreateSpace} disabled={loading} className="w-full">
              {loading ? 'Testing...' : 'Test Create Space'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


