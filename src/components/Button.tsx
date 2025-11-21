import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

export default function Button({
  children,
  sx,
  variant = "contained",
  ...props
}: MuiButtonProps) {
  return (
    <MuiButton
      disableElevation
      variant={variant}
      {...props}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        fontSize: "0.875rem",
        borderRadius: "6px",
        height: "36px",
        padding: "0 16px",
        gap: "8px",
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  );
}
