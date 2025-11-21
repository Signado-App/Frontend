import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';
import { bgcolor } from '@mui/system';

export const MuiInputLabel = { 
    styleOverrides: { 
        root: {
            transform: "translate(14px, 10px) scale(1)",
            [`&.Mui-focused`]: {
                transform: "translate(14px, -9px) scale(0.75)",
            },
            ["&.MuiFormLabel-filled"]: {
                transform: "translate(14px, -9px) scale(0.75)",
            }
        },
    } 
} satisfies Components<Theme>['MuiLink'];