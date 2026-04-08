import Link from 'next/link';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

export default async function NotFound() {
  if (scConfig.defaultSite) {
    try {
      const page = await client.getErrorPage(ErrorPage.NotFound, {
        site: scConfig.defaultSite,
        locale: scConfig.defaultLanguage,
      });

      if (page) {
        return (
          <Providers page={page}>
            <Layout page={page} />
          </Providers>
        );
      }
    } catch {
      // Fall back to static markup when Edge is unavailable (e.g. CI without secrets)
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link href="/">Go to the Home page</Link>
    </div>
  );
}
