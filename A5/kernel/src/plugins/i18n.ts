import { createI18n } from 'vue-i18n'
import it from '../i18n/it.json'

export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'it',
  fallbackLocale: 'it',
  messages: {
    it
  }
})
