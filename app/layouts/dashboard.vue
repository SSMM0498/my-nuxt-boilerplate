<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDashboardGroup unit="rem">
    <DashboardSidebar v-model:open="open" />
    <NotificationsSlideover />

    <slot />
  </UDashboardGroup>
</template>