'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Edit3, 
  Save, 
  X,
  Copy,
  Check,
  Code,
  Users,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Space {
  id: string
  name: string
  redirectUrl: string
  slug: string
  createdAt: string
  updatedAt: string
}

interface Review {
  id: string
  authorName: string
  authorEmail?: string
  rating: number
  text: string
  liked: boolean
  createdAt: string
  updatedAt: string
}

export default function SpaceManagementPage() {
  const params = useParams()
  const router = useRouter()
  const spaceId = params.spaceId as string
  
  const [space, setSpace] = useState<Space | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', redirectUrl: '' })
  const [saving, setSaving] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    if (spaceId) {
      loadSpaceData()
    }
  }, [spaceId])

  const loadSpaceData = async () => {
    try {
      setLoading(true)
      const [spaceData, reviewsData] = await Promise.all([
        apiClient.getSpace(spaceId),
        apiClient.getReviews(spaceId)
      ])
      setSpace(spaceData)
      setReviews(reviewsData)
      setEditForm({
        name: spaceData.name,
        redirectUrl: spaceData.redirectUrl
      })
    } catch (error) {
      console.error('Failed to load space data:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to load space data')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!space) return

    try {
      setSaving(true)
      const updatedSpace = await apiClient.updateSpace(spaceId, editForm)
      setSpace(updatedSpace)
      setEditing(false)
      
      toast.success('Space updated successfully!')
    } catch (error) {
      console.error('Failed to update space:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to update space')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: space?.name || '',
      redirectUrl: space?.redirectUrl || ''
    })
    setEditing(false)
  }

  const handleDeleteSpace = async () => {
    if (!space) return
    
    if (!confirm(`Are you sure you want to delete "${space.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await apiClient.deleteSpace(spaceId)
      toast.success('Space deleted successfully!')
      router.push('/dashboard/spaces')
    } catch (error) {
      console.error('Failed to delete space:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to delete space')
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const handleToggleLike = async (reviewId: string) => {
    try {
      const updatedReview = await apiClient.toggleReviewLike(reviewId)
      setReviews(reviews.map(review => 
        review.id === reviewId ? updatedReview : review
      ))
    } catch (error) {
      console.error('Failed to toggle like:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to update review')
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const handleDeleteReview = async (reviewId: string, authorName: string) => {
    if (!confirm(`Are you sure you want to delete the review by "${authorName}"?`)) {
      return
    }

    try {
      await apiClient.deleteReview(reviewId)
      setReviews(reviews.filter(review => review.id !== reviewId))
      toast.success('Review deleted successfully!')
    } catch (error) {
      console.error('Failed to delete review:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to delete review')
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(type)
      toast.success(`${type} code copied to clipboard!`)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading space...</span>
      </div>
    )
  }

  if (!space) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Space not found</h2>
        <p className="text-gray-600 mb-4">The space you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/dashboard/spaces')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Spaces
        </Button>
      </div>
    )
  }

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/t/${space.slug}`
  const embedUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/embed/${space.id}`
  
  const htmlEmbedCode = `<div id="testiflow-widget-${space.slug}"></div>
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = '${embedUrl}';
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    document.getElementById('testiflow-widget-${space.slug}').appendChild(iframe);
  })();
</script>`

  const reactEmbedCode = `import { useEffect, useRef } from 'react';

export default function TestimonialWidget() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = '${embedUrl}';
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: '100%',
        height: '400px',
        border: 'none',
        borderRadius: '8px'
      }}
    />
  );
}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/spaces')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editing ? (
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-3xl font-bold border-none p-0 h-auto"
                />
              ) : (
                space.name
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Slug: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{space.slug}</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => window.open(`/t/${space.slug}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/dashboard/spaces/${spaceId}/wall-of-love`)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Wall of Love
              </Button>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDeleteSpace}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Space Details */}
      <Card>
        <CardHeader>
          <CardTitle>Space Details</CardTitle>
          <CardDescription>Manage your testimonial collection space</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Redirect URL</Label>
            {editing ? (
              <Input
                value={editForm.redirectUrl}
                onChange={(e) => setEditForm(prev => ({ ...prev, redirectUrl: e.target.value }))}
                placeholder="https://your-website.com/thank-you"
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1 break-all">{space.redirectUrl}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Created</Label>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(space.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label>Last Updated</Label>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(space.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embed Code Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Embed Code
          </CardTitle>
          <CardDescription>
            Add testimonials to your website using these embed codes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Public URL */}
          <div>
            <Label>Public Testimonial Page</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={publicUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(publicUrl, 'URL')}
              >
                {copiedCode === 'URL' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(publicUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* HTML Embed */}
          <div>
            <Label>HTML Embed Code</Label>
            <div className="mt-1">
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                {htmlEmbedCode}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(htmlEmbedCode, 'HTML')}
              >
                {copiedCode === 'HTML' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy HTML Code
              </Button>
            </div>
          </div>

          {/* React Embed */}
          <div>
            <Label>React Component</Label>
            <div className="mt-1">
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                {reactEmbedCode}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(reactEmbedCode, 'React')}
              >
                {copiedCode === 'React' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy React Code
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Copy the embed code above</li>
              <li>2. Paste it into your website's HTML or React component</li>
              <li>3. The testimonials will automatically load and display</li>
              <li>4. Users can submit new testimonials through the widget</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Testimonials ({reviews.length})
          </CardTitle>
          <CardDescription>Manage testimonials for this space</CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No testimonials yet
              </h3>
              <p className="text-gray-600 mb-4">
                Share the public link to start collecting testimonials
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.open(`/t/${space.slug}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.authorName}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.text}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleLike(review.id)}
                          className={review.liked ? 'text-red-500' : 'text-gray-400'}
                        >
                          <Heart className={`h-4 w-4 ${review.liked ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id, review.authorName)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}