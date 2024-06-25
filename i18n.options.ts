import fr from './locales/fr.json'
import en from './locales/en.json'

export default defineI18nConfig(() => ({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    en,
    fr,
  }
}));