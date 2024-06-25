<script setup lang="ts">
const { locale } = useI18n();
const colorMode = useColorMode();

useHead({
  title: 'Home',
  titleTemplate: `%s | ${'My Nuxt'}`,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0' },
    { hid: 'description', name: 'description', content: 'A boilerplate of nuxt app' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: colorMode.value === 'dark' ? '/favicon.white.ico' : '/favicon.ico' }],
})
</script>

<template>
  <Html scroll-smooth snap-mandatory snap-y :lang="locale">

  <Body w-dvh h-dvh flex overflow-hidden items-start>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
      <UNotifications max-w-md />
    </NuxtLayout>
  </Body>

  </Html>
</template>

<style>
body>#__nuxt {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  @apply flex-col md:flex-row;
}
</style>