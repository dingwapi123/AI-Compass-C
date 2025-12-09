import { defineStore } from 'pinia'

type State = {
  keyword: string
  history: string[]
}

/**
 * 搜索状态：关键词与历史记录
 */
export const useSearchStore = defineStore('search', {
  state: (): State => ({ keyword: '', history: [] }),
  actions: {
    /**
     * 添加搜索词到历史记录
     */
    addHistory(term: string) {
      const t = term.trim()
      if (!t) return
      this.history = [t, ...this.history.filter((x) => x !== t)].slice(0, 20)
      this.save()
    },
    /**
     * 删除历史项
     */
    removeHistory(term: string) {
      this.history = this.history.filter((x) => x !== term)
      this.save()
    },
    /**
     * 清空历史
     */
    clearHistory() {
      this.history = []
      this.save()
    },
    /**
     * 从 localStorage 加载
     */
    load() {
      if (import.meta.client) {
        try {
          const raw = localStorage.getItem('ai-compass-search-history')
          this.history = raw ? JSON.parse(raw) : []
        } catch {
          console.error('Failed to load search history')
        }
      }
    },
    /**
     * 保存到 localStorage
     */
    save() {
      if (import.meta.client) {
        try {
          localStorage.setItem('ai-compass-search-history', JSON.stringify(this.history))
        } catch {
          console.error('Failed to save search history')
        }
      }
    },
  },
})
