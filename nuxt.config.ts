// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
  ],

  // 自动导入配置
  imports: {
    dirs: [
      'composables/**', // 递归扫描 composables 目录
    ],
  },
  image: {
    // 默认图片存放目录为 public
    dir: 'public',

    // 支持生成的图片格式
    format: ['webp', 'png', 'jpg'],
    // 屏幕尺寸断点（用于响应式图片）
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // 组件配置
  components: [
    {
      path: '~/components',
      pathPrefix: false, // 禁用目录前缀，直接使用组件名
    },
  ],

  // 混合渲染配置
  routeRules: {
    '/': { swr: 3600 }, // 首页 SWR 1小时
    '/categories/**': { swr: 3600 }, // 分类页 SWR 1小时
    '/tools/**': { isr: 3600 }, // 工具详情页 ISR 1小时
    '/articles/**': { prerender: true }, // 文章页预渲染
    '/admin/**': { ssr: false }, // 后台管理 SPA
    '/search': { ssr: false }, // 搜索页 SPA
  },

  ui: {
    fonts: false,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
    supabaseServiceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY || '',
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'ai-compass-color-mode',
  },
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      meta: [{ name: 'color-scheme', content: 'light dark' }],
    },
  },
})
