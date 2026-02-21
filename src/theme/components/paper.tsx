import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";
export const MuiPaper = {
  styleOverrides: {
    outlined: {
      border: "1px solid #e5e7eb",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
      borderRadius: 12,
    },
  },
} satisfies Components<Theme>["MuiPaper"];