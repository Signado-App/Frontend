"use client";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export default function BackToClientsButton() {
  const router = useRouter();
  return (
    <Button
      variant="text"
      startIcon={<ArrowBackIcon />}
      onClick={() => router.push("/app/clients")}
    >
      Back to Clients
    </Button>
  );
}
