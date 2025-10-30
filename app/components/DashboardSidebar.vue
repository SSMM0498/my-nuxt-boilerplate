<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const localePath = useLocalePath()

const open = ref(false)

const items: NavigationMenuItem[][] = [[{
  label: t('sidebar.menu.home'),
  icon: 'i-lucide-house',
  to: localePath('/'),
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('sidebar.menu.inbox'),
  icon: 'i-lucide-inbox',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('sidebar.menu.contacts'),
  icon: 'i-lucide-users',
}, {
  label: t('sidebar.menu.settings'),
  icon: 'i-lucide-settings',
  defaultOpen: true,
  to: localePath('/settings'),
  type: 'trigger',
  children: [{
    label: t('sidebar.menu.general'),
    icon: 'i-lucide-user',
    to: localePath('/settings'),
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: t('sidebar.menu.members'),
    icon: 'i-lucide-users',
    to: localePath('/settings/members'),
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: $t('sidebar.menu.email'),
    icon: 'i-lucide-mail',
    to: localePath('/settings/email'),
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: t('sidebar.menu.notifications'),
    icon: 'i-lucide-bell',
    to: localePath('/settings/notifications'),
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: $t('sidebar.menu.security'),
    icon: 'i-lucide-shield',
    to: localePath('/settings/security'),
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }]
}], [{
  label: t('sidebar.menu.feedback'),
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: t('sidebar.menu.help-support'),
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui',
  target: '_blank'
}]]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: items.flat()
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages`,
    target: '_blank'
  }]
}])
</script>

<template>
  <UDashboardSidebar collapsible :ui="{ footer: 'border-t border-default' }" v-model:open="open">
    <template #header="{ collapsed }">
      <TeamsMenu :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default"
        :label="$t('sidebar.search')" />

      <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" tooltip popover />

      <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" tooltip class="mt-auto" />
    </template>

    <template #footer="{ collapsed }">
      <UserMenu :collapsed="collapsed" />
    </template>
  </UDashboardSidebar>
  <UDashboardSearch :groups="groups" />
</template>
