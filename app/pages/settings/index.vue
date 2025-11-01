<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard',
  middleware: ["auth-only"]
})

const { t } = useI18n()
const currentUser = useAuthUser()
const pendingProfile = ref(false);
const { updateProfile, changePassword, requestEmailChange, deleteAccount } = useAuth();

const profileSchema = z.object({
  name: z.string().min(2, t('settings.profile.errors.name-too-short')),
  email: z.email(t('settings.profile.errors.invalid-email')),
  username: z.string().min(2, t('settings.profile.errors.username-too-short')),
  bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

const profile = reactive<Partial<ProfileSchema>>({
  name: currentUser.value?.name,
  email: currentUser.value?.email,
  username: currentUser.value?.username,
  bio: undefined
})
const toast = useToast()

async function handleUpdateProfile(event: FormSubmitEvent<any>) {
  pendingProfile.value = true;
  try {
    const formData = new FormData()
    formData.append('name', event.data.name)
    await updateProfile(formData)
    toast.add({ title: t('settings.profile.toast_success'), color: 'success' });
  } catch (error: any) {
    toast.add({ title: t('error.label'), description: error.data?.statusMessage || t('settings.profile.toast_error'), color: 'error' });
  } finally {
    pendingProfile.value = false;
  }
}

async function handleAvatarUpdate(file: File) {
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    await updateProfile(formData)
    toast.add({ title: t('settings.profile.toast_success'), color: 'success' });
  } catch (error: any) {
    toast.add({ title: t('error.label'), description: error.data?.statusMessage || t('settings.profile.toast_error'), color: 'error' });
  }
}
</script>

<template>
  <UPageCard :title="t('settings.profile.title')" :description="t('settings.profile.description')" variant="naked"
    orientation="horizontal">
    <UButton form="settings" :label="t('settings.profile.save-button')" color="neutral" type="submit"
      class="w-fit lg:ms-auto" />
  </UPageCard>
  <UPageCard variant="subtle">
    <UAvatarPicker :user="currentUser" :on-avatar-update="handleAvatarUpdate" :alt="currentUser!.name" />
    <USeparator />
    <UForm id="settings" :schema="profileSchema" :state="profile" @submit="handleUpdateProfile" class="space-y-4">
      <UFormField name="name" :label="t('settings.profile.fields.name.label')"
        :description="t('settings.profile.fields.name.description')" required
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.name" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField name="email" :label="t('settings.profile.fields.email.label')"
        :description="t('settings.profile.fields.email.description')" required
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.email" type="email" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField name="username" :label="t('settings.profile.fields.username.label')"
        :description="t('settings.profile.fields.username.description')" required
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="profile.username" type="username" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField name="bio" :label="t('settings.profile.fields.bio.label')"
        :description="t('settings.profile.fields.bio.description')"
        class="flex max-sm:flex-col justify-between items-start gap-4" :ui="{ container: 'w-full' }">
        <UTextarea v-model="profile.bio" :rows="5" autoresize class="w-full" />
      </UFormField>
    </UForm>
  </UPageCard>
</template>