<script setup lang="ts">
const config = useRuntimeConfig();
const { t } = useI18n();

useHead({
  title: t('home'),
  titleTemplate: `%s | ${config.public.APP_NAME}`,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0' },
    { name: 'description', content: t('meta.description') },
  ],
})
</script>

<template>

  <Body class="bg-zinc-100 overflow-hidden dark:bg-zinc-900 h-screen w-screen">
    <NuxtLoadingIndicator />
    <UApp :toaster="{ position: 'bottom-center', duration: 2500 }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </Body>
</template>
