<script lang="ts" setup>
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"

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
    }>(),
    {
        label: t('date-picker.date'),
        name: "date",
        color: "neutral",
        variant: "outline",
        size: "md",
        disabled: false,
        required: false,
        placeholderText: t('date-picker.select-a-date'),
        icon: "i-lucide-calendar-days",
        ui: () => ({}),
    }
)

const model = defineModel<Date | undefined>({
    default: undefined,
})

onMounted(() => {
    if (model.value) {
        const date = new Date(model.value)
        const dateValue = new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
        )
        model.value = dateValue.toDate(getLocalTimeZone())
    }
})

const modelDate = computed({
    get: () => {
        const date = model.value ? new Date(model.value) : undefined
        return date
            ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
            : undefined
    },
    set: (value) => {
        model.value = value ? value.toDate(getLocalTimeZone()) : undefined
    },
})

const showCalendar = ref(false)
const placeholder = shallowRef(modelDate.value ?? today(getLocalTimeZone()))
</script>

<template>
    <UFormField :name="name" :label="label" :required="required">
        <UPopover v-model:open="showCalendar">
            <UButton :color="color" :variant="variant" :size="size" :disabled="disabled" :icon="icon"
                class="group-[:has([id*='error'])]:focus-visible:ring-error group-[:has([id*='error'])]:ring-error w-full"
                :ui="{ leadingIcon: modelDate ? '' : 'text-dimmed', ...ui }" @click="showCalendar = true">
                <template v-if="modelDate">
                    <NuxtTime :datetime="modelDate.toDate(getLocalTimeZone())" date-style="medium" />
                </template>
                <template v-else>
                    <span class="text-dimmed">{{ placeholderText }}</span>
                </template>
            </UButton>

            <template #content>
                <UCalendar v-model="modelDate" class="p-2" @update:model-value="showCalendar = false"
                    v-model:placeholder="placeholder">
                    <template #heading="{ value }">
                        <CalendarYearMonthSelect v-model:placeholder="placeholder">
                            {{ value }}
                        </CalendarYearMonthSelect>
                    </template>
                </UCalendar>
            </template>
        </UPopover>
    </UFormField>
</template>
