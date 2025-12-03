<template>
  <UContainer>
    <UPageHeader title="搜索 AI 工具" description="支持名称与简介的模糊匹配" />

    <UPageSection>
      <div class="flex flex-col gap-3 sm:flex-row">
        <UInput
          v-model="keyword"
          icon="i-heroicons-magnifying-glass"
          placeholder="输入关键词，如：图像、代码、PPT"
          class="flex-1"
          autofocus
          @keyup.enter="doSearch"
        />
        <UButton
          icon="i-heroicons-magnifying-glass"
          color="primary"
          @click="doSearch"
          >搜索</UButton
        >
      </div>
      <div v-if="history.length" class="mt-3 flex flex-wrap gap-2">
        <span class="text-sm text-gray-500 flex items-center">历史搜索：</span>
        <UBadge
          v-for="h in history"
          :key="h"
          :label="h"
          variant="soft"
          class="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900"
          @click="apply(h)"
        />
        <UButton
          size="xs"
          variant="ghost"
          color="neutral"
          icon="i-heroicons-trash"
          @click="clear"
          >清空</UButton
        >
      </div>
    </UPageSection>

    <UPageSection>
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon
          name="i-heroicons-arrow-path"
          class="h-8 w-8 animate-spin text-gray-400"
        />
      </div>
      <div
        v-else-if="hasSearched && tools.length === 0"
        class="py-12 text-center text-gray-500"
      >
        未找到与“{{ keyword }}”相关的工具
      </div>
      <div v-else class="grid gap-6 md:grid-cols-3">
        <UCard v-for="tool in tools" :key="tool.id" class="flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <NuxtLink
                :to="`/tools/${tool.slug}`"
                class="font-semibold hover:text-primary-500 hover:underline"
              >
                {{ tool.name }}
              </NuxtLink>
              <UBadge
                v-if="tool.pricing_model"
                :color="tool.pricing_model === 'free' ? 'success' : 'warning'"
                variant="subtle"
                size="xs"
              >
                {{
                  tool.pricing_model === "free"
                    ? "免费"
                    : tool.pricing_model === "freemium"
                    ? "免费试用"
                    : "付费"
                }}
              </UBadge>
            </div>
          </template>
          <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {{ tool.description }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-1 text-yellow-500">
              <UIcon name="i-heroicons-star-solid" />
              <span
                class="text-sm font-medium text-gray-700 dark:text-gray-200"
                >{{ tool.rating }}</span
              >
            </div>
          </div>
          <template #footer>
            <UButton
              :to="`/tools/${tool.slug}`"
              block
              variant="ghost"
              color="neutral"
            >
              查看详情
            </UButton>
          </template>
        </UCard>
      </div>
    </UPageSection>

    <div v-if="total > limit" class="mt-6 flex justify-center">
      <UPagination v-model="page" :page-count="limit" :total="total" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Tool } from "~/types"
import { useToolsStore } from "~/stores/tools"
import { useSearchStore } from "~/stores/search"

const toolsStore = useToolsStore()
const searchStore = useSearchStore()

// Initialize search store history
if (import.meta.client) {
  searchStore.load()
}

const keyword = ref(searchStore.keyword)
const history = computed(() => searchStore.history)

const limit = ref(12)
const page = ref(1)
const total = ref(0)
const tools = ref<Tool[]>([])
const loading = ref(false)
const hasSearched = ref(false)

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) {
    tools.value = []
    total.value = 0
    hasSearched.value = false
    return
  }

  searchStore.keyword = kw
  searchStore.addHistory(kw)
  hasSearched.value = true
  loading.value = true
  page.value = 1

  try {
    // Ensure we have data to search from (Mock logic)
    if (toolsStore.tools.length === 0) {
      await toolsStore.fetchTools()
    }

    // Perform client-side search for demo
    // In production, pass `kw` to `toolsStore.fetchTools({ search: kw })`
    const allMatches = toolsStore.tools.filter(
      (t) =>
        t.name.toLowerCase().includes(kw.toLowerCase()) ||
        t.description.toLowerCase().includes(kw.toLowerCase()) ||
        (t.tags &&
          t.tags.some((tag) => tag.toLowerCase().includes(kw.toLowerCase())))
    )

    total.value = allMatches.length
    updatePageData(allMatches)
  } finally {
    loading.value = false
  }
}

function updatePageData(allMatches: Tool[]) {
  const start = (page.value - 1) * limit.value
  tools.value = allMatches.slice(start, start + limit.value)
}

// Re-calculate pagination when page changes
watch(page, () => {
  const kw = keyword.value.trim()
  if (!kw) return

  const allMatches = toolsStore.tools.filter(
    (t) =>
      t.name.toLowerCase().includes(kw.toLowerCase()) ||
      t.description.toLowerCase().includes(kw.toLowerCase())
  )
  updatePageData(allMatches)
})

function apply(term: string) {
  keyword.value = term
  doSearch()
}

function clear() {
  searchStore.clearHistory()
}

useSeoMeta({
  title: "搜索 AI 工具",
  description: "按关键词模糊搜索工具名称与简介",
})
</script>

<style scoped></style>
