import type { ColorSystemOptions } from '@mui/material/styles';

import { california, success, robinEggBlue, nevada, redOrange, shakespeare, stormGrey } from './colors';
import type { ColorScheme } from './types';

export const colorSchemes = {
  light: {
    palette: {
      action: { disabledBackground: 'rgba(0, 0, 0, 0.06)' },
      background: {
        default: '#F8F8F8',
        defaultChannel: '255 255 255',
        paper: 'var(--mui-palette-common-white)',
        paperChannel: '255 255 255',
        level1: 'var(--mui-palette-neutral-50)',
        level2: 'var(--mui-palette-neutral-100)',
        level3: 'var(--mui-palette-neutral-200)',
      },
      common: { black: '#000000', white: '#ffffff' },
      divider: 'var(--mui-palette-neutral-200)',
      dividerChannel: '220 223 228',
      error: {
        ...redOrange,
        light: redOrange[400],
        main: redOrange[500],
        dark: redOrange[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      info: {
        ...shakespeare,
        light: shakespeare[400],
        main: shakespeare[500],
        dark: shakespeare[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      neutral: { ...stormGrey },
      primary: {
        ...robinEggBlue,
        light: robinEggBlue[400],
        main: robinEggBlue[500],
        dark: robinEggBlue[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      secondary: {
        ...nevada,
        light: nevada[600],
        main: nevada[700],
        dark: nevada[800],
        contrastText: 'var(--mui-palette-common-white)',
      },
      success: {
        ...success,
        light: success[300],
        main: success[400],
        dark: success[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      text: {
        primary: 'var(--mui-palette-neutral-900)',
        primaryChannel: '33 38 54',
        secondary: 'var(--mui-palette-neutral-500)',
        secondaryChannel: '102 112 133',
        disabled: 'var(--mui-palette-neutral-400)',
      },
      warning: {
        ...california,
        light: california[400],
        main: california[500],
        dark: california[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
    },
  },
} satisfies Partial<Record<ColorScheme, ColorSystemOptions>>;
