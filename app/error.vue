<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-zinc-50 dark:bg-zinc-900">
    <h1 class="status-code font-bold text-zinc-800 dark:text-zinc-200 transition-all duration-300">
      <span>{{ String(error!.statusCode)[0] }}</span>{{ error?.statusCode ? String(error.statusCode).slice(-2) : 'Error'
      }}
    </h1>
    <p>{{ error!.statusMessage }}</p>
    <p>{{ error!.cause }}</p>
    <UButton class="mt-8" size="lg" color="primary" @click="handleError">
      {{ $t('return-to-home') }}
    </UButton>
  </div>
</template>
<style scoped>
/* Glowing animation for status code */
@keyframes glow {
  0% {
    text-shadow: 0 0 8px rgba(0, 153, 255, 0.8);
  }

  50% {
    text-shadow: 0 0 16px rgba(0, 153, 255, 1);
  }

  100% {
    text-shadow: 0 0 8px rgba(0, 153, 255, 0.8);
  }
}

.status-code {
  animation: glow 2s infinite alternate ease-in-out;
  cursor: pointer;
  transition: text-shadow 0.3s ease;
  position: relative;
  font-size: 20rem;
  line-height: 0.75;
  margin: 0;
  margin-bottom: 5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Hover sharp stacked colors */
/* .status-code:hover {
  animation: none;
  text-shadow:
    4px 4px 0 #ff6ec7,
    -4px -4px 0 #6effa1,
    4px -4px 0 #ffd966,
    -4px 4px 0 #6ecbff;
} */

.status-code span {
  color: oklch(76.9% 0.188 70.08);
  display: inline-block;
  transition: all 0.3s ease;
}

.status-code:hover span {
  transform: scaleX(-1);
}
</style>
