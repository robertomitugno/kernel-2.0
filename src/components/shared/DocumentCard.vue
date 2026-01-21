<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DocumentIcon, MapPinIcon, UserIcon, CalendarIcon, Bars4Icon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import BaseCard from './BaseCard.vue'
import BaseModal from './BaseModal.vue'
import BarcodeDisplay from './BarcodeDisplay.vue'
import type { CardMetadata } from '../../types/shared'
import type { Document, BadgeColors, PrescriptionStatus } from '../../types/document'
import { TAG_COLOR_MAP, TAG_ICON_MAP } from '../../types/document'
import { parseItalianDate, formatItalianDate } from '../../utils/dateUtils'

interface Props {
  document: Document
  selectable?: boolean
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false
})

const emit = defineEmits<{
  click: []
  toggleSelect: []
}>()

const { t } = useI18n()
const showBarcodeModal = ref(false)

/**
 * Get badge colors based on tag name
 */
const getBadgeColors = (tag: string): BadgeColors => {
  const normalizedTag = tag.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const colorKey = TAG_COLOR_MAP[normalizedTag]

  if (colorKey) {
    return {
      color: `var(--badge-${colorKey})`,
      bgColor: `var(--badge-${colorKey}-bg)`,
      borderColor: `var(--badge-${colorKey}-border)`
    }
  }

  return {
    color: 'var(--text-primary)',
    bgColor: 'var(--bg-secondary-30)',
    borderColor: 'var(--border-color)'
  }
}

/**
 * Get badge icon based on tag name
 */
const getBadgeIcon = (tag: string): string => {
  const normalizedTag = tag.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return TAG_ICON_MAP[normalizedTag] || '📄'
}

// Metadata for BaseCard
const metadata = computed<CardMetadata[]>(() => {
  const meta: CardMetadata[] = [
    { icon: CalendarIcon, label: props.document.date }
  ]

  if (props.document.doctor) {
    meta.push({ icon: UserIcon, label: props.document.doctor })
  }

  if (props.document.hospital) {
    meta.push({ icon: MapPinIcon, label: props.document.hospital })
  }

  return meta
})

// Check if prescription is expired
const isExpired = computed(() => {
  if (!props.document.isPrescription || !props.document.expirationDays) {
    return false
  }

  const issueDate = parseItalianDate(props.document.date)
  if (!issueDate) return false

  const expirationDate = new Date(issueDate)
  expirationDate.setDate(expirationDate.getDate() + props.document.expirationDays)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today > expirationDate
})

// Calculate formatted expiration date
const expirationDate = computed(() => {
  if (!props.document.isPrescription || !props.document.expirationDays) {
    return null
  }

  const issueDate = parseItalianDate(props.document.date)
  if (!issueDate) return null

  const expDate = new Date(issueDate)
  expDate.setDate(expDate.getDate() + props.document.expirationDays)

  return formatItalianDate(expDate)
})

// Prescription status: 'valid', 'expired', 'used'
const prescriptionStatus = computed<PrescriptionStatus | null>(() => {
  if (!props.document.isPrescription) return null

  if (props.document.usedDate) return 'used'
  if (isExpired.value) return 'expired'
  return 'valid'
})

// Handler for card click (normal documents only)
const handleCardClick = () => {
  if (props.selectable) {
    emit('toggleSelect')
  } else if (!props.document.isPrescription) {
    emit('click')
  }
}

// Handler to show barcode
const handleShowBarcode = (event: Event) => {
  event.stopPropagation()
  showBarcodeModal.value = true
}

// Handler to close modal
const handleCloseBarcode = () => {
  showBarcodeModal.value = false
}

// Handler for barcode download (placeholder)
const handleDownloadBarcode = () => {
  console.log('Download barcode for prescription:', props.document.id)
  // TODO: Implement download
}
</script>

<template>
  <div class="document-card-wrapper" :class="{ 'selectable': selectable, 'selected': selected }"
    @click="handleCardClick">
    <!-- Selection Checkbox (when in selection mode) -->
    <div v-if="selectable" class="selection-checkbox" :class="{ 'checked': selected }">
      <svg v-if="selected" class="checkbox-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd" />
      </svg>
    </div>

    <BaseCard :title="document.title" :description="document.description" :icon="DocumentIcon" :metadata="metadata">
      <!-- Barcode Button (inline with title) -->
      <template v-if="document.isPrescription" #title-actions>
        <button class="barcode-action-button" @click="handleShowBarcode">
          <Bars4Icon class="barcode-action-icon" />
          <span>{{ t('documents.showBarcode') }}</span>
        </button>
      </template>

      <!-- Document Tags (after title) -->
      <template #after-title>
        <div class="badges-row">
          <div v-for="tag in document.tags.slice(0, 2)" :key="tag" class="document-badge" :style="{
            color: getBadgeColors(tag).color,
            backgroundColor: getBadgeColors(tag).bgColor,
            borderColor: getBadgeColors(tag).borderColor
          }">
            <span class="badge-icon">{{ getBadgeIcon(tag) }}</span>
            <span class="badge-label">{{ tag }}</span>
          </div>
        </div>
      </template>
    </BaseCard>
  </div>

  <!-- Barcode Modal -->
  <Teleport to="body">
    <BaseModal :is-open="showBarcodeModal" :title="t('documents.prescriptionCode')"
      :subtitle="t('documents.prescriptionCodeSubtitle')" max-width="sm" @close="handleCloseBarcode">
      <div class="barcode-container">
        <!-- Prescription info -->
        <div class="prescription-info">
          <p class="prescription-title">{{ document.title }}</p>
          <p class="prescription-date">{{ t('documents.issuedOn') }}: {{ document.date }}</p>
          <p v-if="prescriptionStatus === 'valid'" class="prescription-expiration">
            {{ t('documents.expiresIn', { days: document.expirationDays }) }}
          </p>
        </div>

        <!-- Barcode or Placeholder -->
        <div v-if="prescriptionStatus === 'valid'" class="barcode-wrapper">
          <BarcodeDisplay :code="document.prescriptionCode || '8234567890123'" />
        </div>

        <!-- Placeholder for expired/used prescription -->
        <div v-else class="barcode-placeholder">
          <p class="placeholder-text">{{ t('documents.barcodeNotAvailable') }}</p>
        </div>

        <!-- Status message -->
        <div v-if="prescriptionStatus === 'used'" class="status-message used-message">
          <p class="status-text">{{ t('documents.usedOn', { date: document.usedDate }) }}</p>
        </div>

        <div v-else-if="prescriptionStatus === 'expired'" class="status-message expired-message">
          <p class="status-text">{{ t('documents.expiredOn', { date: expirationDate }) }}</p>
        </div>

        <p v-else class="barcode-instruction">{{ t('documents.barcodeInstruction') }}</p>
      </div>

      <template #footer>
        <button v-if="prescriptionStatus === 'valid'" class="button button-primary" @click="handleDownloadBarcode">
          <ArrowDownTrayIcon class="button-icon" />
          {{ t('documents.downloadBarcode') }}
        </button>
        <button class="button button-secondary" @click="handleCloseBarcode">
          {{ t('documents.close') }}
        </button>
      </template>
    </BaseModal>
  </Teleport>
