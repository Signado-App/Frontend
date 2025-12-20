'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as TP } from '@mui/material/styles';
import { usePathname } from 'next/navigation';

import { createTheme } from '@/theme/create-theme';

import EmotionCache from './emotion-cache';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const theme = createTheme();
  const pathname = usePathname()
  if (pathname.startsWith('/app') || pathname.startsWith('/auth')) {
    return (
      <EmotionCache options={{ key: 'mui' }}>
        <TP theme={theme}>
          <CssBaseline />
          {children}
        </TP>
      </EmotionCache>
    );
  }
  return (
    <>{children}</>
  );
}