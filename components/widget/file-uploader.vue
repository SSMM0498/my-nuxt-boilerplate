<template>
  <div v-if="!loading" class="flex items-start justify-start border border-gray-200 bg-white p-2 md:w-3/5 w-full rounded-lg"
    mb-2>
    <UIcon w-10 h-10 name="i-heroicons:document-text-solid" class="text-blue-700 text-lg mr-2"></UIcon>
    <div class="flex flex-col justify-start items-start space-y-1">
      <p class="text-md">{{ file?.name }}</p>
      <p class="text-sm text-gray-600">{{ formatFileSize(file?.size) }} - {{ currentProgress }}</p>
    </div>
  </div>
  <UFormGroup size="md" mb-4 :ui="{
    wrapper: 'md:w-3/5 w-full',
    label: {
      wrapper: 'flex items-center justify-center border border-gray-200 bg-white p-4 w-full rounded-lg cursor-pointer',
    }
  }">
    <template #label>
      <div class="flex items-center justify-center flex-col cursor-pointer">
        <div flex items-center w-10 h-10 justify-center border border-gray-200 bg-white p-2 rounded-lg mb-4>
          <UIcon text-2xl text-gray-500 name="i-heroicons-cloud-arrow-down" />
        </div>
        <p class="text-primary text-md mb-2">Cliquer pour charger votre fichier</p>
        <p class="text-xs">de type shapefile, KML ou Geojson.</p>
      </div>
    </template>
    <UInput @change="onFileChanged" type="file" accept=".zip,.kml,.geojson" input-class="hidden" />
  </UFormGroup>
</template>
<script setup lang="ts">
const reader = new FileReader();
const loading = ref(true);
const totalSize = ref<number>(0);
const currentProgress = ref<string>('0%');

const file = defineModel("file", { required: true, type: File });

function handleEvent(event: ProgressEvent<FileReader>) {
  if (['loadend', 'load'].includes(event.type)) {
    console.log('finished loading file');
    currentProgress.value = 'Finished loading file';
    loading.value = false;
  }
  if (event.type === 'progress' && event.loaded) {
    currentProgress.value = `${((event.loaded / totalSize.value) * 100).toFixed(2)}%`;
    console.log('Progress: ', currentProgress.value);
    console.log('Bytes transferred: ', event.loaded, 'bytes');
  }
  if (event.type === 'loadstart') {
    totalSize.value = event.total as number;
  }
}

function addListeners(reader: FileReader) {
  reader.addEventListener('loadstart', handleEvent);
  reader.addEventListener('load', handleEvent);
  reader.addEventListener('loadend', handleEvent);
  reader.addEventListener('progress', handleEvent);
  reader.addEventListener('error', handleEvent);
  reader.addEventListener('abort', handleEvent);
}

function onFileChanged(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target && target.files) {
    file.value = target.files[0];
    console.log(file.value, target.files[0]);

    if (file.value) {
      addListeners(reader);
      reader.readAsDataURL(file.value);
    }
  }
}

const formatFileSize = (bytes: number | undefined) => {
  if (!bytes) return ""
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
</script>