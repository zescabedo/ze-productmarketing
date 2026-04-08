import type { Metadata } from 'next';
import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import client from 'src/lib/sitecore-client';

export interface SeoRouteFields {
  [key: string]: unknown;
  Title?: Field;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  ogImage?: ImageField;
}

export async function buildSitePageMetadata(params: {
  site: string;
  locale: string;
  path?: string[];
}): Promise<Metadata> {
  const { site, locale, path } = params;
  try {
    const page = await client.getPage(path ?? [], { site, locale });
    const fields = page?.layout.sitecore.route?.fields as SeoRouteFields;
    const pathSegments = path ?? [];
    const pathname = `/${site}/${locale}${pathSegments.length ? `/${pathSegments.join('/')}` : ''}`;
    const base = process.env.NEXT_PUBLIC_BASE_URL || '';
    const metaDescription =
      fields?.metadataDescription?.value?.toString() ||
      fields?.pageSummary?.value?.toString() ||
      '';
    const metaKeywords = fields?.metadataKeywords?.value?.toString() || '';
    const ogTitle = fields?.metadataTitle?.value?.toString() || 'Page';
    const ogImage = fields?.ogImage?.value?.src;
    const ogDescription =
      fields?.metadataDescription?.value?.toString() ||
      fields?.pageSummary?.value?.toString() ||
      '';
    const ogUrl = `${base}${pathname}`;

    return {
      title: fields?.Title?.value?.toString() || 'Page',
      description: metaDescription || undefined,
      keywords: metaKeywords || undefined,
      openGraph: {
        title: ogTitle,
        description: ogDescription || undefined,
        images: ogImage ? [{ url: ogImage }] : undefined,
        url: ogUrl || undefined,
      },
      other: pathname ? { 'page-path': pathname } : {},
    };
  } catch {
    return { title: 'Page' };
  }
}
