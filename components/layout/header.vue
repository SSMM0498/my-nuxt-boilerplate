<template>
  <div class="md:hidden flex w-full items-center justify-between px-4 py-6">
    <img src="/logo.png" class="w-24" object-cover mr-2 />
    <UButton icon="i-heroicons:bars-3" color="white" variant="ghost" :padded="false" @click="openSidebar()"></UButton>
  </div>
</template>
<script setup lang="ts">
const { openSidebar } = useUIData()
</script>