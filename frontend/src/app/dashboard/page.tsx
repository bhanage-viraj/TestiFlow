'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  LayoutGrid, 
  Star, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Heart,
  ExternalLink,
  Calendar,
  Activity,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardSkeleton from '@/components/DashboardSkeleton'

interface Space {
  id: string
  name: string
  slug: string
  redirectUrl: string
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

interface DashboardStats {
  totalSpaces: number
  totalTestimonials: number
  thisMonthTestimonials: number
  likedTestimonials: number
  averageRating: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [spaces, setSpaces] = useState<Space[]>([])
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalSpaces: 0,
    totalTestimonials: 0,
    thisMonthTestimonials: 0,
    likedTestimonials: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load spaces
      const spacesData = await apiClient.getSpaces()
      setSpaces(spacesData)
      
      // Load reviews for all spaces and calculate stats
      let allReviews: Review[] = []
      
      for (const space of spacesData) {
        try {
          const reviews = await apiClient.getReviews(space.id)
          allReviews = [...allReviews, ...reviews]
        } catch (error) {
          console.warn(`Failed to load reviews for space ${space.id}:`, error)
        }
      }
      
      // Sort reviews by date (most recent first) and take last 3
      const sortedReviews = allReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setRecentReviews(sortedReviews.slice(0, 3))
      
      // Calculate stats
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const thisMonthReviews = allReviews.filter(review => 
        new Date(review.createdAt) >= thisMonth
      )
      
      const likedReviews = allReviews.filter(review => review.liked)
      
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0
      
      setStats({
        totalSpaces: spacesData.length,
        totalTestimonials: allReviews.length,
        thisMonthTestimonials: thisMonthReviews.length,
        likedTestimonials: likedReviews.length,
        averageRating: Math.round(averageRating * 10) / 10
      })
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to load dashboard data')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const dashboardStats = [
    { 
      name: 'Total Spaces', 
      value: stats.totalSpaces.toString(), 
      icon: LayoutGrid, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: spaces.length > 0 ? '+100%' : null
    },
    { 
      name: 'Testimonials', 
      value: stats.totalTestimonials.toString(), 
      icon: Star, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: stats.thisMonthTestimonials > 0 ? `+${stats.thisMonthTestimonials} this month` : null
    },
    { 
      name: 'Loved Reviews', 
      value: stats.likedTestimonials.toString(), 
      icon: Heart, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: stats.likedTestimonials > 0 ? `${Math.round((stats.likedTestimonials / stats.totalTestimonials) * 100)}% loved` : null
    },
    { 
      name: 'Avg Rating', 
      value: stats.averageRating > 0 ? stats.averageRating.toString() : '0', 
      icon: TrendingUp, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: stats.averageRating > 0 ? `⭐ ${stats.averageRating}/5` : null
    },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-blue-100 text-xl mb-4">
                Ready to collect some amazing testimonials today?
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => router.push('/dashboard/spaces')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Space
                </Button>
                <Button 
                  onClick={loadDashboardData}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-12 h-12 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.name} className="card-hover border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <LayoutGrid className="w-5 h-5 mr-2" />
              Your Spaces ({spaces.length})
            </CardTitle>
            <CardDescription className="text-blue-100">
              Manage your testimonial collection spaces
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {spaces.length === 0 ? (
              <div className="text-center py-8">
                <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No spaces yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first testimonial space to start collecting feedback
                </p>
                <Button 
                  onClick={() => router.push('/dashboard/spaces')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Space
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {spaces.slice(0, 3).map((space) => (
                  <div 
                    key={space.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/spaces/${space.id}`)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{space.name}</h4>
                      <p className="text-sm text-gray-500">/{space.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          const url = `${window.location.origin}/t/${space.slug}`
                          navigator.clipboard.writeText(url)
                          toast.success('Link copied!')
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
                {spaces.length > 3 && (
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/dashboard/spaces')}
                    className="w-full"
                  >
                    View All {spaces.length} Spaces
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-purple-100">
              Your latest testimonial activity
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {recentReviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No activity yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Once you start collecting testimonials, they'll appear here
                </p>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard/spaces')}
                >
                  View All Spaces
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{review.authorName}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {review.liked && (
                          <Heart className="w-3 h-3 text-red-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">"{review.text}"</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard/spaces')}
                  className="w-full"
                >
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Getting Started
          </CardTitle>
          <CardDescription className="text-green-100">
            Follow these steps to start collecting testimonials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Create a Space</h3>
              <p className="text-gray-600">
                Set up your first testimonial collection space with a custom URL
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Share the Link</h3>
              <p className="text-gray-600">
                Share the public link with your customers via email, social media, or website
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Embed & Display</h3>
              <p className="text-gray-600">
                Use our Wall of Love feature to embed testimonials on your website
              </p>
            </div>
          </div>
          
          {stats.totalSpaces === 0 && (
            <div className="mt-8 text-center">
              <Button 
                onClick={() => router.push('/dashboard/spaces')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
