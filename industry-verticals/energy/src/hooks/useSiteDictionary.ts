'use client';

import { useTranslations } from 'next-intl';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';

export function useSiteDictionary() {
  const { page } = useSitecore();
  const ns = page?.siteName || sites[0]?.name || 'default';
  return useTranslations(ns);
}
