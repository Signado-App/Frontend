import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";

export const MuiButton = {
  defaultProps: {
    disableElevation: true,
  },

  styleOverrides: {
    root: ({ ownerState }) => ({
      textTransform: "none",
      borderRadius: "6px",
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.5,
      gap: "6px",
      "&:hover": {
        opacity: 0.85,
      },

      ...(ownerState.variant === "contained" && {
        color: "#ffffff",
        backgroundColor: "#000000",
      }),

      ...(ownerState.variant === "text" && {
        backgroundColor: "transparent",
        color: "#0f172a",
        "&:hover": {
          backgroundColor: "#f1f5f9",
          opacity: 1,
        },
      }),

      ...(ownerState.variant === "outlined" && {
        color: "#0f172a",
        borderColor: "#e5e7eb",
        "&:hover": {
          opacity: 1,
        },
      }),
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
