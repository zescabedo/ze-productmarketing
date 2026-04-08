import type { Preview } from '@storybook/nextjs-vite';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { mockPageData } from './mockData/mockPageData';
import { mockApiData } from './mockData/mockApiData';
import mockComponentMap from './mockData/mockComponentMap';
import { NextIntlClientProvider } from 'next-intl';

import '../src/assets/main.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    layout: 'fullscreen',
  },

  decorators: [
    (Story) => (
      <SitecoreProvider componentMap={mockComponentMap} page={mockPageData} api={mockApiData}>
        <NextIntlClientProvider locale="en" messages={{}}>
          <Story />
        </NextIntlClientProvider>
      </SitecoreProvider>
    ),
  ],

  argTypes: {
    fields: { table: { disable: true }, control: false },
    params: { table: { disable: true }, control: false },
    rendering: { table: { disable: true }, control: false },
  },
};

export default preview;
