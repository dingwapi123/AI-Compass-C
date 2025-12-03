import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    favorites: [] as string[] // Tool IDs
  }),
  
  actions: {
    init() {
      if (import.meta.client) {
        try {
          const stored = localStorage.getItem('ai-compass-favorites')
          if (stored) {
            this.favorites = JSON.parse(stored)
          }
        } catch (e) {
          console.error(e)
        }
      }
    },

    toggleFavorite(toolId: string) {
      const index = this.favorites.indexOf(toolId)
      if (index === -1) {
        this.favorites.push(toolId)
      } else {
        this.favorites.splice(index, 1)
      }
      this.save()
    },

    isFavorite(toolId: string) {
      return this.favorites.includes(toolId)
    },

    save() {
      if (import.meta.client) {
        localStorage.setItem('ai-compass-favorites', JSON.stringify(this.favorites))
      }
    }
  }
})
