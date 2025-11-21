// src/components/Headline.tsx
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface HeadlineProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function Headline({
  title,
  description,
  children,
}: HeadlineProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 4,
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
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            {description}
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
