<template>
  <div class="h-screen w-full flex justify-center">
    <div class="mx-auto max-w-md w-full flex items-center px-6">
      <div class="flex-1">
        <div class="text-center">
          <h4 class="mt-3">{{ $t('reset-password') }}</h4>
          <p class="mt-2 text-sm text-zinc-500">
            {{ $t('enter-your-email-address-and-well-send-you-a-link-to-reset-your-password') }}
          </p>
        </div>

        <div class="mt-8">
          <UForm :schema="schema" :state="state" class="space-y-8" @submit="onSubmit" ref="form">
            <UFormField :label="$t('login.email')" required name="email">
              <UInput class="w-full" :placeholder="$t('login.enter_your_email')" required type="email"
                input-class="input-base" size="xl" color="neutral" icon="i-heroicons-envelope" v-model="state.email" />
            </UFormField>

            <UButton type="submit" color="primary" block size="lg">
              {{ $t('send-reset-link') }}
            </UButton>
          </UForm>

          <p class="mt-6 text-center text-sm text-zinc-400">
            {{ $t('remember-your-password') }}
            <ULink :to="'/login'" inactive-class="text-primary">
              {{ $t("sign_in") }}
            </ULink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: ["guest-only"]
});

const { t } = useI18n();
const toast = useToast();
const { requestPasswordReset } = useAuth();
const form = ref();

const schema = z.object({
  email: z.email(t('login.email_required')),
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  form.value.clear()
  try {
    const response = await requestPasswordReset(event.data.email);

    toast.add({
      title: t('success'),
      description: response.message,
      color: 'success',
    });
  } catch (error: any) {
    console.error(error);
    form.value.setErrors([
      { path: 'email', message: error.data?.statusMessage || t('failed-to-send-reset-link-please-try-again') },
    ]);
  }
}
</script>
