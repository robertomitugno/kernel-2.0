<script setup lang="ts">
import type { BaseCardProps } from '../../types/BaseCard'

defineProps<BaseCardProps>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div 
    :class="['base-card', { 'card-selected': selected }]"
    @click="emit('click')"
  >
    <div class="card-content">
      <!-- Icon -->
      <div class="icon-container">
        <div class="icon-bg">
          <component :is="icon" class="icon-main" />
        </div>
      </div>

      <!-- Content -->
      <div class="content-wrapper">
        <!-- Title Row with Actions -->
        <div class="title-row">
          <h3 class="card-title">
            {{ title }}
          </h3>
          <!-- Title Actions button (top right)-->
          <slot name="title-actions" />
        </div>

        <!-- Custom content slot (e.g., badges) -->
        <slot name="after-title" />

        <p class="card-description">
          {{ description }}
        </p>

        <!-- Metadata (date, doctor, location, etc.) -->
        <div class="metadata-row">
          <div 
            v-for="(meta, index) in metadata"
            :key="index"
            class="meta-item"
          >
            <component :is="meta.icon" class="meta-icon" />
            <span>{{ meta.label }}</span>
          </div>
        </div>

        <!-- Actions Slot (bottom right) -->
        <div v-if="$slots.actions" class="card-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-card {
  background: var(--bg-secondary-25);
  backdrop-filter: blur(20px);
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin: 0.75rem 0;
  border: 1.5px solid var(--bg-secondary-70);
  box-shadow: 0 4px 24px var(--shadow), 0 1px 2px var(--white-90);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  display: block;
}

.base-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px var(--text-primary-15), 0 1px 2px var(--white-90);
  background: var(--bg-secondary-35);
  border-color: var(--white-90);
}

.card-selected {
  border: 2px solid var(--text-primary-60);
  background: var(--bg-secondary-40);
  box-shadow: 0 12px 40px var(--text-primary-18), 0 1px 2px var(--bg-secondary);
}

.card-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.icon-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bg {
  width: 3.5rem;
  height: 3.5rem;
  background: var(--white-30);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--white-40);
  box-shadow: 0 2px 8px var(--shadow);
}

.icon-main {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--text-primary);
  display: block;
}

.content-wrapper {
  position: relative;
  padding-right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1 1 0%;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.card-title {
  color: var(--text-heading);
  font-size: 1.125rem;
  font-weight: 600;
  word-break: break-word;
  overflow-wrap: break-word;
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 10rem);
  line-height: 1.2;
}

.card-description {
  color: var(--text-default, var(--text-secondary));
  font-size: 0.98rem;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: calc(100% - 12rem);
  margin: 0.25rem 0 0.5rem 0;
  line-height: 1.4;
}

.metadata-row {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  color: var(--text-metadata, var(--text-secondary));
  gap: 1.25rem;
  max-width: calc(100% - 12rem);
  font-size: 0.97rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.meta-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--text-metadata, var(--text-secondary));
  display: block;
}

.card-actions {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;
  min-width: 200px;
}

@media (max-width: 1024px) {
  .card-title {
    max-width: calc(100% - 8rem);
  }
  .card-description {
    max-width: calc(100% - 10rem);
  }
  .metadata-row {
    max-width: calc(100% - 10rem);
  }
}

@media (max-width: 768px) {
  .card-title,
  .card-description,
  .metadata-row {
    max-width: 100%;
  }
  .card-content {
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .base-card {
    padding: 1rem;
  }
  .card-actions {
    position: static;
    margin-top: 1rem;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    min-width: auto;
  }
  .card-content {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
