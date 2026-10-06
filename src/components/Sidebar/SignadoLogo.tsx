import React from "react";
import { Box, SxProps, Theme } from "@mui/material";

interface SignadoLogoProps {
  size?: number;
  variant?: "icon" | "full";
  sx?: SxProps<Theme>;
}

export default function SignadoLogo({
  size = 32,
  variant = "icon",
  sx,
}: SignadoLogoProps) {
  if (variant === "full") {
    return (
      <Box
        component="img"
        src="/signado-logo-white.png"
        alt="Signado"
        sx={{
          height: size,
          width: "auto",
          objectFit: "contain",
          display: "block",
          ...sx,
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src="/signado-icon-white.png"
      alt="Signado"
      sx={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        ...sx,
      }}
    />
  );
}
