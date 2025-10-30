<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    alias: '/',
    middleware: ["auth-only"],
    layoutTransition: true
})

const { isNotificationsSlideoverOpen } = useDashboard()
</script>

<template>
    <UDashboardPanel>
        <template #header>
            <UDashboardNavbar :title="$t('dashboard')">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>

                <template #right>
                    <ULangSwitch />
                    <UTooltip :text="$t('notifications')">
                        <UButton color="neutral" variant="ghost" square @click="isNotificationsSlideoverOpen = true">
                            <UChip color="error" inset>
                                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
                            </UChip>
                        </UButton>
                    </UTooltip>
                    <UColorModeButton />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
        </template>
    </UDashboardPanel>
</template>