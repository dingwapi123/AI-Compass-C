export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  parent_id?: string
}

export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  url: string
  image_url?: string
  category_id: string
  tags?: string[]
  is_free: boolean
  pricing_model?: 'free' | 'freemium' | 'paid'
  rating: number
  review_count: number
  created_at: string
}

export interface Review {
  id: string
  tool_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  user?: {
    name: string
    avatar_url?: string
  }
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  favorites: string[] // Tool IDs
}
