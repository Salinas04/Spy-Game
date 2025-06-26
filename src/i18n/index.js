import { createI18n } from 'vue-i18n';
import en from './en.js';
import es from './es.js';

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'es', // Default language
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
});

export default i18n;