const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()

    console.log(`Making API request to: ${url}`)
    console.log(`Token present: ${!!token}`)

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      // Remove manual redirect handling for now
    }

    try {
      const response = await fetch(url, config)
      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        let errorData: any = {}
        try {
          // Check if response has content before trying to parse JSON
          const text = await response.text()
          if (text) {
            try {
              errorData = JSON.parse(text)
            } catch {
              errorData = { message: text }
            }
          } else {
            errorData = { message: `HTTP ${response.status}` }
          }
        } catch (e) {
          errorData = { message: `HTTP ${response.status}` }
        }
        
        console.error('API Error:', errorData)
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T
      }

      // Handle 201 Created responses (like successful review submission)
      if (response.status === 201) {
        return {} as T
      }

      // Try to parse JSON, but handle cases where there might not be any content
      try {
        const data = await response.json()
        console.log('API Response:', data)
        return data
      } catch (e) {
        // If JSON parsing fails but response was ok, return empty object
        console.log('Response was successful but contained no JSON data')
        return {} as T
      }
    } catch (error) {
      console.error('Request error:', error)
      
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Network error: Unable to connect to the server. Please check if the backend is running on port 8080.',
          0,
          { originalError: error.message }
        )
      }

      throw new ApiError(
        'An unexpected error occurred',
        500,
        { originalError: error }
      )
    }
  }

  // Authentication endpoints
  async signup(data: { name: string; email: string; password: string }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ accessToken: string; tokenType: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser() {
    return this.request<{ id: string; name: string; email: string }>('/auth/me')
  }

  // Space endpoints
  async getSpaces() {
    return this.request<Array<{
      id: string
      name: string
      redirectUrl: string
      slug: string
      createdAt: string
      updatedAt: string
    }>>('/spaces')
  }

  async getSpace(id: string) {
    return this.request<{
      id: string
      name: string
      redirectUrl: string
      slug: string
      createdAt: string
      updatedAt: string
    }>(`/spaces/${id}`)
  }

  async createSpace(data: { name: string; redirectUrl: string }) {
    return this.request<{
      id: string
      name: string
      redirectUrl: string
      slug: string
      createdAt: string
      updatedAt: string
    }>('/spaces', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSpace(id: string, data: { name: string; redirectUrl: string }) {
    return this.request<{
      id: string
      name: string
      redirectUrl: string
      slug: string
      createdAt: string
      updatedAt: string
    }>(`/spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteSpace(id: string) {
    return this.request(`/spaces/${id}`, {
      method: 'DELETE',
    })
  }

  // Review endpoints
  async getReviews(spaceId: string) {
    return this.request<Array<{
      id: string
      authorName: string
      authorEmail?: string
      rating: number
      text: string
      liked: boolean
      createdAt: string
      updatedAt: string
    }>>(`/reviews/${spaceId}`)
  }

  async createReview(slug: string, data: {
    authorName: string
    authorEmail?: string
    rating: number
    text: string
  }) {
    return this.request(`/reviews/${slug}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async toggleReviewLike(reviewId: string) {
    return this.request<{
      id: string
      authorName: string
      authorEmail?: string
      rating: number
      text: string
      liked: boolean
      createdAt: string
      updatedAt: string
    }>(`/reviews/${reviewId}/like`, {
      method: 'PUT',
    })
  }

  async deleteReview(reviewId: string) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    })
  }

  // Embed endpoints
  async getEmbedReviews(spaceId: string) {
    return this.request<Array<{
      id: string
      authorName: string
      authorEmail?: string
      rating: number
      text: string
      liked: boolean
      createdAt: string
      updatedAt: string
    }>>(`/embed/${spaceId}`)
  }
}

export const apiClient = new ApiClient()