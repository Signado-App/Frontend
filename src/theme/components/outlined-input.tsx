import type { Components } from "@mui/material/styles";

import type { Theme } from "../types";
import { bgcolor } from "@mui/system";

export const MuiOutlinedInput = {
  styleOverrides: {
    root: {
      ".MuiInputBase-input": {
        padding: "10px 14px",
        ":-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 100px #FFF inset",
          WebkitTextFillColor: "#000",
          caretColor: "#000",
        },
      },
    },
  },
} satisfies Components<Theme>["MuiLink"];
