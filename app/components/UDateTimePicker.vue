<script setup lang="ts">
import { CalendarDateTime, getLocalTimeZone, now, parseDateTime } from '@internationalized/date'

type ButtonColor = "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error"
type ButtonVariant = "outline" | "soft" | "subtle" | "ghost" | "solid" | "link"
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

const { t } = useI18n()

withDefaults(
    defineProps<{
        label?: string
        name?: string
        color?: ButtonColor
        variant?: ButtonVariant
        size?: ButtonSize
        disabled?: boolean
        required?: boolean
        placeholderText?: string
        icon?: string
        ui?: Record<string, any>
        minValue?: Date
        maxValue?: Date
    }>(),
    {
        label: '',
        name: "datetime",
        color: "neutral",
        variant: "outline",
        size: "md",
        disabled: false,
        required: false,
        placeholderText: '',
        icon: "i-lucide-calendar-days",
        ui: () => ({}),
        minValue: undefined,
        maxValue: undefined,
    }
)

const model = defineModel<Date | undefined>({
    default: undefined,
})

onMounted(() => {
    if (model.value) {
        const date = new Date(model.value)
        const dateValue = new CalendarDateTime(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        )
        model.value = dateValue.toDate(getLocalTimeZone())
    }
})

// Convert Date to CalendarDateTime for the picker
const modelDateTime = computed({
    get: () => {
        if (!model.value) return undefined

        const date = new Date(model.value)
        return new CalendarDateTime(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        )
    },
    set: (value: CalendarDateTime | undefined) => {
        model.value = value ? value.toDate(getLocalTimeZone()) : undefined
    },
})

const showCalendar = ref(false)
const placeholder = shallowRef(modelDateTime.value ?? now(getLocalTimeZone()))

// Format the display value
const displayValue = computed(() => {
    if (!model.value) return null
    return new Date(model.value).toLocaleString('fr-FR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
})
</script>

<template>
    <UFormField :name="name" :label="label !== '' ? label : t('date-picker.date-and-time')" :required="required">
        <UPopover v-model:open="showCalendar">
            <UButton :color="color" :variant="variant" :size="size" :disabled="disabled" :icon="icon"
                class="group-[:has([id*='error'])]:focus-visible:ring-error group-[:has([id*='error'])]:ring-error w-full"
                :ui="{ leadingIcon: modelDateTime ? '' : 'text-dimmed', ...ui }" @click="showCalendar = true">
                <template v-if="displayValue">
                    {{ displayValue }}
                </template>
                <template v-else>
                    <span class="text-dimmed">{{ placeholderText !== '' ? placeholderText : t('date-picker.select-a-date-and-time') }}</span>
                </template>
            </UButton>

            <template #content>
                <div class="p-3 w-80">
                    <!-- Date Picker -->
                    <UCalendar v-model="modelDateTime" class="mb-3" @update:model-value="showCalendar = false"
                        v-model:placeholder="placeholder" />

                    <!-- Time Picker -->
                    <div class="flex items-center gap-3 py-3 border-t border-zinc-200 dark:border-zinc-700">
                        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Heure:
                        </label>
                        <div class="flex items-center gap-2 flex-1">
                            <USelect :model-value="modelDateTime?.hour ?? 9"
                                :items="Array.from({ length: 24 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))"
                                @update:model-value="(value) => {
                                    if (modelDateTime) {
                                        modelDateTime = new CalendarDateTime(
                                            modelDateTime.year,
                                            modelDateTime.month,
                                            modelDateTime.day,
                                            value as number,
                                            modelDateTime.minute
                                        )
                                    }
                                }" class="flex-1" size="sm" />
                            <span class="text-zinc-500">:</span>
                            <USelect :model-value="modelDateTime?.minute ?? 0" :items="[
                                { value: 0, label: '00' },
                                { value: 15, label: '15' },
                                { value: 30, label: '30' },
                                { value: 45, label: '45' }
                            ]" @update:model-value="(value) => {
                                if (modelDateTime) {
                                    modelDateTime = new CalendarDateTime(
                                        modelDateTime.year,
                                        modelDateTime.month,
                                        modelDateTime.day,
                                        modelDateTime.hour,
                                        value as number
                                    )
                                }
                            }" class="flex-1" size="sm" />
                        </div>
                    </div>

                    <!-- Quick actions -->
                    <div class="flex gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                        <UButton size="xs" variant="ghost" @click="model = new Date()">
                            {{ $t('now') }}
                        </UButton>
                        <UButton size="xs" variant="ghost" @click="model = undefined">
                            {{ $t('clear') }}
                        </UButton>
                        <UButton size="xs" variant="solid" @click="showCalendar = false" class="ml-auto">
                            {{ $t('valid') }}
                        </UButton>
                    </div>
                </div>
            </template>
        </UPopover>
    </UFormField>
</template>