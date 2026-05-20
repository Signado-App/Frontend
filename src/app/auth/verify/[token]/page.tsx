"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headline from "@/components/Headline";
import { verifyUser } from "@/services/auth";

export default function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    verifyUser(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <Box sx={{ textAlign: "center" }}>
      {status === "loading" && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            Verifying your account...
          </Typography>
        </Box>
      )}
      {status === "success" && (
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#22c55e" }} />
          <Typography variant="h5" fontWeight={700}>
            Account Verified!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your account has been successfully verified. You can now log in.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/auth/login")}
          >
            Go to Login
          </Button>
        </Box>
      )}
      {status === "error" && (
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: "#ef4444" }} />
          <Typography variant="h5" fontWeight={700}>
            Verification Failed
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The verification link is invalid or has expired.
          </Typography>
          <Button variant="outlined" onClick={() => router.push("/auth/login")}>
            Back to Login
          </Button>
        </Box>
      )}
    </Box>
  );
}
