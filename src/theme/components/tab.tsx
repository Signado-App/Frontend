import type { Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiTab = {
  styleOverrides: {
    root: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.71,
      minWidth: "auto",
      paddingLeft: 0,
      paddingRight: 0,
      textTransform: "none",
      "& + &": { marginLeft: "24px" },
      color: "#94a3b8",
      minHeight: 48,
      "&:hover": {
        color: "#0f172a",
      },
      "&.Mui-selected": {
        color: "#0f172a",
        fontWeight: 700,
      },
    },
  },
} satisfies Components<Theme>["MuiTab"];
