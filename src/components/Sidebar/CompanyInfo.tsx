"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import SignadoLogo from "./SignadoLogo";
import { useAuthContext } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";

interface CompanyInfoProps {
  isCollapsed?: boolean;
}

export default function CompanyInfo({ isCollapsed = false }: CompanyInfoProps) {
  const router = useRouter();
  const { user, organizations } = useAuthContext();
  const { mode, selectedOrgId } = useUserContext();

  const activeOrg = organizations?.find(
    (o) => o.organization_id === selectedOrgId,
  );

  const currentOrgName =
    mode === "organization" && activeOrg
      ? activeOrg.name
      : `${user?.first_name ?? "Personal"} (Client)`;

  return (
    <Box
      onClick={() => router.push("/app/dashboard")}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        p: 0.5,
        borderRadius: "10px",
        transition: "background-color 0.15s ease",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.08)",
        },
        justifyContent: isCollapsed ? "center" : "flex-start",
        width: "100%",
      }}
    >
      <SignadoLogo size={isCollapsed ? 30 : 34} />

      {!isCollapsed && (
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              color: "#ffffff",
              lineHeight: 1.15,
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
            }}
          >
            Signado
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: "rgba(255, 255, 255, 0.72)",
              fontSize: "0.78rem",
              maxWidth: "155px",
              display: "block",
              mt: 0.25,
            }}
          >
            {currentOrgName}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
