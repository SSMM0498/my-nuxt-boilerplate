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

          <p class="mt-3 font-bold text-4xl mb-4">{{ $t("sign_up") }}</p>
          <p>{{ $t('login.welcome_back_please_enter_your_credentia') }}</p>
        </div>

        <div class="mt-8 w-full flex items-center justify-center flex-col">
          <UForm ref="formEl" :schema="schema" :state="state" class="space-y-3 w-full" @submit="onSubmit">
            <UFormGroup label="Email" required name="email">
              <UInput size="lg" v-model="state.email" autocomplete="username email" icon="i-heroicons:at-symbol-16-solid"
                :placeholder="t('login.enter_your_email')" />
            </UFormGroup>

            <UFormGroup label="Username" required name="username">
              <UInput placeholder="Enter your username" autocomplete="username" required type="text" input-class="input-base" size="lg"
                color="white" icon="i-heroicons-user" v-model="state.username" />
            </UFormGroup>

            <UFormGroup :label="t('login.password')" required name="password">
              <UInput size="lg" v-model="state.password" type="password" autocomplete="current-password"
                icon="i-heroicons:lock-closed" placeholder="Enter your password" />
            </UFormGroup>

            <UFormGroup label="Confirm Password" required name="passwordConfirm">
              <UInput placeholder="Confirm your password" required autocomplete="current-password" type="password"
                input-class="input-base" size="lg" color="white" icon="i-heroicons:lock-closed"
                v-model="state.passwordConfirm" />
            </UFormGroup>

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
              active-class="text-primary" :to="localePath('/login')">{{ $t("sign_in") }}</ULink>.</p>
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
  alias: ["/register"],
  layout: "auth",
  middleware: ["guest-only", "ui-check"]
});

const schema = z.object({
  username: z.string(),
  email: z.string().email('Invalid email'),
  password: z.string(),
  passwordConfirm: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  username: undefined,
  password: undefined,
  passwordConfirm: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    await pocketbase.collection("users").create({
      ...event.data,
      "emailVisibility": true,
      "name": "test"
    });
    await pocketbase.collection('users').requestVerification(event.data.email);
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