"use client";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => router.push("/app/clients")}>
      Back to Clients
    </Button>
  );
}