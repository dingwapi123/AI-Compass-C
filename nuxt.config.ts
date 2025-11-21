// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/content", "@nuxt/image", "@pinia/nuxt"],
  ui: {
    fonts: false,
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "ai-compass-color-mode",
  },
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      meta: [{ name: "color-scheme", content: "light dark" }],
    },
  },
})
