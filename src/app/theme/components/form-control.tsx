import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiFormControl = { 
    styleOverrides: { 
        root: {
            ["&.MuiTextField-root"]:{
                ".MuiInputBase-root": {
                    padding: "10px 14px",
                    ".MuiInputBase-input": {
                        padding: 0
                    }
                }
            }
        },
    } 
} satisfies Components<Theme>['MuiLink'];