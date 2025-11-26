<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

definePageMeta({
    layout: 'dashboard',
    alias: '/settings',
    middleware: ["auth-only"]
})

const localePath = useLocalePath();

const links = [[{
    label: $t('sidebar.menu.general'),
    icon: 'i-lucide-user',
    to: localePath('/settings'),
    exact: true
}, {
    label: $t('sidebar.menu.members'),
    icon: 'i-lucide-users',
    to: localePath('/settings/members')
}, {
    label: $t('sidebar.menu.email'),
    icon: 'i-lucide-mail',
    to: localePath('/settings/email')
}, {
    label: $t('sidebar.menu.notifications'),
    icon: 'i-lucide-bell',
    to: localePath('/settings/notifications')
}, {
    label: $t('sidebar.menu.security'),
    icon: 'i-lucide-shield',
    to: localePath('/settings/security')
}], [{
    label: $t('sidebar.menu.doc'),
    icon: 'i-lucide-book-open',
    to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
    target: '_blank'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
    <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
        <template #header>
            <UDashboardNavbar title="Settings">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>

            <UDashboardToolbar>
                <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
            </UDashboardToolbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <NuxtPage />
            </div>
        </template>
    </UDashboardPanel>
</template>