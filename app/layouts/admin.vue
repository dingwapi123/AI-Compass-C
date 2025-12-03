<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar -->
    <aside class="w-64 border-r bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-16 items-center border-b px-6 dark:border-gray-800">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <UIcon name="i-heroicons-compass" class="h-6 w-6 text-primary-500" />
          <span>AI Compass Admin</span>
        </NuxtLink>
      </div>
      <nav class="p-4 space-y-1">
        <UVerticalNavigation :links="links" />
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
       <header class="flex h-16 items-center justify-between border-b bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
         <h1 class="text-lg font-semibold">{{ route.meta.title || 'Dashboard' }}</h1>
         <div class="flex items-center gap-4">
           <UButton to="/" variant="ghost" icon="i-heroicons-home" color="neutral">返回前台</UButton>
           <UAvatar alt="Admin" size="sm" />
         </div>
       </header>
       <div class="flex-1 p-6 overflow-auto">
         <slot />
       </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const links = [
  {
    label: '仪表盘',
    icon: 'i-heroicons-home',
    to: '/admin'
  },
  {
    label: '工具管理',
    icon: 'i-heroicons-wrench-screwdriver',
    to: '/admin/tools'
  },
  {
    label: '分类管理',
    icon: 'i-heroicons-tag',
    to: '/admin/categories'
  },
  {
    label: '用户反馈',
    icon: 'i-heroicons-chat-bubble-left-right',
    to: '/admin/reviews'
  }
]
</script>