export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxt = useNuxtApp()
  const pocketbase = nuxt.$pb;

  if (pocketbase.authStore.isValid) {
    return navigateTo(nuxt.$localePath('/protected'));
  }
})
