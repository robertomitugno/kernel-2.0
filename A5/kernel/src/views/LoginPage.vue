<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProfileCard from '../components/ProfileCard.vue'

const { t } = useI18n()
const router = useRouter()

interface Profile {
  id: string
  name: string
  role: string
}

const profiles = ref<Profile[]>([
  { id: '1', name: 'Marco', role: 'Titolare' },
  { id: '2', name: 'Laura', role: 'Partner' },
  { id: '3', name: 'Sofia', role: 'Figlia' },
  { id: '4', name: 'Nonno Giulio', role: 'Genitore' }
])

const selectProfile = (profile: Profile) => {
  // Qui potrai aggiungere la logica per salvare il profilo selezionato
  console.log('Profilo selezionato:', profile)
  router.push('/home')
}

const addProfile = () => {
  // Qui potrai aggiungere la logica per creare un nuovo profilo
  console.log('Aggiungi nuovo profilo')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
    <!-- Titolo con stile sketch -->
    <h1 class="text-6xl md:text-7xl font-bold mb-4 bottom-5 text-gray-900 relative">
      Nucleo
      <div 
        class="absolute -bottom-5 left-0 w-full h-1 bg-gray-900"
      ></div>
    </h1>
    
    <p class="text-gray-600 text-xl font-medium">
      {{ t('login.subtitle') }}
    </p>
    
    
    <!-- Grid di profili -->
    <div class="flex flex-wrap justify-center gap-6 max-w-4xl">
      <ProfileCard
        v-for="profile in profiles"
        :key="profile.id"
        :name="profile.name"
        :role="profile.role"
        @click="selectProfile(profile)"
      />
      
      <ProfileCard
        :name="t('login.addProfile')"
        :is-add-card="true"
        @click="addProfile"
      />
    </div>
  </div>
</template>
