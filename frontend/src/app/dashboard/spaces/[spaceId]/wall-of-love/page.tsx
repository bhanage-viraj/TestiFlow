'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { apiClient, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  Star, 
  Code, 
  Copy, 
  Check, 
  ExternalLink,
  Loader2,
  Grid,
  List,
  ArrowLeft,
  Sparkles,
  Zap,
  Activity,
  Plus,
  Users
} from 'lucide-react'
import toast from 'react-hot-toast'

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

interface Space {
  id: string
  name: string
  slug: string
  redirectUrl: string
}

type TemplateType = 'grid' | 'slider' | 'masonry' | 'minimal' | 'card-stack'

const templates = [
  { 
    id: 'grid', 
    name: 'Grid Layout', 
    description: 'Clean grid of testimonial cards',
    preview: 'grid'
  },
  { 
    id: 'slider', 
    name: 'Slider', 
    description: 'Horizontal scrolling testimonials',
    preview: 'slider'
  },
  { 
    id: 'masonry', 
    name: 'Masonry', 
    description: 'Pinterest-style layout',
    preview: 'masonry'
  },
  { 
    id: 'minimal', 
    name: 'Minimal List', 
    description: 'Simple vertical list',
    preview: 'minimal'
  },
  { 
    id: 'card-stack', 
    name: 'Card Stack', 
    description: 'Stacked card design',
    preview: 'stack'
  }
]

// Sample data for previews
const sampleReviews = [
  { id: '1', rating: 5, text: 'Amazing product! Highly recommend.', authorName: 'John Doe' },
  { id: '2', rating: 4, text: 'Great experience, very satisfied.', authorName: 'Jane Smith' },
  { id: '3', rating: 5, text: 'Exceeded my expectations!', authorName: 'Mike Johnson' },
  { id: '4', rating: 5, text: 'Outstanding quality and service.', authorName: 'Sarah Wilson' }
]

