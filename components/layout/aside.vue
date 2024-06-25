<template>
  <Transition name="slide">
    <aside v-if="toggleSidebar"
      class="md:relative flex flex-col h-dvh md:px-3 md:py-5 p-6 overflow-y-auto overflow-x-hidden bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-600 md:w-1/7 min-w-[250px] w-full fixed z-20">
      <div flex w-full items-start justify-between>
        <img class="w-10 object-cover mr-2" :src="colorMode.value === 'dark' ? '/logo.white.png' : '/logo.png'" alt="">
        <UButton class="md:hidden flex" icon="i-heroicons:x-mark" color="white" variant="ghost" size="lg"
          :padded="false" @click="closeSidebar">
        </UButton>
      </div>
      <div class="flex flex-col justify-between flex-1 mt-8">
        <nav class="flex-1 w-full space-y-xs">
          <ULink
            class="flex items-center p-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500/10 dark:hover:text-gray-200 hover:text-gray-700 w-full"
            p-1 mb-2 rounded :to="localePath('/farmers')">
            <i class="i-heroicons:users text-3xl md:text-2xl"></i>
            <span class="mx-2 font-semibold text-lg md:text-sm">Link</span>
          </ULink>
          <UAccordion :items="items">
            <template #default="{ item, index, open }">
              <UButton color="gray" variant="ghost" class="border-b border-gray-200 dark:border-gray-700"
                :ui="{ rounded: 'rounded-lg', padding: { sm: 'p-2' } }">
                <template #leading>
                  <UIcon :name="item.icon" class="text-3xl md:text-2xl" />
                </template>

                <span class="truncate mx-2 font-semibold text-lg md:text-sm">{{ item.label }}</span>

                <template #trailing>
                  <UIcon name="i-heroicons-chevron-right-20-solid"
                    class="w-5 h-5 ms-auto transform transition-transform duration-200"
                    :class="[open && 'rotate-90']" />
                </template>
              </UButton>
            </template>
            <template #collect>
              <ULink
                class="flex items-center p-2 ml-4 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500/10 dark:hover:text-gray-200 hover:text-gray-700 w-full"
                p-1 mb-2 rounded :to="localePath({ name: 'collect-type', params: { type: 'onboarding' } })">
                <i class="i-heroicons:clipboard text-3xl md:text-2xl"></i>
                <span class="mx-2 font-semibold text-lg md:text-sm">Link</span>
              </ULink>
              <ULink
                class="flex items-center p-2 ml-4 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500/10 dark:hover:text-gray-200 hover:text-gray-700 w-full"
                p-1 mb-2 rounded :to="localePath({ name: 'collect-type', params: { type: 'traceability' } })">
                <i class="i-heroicons:truck text-3xl md:text-2xl"></i>
                <span class="mx-2 font-semibold text-lg md:text-sm">Link</span>
              </ULink>
              <ULink
                class="flex items-center p-2 ml-4 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500/10 dark:hover:text-gray-200 hover:text-gray-700 w-full"
                p-1 mb-2 rounded :to="localePath({ name: 'collect-type', params: { type: 'survey' } })">
                <i class="i-heroicons:pencil-square text-3xl md:text-2xl"></i>
                <span class="mx-2 font-semibold text-lg md:text-sm">Link</span>
              </ULink>
            </template>
          </UAccordion>
          <ULink
            class="flex items-center p-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500/10 dark:hover:text-gray-200 hover:text-gray-700 w-full"
            p-1 rounded :to="localePath('/woma')">
            <i class="i-heroicons:phone text-3xl md:text-2xl"></i>
            <span class="mx-2 font-semibold text-lg md:text-sm">Link</span>
          </ULink>
        </nav>
        <nav class="flex flex-col w-full items-start">
          <ULink
            class="flex items-center p-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500/10 dark:hover:text-gray-200 hover:text-gray-700 w-full"
            p-1 mb-2 rounded :to="localePath('/terms')">
            <i class="i-heroicons:lifebuoy text-3xl md:text-2xl"></i>
            <span class="mx-2 font-semibold text-lg md:text-sm">Support</span>
          </ULink>
          <UPopover :ui="{ wrapper: 'w-full' }" :popper="{ placement: 'top' }">
            <UButton variant="ghost"
              class="items-center w-full p-2 text-gray-600 transition-colors duration-300 transform rounded-lg  dark:text-gray-300 hover:bg-gray-100 font-semibold text-lg md:text-sm dark:hover:bg-gray-500/10 dark:hover:text-gray-200 hover:text-gray-700 mb-2"
              color="white">
              <i class="i-heroicons:cog-6-tooth text-3xl md:text-2xl"></i>
              {{ $t('settings') }}
            </UButton>
            <template #panel>
              <div class="p-2">
                <widget-switch-lang />
                <widget-switch-color />
              </div>
            </template>
          </UPopover>
          <UButton :loading="loading" variant="outline" color="gray" class="flex items-center justify-center w-full"
            mb-2 rounded-lg @click="onLogoutClick">
            <span class="mx-2 font-medium text-lg md:text-sm">{{ $t('logout') }}</span>
            <i class="i-heroicons:arrow-right-on-rectangle-20-solid text-3xl md:text-2xl"></i>
          </UButton>
          <UDivider my-4 />
          <div v-if="currentUser" class="flex w-full items-center">
            <UAvatar size="md" :alt="`${currentUser.name}`" />
            <div flex flex-col ml-2 overflow-hidden>
              <p line-clamp-1 text-ellipsis overflow-hidden font-bold text-md md:text-sm>
                {{ currentUser.name }}
              </p>
              <p line-clamp-1 truncate text-sm md:text-xs>
                {{ currentUser.email }}
              </p>
            </div>
          </div>
        </nav>
      </div>
      <!-- <layout-footer /> -->
    </aside>
  </Transition>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const localePath = useLocalePath();
const { toggleSidebar, closeSidebar } = useUIData();
const pocketbase = useNuxtApp().$pb;
const currentUser = pocketbase.authStore.model ?? null;
const loading = ref(false);

const items = [{
  label: 'Collect',
  icon: 'i-heroicons:clipboard-document-list',
  defaultOpen: true,
  slot: 'collect'
}]

async function onLogoutClick() {
  try {
    loading.value = true;
    pocketbase.authStore.clear()
    navigateTo(localePath('/'))
    loading.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>