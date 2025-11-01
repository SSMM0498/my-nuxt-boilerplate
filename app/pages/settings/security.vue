<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

definePageMeta({
    layout: 'dashboard',
    alias: '/settings/security',
    middleware: ["auth-only"]
})

const { t } = useI18n()
const toast = useToast()
const { changePassword, deleteAccount } = useAuth()

const passwordSchema = z.object({
    current: z.string().min(8, t('security.password.errors.min-length')),
    new: z.string().min(8, t('security.password.errors.min-length'))
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
    current: undefined,
    new: undefined
})

const isPasswordLoading = ref(false)
const isDeleteLoading = ref(false)
const isDeleteModalOpen = ref(false)

const validate = (state: Partial<PasswordSchema>): FormError[] => {
    const errors: FormError[] = []
    if (state.current && state.new && state.current === state.new) {
        errors.push({ name: 'new', message: t('security.password.errors.same-password') })
    }
    return errors
}

const handlePasswordUpdate = async () => {
    try {
        isPasswordLoading.value = true
        await changePassword({
            oldPassword: password.current,
            password: password.new,
            passwordConfirm: password.new
        })

        toast.add({
            title: t('security.password.success.title'),
            description: t('security.password.success.description'),
            color: 'success'
        })

        // Reset form
        password.current = undefined
        password.new = undefined
    } catch (error: any) {
        toast.add({
            title: t('security.password.error.title'),
            description: error?.data?.message || t('security.password.error.description'),
            color: 'error'
        })
    } finally {
        isPasswordLoading.value = false
    }
}

const handleDeleteAccount = async () => {
    try {
        isDeleteLoading.value = true
        await deleteAccount()

        toast.add({
            title: t('security.delete-account.success.title'),
            description: t('security.delete-account.success.description'),
            color: 'success'
        })
    } catch (error: any) {
        toast.add({
            title: t('security.delete-account.error.title'),
            description: error?.data?.message || t('security.delete-account.error.description'),
            color: 'error'
        })
    } finally {
        isDeleteLoading.value = false
        isDeleteModalOpen.value = false
    }
}
</script>

<template>
    <UPageCard :title="t('security.password.title')" :description="t('security.password.description')" variant="subtle">
        <UForm :schema="passwordSchema" :state="password" :validate="validate" class="flex flex-col gap-4 max-w-xs"
            @submit="handlePasswordUpdate">
            <UFormField name="current" :label="t('security.password.current-label')">
                <UInput v-model="password.current" type="password"
                    :placeholder="t('security.password.current-placeholder')" class="w-full" />
            </UFormField>

            <UFormField name="new" :label="t('security.password.new-label')">
                <UInput v-model="password.new" type="password" :placeholder="t('security.password.new-placeholder')"
                    class="w-full" />
            </UFormField>

            <UButton :label="t('security.password.update-button')" class="w-fit" type="submit"
                :loading="isPasswordLoading" />
        </UForm>
    </UPageCard>

    <UPageCard :title="t('security.delete-account.title')" :description="t('security.delete-account.description')"
        class="bg-linear-to-tl from-error/10 from-5% to-default">
        <template #footer>
            <UButton :label="t('security.delete-account.button')" color="error" @click="isDeleteModalOpen = true" />
        </template>
    </UPageCard>

    <!-- Delete Account Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    {{ t('security.delete-account.modal.title') }}
                </h3>
                <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1"
                    @click="isDeleteModalOpen = false" />
            </div>
        </template>

        <template #body>
            <div class="space-y-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t('security.delete-account.modal.description') }}
                </p>
                <div class="rounded-md bg-error/10 p-4">
                    <div class="flex">
                        <div class="shrink-0">
                            <UIcon name="i-lucide-alert-triangle" class="h-5 w-5 text-error" />
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-error">
                                {{ t('security.delete-account.modal.warning-title') }}
                            </h3>
                            <div class="mt-2 text-sm text-error/80">
                                <p>{{ t('security.delete-account.modal.warning-description') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-2">
                <UButton :label="t('security.delete-account.modal.cancel')" color="neutral" variant="ghost"
                    @click="isDeleteModalOpen = false" :disabled="isDeleteLoading" />
                <UButton :label="t('security.delete-account.modal.confirm')" color="error" @click="handleDeleteAccount"
                    :loading="isDeleteLoading" />
            </div>
        </template>
    </UModal>
</template>