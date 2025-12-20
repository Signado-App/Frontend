import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";

export const MuiButton = {
  defaultProps: {
    disableElevation: true,
  },

  styleOverrides: {
    root: ({}) => ({
      textTransform: "none",
      borderRadius: "6px",
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.5,
      gap: "6px",
    }),

    sizeSmall: {
      height: "32px",
      padding: "0 12px",
      fontSize: "0.8125rem",
    },
    sizeMedium: {
      height: "36px",
      padding: "0 16px",
    },
    sizeLarge: {
      height: "40px",
      padding: "0 24px",
      fontSize: "1rem",
    },
  },
} satisfies Components<Theme>["MuiButton"];
