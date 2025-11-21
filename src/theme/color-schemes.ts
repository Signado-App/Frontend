import type { ColorSystemOptions } from '@mui/material/styles';

import { base, scarletFire, blue, seaGreen} from './colors';
import type { ColorScheme } from './types';

export const colorSchemes = {
  light: {
    palette: {
      action: { disabledBackground: 'rgba(0, 0, 0, 0.06)' },
      background: {
        default: base[50],
      },
      common: { black: base[950], white: base[50] },
      divider: base[200],
      dividerChannel: base[200],
      error: {
        ...scarletFire,
        light: scarletFire[400],
        main: scarletFire[500],
        dark: scarletFire[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      info: {
        ...blue,
        light: blue[400],
        main: blue[500],
        dark: blue[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      neutral: { ...base },
      primary: {
        ...blue,
        light: blue[400],
        main: blue[500],
        dark: blue[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      secondary: {
        ...seaGreen,
        light: seaGreen[400],
        main: seaGreen[500],
        dark: seaGreen[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      success: {
        ...seaGreen,
        light: seaGreen[300],
        main: seaGreen[400],
        dark: seaGreen[600],
        contrastText: 'var(--mui-palette-common-white)',
      },
      text: {
        primary: 'var(--mui-palette-common-black)',
        primaryChannel: '33 38 54',
        secondary: 'var(--mui-palette-neutral-500)',
        secondaryChannel: '102 112 133',
        disabled: 'var(--mui-palette-neutral-200)',
      },
      /*
      warning: {
        ...california,
        light: california[400],
        main: california[500],
        dark: california[600],
        contrastText: 'var(--mui-palette-common-white)',
      },*/
    },
  },
} satisfies Partial<Record<ColorScheme, ColorSystemOptions>>;
