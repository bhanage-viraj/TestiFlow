'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { apiClient, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Heart,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function TestimonialSubmissionPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    rating: 0,
    text: '',
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.authorName.trim() || !formData.text.trim() || formData.rating === 0) {
      toast.error('Please fill in all required fields and select a rating.')
      return
    }

    try {
      setSubmitting(true)
      
      const reviewData = {
        authorName: formData.authorName.trim(),
        authorEmail: formData.authorEmail.trim() || undefined,
        rating: formData.rating,
        text: formData.text.trim(),
      }

      await apiClient.createReview(slug, reviewData)
      
      setSubmitted(true)
      toast.success('Thank you for your testimonial!')
      
    } catch (error) {
      console.error('Failed to submit testimonial:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to submit testimonial')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-6">
              <Image 
                src="/thank-you-image.jpeg" 
                alt="Testimonial submitted" 
                width={200}
                height={200}
                className="mx-auto rounded-lg object-cover shadow-lg"
              />
            </div>
            <CardDescription className="text-green-700">
              Your testimonial has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              We appreciate you taking the time to share your experience with us.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Your feedback means the world to us!</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Share Your Experience
          </CardTitle>
          <CardDescription>
            Your feedback helps others make informed decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <Label className="text-base font-medium">Rating *</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredStar || formData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating > 0 && `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="authorName">Your Name *</Label>
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                placeholder="Enter your name"
                required
                disabled={submitting}
                className="mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="authorEmail">Email (Optional)</Label>
              <Input
                id="authorEmail"
                type="email"
                value={formData.authorEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
                placeholder="your.email@example.com"
                disabled={submitting}
                className="mt-1"
              />
            </div>

            {/* Testimonial */}
            <div>
              <Label htmlFor="text">Your Testimonial *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Share your experience and thoughts..."
                rows={4}
                required
                disabled={submitting}
                className="mt-1"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={submitting || formData.rating === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Testimonial
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}