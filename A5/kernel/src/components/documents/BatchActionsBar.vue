<script setup lang="ts">
import { computed } from 'vue'
import { 
  ArrowDownTrayIcon, 
  XMarkIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import type { Document } from '../shared/DocumentCard.vue'

interface Props {
  selectedDocuments: Document[]
  totalDocuments: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  downloadAll: []
  deselectAll: []
  cancel: []
}>()

// Group documents by category
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  
  props.selectedDocuments.forEach(doc => {
    doc.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3) // Show top 3 categories
})

const allSelected = computed(() => {
  return props.selectedDocuments.length === props.totalDocuments
})
</script>

<template>
  <Transition name="slide-up">
    <div v-if="selectedDocuments.length > 0" class="batch-actions-bar">
      <div class="bar-content">
        <div class="selection-info">
          <div class="selection-header">
            <CheckIcon class="w-5 h-5" style="color: #3b82f6" />
            <span class="selection-count">
              {{ selectedDocuments.length }} 
              {{ selectedDocuments.length === 1 ? $t('documents.batch.documentSelected') : $t('documents.batch.documentsSelected') }}
            </span>
            <span v-if="allSelected" class="all-badge">{{ $t('documents.batch.all') }}</span>
          </div>
          
          <div v-if="categoryCounts.length > 0" class="category-breakdown">
            <span
              v-for="[category, count] in categoryCounts"
              :key="category"
              class="category-pill"
            >
              {{ category }} ({{ count }})
            </span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn download-btn" @click="emit('downloadAll')">
            <ArrowDownTrayIcon class="w-5 h-5" />
            <span>{{ $t('documents.batch.downloadAll') }}</span>
          </button>
          
          <button class="action-btn deselect-btn" @click="emit('deselectAll')">
            <span>{{ $t('documents.batch.deselectAll') }}</span>
          </button>
          
          <button class="action-btn cancel-btn" @click="emit('cancel')">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.batch-actions-bar {
  position: fixed;
  top: 5.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 4rem);
  max-width: 900px;
  z-index: 40;
  animation: slideInDown 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 1.25rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12), 
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.selection-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.selection-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selection-count {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #171717;
  white-space: nowrap;
}

.all-badge {
  padding: 0.125rem 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 0.375rem;
  color: #10b981;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.category-pill {
  padding: 0.25rem 0.625rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
  white-space: nowrap;
}

.download-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.deselect-btn {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #525252;
}

.deselect-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.cancel-btn {
  padding: 0.625rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-2px);
}

/* Slide down animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .batch-actions-bar {
    width: calc(100% - 2rem);
    top: 5rem;
  }
  
  .bar-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }
  
  .action-buttons {
    justify-content: stretch;
  }
  
  .action-btn {
    flex: 1;
  }
  
  .download-btn span {
    display: none;
  }
}
</style>
