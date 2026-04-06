"use client";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export default function BackButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const router = useRouter();
  return (
    <Button
      variant="text"
      startIcon={<ArrowBackIcon />}
      onClick={() => router.push(href)}
    >
      {label}
    </Button>
  );
}
