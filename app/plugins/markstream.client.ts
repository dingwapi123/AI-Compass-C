// plugins/markstream.client.ts
import { defineNuxtPlugin } from '#app'
import MarkdownRender, { setCustomComponents, MarkdownCodeBlockNode } from 'markstream-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('MarkdownRender', MarkdownRender)

  setCustomComponents('daily', {
    code_block: MarkdownCodeBlockNode,
  })
})
