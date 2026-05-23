// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  css: ["~/assets/css/style.css"],
  experimental: {
    viteEnvironmentApi: true,
  },
  ssr: false,
  devtools: { enabled: false },
  i18n: {
    locales: [
      {
        code: "en",
        file: "en-US.ts",
      },
    ],
    defaultLocale: "en",
  },
  modules: ["@formkit/auto-animate/nuxt", "@nuxtjs/i18n"],
  vite: {
    build: {
      target: "esnext",
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["mupdf"],
      include: ["@mitikaIn/parkhi", "@mitikaIn/parkhi/logging", "@phosphor-icons/vue"],
    },
    worker: {
      format: "es",
    },
  },
});
