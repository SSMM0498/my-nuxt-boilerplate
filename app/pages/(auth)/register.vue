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
        <div class="text-center">
          <h1 class="text-3xl font-bold text-card-foreground font-sans">{{ config.public.APP_NAME }}</h1>
        </div>

        <UCard class="border-0 shadow-2xl dark:bg-zinc-950 bg-white">
          <template #header>
            <h1 class="text-2xl font-sans text-hightlighted">{{ $t('sign_up') }}</h1>
            <p class="text-sm text-muted-foreground mt-2">{{ $t('register.create_your_account') }}</p>
          </template>

          <UForm :schema="registerSchema" :state="registerForm" @submit="handleRegister" class="space-y-3">
            <UFormField class="w-full" :label="$t('register.name')" name="name">
              <UInput v-model="registerForm.name" type="text" :placeholder="t('register.enter_your_name')"
                icon="i-heroicons-user" class="w-full" size="xl" />
            </UFormField>

            <UFormField class="w-full" :label="$t('login.email')" name="email">
              <UInput v-model="registerForm.email" type="email" :placeholder="t('login.enter_your_email')"
                icon="i-heroicons-envelope" class="w-full" size="xl" />
            </UFormField>

            <UPassword v-model="registerForm.password" size="xl" />

            <UPassword v-model="registerForm.passwordConfirm" :label="$t('login.confirmPassword')" size="xl"
              :showStrengthTips="true" name="passwordConfirm" />

            <UFormField name="termsAccepted">
              <UCheckbox v-model="registerForm.termsAccepted" name="termsAccepted">
                <template #label>
                  <span>{{ $t('register.i_accept_the') }} <ULink :to="localePath('/terms')" target="_blank">{{
                    $t('terms')
                      }}</ULink> {{ $t('register.and') }} <ULink :to="localePath('/privacy')" target="_blank">{{
                        $t('privacy-policy') }}</ULink></span>
                </template>
              </UCheckbox>
            </UFormField>

            <UButton type="submit" :loading="isLoading" block size="xl">
              {{ $t("sign_up") }}
            </UButton>

            <USeparator :label="$t('login.or')" class="w-full" />

            <div class="flex w-full gap-3">
              <UButton size="lg" block variant="outline" color="neutral" disabled>
                <UIcon name="i-logos:google-icon" />
                {{ $t("register.sign_up_with_google") }}
              </UButton>
              <UButton type="submit" size="lg" block variant="outline" color="neutral" disabled>
                <UIcon name="i-logos:microsoft-icon" />
                {{ $t("register.sign_up_with_microsoft") }}
              </UButton>
            </div>

            <div class="text-center text-sm text-muted-foreground">
              {{ $t('register.already_have_an_account') }}
              <ULink :to="$localePath('/login')" class="text-primary font-semibold">
                {{ $t('sign_in') }}
              </ULink>
            </div>
          </UForm>
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
const { register } = useAuth();

const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  termsAccepted: false
})
const isLoading = ref(false)

const registerSchema = z.object({
  name: z.string().min(2, t('register.name_required')),
  email: z.email(t('login.email_required')),
  password: z.string().min(8, t('login.must_be_at_least_8_characters')),
  passwordConfirm: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: t('register.must_accept_terms')
  })
}).refine(data => data.password === data.passwordConfirm, {
  message: t('register.passwords_must_match'),
  path: ['passwordConfirm']
})

type Schema = z.output<typeof registerSchema>

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

const handleRegister = async (event: FormSubmitEvent<Schema>) => {
  try {
    isLoading.value = true
    await register({
      name: event.data.name,
      email: event.data.email,
      password: event.data.password,
      passwordConfirm: event.data.passwordConfirm
    });

    console.log("✅ REGISTRATION SUCCESSFUL")
    toast.add({
      title: t('register.registration_successful'),
      description: t('register.welcome_message'),
      color: 'success'
    })
    navigateTo(localePath("/"))
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.statusCode === 400) {
      toast.add({
        title: t('register.registration_failed'),
        description: error.data?.message || t('register.email_already_exists'),
        color: 'error'
      })
    } else {
      toast.add({
        title: t('register.registration_failed'),
        description: t('an-error-has-occurred-please-try-again'),
        color: 'error'
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>
