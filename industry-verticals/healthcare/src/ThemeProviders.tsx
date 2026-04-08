'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export function ThemeProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
