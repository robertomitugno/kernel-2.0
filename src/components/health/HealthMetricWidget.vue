<script setup lang="ts">
import { computed, ref } from 'vue';
import type { HealthParameter } from '../../types/health';

interface Props {
  parameter: HealthParameter;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
});

const showDetails = ref(false);

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

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
</script>

<template>
  <div :class="compact ? 'compact-metric' : 'metric-widget'">
    <div class="flex justify-between items-start" :class="compact ? 'mb-1' : 'mb-2'">
      <h3 class="metric-title" :class="compact ? 'metric-title-compact' : 'metric-title-large'">{{ parameter.name }}</h3>
      <span :class="[trendColor, compact ? 'text-lg' : 'text-2xl']" class="font-bold">{{ trendIcon }}</span>
    </div>
    <div class="metric-range" :class="compact ? 'mb-2' : 'mb-3'">
      {{ $t('health.normalRange') }} {{ parameter.normalRange.min }}-{{ parameter.normalRange.max }}
      {{ parameter.unit }}
    </div>
    <div class="flex items-baseline" :class="compact ? 'mb-1' : 'mb-3'">
      <span :class="[statusColor, compact ? 'text-2xl' : 'text-4xl']" class="font-bold">
        {{ parameter.value }}
      </span>
      <span class="text-gray-600" :class="[compact ? 'text-xs ml-1' : 'text-sm ml-2']">{{ parameter.unit }}</span>
    </div>

    <!-- Source Documents Section -->
    <div class="source-documents-section">
      <button @click="toggleDetails" class="details-toggle">
        <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': showDetails }" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        <span class="metric-details-text">
          {{ showDetails ? $t('health.sourceDocuments.hideDetails') : $t('health.sourceDocuments.showDetails') }}
        </span>
      </button>

      <transition name="expand">
        <div v-if="showDetails" class="details-content">
          <p class="details-description">{{ $t('health.sourceDocuments.description') }}</p>
          <div v-if="parameter.sourceDocuments && parameter.sourceDocuments.length > 0" class="space-y-1.5">
            <div v-for="doc in parameter.sourceDocuments" :key="doc.id" class="document-item">
              <div class="flex items-start">
                <svg class="document-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clip-rule="evenodd" />
                </svg>
                <div class="ml-1.5 flex-1">
                  <p class="document-title">{{ doc.title }}</p>
                  <p class="document-date">{{ doc.date }}</p>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="no-documents">{{ $t('health.sourceDocuments.noDocuments') }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.metric-title {
  color: var(--text-default);
  font-weight: 600;
}

.metric-title-large {
  font-size: 1.125rem;
}

.metric-title-compact {
  font-size: 1rem;
}

.metric-range {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.metric-details-text {
  margin-left: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-interactive);
}

.compact-metric {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--white-50);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--white-60);
  border-radius: 0.75rem;
  box-shadow: 0 4px 16px var(--shadow), inset 0 1px 0 var(--white-70);
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  align-self: start;
}

.compact-metric:hover {
  background: var(--white-65);
  box-shadow: 0 8px 24px var(--shadow), inset 0 1px 0 var(--white-80);
  transform: translateY(-2px);
}

.metric-widget {
  padding: 1.5rem;
  background: var(--white-50);
  backdrop-filter: blur(16px);
  border: 1px solid var(--white-60);
  border-radius: 1.25rem;
  box-shadow: 0 4px 16px var(--shadow), inset 0 1px 0 var(--white-70);
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  align-self: start;
}

.metric-widget:hover {
  background: var(--white-65);
  box-shadow: 0 8px 24px var(--shadow), inset 0 1px 0 var(--white-80);
  transform: translateY(-2px);
}

.source-documents-section {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.details-toggle {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.375rem;
  background: transparent;
  border: none;
  color: var(--text-interactive);
  cursor: pointer;
  transition: color 0.2s;
  border-radius: 0.5rem;
}

.details-toggle:hover {
  color: var(--text-interactive-hover);
  background: var(--accent-primary-5);
}

.details-toggle:hover .metric-details-text {
  color: var(--text-interactive-hover);
}

.details-content {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: var(--accent-primary-8-on-bg);
  border-radius: 0.5rem;
  border: 1px solid var(--accent-primary-15);
}

.details-description {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.document-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--text-interactive);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.document-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-default);
  line-height: 1.25;
}

.document-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.no-documents {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
}

.document-item {
  padding: 0.5rem;
  background: var(--white-60);
  border-radius: 0.375rem;
  border: 1px solid var(--accent-primary-10);
  transition: all 0.2s;
}

.document-item:hover {
  background: var(--white-80);
  border-color: var(--accent-primary-20);
  transform: translateX(2px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
