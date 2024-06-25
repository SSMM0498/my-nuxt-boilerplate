<template>
  <layout-header />
  <layout-aside />
  <main class="md:w-6/7 w-full" flex flex-col items-start justify-start overflow-x-hidden max-h-dvh h-dvh
    md:bg-gray-100 bg-white dark:bg-gray-950 p-4 md:py-6 md:px-8>
    <slot />
  </main>
</template>
<script setup lang="ts">
</script>