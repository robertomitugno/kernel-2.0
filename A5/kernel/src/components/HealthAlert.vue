<script setup lang="ts">
import { computed } from 'vue';
import type { HealthAlert } from '../types/health';

interface Props {
  alert: HealthAlert;
}

const props = defineProps<Props>();

const alertClasses = computed(() => {
  const baseClasses = 'p-4 rounded-lg border-l-4 mb-3';
  if (props.alert.severity === 'danger') {
    return `${baseClasses} bg-red-50 border-red-500`;
  }
  return `${baseClasses} bg-yellow-50 border-yellow-500`;
});

const iconClasses = computed(() => {
  if (props.alert.severity === 'danger') {
    return 'text-red-600';
  }
  return 'text-yellow-600';
});

const titleClasses = computed(() => {
  if (props.alert.severity === 'danger') {
    return 'text-red-800';
  }
  return 'text-yellow-800';
});

const textClasses = computed(() => {
  if (props.alert.severity === 'danger') {
    return 'text-red-700';
  }
  return 'text-yellow-700';
});
</script>

<template>
  <div :class="alertClasses">
    <div class="flex items-start">
      <div class="shrink-0">
        <svg
          :class="iconClasses"
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 :class="titleClasses" class="text-sm font-semibold mb-1">
          {{ alert.parameterName }}
        </h3>
        <p :class="textClasses" class="text-sm mb-2">
          {{ alert.message }}
        </p>
        <p :class="textClasses" class="text-sm font-medium">
          💡 {{ alert.recommendation }}
        </p>
      </div>
    </div>
  </div>
</template>
