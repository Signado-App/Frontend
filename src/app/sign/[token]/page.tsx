"use client";

import { use, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import { loginWithSigningToken } from "@/services/auth";
import { getSigningContract, signContract } from "@/services/signing";

export default function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    loginWithSigningToken(token)
      .then(() => getSigningContract())
      .then((response) => {
        setContract(response.contract ?? response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.data?.specification === "expired") {
          setError(
            "This signing link has expired. A new link has been sent to your email.",
          );
        } else {
          setError("Invalid or expired signing link.");
        }
        setLoading(false);
      });
  }, [token]);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSign = async () => {
    if (!contract) return;
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setError("Please draw your signature before signing.");
      return;
    }

    try {
      setSigning(true);
      setError(null);

      const signatureData = sigCanvasRef.current.toDataURL();

      await signContract(contract.id, {
        device: navigator.userAgent,
        document_hash: contract.id,
        location: "",
        signature_svg: { data: signatureData },
      });

      setSigned(true);
    } catch {
      setError("Failed to sign the contract. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !contract) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4, mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (signed) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Contract Signed Successfully
        </Typography>
        <Typography color="text.secondary">
          Thank you for signing the contract.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 4, mt: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Sign Contract
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Please review the contract and sign below.
      </Typography>

      {contract && (
        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight={700}>
            {contract.title}
          </Typography>
          {contract.description && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              {contract.description}
            </Typography>
          )}
          {contract.sign_by && (
            <Typography variant="body2" mt={2}>
              Sign by:{" "}
              <strong>
                {new Date(contract.sign_by).toLocaleDateString("cs-CZ")}
              </strong>
            </Typography>
          )}
          {contract.expires_at && (
            <Typography variant="body2">
              Expires:{" "}
              <strong>
                {new Date(contract.expires_at).toLocaleDateString("cs-CZ")}
              </strong>
            </Typography>
          )}
          {contract.status && (
            <Typography variant="body2">
              Status: <strong>{contract.status}</strong>
            </Typography>
          )}
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Draw your signature
      </Typography>

      <Box
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
          mb: 2,
          bgcolor: "#fafafa",
        }}
      >
        <SignatureCanvas
          ref={sigCanvasRef}
          penColor="black"
          canvasProps={{
            width: 650,
            height: 200,
            style: { display: "block" },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={handleClear} disabled={signing}>
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={handleSign}
          disabled={signing}
          startIcon={
            signing ? <CircularProgress size={16} color="inherit" /> : undefined
          }
        >
          {signing ? "Signing..." : "Sign Contract"}
        </Button>
      </Box>
    </Box>
  );
}
