"use client";

import { use, useEffect, useState } from "react";
import { Box,  } from "@mui/material";
import Headline from "@/components/Headline";

export default function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [contract, setContract] = useState<any>(null);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    // GET /contract/get s tokenem v headeru
    // fetch contract details
  }, [token]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Headline title="Sign contract" />
      {/* Contract details */}
      {/* Canvas pro podpis */}
      {/* Sign button */}
    </Box>
  );
}
