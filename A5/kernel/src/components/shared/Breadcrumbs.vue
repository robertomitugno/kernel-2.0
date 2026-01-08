<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

interface BreadcrumbItem {
  name: string
  path?: string
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = []
  
  // Aggiungi sempre home come primo elemento se non siamo nella home
  if (route.path !== '/home' && route.name !== 'home') {
    items.push({
      name: t('breadcrumbs.home'),
      path: '/home'
    })
  }
  
  // Aggiungi la pagina corrente
  if (route.name && route.name !== 'login') {
    const currentPageKey = `breadcrumbs.${route.name}`
    items.push({
      name: t(currentPageKey)
    })
  }
  
  return items
})

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <nav 
    v-if="breadcrumbs.length > 0"
    class="breadcrumbs-container"
    aria-label="Navigazione breadcrumb"
  >
    <ol class="breadcrumbs-list">
      <li 
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
      >
        <!-- Link per elementi non finali -->
        <button
          v-if="item.path"
          class="breadcrumb-link"
          @click="navigateTo(item.path)"
          :aria-label="`Vai a ${item.name}`"
        >
          {{ item.name }}
        </button>
        
        <!-- Testo per elemento finale -->
        <span 
          v-else
          class="breadcrumb-current"
          aria-current="page"
        >
          {{ item.name }}
        </span>
        
        <!-- Separatore (non dopo l'ultimo elemento) -->
        <svg 
          v-if="index < breadcrumbs.length - 1"
          class="breadcrumb-separator"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs-container {
  position: relative;
  z-index: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--white-40) 0%, var(--white-30) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--white-30);
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: var(--text-primary);
  text-decoration: underline;
}

.breadcrumb-link:focus {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.breadcrumb-current {
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: var(--text-primary);
  font-weight: 600;
}

.breadcrumb-separator {
  width: 1rem;
  height: 1rem;
  color: var(--text-gray-400);
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .breadcrumbs-container {
    padding: 0.5rem 1rem;
  }
  
  .breadcrumbs-list {
    gap: 0.375rem;
  }
  
  .breadcrumb-item {
    gap: 0.375rem;
  }
  
  .breadcrumb-separator {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>
