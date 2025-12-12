export interface NewsItem {
  id: string
  title: string
  summary: string
  content?: string
  source: string
  time: string
  date: string
  link?: string
  tags?: string[]
}

export interface NewsGroup {
  date: string
  items: NewsItem[]
}
