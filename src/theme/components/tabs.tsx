import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";

export const MuiTabs = {
  styleOverrides: {
    root: {
      borderBottom: "1px solid #e5e7eb",
    },
    indicator: {
      backgroundColor: "#0f172a",
      height: 2,
    },
  },
} satisfies Components<Theme>["MuiTabs"];

// export const MuiTab = {
//   styleOverrides: {
//     root: {
//       color: "#94a3b8",
//       fontWeight: 500,
//       textTransform: "none",
//       minHeight: 48,
//       gap: 1,
//       "&:hover": {
//         color: "#0f172a",
//       },
//       "&.Mui-selected": {
//         color: "#0f172a",
//         fontWeight: 700,
//       },
//     },
//   },
// } satisfies Components<Theme>["MuiTab"];
