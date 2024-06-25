<script setup lang="ts">
import type { DropdownItem } from '@nuxt/ui/dist/runtime/types';

const { locales, locale, setLocale } = useI18n();

const items = locales.value.map((item) => {
  if (typeof item == "object") {
    return [{
      label: item.name!,
      click: () => setLocale(item.code)
    }]
  }
}) as DropdownItem[][]
</script>

<template>
  <UDropdown :items="items" :popper="{ arrow: true }">
    <UButton variant="link" size="2xs" color="white" :label="locale" icon="i-ri-global-line"
      trailing-icon="i-heroicons-chevron-down-20-solid" />
  </UDropdown>
</template>
