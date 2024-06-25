<template>
  <div class="bg-white dark:bg-gray-900 flex w-screen h-screen">
    <div class="flex items-center justify-center px-6 mx-auto w-full lg:w-1/2">
      <div class="flex flex-col lg:w-4/6 w-full min-w-[250px]">
        <div class="flex w-full items-start flex-col">
          <div class="flex justify-center mx-auto">
            <NuxtLink :to="localePath('/')">
              <img class="w-auto h-10 mb-2" :src="colorMode.value === 'dark' ? '/logo.white.png' : '/logo.png'" alt="">
            </NuxtLink>
          </div>

          <p class="mt-3 font-bold text-4xl mb-4">{{ $t("sign_in") }}</p>
          <p>{{ $t('login.welcome_back_please_enter_your_credentia') }}</p>
        </div>

        <div class="mt-8 w-full flex items-center justify-center flex-col">
          <UForm ref="formEl" :schema="schema" :state="state" class="space-y-3 w-full" @submit="onSubmit">
            <UFormGroup label="Email" name="email">
              <UInput size="lg" v-model="state.email" autocomplete="username" icon="i-heroicons-user" 
                :placeholder="t('login.enter_your_email')" />
            </UFormGroup>

            <UFormGroup :label="t('login.password')" name="password">
              <UInput size="lg" v-model="state.password" type="password" autocomplete="current-password"
              icon="i-heroicons:lock-closed"
                placeholder="•••••••••" />
            </UFormGroup>

            <div class="flex w-full justify-between">
              <UCheckbox v-model="state.remember" :label="t('login.remember_me')" name="remember" />
              <ULink class="font-bold text-sm">{{ $t('login.forgot_your_password') }}</ULink>
            </div>

            <UButton type="submit" size="lg" block :loading="loading">
              {{ $t("sign_in") }}
            </UButton>
            <UDivider label="OR" />
            <UButton type="submit" size="lg" block variant="outline" color="black">
              <i class="i-flat-color-icons:google"></i>
              {{ $t("login.sign_in_with_google") }}
            </UButton>
          </UForm>
          <p class="mt-8 text-md text-center text-secondary">{{ $t('login.dont_have_an_account_yet') }} <ULink
              active-class="text-primary" :to="localePath('/register')">{{ $t("sign_up") }}</ULink>.</p>
        </div>
      </div>
    </div>
    <div class="bg-cover hidden lg:block lg:w-1/2 bg-[#0e0669]">
      <div class="flex items-center h-full px-24 bg-gray-900 bg-opacity-40">
        <div class="flex w-full flex-col items-center justify-center">
          <div class="flex flex-col items-center justify-center relative mb-4">
            <img class="w-auto h-[25rem]" src="/assets/img/auth-illustration.1.svg" alt="">
            <img class="w-auto h-48 absolute bottom-6 -right-2" src="/assets/img/auth-illustration.2.svg" alt="">
          </div>

          <p class="text-2xl text-white">{{ $t("login.have_access_to_your_dashboard") }}</p>
          <p class="max-w-xl mt-3 text-gray-300/90 text-center">
            {{ $t("login.you_will_get_insight") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const { t } = useI18n();
const pocketbase = useNuxtApp().$pb;
const localePath = useLocalePath();
const formEl = ref();
const loading = ref(false);
const colorMode = useColorMode();

useHead({
  title: t('sign_in'),
})

definePageMeta({
  alias: ["/login"],
  layout: "auth",
  middleware: ["guest-only", "ui-check"]
});

const schema = z.object({
  email: z.string().email('Invalid email'),
  remember: z.boolean().optional(),
  password: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  remember: undefined,
  password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    await pocketbase.collection("users").authWithPassword(event.data.email, event.data.password);
    const redirect = localePath('/')
    await navigateTo(redirect);
  } catch (error) {
    formEl.value.setErrors([
      {
        message: "Invalid email or password",
        path: "email",
      }, {
        message: "Invalid email or password",
        path: "password",
      }
    ])
  } finally {
    loading.value = false;
  }
}
</script>