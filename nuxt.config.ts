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
    '@vueuse/nuxt',
  ],

  // 自动导入配置
  imports: {
    dirs: [
      'composables/**', // 递归扫描 composables 目录
      'services/**', // 递归扫描 services 目录
      'stores/**', // 递归扫描 stores 目录
    ],
  },
  image: {
    // 默认图片存放目录为 public
    // dir: 'public',

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
    '/news/**': { prerender: true }, // 资讯页预渲染
    '/admin/**': { ssr: false }, // 后台管理 SPA
    '/search': { ssr: false }, // 搜索页 SPA
  },

  ui: {
    fonts: false,
  },
  runtimeConfig: {
    cozeApiToken: process.env.NUXT_COZE_API_TOKEN || '',
    cozeApiBaseUrl: process.env.NUXT_COZE_API_BASE_URL || 'https://api.coze.cn',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabasePublishableKey: process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
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
    // pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      meta: [{ name: 'color-scheme', content: 'light dark' }],
    },
  },
})
