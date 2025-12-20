<script setup lang="ts">
import { computed } from 'vue';
import type { HealthParameter } from '../types/health';

interface Props {
  parameter: HealthParameter;
}

const props = defineProps<Props>();

const isInRange = computed(() => {
  return (
    props.parameter.value >= props.parameter.normalRange.min &&
    props.parameter.value <= props.parameter.normalRange.max
  );
});

const statusColor = computed(() => {
  return isInRange.value ? 'text-green-600' : 'text-red-600';
});

const trendIcon = computed(() => {
  if (props.parameter.trend === 'up') return '↗';
  if (props.parameter.trend === 'down') return '↘';
  return '→';
});

const trendColor = computed(() => {
  if (props.parameter.trend === 'up') return 'text-red-500';
  if (props.parameter.trend === 'down') return 'text-green-500';
  return 'text-gray-500';
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-gray-600 text-sm font-medium">{{ parameter.name }}</h3>
      <span :class="trendColor" class="text-2xl font-bold">{{ trendIcon }}</span>
    </div>
    <div class="flex items-baseline mb-3">
      <span :class="statusColor" class="text-4xl font-bold">
        {{ parameter.value }}
      </span>
      <span class="text-gray-500 text-sm ml-2">{{ parameter.unit }}</span>
    </div>
    <div class="text-xs text-gray-500">
      Range normale: {{ parameter.normalRange.min }}-{{ parameter.normalRange.max }}
      {{ parameter.unit }}
    </div>
  </div>
</template>
