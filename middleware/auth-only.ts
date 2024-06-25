export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxt = useNuxtApp()
  const pocketbase = useNuxtApp().$pb;

  if (!pocketbase.authStore.isValid) {
    return navigateTo(nuxt.$localePath('/login'));
  }
})
