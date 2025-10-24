'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  LayoutGrid, 
  ExternalLink, 
  Settings, 
  Trash2, 
  Loader2,
  Star,
  Users,
  Calendar,
  Copy,
  Check,
  Heart
} from 'lucide-react'
import toast from 'react-hot-toast'
import SpacesSkeleton from '@/components/SpacesSkeleton'

interface Space {
  id: string
  name: string
  redirectUrl: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSpaceName, setNewSpaceName] = useState('')
  const [newSpaceRedirectUrl, setNewSpaceRedirectUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadSpaces()
  }, [])

  const loadSpaces = async () => {
    try {
      setLoading(true)
      const spacesData = await apiClient.getSpaces()
      setSpaces(spacesData)
    } catch (error) {
      console.error('Failed to load spaces:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to load spaces')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSpaceName.trim() || !newSpaceRedirectUrl.trim()) return

    try {
      setCreating(true)
      const newSpace = await apiClient.createSpace({
        name: newSpaceName,
        redirectUrl: newSpaceRedirectUrl,
      })
      
      setSpaces([...spaces, newSpace])
      setNewSpaceName('')
      setNewSpaceRedirectUrl('')
      setShowCreateForm(false)
      
      toast.success('Space created successfully!')
    } catch (error) {
      console.error('Failed to create space:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to create space')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteSpace = async (spaceId: string, spaceName: string) => {
    if (!confirm(`Are you sure you want to delete "${spaceName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await apiClient.deleteSpace(spaceId)
      setSpaces(spaces.filter(space => space.id !== spaceId))
      toast.success('Space deleted successfully!')
    } catch (error) {
      console.error('Failed to delete space:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to delete space')
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSlug(type)
      toast.success(`${type} copied to clipboard!`)
      setTimeout(() => setCopiedSlug(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonial Spaces</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your testimonial collection spaces
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Space
        </Button>
      </div>

      {/* Create Space Form */}
      {showCreateForm && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Create New Testimonial Space
            </CardTitle>
            <CardDescription>
              Set up a new space to collect testimonials for your product or service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSpace} className="space-y-4">
              <div>
                <Label htmlFor="spaceName">Space Name *</Label>
                <Input
                  id="spaceName"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="e.g., My Amazing Product"
                  required
                  disabled={creating}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="redirectUrl">Redirect URL *</Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  value={newSpaceRedirectUrl}
                  onChange={(e) => setNewSpaceRedirectUrl(e.target.value)}
                  placeholder="https://your-website.com/thank-you"
                  required
                  disabled={creating}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Where users will be redirected after submitting a testimonial
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Space
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && <SpacesSkeleton />}

      {/* Spaces Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Card key={space.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900">{space.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Slug:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {space.slug}
                      </code>
                      <button
                        onClick={() => copyToClipboard(space.slug, 'slug')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedSlug === 'slug' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Redirect URL</span>
                    <span className="text-xs text-blue-600 truncate max-w-32" title={space.redirectUrl}>
                      {space.redirectUrl}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm">{new Date(space.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => router.push(`/dashboard/spaces/${space.id}`)}
                      >
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/spaces/${space.id}/wall-of-love`)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/t/${space.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteSpace(space.id, space.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {spaces.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <LayoutGrid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No testimonial spaces yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first testimonial space to start collecting feedback
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Space
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}