'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/api'
import { Star, Heart, Loader2, AlertCircle, MessageSquare } from 'lucide-react'

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

export default function EmbedPage() {
  const params = useParams()
  const spaceId = params.spaceId as string
  
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true)
      const reviewsData = await apiClient.getEmbedReviews(spaceId)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Failed to load reviews:', error)
      if (error instanceof ApiError) {
        setError(error.message || 'Failed to load testimonials')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [spaceId])

  useEffect(() => {
    if (spaceId) {
      loadReviews()
    }
  }, [spaceId, loadReviews])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Testimonials</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center p-8">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Testimonials Yet</h3>
        <p className="text-gray-600">Check back later for customer testimonials.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
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
              {review.liked && (
                <Heart className="h-4 w-4 text-red-500 fill-current ml-2" />
              )}
            </div>
            
            {/* Testimonial Text */}
            <blockquote className="text-gray-700 mb-4 leading-relaxed">
              &quot;{review.text}&quot;
            </blockquote>
            
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  {review.authorName}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}