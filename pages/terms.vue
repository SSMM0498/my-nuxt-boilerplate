<template>
  <article class="max-w-none prose" h-full of-auto p6>
    <ContentDoc />
  </article>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('terms'),
})

definePageMeta({
  alias: ["/terms"],
  middleware: ["auth-only", "ui-check"],
})
</script>