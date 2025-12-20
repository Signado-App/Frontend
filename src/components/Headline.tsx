"use client";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface HeadlineProps {
  title: string;
  description?: string;
  children?: ReactNode;
  marginBottom?: number;
}

export default function Headline({
  title,
  description,
  children,
  marginBottom = 2,
}: HeadlineProps) {
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
          variant="h4"
          component="h1"
          sx={{ color: "text.primary", fontWeight: "bold" }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" sx={{ mt: 0.5, color: "text.secondary" }}>
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
