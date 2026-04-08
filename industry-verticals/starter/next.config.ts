import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  distDir: process.env.NEXTJS_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'starter-verticals-2.sitecoresandbox.cloud',
        port: '',
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
        locale: false,
      },
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap',
        locale: false,
      },
      {
        source: '/feaas-render',
        destination: '/api/editing/feaas/render',
      },
    ];
  },
  webpack: (config, options) => {
    if (options.isServer) {
      config.externals = [
        {
          '@sitecore-feaas/clientside/react': 'commonjs @sitecore-feaas/clientside/react',
          '@sitecore/byoc': 'commonjs @sitecore/byoc',
          '@sitecore/byoc/react': 'commonjs @sitecore/byoc/react',
        },
        ...(Array.isArray(config.externals) ? config.externals : []),
      ];
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
