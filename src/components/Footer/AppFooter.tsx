"use client";

import React, { useState } from "react";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

export default function AppFooter() {
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [currentLang, setCurrentLang] = useState("English");

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        pt: 6,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        color: "#94a3b8",
        fontSize: "0.78rem",
        borderTop: "1px solid rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Left links */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: { xs: 1.5, sm: 2.5 } }}>
        <Box
          onClick={(e) => setLangAnchor(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.3,
            cursor: "pointer",
            fontWeight: 500,
            color: "#64748b",
            "&:hover": { color: "#1e293b" },
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
            {currentLang}
          </Typography>
          <KeyboardArrowDownRoundedIcon sx={{ fontSize: "0.95rem" }} />
        </Box>

        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
          slotProps={{
            paper: { sx: { borderRadius: "10px", minWidth: 120, mt: -0.5 } },
          }}
        >
          <MenuItem
            selected={currentLang === "English"}
            onClick={() => {
              setCurrentLang("English");
              setLangAnchor(null);
            }}
          >
            English
          </MenuItem>
          <MenuItem
            selected={currentLang === "Čeština"}
            onClick={() => {
              setCurrentLang("Čeština");
              setLangAnchor(null);
            }}
          >
            Čeština
          </MenuItem>
        </Menu>

        <Typography
          component="a"
          href="#"
          variant="caption"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: "#64748b" },
          }}
        >
          Contact
        </Typography>
        <Typography
          component="a"
          href="#"
          variant="caption"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: "#64748b" },
          }}
        >
          Security
        </Typography>
        <Typography
          component="a"
          href="#"
          variant="caption"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: "#64748b" },
          }}
        >
          Pricing
        </Typography>
        <Typography
          component="a"
          href="#"
          variant="caption"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: "#64748b" },
          }}
        >
          Terms
        </Typography>
        <Typography
          component="a"
          href="#"
          variant="caption"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: "#64748b" },
          }}
        >
          Privacy Policy
        </Typography>
      </Box>

      {/* Right copyright */}
      <Typography variant="caption" sx={{ color: "inherit", fontSize: "inherit" }}>
        © 2026 Signado s.r.o.
      </Typography>
    </Box>
  );
}
