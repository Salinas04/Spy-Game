/**
 * Locations data for the spy game
 * This file is a wrapper around the i18n locations data
 * It uses the current locale to get the correct translations
 */
import { useI18n } from 'vue-i18n';
import locationsData from '../i18n/locations.js';

export default {
  // Proxy to get categories based on current locale
  get categories() {
    try {
      const { locale } = useI18n();
      return locationsData[locale.value].categories;
    } catch (e) {
      // Fallback to Spanish if i18n is not available (during SSR or static analysis)
      return locationsData.es.categories;
    }
  },

  // Helper function to get all locations in a flat array
  getAllLocations() {
    try {
      const { locale } = useI18n();
      return locationsData.getAllLocations(locale.value);
    } catch (e) {
      // Fallback to Spanish if i18n is not available
      return locationsData.getAllLocations('es');
    }
  }
};
