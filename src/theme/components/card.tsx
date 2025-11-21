import { paperClasses } from '@mui/material/Paper';
import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        borderRadius: '10px',
        border: `1px solid ${theme.palette.divider}`,
        [`&.${paperClasses.elevation0}`]: {
          boxShadow: "none",
        },
        [`&.${paperClasses.elevation1}`]: {
          boxShadow: theme.shadows[2],
        },
      };
    },
  },
} satisfies Components<Theme>['MuiCard'];
