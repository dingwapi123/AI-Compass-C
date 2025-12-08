export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  created_at: string
}

export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  url: string
  icon?: string
  images: string[]
  category_id: string
  tags?: string[]
  pricing: 'free' | 'paid' | 'freemium'
  created_at: string
  updated_at?: string
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
