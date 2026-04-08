'use client';

import { ReactNode, useEffect } from 'react';
import { Environment, PageController, WidgetsProvider } from '@sitecore-search/react';

const SEARCH_CONFIG = {
  env: process.env.NEXT_PUBLIC_SEARCH_ENV,
  customerKey: process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY,
  apiKey: process.env.NEXT_PUBLIC_SEARCH_API_KEY,
};

export function SearchAppProviders({ locale, children }: { locale: string; children: ReactNode }) {
  useEffect(() => {
    const lang = locale || 'en';
    PageController.getContext().setLocaleLanguage(lang.split('-')[0]);
    if (lang === 'en') {
      PageController.getContext().setLocaleCountry('us');
    } else {
      const parts = lang.split('-');
      if (parts[1]) {
        PageController.getContext().setLocaleCountry(parts[1].toLowerCase());
      }
    }
  }, [locale]);

  return (
    <WidgetsProvider
      env={SEARCH_CONFIG.env as Environment}
      customerKey={SEARCH_CONFIG.customerKey}
      apiKey={SEARCH_CONFIG.apiKey}
      publicSuffix={true}
    >
      {children}
    </WidgetsProvider>
  );
}
