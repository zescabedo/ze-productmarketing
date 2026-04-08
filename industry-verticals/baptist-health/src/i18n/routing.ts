import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr-FR', 'es-ES', 'es-PR'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
