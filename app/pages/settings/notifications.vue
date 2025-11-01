<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  alias: '/settings/notifications',
  middleware: ["auth-only"]
})

const { t } = useI18n()

const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = computed(() => [{
  title: t('notifications.channels.title'),
  description: t('notifications.channels.description'),
  fields: [{
    name: 'email',
    label: t('notifications.channels.email.label'),
    description: t('notifications.channels.email.description')
  }, {
    name: 'desktop',
    label: t('notifications.channels.desktop.label'),
    description: t('notifications.channels.desktop.description')
  }]
}, {
  title: t('notifications.updates.title'),
  description: t('notifications.updates.description'),
  fields: [{
    name: 'weekly_digest',
    label: t('notifications.updates.weekly-digest.label'),
    description: t('notifications.updates.weekly-digest.description')
  }, {
    name: 'product_updates',
    label: t('notifications.updates.product-updates.label'),
    description: t('notifications.updates.product-updates.description')
  }, {
    name: 'important_updates',
    label: t('notifications.updates.important-updates.label'),
    description: t('notifications.updates.important-updates.description')
  }]
}])

async function onChange() {
  // Do something with data
  console.log(state)
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      :title="section.title"
      :description="section.description"
      variant="naked"
      class="mb-4"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch
          v-model="state[field.name]"
          @update:model-value="onChange"
        />
      </UFormField>
    </UPageCard>
  </div>
</template>