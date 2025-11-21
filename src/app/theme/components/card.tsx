import { paperClasses } from '@mui/material/Paper';
import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        borderRadius: '10px',
        [`&.${paperClasses.elevation1}`]: {
          boxShadow: '0 5px 22px 0 rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        },
      };
    },
  },
} satisfies Components<Theme>['MuiCard'];
