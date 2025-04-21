'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import ThemeInitializer from './ThemeInitializer';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeInitializer/>
        {children}
      </ThemeProvider>
    </Provider>
  );
}