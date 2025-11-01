<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard',
  alias: '/settings/email',
  middleware: ["auth-only"]
})

const { t } = useI18n()
const toast = useToast()
const { requestEmailChange } = useAuth()
const authUser = useAuthUser()

const emailSchema = z.object({
    newEmail: z.email(t('settings.email.errors.invalid-email')),
    confirmEmail: z.email(t('settings.email.errors.invalid-email'))
})

type EmailSchema = z.output<typeof emailSchema>

const email = reactive<Partial<EmailSchema>>({
    newEmail: undefined,
    confirmEmail: undefined
})

const isLoading = ref(false)

const validate = (state: Partial<EmailSchema>): FormError[] => {
    const errors: FormError[] = []
    if (state.newEmail && state.confirmEmail && state.newEmail !== state.confirmEmail) {
        errors.push({ name: 'confirmEmail', message: t('settings.email.errors.emails-mismatch') })
    }
    if (state.newEmail && authUser.value?.email && state.newEmail === authUser.value.email) {
        errors.push({ name: 'newEmail', message: t('settings.email.errors.same-email') })
    }
    return errors
}

const handleEmailChange = async () => {
    if (!email.newEmail) return

    try {
        isLoading.value = true
        await requestEmailChange(email.newEmail)

        toast.add({
            title: t('settings.email.success.title'),
            description: t('settings.email.success.description'),
            color: 'success'
        })

        // Reset form
        email.newEmail = undefined
        email.confirmEmail = undefined
    } catch (error: any) {
        toast.add({
            title: t('settings.email.error.title'),
            description: error?.data?.message || t('settings.email.error.description'),
            color: 'error'
        })
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <UPageCard
        :title="t('settings.email.title')"
        :description="t('settings.email.description')"
        variant="subtle"
    >
        <UForm
            :schema="emailSchema"
            :state="email"
            :validate="validate"
            class="flex flex-col gap-4 max-w-xs"
            @submit="handleEmailChange"
        >
            <UFormField name="current" :label="t('settings.email.current-label')">
                <UInput
                    :model-value="authUser?.email"
                    type="email"
                    disabled
                    class="w-full"
                    :ui="{ base: 'disabled:opacity-60' }"
                />
            </UFormField>

            <UFormField name="newEmail" :label="t('settings.email.new-label')">
                <UInput
                    v-model="email.newEmail"
                    type="email"
                    :placeholder="t('settings.email.new-placeholder')"
                    class="w-full"
                />
            </UFormField>

            <UFormField name="confirmEmail" :label="t('settings.email.confirm-label')">
                <UInput
                    v-model="email.confirmEmail"
                    type="email"
                    :placeholder="t('settings.email.confirm-placeholder')"
                    class="w-full"
                />
            </UFormField>

            <UButton
                :label="t('settings.email.update-button')"
                class="w-fit"
                type="submit"
                :loading="isLoading"
            />
        </UForm>
    </UPageCard>

    <UPageCard
        :title="t('settings.email.info.title')"
        :description="t('settings.email.info.description')"
        variant="subtle"
        class="border-l-4 border-primary"
    >
        <div class="flex items-start gap-3">
            <UIcon name="i-lucide-info" class="h-5 w-5 text-primary mt-0.5" />
            <div class="text-sm text-gray-600 dark:text-gray-400">
                <p>{{ t('settings.email.info.note') }}</p>
            </div>
        </div>
    </UPageCard>
</template>
