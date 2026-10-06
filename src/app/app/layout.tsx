"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar, {
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from "@/components/Sidebar/Sidebar";
import AppHeader from "@/components/Header/AppHeader";
import AppFooter from "@/components/Footer/AppFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar_collapsed") === "true";
    }
    return false;
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#faf8f5",
        }}
      >
        <CircularProgress sx={{ color: "#5046e5" }} />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const currentSidebarWidth = isCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#faf8f5" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${currentSidebarWidth}px`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#faf8f5",
          transition: "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          width: `calc(100% - ${currentSidebarWidth}px)`,
        }}
      >
        {/* Top Header */}
        <AppHeader />

        {/* Page Content Body */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            px: { xs: 2, sm: 3, md: 4 },
            py: 2,
          }}
        >
          {children}

          {/* Footer */}
          <AppFooter />
        </Box>
      </Box>
    </Box>
  );
}
