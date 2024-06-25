<script setup lang="ts">
defineProps({
  error: Object,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <div class="flex flex-col items-center justify-center text-center w-full h-full relative">
      <p class="text-[35vw] absolute font-bold special text-black/10">
        {{ error?.statusCode }}
      </p>
      <p mt-7 text-6xl font-bold text-gray-800 z-10>
        Oops! Something went wrong.
      </p>
      <p mt-7 text-2xl z-10>
        {{ error?.message }}
      </p>
      <UButton variant="ghost" text-2l size="xl" mt-8 @click="handleError" z-10>
        {{ $t('go_home') }}
      </UButton>
    </div>
  </NuxtLayout>
</template>

<style lang="css" scoped>
.special:first-letter {
  @apply text-primary/20;
}
</style>