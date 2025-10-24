'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/api'
import { Star, Heart, Loader2 } from 'lucide-react'

interface Review {
  id: string
  authorName: string
  rating: number
  text: string
  liked: boolean
  createdAt: string
}

interface Space {
  id: string
  name: string
  slug: string
}

export default function PublicWallOfLovePage() {
  const params = useParams()
  const spaceId = params.spaceId as string
  
  const [space, setSpace] = useState<Space | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Use embed endpoint which is public
      const [reviewsData] = await Promise.all([
        apiClient.getEmbedReviews(spaceId)
      ])
      
      // Filter only liked reviews
      setReviews(reviewsData.filter(review => review.liked))
      
      // Create a minimal space object from the data we have
      setSpace({
        id: spaceId,
        name: 'Customer Testimonials',
        slug: spaceId
      })
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [spaceId])

  useEffect(() => {
    loadData()
  }, [spaceId, loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wall of Love</h1>
          <p className="text-gray-600">No testimonials to display yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">Wall of Love</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our amazing customers are saying about us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex text-yellow-400 text-lg mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < review.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
              
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-4 italic">
                &quot;{review.text}&quot;
              </blockquote>
              
              <div className="flex items-center justify-between">
                <cite className="font-semibold text-gray-900 not-italic">
                  — {review.authorName}
                </cite>
                <Heart className="h-5 w-5 text-red-500 fill-current" />
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Powered by <span className="font-semibold text-blue-600">TestiFlow</span>
          </p>
        </div>
      </div>
    </div>
  )
}
