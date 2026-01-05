<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CalendarIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

export interface DateRange {
  from: Date | null
  to: Date | null
}

interface Props {
  modelValue: DateRange
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: DateRange]
}>()

const { t } = useI18n()
const showPicker = ref(false)
const fromDate = ref('')
const toDate = ref('')

// Preset date ranges
const presets = computed(() => [
  {
    id: 'last-month',
    label: t('documents.dateRange.lastMonth'),
    getDates: () => {
      const to = new Date()
      const from = new Date()
      from.setMonth(from.getMonth() - 1)
      return { from, to }
    }
  },
  {
    id: 'last-3-months',
    label: t('documents.dateRange.last3Months'),
    getDates: () => {
      const to = new Date()
      const from = new Date()
      from.setMonth(from.getMonth() - 3)
      return { from, to }
    }
  },
  {
    id: 'last-6-months',
    label: t('documents.dateRange.last6Months'),
    getDates: () => {
      const to = new Date()
      const from = new Date()
      from.setMonth(from.getMonth() - 6)
      return { from, to }
    }
  },
  {
    id: 'last-year',
    label: t('documents.dateRange.lastYear'),
    getDates: () => {
      const to = new Date()
      const from = new Date()
      from.setFullYear(from.getFullYear() - 1)
      return { from, to }
    }
  }
])

const isActive = computed(() => {
  return props.modelValue.from !== null || props.modelValue.to !== null
})

const formattedRange = computed(() => {
  if (!props.modelValue.from && !props.modelValue.to) {
    return t('documents.dateRange.selectRange')
  }
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date)
  }
  
  if (props.modelValue.from && props.modelValue.to) {
    return `${formatDate(props.modelValue.from)} - ${formatDate(props.modelValue.to)}`
  }
  
  if (props.modelValue.from) {
    return `${t('documents.dateRange.from')} ${formatDate(props.modelValue.from)}`
  }
  
  if (props.modelValue.to) {
    return `${t('documents.dateRange.to')} ${formatDate(props.modelValue.to)}`
  }
  
  return ''
})

// Initialize input values from props
watch(() => props.modelValue, (value) => {
  if (value.from) {
    fromDate.value = value.from.toISOString().split('T')[0] || ''
  } else {
    fromDate.value = ''
  }
  
  if (value.to) {
    toDate.value = value.to.toISOString().split('T')[0] || ''
  } else {
    toDate.value = ''
  }
}, { immediate: true })

const applyPreset = (preset: typeof presets.value[0]) => {
  const dates = preset.getDates()
  emit('update:modelValue', dates)
  showPicker.value = false
}

const applyCustomRange = () => {
  const range: DateRange = {
    from: fromDate.value ? new Date(fromDate.value) : null,
    to: toDate.value ? new Date(toDate.value) : null
  }
  emit('update:modelValue', range)
  showPicker.value = false
}

const clearRange = () => {
  emit('update:modelValue', { from: null, to: null })
  showPicker.value = false
}
</script>

<template>
  <div class="date-range-filter">
    <button 
      class="range-button"
      :class="{ 'range-button-active': isActive }"
      @click="showPicker = !showPicker"
    >
      <CalendarIcon class="w-5 h-5" />
      <span>{{ formattedRange }}</span>
      <XMarkIcon 
        v-if="isActive" 
        class="w-4 h-4 clear-icon"
        @click.stop="clearRange"
      />
    </button>

    <Transition name="dropdown">
      <div v-if="showPicker" class="date-picker-dropdown">
        <div class="picker-section">
          <h4 class="section-title">{{ $t('documents.dateRange.quickSelect') }}</h4>
          <div class="presets-grid">
            <button
              v-for="preset in presets"
              :key="preset.id"
              class="preset-button"
              @click="applyPreset(preset)"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <div class="picker-divider"></div>

        <div class="picker-section">
          <h4 class="section-title">{{ $t('documents.dateRange.customRange') }}</h4>
          <div class="date-inputs">
            <div class="date-input-group">
              <label class="input-label">{{ $t('documents.dateRange.from') }}</label>
              <input 
                v-model="fromDate"
                type="date"
                class="date-input"
              />
            </div>
            <div class="date-input-group">
              <label class="input-label">{{ $t('documents.dateRange.to') }}</label>
              <input 
                v-model="toDate"
                type="date"
                class="date-input"
              />
            </div>
          </div>
          <button class="apply-button" @click="applyCustomRange">
            {{ $t('documents.dateRange.apply') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.date-range-filter {
  position: relative;
  z-index: 200;
}

.range-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.75rem;
  color: #525252;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  position: relative;
  z-index: 201;
}

.range-button:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.range-button-active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.range-button-active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.clear-icon {
  opacity: 0.8;
  transition: opacity 0.2s;
}

.clear-icon:hover {
  opacity: 1;
}

.date-picker-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 320px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  z-index: 210;
  pointer-events: auto;
  isolation: isolate;
}

.picker-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #404040;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.presets-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.preset-button {
  padding: 0.625rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  color: #3b82f6;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
  pointer-events: auto;
}

.preset-button:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.picker-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
  margin: 1rem 0;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #525252;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-input {
  padding: 0.625rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #171717;
  transition: all 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.apply-button {
  padding: 0.625rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
