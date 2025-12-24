<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from './components/TopBar.vue'
import BottomBar from './components/BottomBar.vue'

const route = useRoute()

const hideNavigation = computed(() => route.meta.hideNavigation === true)
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <TopBar v-if="!hideNavigation" />
    <main :class="hideNavigation ? 'h-screen' : 'flex-1 overflow-y-auto p-5 px-6'">
      <router-view />
    </main>
    <BottomBar v-if="!hideNavigation" />
  </div>
</template>