export default function WallOfLovePage() {
  const params = useParams()
  const spaceId = params.spaceId as string
  
  const [space, setSpace] = useState<Space | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('grid')
  const [selectedFramework, setSelectedFramework] = useState<'html' | 'react' | 'nextjs'>('html')
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    loadSpaceAndReviews()
  }, [spaceId])

  const loadSpaceAndReviews = async () => {
    try {
      setLoading(true)
      const [spaceData, reviewsData] = await Promise.all([
        apiClient.getSpace(spaceId),
        apiClient.getReviews(spaceId)
      ])
      
      setSpace(spaceData)
      // Filter only liked reviews
      setReviews(reviewsData.filter(review => review.liked))
    } catch (error) {
      console.error('Failed to load data:', error)
      if (error instanceof ApiError) {
        toast.error(error.message || 'Failed to load data')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const generateCode = () => {
    const likedReviews = reviews.filter(review => review.liked)
    
    if (selectedFramework === 'html') {
      return generateHTMLCode(likedReviews, selectedTemplate)
    } else if (selectedFramework === 'react') {
      return generateReactCode(likedReviews, selectedTemplate)
    } else {
      return generateNextJSCode(likedReviews, selectedTemplate)
    }
  }

  const generateHTMLCode = (reviews: Review[], template: TemplateType) => {
    const reviewsHTML = reviews.map(review => `
    <div class="testimonial-card">
      <div class="testimonial-rating">
        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
      </div>
      <p class="testimonial-text">"${review.text}"</p>
      <div class="testimonial-author">
        <strong>${review.authorName}</strong>
      </div>
    </div>`).join('')

    const baseCSS = `
<style>
.testimonials-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.testimonial-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.testimonial-rating {
  color: #fbbf24;
  font-size: 18px;
  margin-bottom: 10px;
}

.testimonial-text {
  font-style: italic;
  margin-bottom: 15px;
  line-height: 1.6;
}

.testimonial-author {
  color: #6b7280;
}
</style>`

    let layoutCSS = ''
    let containerClass = 'testimonials-container'

    switch (template) {
      case 'grid':
        layoutCSS = `
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}`
        containerClass += ' testimonials-grid'
        break
      case 'slider':
        layoutCSS = `
.testimonials-slider {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 10px;
}
.testimonials-slider .testimonial-card {
  min-width: 300px;
  flex-shrink: 0;
}`
        containerClass += ' testimonials-slider'
        break
      case 'masonry':
        layoutCSS = `
.testimonials-masonry {
  column-count: 3;
  column-gap: 20px;
}
.testimonials-masonry .testimonial-card {
  break-inside: avoid;
  margin-bottom: 20px;
}
@media (max-width: 768px) {
  .testimonials-masonry { column-count: 1; }
}`
        containerClass += ' testimonials-masonry'
        break
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testimonials - ${space?.name}</title>
    ${baseCSS}
    <style>${layoutCSS}</style>
</head>
<body>
    <div class="${containerClass}">
        ${reviewsHTML}
    </div>
</body>
</html>`
  }

  const generateReactCode = (reviews: Review[], template: TemplateType) => {
    return `import React from 'react';

const Testimonials = () => {
  const testimonials = ${JSON.stringify(reviews.map(r => ({
    rating: r.rating,
    text: r.text,
    authorName: r.authorName
  })), null, 2)};

  const StarRating = ({ rating }) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < rating ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="${getTemplateClassName(template)}">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <StarRating rating={testimonial.rating} />
            <p className="italic mt-3 mb-4 text-gray-700">
              "{testimonial.text}"
            </p>
            <div className="font-semibold text-gray-900">
              {testimonial.authorName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;`
  }

  const generateNextJSCode = (reviews: Review[], template: TemplateType) => {
    return `'use client'

import React from 'react';

interface Testimonial {
  rating: number;
  text: string;
  authorName: string;
}

const TestimonialsWall: React.FC = () => {
  const testimonials: Testimonial[] = ${JSON.stringify(reviews.map(r => ({
    rating: r.rating,
    text: r.text,
    authorName: r.authorName
  })), null, 2)};

  const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
      <div className="flex text-yellow-400 text-lg">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < rating ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
      <div className="${getTemplateClassName(template)}">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <StarRating rating={testimonial.rating} />
            <blockquote className="italic mt-4 mb-4 text-gray-700 text-lg leading-relaxed">
              "{testimonial.text}"
            </blockquote>
            <cite className="font-semibold text-gray-900 not-italic">
              — {testimonial.authorName}
            </cite>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsWall;`
  }

  const getTemplateClassName = (template: TemplateType) => {
    switch (template) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'slider':
        return 'flex overflow-x-auto gap-6 pb-4'
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6'
      case 'minimal':
        return 'space-y-6'
      case 'card-stack':
        return 'space-y-4'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  const renderTemplatePreview = (template: any) => {
    const miniReviews = sampleReviews.slice(0, 4)
    
    const PreviewCard = ({ review, className = '', style = {}, size = 'normal' }: { 
      review: any, 
      className?: string, 
      style?: any,
      size?: 'small' | 'normal' | 'large'
    }) => {
      const sizeClasses = {
        small: 'p-1.5 text-xs',
        normal: 'p-2 text-xs',
        large: 'p-3 text-sm'
      }
      
      return (
        <div className={`bg-gradient-to-br from-white to-gray-50 rounded border border-gray-200 shadow-sm overflow-hidden ${sizeClasses[size]} ${className}`} style={style}>
          <div className="flex text-yellow-400 mb-1" style={{ fontSize: '0.6rem' }}>
            {[...Array(Math.min(review.rating, 5))].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <p className="text-gray-700 italic mb-1 overflow-hidden" style={{ 
            fontSize: '0.6rem',
            lineHeight: '0.8rem',
            display: '-webkit-box',
            WebkitLineClamp: size === 'small' ? 1 : 2,
            WebkitBoxOrient: 'vertical',
          }}>
            "{review.text.length > 30 ? review.text.substring(0, 30) + '...' : review.text}"
          </p>
          <div className="font-medium text-gray-900 truncate" style={{ fontSize: '0.55rem' }}>
            {review.authorName}
          </div>
        </div>
      )
    }

    switch (template.preview) {
      case 'grid':
        return (
          <div className="h-32 p-2 bg-gray-50 rounded-lg relative overflow-hidden">
            <div className="grid grid-cols-2 gap-1.5 h-full">
              {miniReviews.slice(0, 4).map((review, index) => (
                <PreviewCard 
                  key={review.id} 
                  review={review} 
                  size="small"
                  className="hover:shadow-md transition-all duration-300"
                />
              ))}
            </div>
            <div className="absolute top-1 right-1">
              <Grid className="h-3 w-3 text-gray-500" />
            </div>
          </div>
        )
      
      case 'slider':
        return (
          <div className="h-32 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg overflow-hidden relative">
            <div className="flex gap-1.5 h-full">
              {miniReviews.slice(0, 3).map((review, index) => (
                <div
                  key={review.id}
                  className="flex-1 min-w-0"
                >
                  <PreviewCard 
                    review={review} 
                    size="small"
                    className="border border-blue-200 shadow-sm h-full"
                  />
                </div>
              ))}
            </div>
            <div className="absolute top-1 right-1">
              <Zap className="h-3 w-3 text-blue-500" />
            </div>
          </div>
        )
      
      case 'masonry':
        return (
          <div className="h-32 p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg relative overflow-hidden">
            <div className="grid grid-cols-3 gap-1 h-full">
              <div className="space-y-1">
                <PreviewCard review={miniReviews[0]} size="small" className="h-14" />
                <PreviewCard review={miniReviews[1]} size="small" className="h-10" />
              </div>
              <div className="space-y-1">
                <PreviewCard review={miniReviews[2]} size="small" className="h-10" />
                <PreviewCard review={miniReviews[0]} size="small" className="h-14" />
              </div>
              <div className="space-y-1">
                <PreviewCard review={miniReviews[1]} size="small" className="h-16" />
                <PreviewCard review={miniReviews[2]} size="small" className="h-6" />
              </div>
            </div>
            <div className="absolute top-1 right-1">
              <Sparkles className="h-3 w-3 text-purple-500" />
            </div>
          </div>
        )
      
      case 'minimal':
        return (
          <div className="h-32 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg relative overflow-hidden">
            <div className="space-y-1.5">
              {miniReviews.slice(0, 3).map((review, index) => (
                <div key={review.id} className="flex items-center border-l-2 border-green-300 pl-2 bg-white/50 rounded-r py-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex text-yellow-400 mb-0.5" style={{ fontSize: '0.5rem' }}>
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 italic truncate" style={{ fontSize: '0.6rem' }}>
                      "{review.text.length > 25 ? review.text.substring(0, 25) + '...' : review.text}"
                    </p>
                    <div className="text-gray-600 font-medium truncate" style={{ fontSize: '0.55rem' }}>
                      {review.authorName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-1 right-1">
              <List className="h-3 w-3 text-green-500" />
            </div>
          </div>
        )
      
      case 'stack':
        return (
          <div className="h-32 p-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg relative overflow-hidden">
            {miniReviews.slice(0, 3).map((review, index) => (
              <div 
                key={review.id} 
                className="absolute bg-white border border-orange-200 rounded shadow-sm overflow-hidden"
                style={{ 
                  top: `${4 + index * 4}px`, 
                  left: `${4 + index * 6}px`,
                  right: `${4 + (2-index) * 3}px`,
                  height: '60px',
                  zIndex: 3 - index,
                  transform: `rotate(${index * 2 - 2}deg)`,
                  transformOrigin: 'bottom left'
                }}
              >
                <div className="p-1.5">
                  <div className="flex text-yellow-400 mb-0.5" style={{ fontSize: '0.5rem' }}>
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic overflow-hidden" style={{ 
                    fontSize: '0.6rem',
                    lineHeight: '0.7rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    "{review.text.length > 20 ? review.text.substring(0, 20) + '...' : review.text}"
                  </p>
                  <div className="text-gray-600 font-medium truncate" style={{ fontSize: '0.55rem' }}>
                    {review.authorName}
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute top-1 right-1">
              <Heart className="h-3 w-3 text-orange-500" />
            </div>
          </div>
        )
      
      default:
        return (
          <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg">
            <Grid className="h-8 w-8 text-gray-400" />
          </div>
        )
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      setCopiedCode(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const renderPreview = () => {
    if (!reviews.length) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Loved Reviews Yet</h3>
          <p>Like some reviews to see them appear in your Wall of Love!</p>
        </div>
      )
    }

    const templateClass = getTemplateClassName(selectedTemplate)
    
    return (
      <div className={`${templateClass} max-h-96 overflow-y-auto`}>
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-4 border">
            <div className="flex text-yellow-400 text-sm mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
              ))}
            </div>
            <p className="text-gray-700 text-sm italic mb-3">"{review.text}"</p>
            <div className="text-sm font-medium text-gray-900">
              — {review.authorName}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4" />
            Wall of Love
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {space?.name} Testimonials
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Showcase your favorite testimonials with beautiful, embeddable components. 
            Choose from multiple layouts and get ready-to-use code for your website.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/wall/${spaceId}`
                navigator.clipboard.writeText(publicUrl)
                toast.success('Public Wall of Love URL copied!')
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="h-5 w-5" />
              Copy Public URL
            </button>
            
            <button
              onClick={() => {
                const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/wall/${spaceId}`
                window.open(publicUrl, '_blank')
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="h-5 w-5" />
              View Live Wall
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Template Selection and Live Preview Side by Side */}
          <div className="grid xl:grid-cols-3 gap-8">
            {/* Template Selection - Takes up more space */}
            <div className="xl:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Choose Your Template</CardTitle>
                  <CardDescription className="text-purple-100">
                    Select a layout style that matches your brand and website design
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id as TemplateType)}
                        className={`group p-6 text-left border-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-400 hover:shadow-md bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                              {template.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{template.description}</div>
                          </div>
                          {selectedTemplate === template.id && (
                            <div className="bg-blue-500 text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="transform group-hover:scale-105 transition-transform duration-200">
                          {renderTemplatePreview(template)}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview - Sidebar */}
            <div>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    {reviews.length} loved testimonials
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {renderPreview()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Export Code Section - Full Width */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Code className="h-6 w-6" />
                Export Code
              </CardTitle>
              <CardDescription className="text-green-100 text-base">
                Ready-to-use code for your project
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side - Framework Selection & Info */}
                <div className="flex-1 space-y-6">
                  {/* Framework Selection */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Choose Framework</h3>
                    <div className="flex gap-3">
                      {(['html', 'react', 'nextjs'] as const).map((framework) => (
                        <button
                          key={framework}
                          onClick={() => setSelectedFramework(framework)}
                          className={`flex-1 px-8 py-5 text-lg font-semibold rounded-xl transition-all ${
                            selectedFramework === framework
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {framework.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Framework Info */}
                  <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                    {selectedFramework === 'html' && '🌐 Pure HTML with inline CSS - works anywhere'}
                    {selectedFramework === 'react' && '⚛️ React component with Tailwind CSS classes'}
                    {selectedFramework === 'nextjs' && '🚀 Next.js component with TypeScript and Tailwind'}
                  </div>

                  {/* Copy Button */}
                  <Button
                    onClick={copyToClipboard}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 text-lg"
                    disabled={copiedCode}
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>

                {/* Right Side - Code Block */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Code</h3>
                  <div className="relative">
                    <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm overflow-x-auto max-h-96 border border-gray-700">
                      <code>{generateCode()}</code>
                    </pre>
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600"
                      variant="secondary"
                    >
                      {copiedCode ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats - Full Width */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{reviews.length}</div>
                <div className="text-sm text-gray-600 mb-4">Loved Testimonials</div>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Average rating from your customers
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to showcase your testimonials?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Copy the code above and paste it into your website. Your testimonials will automatically update 
              when you add new ones to your Wall of Love.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/wall/${spaceId}`
                  window.open(publicUrl, '_blank')
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="h-5 w-5" />
                Preview Live Wall
              </button>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
