<template>
  <div class="h-screen bg-background flex">
    <div class="hidden lg:flex lg:w-1/2">
      <UCarousel v-slot="{ item }" :items="sliderImages" class="w-full h-full relative"
        :ui="{ prev: 'absolute rounded-md !start-10 text-white hover:bg-white/20 bg-black/20', next: 'absolute rounded-md !end-10 text-white hover:bg-white/20 bg-black/20', dots: 'bottom-5', dot: 'data-[state=active]:bg-primary', arrows: 'absolute top-0 left-0 w-full h-full', controls: 'absolute top-0 left-0 z-10 w-full h-full' }"
        :prev="{
          color: 'neutral',
          icon: 'i-heroicons-arrow-left-20-solid',
        }" :next="{
          color: 'neutral',
          icon: 'i-heroicons-arrow-right-20-solid',
        }" :loop="true" :arrows="true" :dots="true" :autoplay="{ delay: 5000 }">
        <div class="relative w-full h-full">
          <img :src="item.url" :alt="item.title" class="w-full h-full object-cover">
          <div class="absolute h-full w-full inset-0 bg-linear-to-b from-black via-black/50 to-transparent" />
          <div class="absolute w-full h-full bottom-0 left-0 right-0 p-12 text-highlighted">
            <h2 class="text-4xl font-bold mb-4 font-sans">{{ item.title }}</h2>
            <p class="text-xl opacity-90 font-sans">{{ item.subtitle }}</p>
          </div>
        </div>
      </UCarousel>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center space-x-3">
            <h1 class="text-3xl font-bold text-card-foreground font-sans">{{ config.public.APP_NAME }}</h1>
          </div>
        </div>

        <UCard class="border-0 shadow-2xl dark:bg-zinc-950 bg-white min-h-125">
          <template #header>
            <h1 class="text-2xl font-sans text-hightlighted">{{ $t('sign_in') }}</h1>
            <p class="text-sm text-muted-foreground mt-2">{{ $t('login.welcome_back_please_enter_your_credentia') }}</p>
          </template>

          <UTabs
            :items="[{ label: $t('login.email') + ' & ' + t('password.label'), slot: 'email' }, { label: 'Code OTP', slot: 'otp' }]"
            class="space-y-6">
            <template #email>
              <UForm :schema="loginSchema" :state="loginForm" @submit="handleEmailLogin" class="space-y-4">
                <UFormField class="w-full" :label="$t('login.email')" name="email">
                  <UInput v-model="loginForm.email" type="email" :placeholder="t('login.enter_your_email')"
                    icon="i-heroicons-envelope" class="w-full" size="xl" />
                </UFormField>

                <UPassword v-model="loginForm.password" size="xl" :showStrengthTips="false" />

                <div class="flex w-full justify-between">
                  <UCheckbox v-model="loginForm.remember" :label="t('login.remember_me')" name="remember" />
                  <ULink :to="$localePath('/forgot-password')"
                    class="text-primary text-sm font-semibold font-['Poppins'] leading-tight">{{
                      $t('login.forgot_your_password') }}</ULink>
                </div>

                <UButton type="submit" :loading="isLoading" block size="xl">
                  {{ $t("sign_in") }}
                </UButton>

                <USeparator :label="$t('login.or')" class="w-full" />
                <div class="flex flex-col w-full gap-3">
                  <UButton size="lg" block variant="outline" color="neutral" disabled>
                    <UIcon name="i-logos:google-icon" />
                    {{ $t("login.sign_in_with_google") }}
                  </UButton>
                  <UButton type="submit" size="lg" block variant="outline" color="neutral" disabled>
                    <UIcon name="i-logos:microsoft-icon" />
                    {{ $t("login.sign_in_with_microsoft") }}
                  </UButton>
                </div>

                <div class="text-center text-sm text-muted-foreground">
                  {{ $t('login.dont_have_an_account_yet') }}
                  <ULink :to="$localePath('/register')" class="text-primary font-semibold">
                    {{ $t('sign_up') }}
                  </ULink>
                </div>
              </UForm>

            </template>

            <!-- OTP Login -->
            <template #otp>
              <UForm :state="{ otpEmail }" @submit="handleOtpRequest" class="space-y-4">
                <UFormField class="w-full" :label="t('login.email')" name="otpEmail">
                  <UInput v-model="otpEmail" type="email" :placeholder="t('login.enter_your_email')"
                    icon="i-heroicons-envelope" class="w-full" size="xl" />
                </UFormField>

                <UButton type="submit" :loading="isLoading" block size="xl">
                  {{ $t("sign_in") }}
                </UButton>
              </UForm>

              <div class="text-center text-sm text-zinc-500 font-sans mt-2">
                {{ $t('a-connection-code-will-be-sent-to-your-email-address') }}
              </div>
            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

const config = useRuntimeConfig();

definePageMeta({
  middleware: ["guest-only"],
  layoutTransition: true
})

const { t } = useI18n();
const toast = useToast();
const localePath = useLocalePath()
const { login } = useAuth();

const loginForm = reactive({ email: "", password: "", remember: false, })
const otpEmail = ref("")
const isLoading = ref(false)

const loginSchema = z.object({
  email: z.email(t('login.email_required')),
  remember: z.boolean().optional(),
  password: z.string().min(5, t('login.password_required')),
})

type Schema = z.output<typeof loginSchema>

const sliderImages = computed(() => [
  {
    url: "https://images.pexels.com/photos/34384606/pexels-photo-34384606.jpeg",
    title: t('register.sliders.title_1'),
    subtitle: t('register.sliders.subtitle_1'),
  },
  {
    url: "https://images.pexels.com/photos/20005384/pexels-photo-20005384.jpeg",
    title: t('register.sliders.title_2'),
    subtitle: t('register.sliders.subtitle_2'),
  },
  {
    url: "https://images.pexels.com/photos/20005388/pexels-photo-20005388.jpeg",
    title: t('register.sliders.title_3'),
    subtitle: t('register.sliders.subtitle_3'),
  }
])

const handleEmailLogin = async (event: FormSubmitEvent<Schema>) => {
  try {
    isLoading.value = true
    await login(event.data);
    console.log("🔓 LOGIN SUCCESSFULL")
    toast.add({
      title: t('connection-successful'),
      color: 'success'
    })
    navigateTo(localePath("/"))
  } catch (error: any) {
    if (error.statusCode === 404) {
      toast.add({
        title: t('incorrect-login-details'),
        description: t('please-check-your-email-and-password'),
        color: 'error'
      })
    } else {
      toast.add({
        title: t('login-error'),
        description: t('an-error-has-occurred-please-try-again'),
        color: 'error'
      })
    }
  } finally {
    isLoading.value = false
  }
}

const handleOtpRequest = async () => {
  try {
    isLoading.value = true
    await $fetch("/api/auth/request-otp", { method: "POST", body: { email: otpEmail.value } })
    // TODO: afficher notification succès
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>
