'use client';

import Image from 'next/image';
import * as FEAAS from '@sitecore-feaas/clientside/react';
import { JSX } from 'react';

const REMOTE_PATTERNS = [
  { protocol: 'https' as const, hostname: 'edge*.**' },
  { protocol: 'https' as const, hostname: 'xmc-*.**' },
  { protocol: 'https' as const, hostname: 'starter-verticals-2.sitecoresandbox.cloud' },
];

const FEAASScripts = (): JSX.Element => {
  const convertToRegex = (pattern: string) => {
    return pattern.replace('.', '\\.').replace(/\*/g, '.*');
  };

  const shouldOptimize = (src: string) => {
    if (src.startsWith('http')) {
      const url = new URL(src);
      const remotePatterns = REMOTE_PATTERNS;
      return remotePatterns.some(
        (pattern) =>
          pattern.protocol === url.protocol.slice(0, -1) &&
          new RegExp('^' + convertToRegex(pattern.hostname) + '$').test(url.hostname)
      );
    }
    return true;
  };

  FEAAS.setElementImplementation('img', (attributes: Record<string, string>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, src, alt, ...imgAttributes } = attributes;
    return (
      <Image
        height={1920}
        width={1200}
        unoptimized={!shouldOptimize(src)}
        src={src}
        alt={alt}
        {...imgAttributes}
      />
    );
  });

  return <></>;
};

export default FEAASScripts;
