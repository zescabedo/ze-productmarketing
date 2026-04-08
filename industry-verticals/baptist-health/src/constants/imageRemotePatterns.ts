import type { NextConfig } from 'next';

type RemotePattern = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>[number];

/** Must stay in sync with `next.config.ts` `images.remotePatterns`. */
export const imageRemotePatterns: RemotePattern[] = [
  { protocol: 'https', hostname: 'edge*.**', port: '' },
  { protocol: 'https', hostname: 'xmc-*.**', port: '' },
  { protocol: 'https', hostname: 'starter-verticals-2.sitecoresandbox.cloud', port: '' },
  { protocol: 'https', hostname: 'starter-verticals-v2.sitecoresandbox.cloud', port: '' },
];
