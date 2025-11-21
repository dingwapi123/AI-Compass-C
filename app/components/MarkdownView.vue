<template>
  <div v-html="html"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

/**
 * 将 Markdown 文本渲染为安全的 HTML
 * - 使用 markdown-it，并禁用原始 HTML（html=false）降低 XSS 风险
 * - 支持自动链接与排版优化
 */
const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

/** 组件入参：Markdown 源文本 */
const props = defineProps<{ source?: string }>()

/**
 * 计算渲染结果
 * - 输入为空时返回空字符串，避免 v-html 注入无效内容
 */
const html = computed(() => md.render(String(props.source ?? '')))
</script>

<style scoped>
/* 组件自身不包含样式，建议外层容器套用 .prose */
</style>