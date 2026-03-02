export type AppLocale = 'en' | 'fr-FR' | 'es-ES' | 'es-PR';

export type LocaleOption = {
  code: AppLocale;
  label: string;
  currency: string;
  currencySymbol: string;
};
