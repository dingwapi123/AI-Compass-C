import { defineNuxtPlugin } from '#app'
import MarkdownRender from 'markstream-vue'

export default defineNuxtPlugin((nuxtApp) => {
  // 注册全局组件
  nuxtApp.vueApp.component('MarkdownRender', MarkdownRender)
})
