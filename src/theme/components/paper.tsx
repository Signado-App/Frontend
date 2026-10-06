import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";

export const MuiPaper = {
  styleOverrides: {
    root: {
      backgroundColor: "#ffffff",
    },
    outlined: {
      border: "1px solid #f1ede7",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.03)",
      borderRadius: 16,
    },
  },
} satisfies Components<Theme>["MuiPaper"];