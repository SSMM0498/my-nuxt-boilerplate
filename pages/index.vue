<template>
  <h1 class="text-6xl">{{ $t("welcome") }} 🌿🍃🍀🥬🔰</h1>
  <p>
    {{ currentUser }}
  </p>
</template>

<script setup lang="ts">
const { t } = useI18n();

const pocketbase = useNuxtApp().$pb;
const currentUser = pocketbase.authStore.model ?? null;

useHead({
  title: t('home'),
})

definePageMeta({
  alias: ["/_"],
  middleware: ["auth-only"],
});
</script>