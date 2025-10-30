<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'

const { t } = useI18n()

const defaultLabel = t('password.label')
const defaultPlaceholder = t('password.placeholder')
const defaultRequirements = [
    { regex: /.{8,}/, text: t('password.requirements.min-length') },
    { regex: /\d/, text: t('password.requirements.number') },
    { regex: /[a-z]/, text: t('password.requirements.lowercase') },
    { regex: /[A-Z]/, text: t('password.requirements.uppercase') }
]
const defaultStrengthLabels = {
    empty: t('password.strength.empty'),
    weak: t('password.strength.weak'),
    medium: t('password.strength.medium'),
    strong: t('password.strength.strong')
}

const props = defineProps({
    name: { type: String, default: () => 'password' },
    label: { type: String, default: () => '' },
    placeholder: { type: String, default: () => '' },
    showStrengthTips: { type: Boolean, default: true },
    fullWidth: { type: Boolean, default: true },
    size: { type: Object as PropType<"xl" | "xs" | "sm" | "md" | "lg">, default: 'md' },
    requirements: {
        type: Array as PropType<Array<{ regex: RegExp; text: string }>>,
        default: () => []
    },
    strengthLabels: {
        type: Object as PropType<{ empty: string; weak: string; medium: string; strong: string }>,
        default: () => {}
    },
    colors: {
        type: Object as PropType<{ neutral: ScoreColor; weak: ScoreColor; medium: ScoreColor; strong: ScoreColor }>,
        default: () => ({
            neutral: 'neutral',
            weak: 'error',
            medium: 'warning',
            strong: 'success'
        })
    }
})

type ScoreColor = "neutral" | "error" | "warning" | "success" | "primary" | "secondary" | "info"

const show = ref(false)
const isFocused = ref(false)
const password = defineModel<string>({ default: '' })
const requirements = ref(props.requirements.length ? props.requirements : defaultRequirements)
const strengthLabels = ref(props.strengthLabels ? props.strengthLabels : defaultStrengthLabels)

const strength = computed(() =>
    requirements.value.map(req => ({
        met: req.regex.test(password.value),
        text: req.text
    }))
)

const score = computed(() => strength.value.filter(req => req.met).length)

const color = computed(() => {
    if (score.value === 0) return props.colors.neutral
    if (score.value <= 2) return props.colors.weak
    if (score.value === 3) return props.colors.medium
    return props.colors.strong
})

const text = computed(() => {
    if (score.value === 0) return strengthLabels.value.empty
    if (score.value <= 2) return strengthLabels.value.weak
    if (score.value === 3) return strengthLabels.value.medium
    return strengthLabels.value.strong
})
</script>

<template>
    <div class="space-y-2" :class="{ 'w-full': fullWidth }">
        <UFormField :label="label ? label : defaultLabel" :class="{ 'w-full': fullWidth }" :name="props.name">
            <UInput v-model="password" :placeholder="placeholder ? placeholder : defaultPlaceholder" :color="color" :size="size"
                :type="show ? 'text' : 'password'" :aria-invalid="score < requirements.length && props.showStrengthTips"
                aria-describedby="password-strength" :ui="{ trailing: 'pe-1' }" :class="{ 'w-full': fullWidth }"
                @focus="isFocused = true" @blur="isFocused = false" icon="i-heroicons:lock-closed">
                <template #trailing>
                    <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="show ? t('password.hide') : t('password.show')" :aria-pressed="show"
                        aria-controls="password" @click="show = !show" />
                </template>
            </UInput>
        </UFormField>

        <template v-if="props.showStrengthTips && isFocused && password.length > 0">
            <UProgress :color="color" :indicator="text" :model-value="score" :max="requirements.length" size="sm"
                :class="{ 'w-full': fullWidth }" />

            <p id="password-strength" class="text-sm font-medium">
                {{ text }}. {{ t('password.must-contain') }}:
            </p>

            <ul class="space-y-1" :class="{ 'w-full': fullWidth }" aria-label="Password requirements">
                <li v-for="(req, index) in strength" :key="index" class="flex items-center gap-0.5"
                    :class="req.met ? 'text-success' : 'text-muted'">
                    <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
                    <span class="text-xs font-light">
                        {{ req.text }}
                        <span class="sr-only">
                            {{ req.met ? ` - ${t('password.requirement-met')}` : ` -
                            ${t('password.requirement-not-met')}` }}
                        </span>
                    </span>
                </li>
            </ul>
        </template>
    </div>
</template>
