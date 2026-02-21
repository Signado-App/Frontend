"use client";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface HeadlineProps {
  title: string;
  description?: string;
  children?: ReactNode;
  marginBottom?: number;
  size?: "small" | "medium" | "large";
}

const sizeMap = {
  small: { title: "h6", description: "body2" },
  medium: { title: "h5", description: "body1" },
  large: { title: "h4", description: "body1" },
};

export default function Headline({
  title,
  description,
  children,
  marginBottom = 2,
  size = "medium",
}: HeadlineProps) {
  const { title: titleVariant, description: descVariant } = sizeMap[size];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: marginBottom,
      }}
    >
      <Box>
        <Typography
          variant={titleVariant as any}
          component="h1"
          sx={{ color: "text.primary", fontWeight: "bold" }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant={descVariant as any}
            sx={{ mt: 0.5, color: "text.secondary" }}
          >
            <span dangerouslySetInnerHTML={{ __html: description }}></span>
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
