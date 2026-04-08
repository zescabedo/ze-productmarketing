'use client';

import Image from 'next/image';
import * as FEAAS from '@sitecore-feaas/clientside/react';
import { JSX } from 'react';
import { imageRemotePatterns } from '@/constants/imageRemotePatterns';

const FEAASScripts = (): JSX.Element => {
  const convertToRegex = (pattern: string) => {
    return pattern.replace('.', '\\.').replace(/\*/g, '.*');
  };

  const shouldOptimize = (src: string) => {
    if (src.startsWith('http')) {
      const url = new URL(src);
      return imageRemotePatterns.some(
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
