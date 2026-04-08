import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
import client from 'src/lib/sitecore-client';
import Layout, { RouteFields } from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** Prefer on-demand rendering when Edge is not available at build time (e.g. CI). */
export const dynamic = 'force-dynamic';

export default async function Page({ params, searchParams }: PageProps) {
  const { site, locale, path } = await params;

  setRequestLocale(`${site}_${locale}`);

  const draft = await draftMode();

  let page;
  if (draft.isEnabled) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  if (!page) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
    </NextIntlClientProvider>
  );
}

export const generateStaticParams = async () => {
  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    try {
      return await client.getAppRouterStaticParams(
        sites.map((site: SiteInfo) => site.name),
        routing.locales.slice()
      );
    } catch (error) {
      console.error('Error occurred while generating App Router static params', error);
    }
  }
  return [
    {
      site: sites[0]?.name || 'default',
      locale: routing.defaultLocale || scConfig.defaultLanguage || 'en',
      path: [],
    },
  ];
};

export const generateMetadata = async ({ params }: PageProps) => {
  const { path, site, locale } = await params;

  try {
    const page = await client.getPage(path ?? [], { site, locale });
    return {
      title:
        (page?.layout.sitecore.route?.fields as RouteFields)?.Title?.value?.toString() || 'Page',
    };
  } catch {
    return { title: 'Page' };
  }
};
