<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'

type ButtonColor = "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error"
type ButtonVariant = "outline" | "soft" | "subtle" | "ghost" | "solid" | "link"
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

const { t } = useI18n()

const props = withDefaults(
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
    }>(),
    {
        label: t('date-picker.period'),
        name: "date-range",
        color: "neutral",
        variant: "outline",
        size: "md",
        disabled: false,
        required: false,
        placeholderText: t('date-picker.select-a-period'),
        icon: "i-lucide-calendar-days",
        ui: () => ({}),
    }
)

const start = defineModel<Date | undefined>('start', { default: undefined })
const end = defineModel<Date | undefined>('end', { default: undefined })

onMounted(() => {
    if (start.value) {
        const date = new Date(start.value)
        const dateValue = new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
        )
        start.value = dateValue.toDate(getLocalTimeZone())
    }
    if (end.value) {
        const date = new Date(end.value)
        const dateValue = new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
        )
        end.value = dateValue.toDate(getLocalTimeZone())
    }
})

const startDate = computed({
    get: () => {
        const date = start.value ? new Date(start.value) : undefined
        return date
            ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
            : undefined
    },
    set: (value) => {
        start.value = value ? value.toDate(getLocalTimeZone()) : undefined
    },
})

const endDate = computed({
    get: () => {
        const date = end.value ? new Date(end.value) : undefined
        return date
            ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
            : undefined
    },
    set: (value) => {
        end.value = value ? value.toDate(getLocalTimeZone()) : undefined
    },
})

const range = computed({
    get: () => {
        if (startDate.value && endDate.value) {
            return { start: startDate.value, end: endDate.value }
        }
        return { start: undefined, end: undefined }
    },
    set: (value: { start?: CalendarDate; end?: CalendarDate }) => {
        if (value.start && value.end) {
            startDate.value = value.start
            endDate.value = value.end
        } else {
            // Handle single date selection or clear
            if (value.start && !value.end) {
                startDate.value = value.start
                endDate.value = value.start
            } else if (!value.start && value.end) {
                startDate.value = value.end
                endDate.value = value.end
            } else {
                startDate.value = undefined
                endDate.value = undefined
            }
        }
    }
})

const showCalendar = ref(false)
const placeholder = shallowRef(today(getLocalTimeZone()))

const df = new DateFormatter('fr-FR', {
    dateStyle: 'medium'
})

const displayLabel = computed(() => {
    if (start.value && end.value) {
        const startFormatted = df.format(new Date(start.value))
        const endFormatted = df.format(new Date(end.value))
        return `${startFormatted} - ${endFormatted}`
    } else if (start.value) {
        return df.format(new Date(start.value))
    }
    return props.placeholderText
})

watch([start, end], ([newStart, newEnd]) => {
    if (newStart && newEnd) {
        range.value = {
            start: new CalendarDate(new Date(newStart).getFullYear(), new Date(newStart).getMonth() + 1, new Date(newStart).getDate()),
            end: new CalendarDate(new Date(newEnd).getFullYear(), new Date(newEnd).getMonth() + 1, new Date(newEnd).getDate())
        }
    }
}, { immediate: true })
</script>

<template>
    <UFormField :name="name" :label="label" :required="required">
        <UPopover v-model:open="showCalendar">
            <UButton :color="color" :variant="variant" :size="size" :disabled="disabled" :icon="icon"
                class="group-[:has([id*='error'])]:focus-visible:ring-error group-[:has([id*='error'])]:ring-error w-full"
                :ui="{ leadingIcon: start && end ? '' : 'text-dimmed', ...ui }" @click="showCalendar = true">
                <template v-if="start && end">
                    {{ displayLabel }}
                </template>
                <template v-else>
                    <span class="text-dimmed">{{ placeholderText }}</span>
                </template>
            </UButton>

            <template #content>
                <UCalendar v-model="range" class="p-2" :number-of-months="2" range v-model:placeholder="placeholder"
                    @update:model-value="showCalendar = false">
                    <template #heading="{ value }">
                        <CalendarYearMonthSelect v-model:placeholder="placeholder">
                            {{ value }}
                        </CalendarYearMonthSelect>
                    </template>
                </UCalendar>

                <!-- Action buttons -->
                <div class="flex items-center justify-between p-3 border-t border-zinc-200 dark:border-zinc-700">
                    <UButton size="sm" color="neutral" variant="ghost" @click="() => {
                        start = undefined
                        end = undefined
                        showCalendar = false
                    }">
                        {{ $t('clear') }}
                    </UButton>
                    <UButton size="sm" color="primary" @click="showCalendar = false">
                        {{ $t('apply') }}
                    </UButton>
                </div>
            </template>
        </UPopover>
    </UFormField>
</template>