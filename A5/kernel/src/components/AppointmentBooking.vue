<script setup lang="ts">
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import VisitTypeSelector from './appointment/VisitTypeSelector.vue'
import DateSelector from './appointment/DateSelector.vue'
import TimeSlotSelector from './appointment/TimeSlotSelector.vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: [appointment: any]
}>()

// Stati del componente
const selectedVisit = ref<string | null>(null)
const selectedDate = ref<string | null>(null)
const selectedTime = ref<string | null>(null)
const isLoadingDates = ref(false)
const isLoadingTimes = ref(false)

// Funzione per resettare tutti i campi
const resetFields = () => {
  selectedVisit.value = null
  selectedDate.value = null
  selectedTime.value = null
  isLoadingDates.value = false
  isLoadingTimes.value = false
}

// Funzione per chiudere e resettare
const handleClose = () => {
  resetFields()
  emit('close')
}

const handleVisitSelect = () => {
  // Reset selezioni precedenti e mostra loading
  selectedDate.value = null
  selectedTime.value = null
  isLoadingDates.value = true
  
  // Simula chiamata API
  setTimeout(() => {
    isLoadingDates.value = false
  }, 1500)
}

const handleDateSelect = () => {
  selectedTime.value = null // Reset orario quando si cambia data
  isLoadingTimes.value = true
  
  // Simula chiamata API per caricare orari
  setTimeout(() => {
    isLoadingTimes.value = false
  }, 1000)
}

const handleConfirm = () => {
  if (!selectedVisit.value || !selectedDate.value || !selectedTime.value) return
  
  const appointment = {
    visitType: selectedVisit.value,
    date: selectedDate.value,
    time: selectedTime.value,
  }
  
  emit('confirm', appointment)
  resetFields()
  emit('close')
}

const canConfirm = computed(() => {
  return selectedVisit.value && selectedDate.value && selectedTime.value
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <h2 class="modal-title">{{ $t('appointmentBooking.title') }}</h2>
            </div>
            <button 
              class="close-button"
              @click="handleClose"
              :aria-label="$t('appointmentBooking.cancel')"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Sezione 1: Ricerca tipo visita -->
            <VisitTypeSelector
              v-model="selectedVisit"
              @select="handleVisitSelect"
            />

            <!-- Sezione 2: Selezione data -->
            <DateSelector
              v-model="selectedDate"
              :disabled="!selectedVisit"
              :loading="isLoadingDates"
              @select="handleDateSelect"
            />

            <!-- Sezione 3: Selezione orario -->
            <TimeSlotSelector
              v-model="selectedTime"
              :selected-date="selectedDate"
              :disabled="!selectedDate"
              :loading="isLoadingTimes"
            />
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button 
              class="button button-secondary" 
              @click="handleClose"
            >
              {{ $t('appointmentBooking.cancel') }}
            </button>
            <button 
              class="button button-primary" 
              :disabled="!canConfirm"
              @click="handleConfirm"
            >
              {{ $t('appointmentBooking.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(224, 242, 254, 0.10) 0%, rgba(221, 214, 254, 0.10) 50%, rgba(252, 231, 243, 0.10) 100%);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.modal-container {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  max-width: 48rem;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #171717;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #737373;
  margin: 0.25rem 0 0 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #525252;
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.button-secondary {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #525252;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.button-secondary:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.button-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.button-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-body {
    padding: 1.5rem;
  }
}
</style>