</template>

<style scoped>
/* Document Card Wrapper */
.document-card-wrapper {
  position: relative;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.document-card-wrapper.selectable {
  padding-left: 3rem;
}

.document-card-wrapper.selectable:hover {
  transform: translateX(4px);
}

.document-card-wrapper.selected {
  opacity: 0.95;
}

.selection-checkbox {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--text-primary-20);
  border-radius: 0.5rem;
  background: var(--bg-secondary-80);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
  z-index: 10;
}

.selection-checkbox.checked {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  backdrop-filter: blur(16px);
  border-color: var(--white-30);
  color: var(--white);
  box-shadow: 0 4px 12px var(--accent-primary-40);
}



.checkbox-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--white);
}

/* Badges Row */
.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

/* Document Badge */
.document-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: 1.5px solid;
  border-radius: 0.75rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-weight: 600;
  font-size: 0.8125rem;
  box-shadow: 0 2px 8px var(--badge-shadow), inset 0 1px 0 var(--white-40);
  width: fit-content;
  animation: fadeInScale 0.4s cubic-bezier(0, 0, 0.2, 1);
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.badge-icon {
  font-size: 1.125rem;
  line-height: 1;
}

.badge-label {
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 0.8125rem;
}

/* Barcode Action Button */
.barcode-action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border: 1px solid var(--white-20);
  border-radius: 0.75rem;
  color: var(--white);
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  box-shadow: 0 2px 8px var(--accent-primary-25), inset 0 1px 0 var(--white-20);
  white-space: nowrap;
  flex-shrink: 0;
}

.barcode-action-button:hover {
  background: linear-gradient(135deg, var(--blue-2563eb) 0%, var(--blue-7c3aed) 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--blue-3b82f6-30), inset 0 1px 0 var(--white-30);
}

.barcode-action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px var(--blue-3b82f6-30);
}

.barcode-action-icon {
  width: 1rem;
  height: 1rem;
}

/* Animations */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Barcode Modal Content */
.barcode-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.prescription-info {
  text-align: center;
}

.prescription-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.prescription-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.prescription-expiration {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
  text-decoration: underline;
  font-style: italic;
}

.barcode-wrapper {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 1rem;
  border: 2px dashed var(--border-color);
}

.barcode-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-secondary-80);
  border-radius: 1rem;
  border: 2px dashed var(--border-color);
  min-height: 120px;
}

.placeholder-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  margin: 0;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.875rem;
  margin-top: 1rem;
}

.status-message.used-message {
  background: var(--success-10);
  border: 1px solid var(--success-30);
}

.status-message.expired-message {
  background: var(--warning-10);
  border: 1px solid var(--warning-30);
}

.status-text {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
}

.used-message .status-text {
  color: var(--success-text-dark);
}

.expired-message .status-text {
  color: var(--warning-text-dark);
}

.barcode-instruction {
  text-align: center;
  font-size: 0.875rem;
  color: var(--gray-525252);
  margin: 0;
  line-height: 1.5;
}

/* Modal Buttons */
.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.button-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  color: var(--white);
  border: 1px solid var(--bg-secondary-30);
  box-shadow: 0 4px 16px var(--accent-primary-30), inset 0 1px 0 var(--bg-secondary-20);
}

.button-primary:hover {
  background: linear-gradient(135deg, var(--bg-gradient-start-85-black) 0%, var(--bg-gradient-end-85-black) 100%);
  box-shadow: 0 6px 20px var(--accent-primary-40), inset 0 1px 0 var(--bg-secondary-30);
  transform: translateY(-1px);
}

.button-secondary {
  background: var(--bg-secondary-30);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--bg-secondary-50);
  color: var(--text-secondary);
  box-shadow: 0 2px 8px var(--text-primary-6), inset 0 1px 0 var(--bg-secondary-50);
}

.button-secondary:hover {
  background: var(--bg-secondary-40);
  box-shadow: 0 4px 16px var(--text-primary-10), inset 0 1px 0 var(--bg-secondary-70);
  transform: translateY(-1px);
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>